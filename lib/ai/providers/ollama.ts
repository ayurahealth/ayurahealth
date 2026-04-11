/**
 * Ollama Provider — Local LLM inference via Ollama.
 * Uses the OpenAI-compatible API endpoint (http://localhost:11434/v1).
 * 
 * Supports both streaming and non-streaming completions.
 * Falls back gracefully when Ollama is not running (e.g., in Vercel).
 */

import type {
  LLMProvider,
  CompletionRequest,
  CompletionResponse,
  ProviderHealth,
  ChatMessage,
} from './types'

const DEFAULT_BASE_URL = 'http://localhost:11434'

function getBaseUrl(): string {
  return process.env.OLLAMA_BASE_URL || DEFAULT_BASE_URL
}

interface OllamaTagsResponse {
  models?: Array<{ name: string; size: number; modified_at: string }>
}

interface OllamaChatChoice {
  message?: { 
    content?: string
    tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>
  }
}

interface OllamaChatResponse {
  choices?: OllamaChatChoice[]
  usage?: { total_tokens?: number }
}

interface OllamaStreamDelta {
  choices?: Array<{ 
    delta?: { 
      content?: string
      tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>
    }
    finish_reason?: string | null 
  }>
}

export class OllamaProvider implements LLMProvider {
  readonly name = 'Ollama'
  readonly supportsStreaming = true
  readonly supportsVision = false // GLM 5.1 cloud is text-only

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now()
    try {
      const res = await fetch(`${getBaseUrl()}/api/tags`, {
        signal: AbortSignal.timeout(3000),
      })
      if (!res.ok) {
        return { available: false, error: `Ollama returned ${res.status}` }
      }
      const data = (await res.json()) as OllamaTagsResponse
      const models = data.models?.map((m) => m.name) || []
      return {
        available: true,
        latencyMs: Date.now() - start,
        models,
      }
    } catch (err) {
      return {
        available: false,
        error: `Ollama not reachable: ${err instanceof Error ? err.message : String(err)}`,
      }
    }
  }

  async fetchCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    const start = Date.now()
    const url = `${getBaseUrl()}/v1/chat/completions`

    const messages = request.messages.map((m) => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : m.content.map((p) => p.text || '').join(''),
    }))

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: request.model,
        messages,
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        stream: false,
        tools: request.tools,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`Ollama error ${response.status}: ${errorText}`)
    }

    const json = (await response.json()) as OllamaChatResponse
    const text = json.choices?.[0]?.message?.content?.trim() || ''

    return {
      text,
      model: request.model,
      provider: this.name,
      latencyMs: Date.now() - start,
      tokensUsed: json.usage?.total_tokens,
      toolCalls: json.choices?.[0]?.message?.tool_calls?.map(tc => ({
        id: tc.id,
        type: 'function' as const,
        function: tc.function,
      })),
    }
  }

  async fetchStreamingCompletion(request: CompletionRequest): Promise<ReadableStream<Uint8Array>> {
    const url = `${getBaseUrl()}/v1/chat/completions`
    const encoder = new TextEncoder()

    const messages = request.messages.map((m: ChatMessage) => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : m.content.map((p) => p.text || '').join(''),
    }))

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: request.model,
        messages,
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        stream: true,
        tools: request.tools,
      }),
    })

    if (!response.ok || !response.body) {
      throw new Error(`Ollama streaming error ${response.status}`)
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
              const chunk = JSON.parse(payload) as OllamaStreamDelta
              const content = chunk.choices?.[0]?.delta?.content || ''
              const toolCalls = chunk.choices?.[0]?.delta?.tool_calls

              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
              }
              if (toolCalls && toolCalls.length > 0) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                  toolCall: {
                    id: toolCalls[0].id,
                    type: 'function',
                    function: toolCalls[0].function,
                  }
                })}\n\n`))
              }
            } catch {
              // Skip malformed JSON chunks
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

export const ollamaProvider = new OllamaProvider()
