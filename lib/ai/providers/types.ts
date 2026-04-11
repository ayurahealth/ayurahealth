import type { ToolDefinition } from '../tool-executor'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string | ChatPart[]
  toolCalls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>
  toolCallId?: string
}

export interface ChatPart {
  type: 'text' | 'image_url'
  text?: string
  image_url?: { url: string }
}

export interface CompletionRequest {
  model: string
  messages: ChatMessage[]
  maxTokens: number
  temperature: number
  stream?: boolean
  tools?: ToolDefinition[]
  signal?: AbortSignal
}

export interface CompletionResponse {
  text: string
  model: string
  provider: string
  latencyMs: number
  tokensUsed?: number
  toolCalls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>
}

export interface StreamChunk {
  content?: string
  toolCall?: { id: string; type: 'function'; function: { name: string; arguments: string } }
  done: boolean
}

export interface ProviderHealth {
  available: boolean
  latencyMs?: number
  models?: string[]
  error?: string
}

/**
 * Every LLM provider must implement this interface.
 * This allows hot-swapping providers without changing calling code.
 */
export interface LLMProvider {
  readonly name: string
  readonly supportsStreaming: boolean
  readonly supportsVision: boolean

  /** Check if this provider is configured and reachable */
  healthCheck(): Promise<ProviderHealth>

  /** Fetch a complete response (non-streaming) */
  fetchCompletion(request: CompletionRequest): Promise<CompletionResponse>

  /** Fetch a streaming response as a ReadableStream of SSE chunks */
  fetchStreamingCompletion(request: CompletionRequest): Promise<ReadableStream<Uint8Array>>
}
