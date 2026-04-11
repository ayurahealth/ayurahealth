/**
 * Groq Provider — Fast cloud inference via Groq API.
 * Primary provider for text-only chat (low latency, high throughput).
 */

import type {
  LLMProvider,
  CompletionRequest,
  CompletionResponse,
  ProviderHealth,
  ChatMessage,
} from './types'

const API_URL = 'https://api.groq.com/openai/v1/chat/completions'

function getApiKey(): string {
  return process.env.GROQ_API_KEY || ''
}

  message?: { 
    content?: string
    tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>
  }
  delta?: { 
    content?: string
    tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>
  }
  finish_reason?: string | null
}

interface GroqChatResponse {
  choices?: GroqChoice[]
  usage?: { total_tokens?: number }
}

export class GroqProvider implements LLMProvider {
  readonly name = 'Groq'
  readonly supportsStreaming = true
  readonly supportsVision = false

  async healthCheck(): Promise<ProviderHealth> {
    const key = getApiKey()
    if (!key) {
      return { available: false, error: 'GROQ_API_KEY not set' }
    }
    const start = Date.now()
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) {
        return { available: false, error: `Groq returned ${res.status}` }
      }
      return { available: true, latencyMs: Date.now() - start }
    } catch (err) {
      return { available: false, error: `Groq unreachable: ${err instanceof Error ? err.message : String(err)}` }
    }
  }

  private buildHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    }
  }

  private flattenMessages(messages: ChatMessage[]): Array<{ role: string; content: string }> {
    return messages.map((m) => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : m.content.map((p) => p.text || '').join(''),
    }))
  }

  async fetchCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    const start = Date.now()
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model: request.model,
        messages: this.flattenMessages(request.messages),
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        stream: false,
        tools: request.tools,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`Groq error ${response.status}: ${errorText}`)
    }

    const json = (await response.json()) as GroqChatResponse
    const text = json.choices?.[0]?.message?.content?.trim() || ''

    return {
      text,
      model: request.model,
      provider: this.name,
      latencyMs: Date.now() - start,
      tokensUsed: json.usage?.total_tokens,
      toolCalls: json.choices?.[0]?.message?.tool_calls?.map(tc => ({
        id: tc.id,
        name: tc.function.name,
        arguments: tc.function.arguments,
      })),
    }
  }

  async fetchStreamingCompletion(request: CompletionRequest): Promise<ReadableStream<Uint8Array>> {
    const encoder = new TextEncoder()
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model: request.model,
        messages: this.flattenMessages(request.messages),
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        stream: true,
        tools: request.tools,
      }),
    })

    if (!response.ok || !response.body) {
      throw new Error(`Groq streaming error ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    return new ReadableStream({
      async pull(controller) {
        try {
          const { done, value } = await reader.read()
          if (done) {
            controller.close()
            return
          }

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || !trimmed.startsWith('data: ')) continue
            const payload = trimmed.slice(6)
            if (payload === '[DONE]') {
              controller.close()
              return
            }
            try {
              const chunk = JSON.parse(payload) as GroqChatResponse
              const content = chunk.choices?.[0]?.delta?.content || ''
              const toolCalls = chunk.choices?.[0]?.delta?.tool_calls
              
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
              }
              if (toolCalls && toolCalls.length > 0) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                  toolCall: {
                    id: toolCalls[0].id,
                    name: toolCalls[0].function.name,
                    arguments: toolCalls[0].function.arguments,
                  }
                })}\n\n`))
              }
            } catch {
              // Skip malformed chunks
            }
          }
        } catch (err) {
          controller.error(err)
        }
      },
      cancel() {
        reader.cancel()
      },
    })
  }
}

export const groqProvider = new GroqProvider()
