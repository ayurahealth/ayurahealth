/**
 * HuggingFace Provider — Vision-capable inference via HuggingFace Router.
 * Used specifically when image attachments are present (lab reports, photos).
 */

import type {
  LLMProvider,
  CompletionRequest,
  CompletionResponse,
  ProviderHealth,
  ChatMessage,
  ChatPart,
} from './types'

const API_URL = 'https://router.huggingface.co/v1/chat/completions'
const DEFAULT_VISION_MODEL = 'google/gemma-4-31B-it:novita'

function getApiKey(): string {
  return process.env.HUGGINGFACE_API_KEY || ''
}

interface HFChoice {
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

interface HFChatResponse {
  choices?: HFChoice[]
  usage?: { total_tokens?: number }
}

interface HFMessage {
  role: string
  content: string | ChatPart[]
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>
  tool_call_id?: string
}

export class HuggingFaceProvider implements LLMProvider {
  readonly name = 'HuggingFace'
  readonly supportsStreaming = true
  readonly supportsVision = true

  async healthCheck(): Promise<ProviderHealth> {
    const key = getApiKey()
    if (!key) {
      return { available: false, error: 'HUGGINGFACE_API_KEY not set' }
    }
    return { available: true, models: [DEFAULT_VISION_MODEL] }
  }

  private buildHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    }
  }

  private formatMessages(messages: ChatMessage[]): HFMessage[] {
    return messages.map((m) => {
      const msg: HFMessage = {
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
    const model = request.model || DEFAULT_VISION_MODEL

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model,
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
      throw new Error(`HuggingFace error ${response.status}: ${errorText}`)
    }

    const json = (await response.json()) as HFChatResponse
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
      model,
      provider: this.name,
      latencyMs: Date.now() - start,
      tokensUsed: json.usage?.total_tokens,
    }
  }

  async fetchStreamingCompletion(request: CompletionRequest): Promise<ReadableStream<Uint8Array>> {
    const encoder = new TextEncoder()
    const model = request.model || DEFAULT_VISION_MODEL

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model,
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
      throw new Error(`HuggingFace streaming error ${response.status}`)
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
              const chunk = JSON.parse(payload) as HFChatResponse
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

export const huggingFaceProvider = new HuggingFaceProvider()
