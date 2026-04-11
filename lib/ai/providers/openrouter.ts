/**
 * OpenRouter Provider — Multi-model cloud inference.
 * Supports Claude, GPT, Gemini, DeepSeek, Mistral, Llama via a single gateway.
 */

import type {
  LLMProvider,
  CompletionRequest,
  CompletionResponse,
  ProviderHealth,
  ChatMessage,
  ChatPart,
} from './types'

const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

function getApiKey(): string {
  return process.env.OPENROUTER_API_KEY || ''
}

/** Maps user-facing model preference to OpenRouter model IDs */
export const OPENROUTER_MODEL_MAP: Record<string, string> = {
  auto: 'google/gemini-2.5-pro',
  claude: 'anthropic/claude-3.7-sonnet',
  gpt: 'openai/chatgpt-4o-latest',
  gemini: 'google/gemini-2.5-flash',
  deepseek: 'deepseek/deepseek-r1',
  mistral: 'mistralai/mistral-large-2411',
  llama: 'meta-llama/llama-3.3-70b-instruct',
}

interface OpenRouterChoice {
  message?: { 
    content?: string; 
    tool_calls?: Array<{
      id: string;
      type: 'function';
      function: { name: string; arguments: string };
    }>;
  }
  delta?: { 
    content?: string;
    tool_calls?: Array<{
      index: number;
      id?: string;
      type?: 'function';
      function?: { name: string; arguments?: string };
    }>;
  }
  finish_reason?: string | null
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[]
  usage?: { total_tokens?: number }
}

interface ORMessage {
  role: string
  content: string | ChatPart[]
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>
  tool_call_id?: string
}

export class OpenRouterProvider implements LLMProvider {
  readonly name = 'OpenRouter'
  readonly supportsStreaming = true
  readonly supportsVision = true

  async healthCheck(): Promise<ProviderHealth> {
    const key = getApiKey()
    if (!key) {
      return { available: false, error: 'OPENROUTER_API_KEY not set' }
    }
    return { available: true, models: Object.keys(OPENROUTER_MODEL_MAP) }
  }

  private buildHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://ayurahealth.com',
      'X-Title': 'AyuraHealth VAIDYA',
    }
  }

  private formatMessages(messages: ChatMessage[]): ORMessage[] {
    return messages.map((m) => {
      const msg: ORMessage = {
        role: m.role,
        content: m.content,
      }

      if (m.toolCalls && m.toolCalls.length > 0) {
        msg.tool_calls = m.toolCalls.map(tc => ({
          id: tc.id,
          type: 'function',
          function: {
            name: tc.function.name,
            arguments: tc.function.arguments
          }
        }))
      }

      if (m.toolCallId) {
        msg.tool_call_id = m.toolCallId
      }

      return msg
    })
  }

  async fetchCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    const start = Date.now()
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model: request.model,
        messages: this.formatMessages(request.messages),
        tools: request.tools?.map(t => ({
          type: 'function' as const,
          function: {
            name: t.name,
            description: t.description,
            parameters: t.parameters
          }
        })),
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        stream: false,
      }),
      signal: request.signal,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`OpenRouter error ${response.status}: ${errorText}`)
    }

    const json = (await response.json()) as OpenRouterResponse
    const message = json.choices?.[0]?.message
    const text = message?.content?.trim() || ''
    const toolCalls = message?.tool_calls?.map(tc => ({
      id: tc.id,
      type: 'function' as const,
      function: tc.function
    }))

    return {
      text,
      toolCalls,
      model: request.model,
      provider: this.name,
      latencyMs: Date.now() - start,
      tokensUsed: json.usage?.total_tokens,
    }
  }

  async fetchStreamingCompletion(request: CompletionRequest): Promise<ReadableStream<Uint8Array>> {
    const encoder = new TextEncoder()
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model: request.model,
        messages: this.formatMessages(request.messages),
        tools: request.tools?.map(t => ({
          type: 'function' as const,
          function: {
            name: t.name,
            description: t.description,
            parameters: t.parameters
          }
        })),
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        stream: true,
      }),
      signal: request.signal,
    })

    if (!response.ok || !response.body) {
      throw new Error(`OpenRouter streaming error ${response.status}`)
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
              const chunk = JSON.parse(payload) as OpenRouterResponse
              const delta = chunk.choices?.[0]?.delta
              const content = delta?.content || ''
              const toolCall = delta?.tool_calls && delta.tool_calls.length > 0 ? {
                id: delta.tool_calls[0].id,
                type: 'function' as const,
                function: delta.tool_calls[0].function
              } : undefined

              if (content || toolCall) {
                const chunk: { content?: string; toolCall?: typeof toolCall } = { content }
                if (toolCall) chunk.toolCall = toolCall
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
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

export const openRouterProvider = new OpenRouterProvider()
