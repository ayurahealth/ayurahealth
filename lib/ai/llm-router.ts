/**
 * LLM Router — Central AI orchestration engine for AyuraHealth.
 * 
 * Routes requests to the optimal provider based on:
 * 1. User's model preference
 * 2. Whether vision is needed (image attachments)
 * 3. Provider availability
 * 4. Automatic fallback chains
 * 
 * Supports hot-swapping models by adding provider config — no code changes needed.
 */

import type {
  LLMProvider,
  CompletionRequest,
  CompletionResponse,
  ProviderHealth,
} from './providers/types'
import { ollamaProvider } from './providers/ollama'
import { groqProvider } from './providers/groq'
import { openRouterProvider, OPENROUTER_MODEL_MAP } from './providers/openrouter'
import { huggingFaceProvider } from './providers/huggingface'
import { log } from '../logger'

export type ModelPreference = 'auto' | 'claude' | 'gpt' | 'gemini' | 'deepseek' | 'mistral' | 'llama' | 'groq' | 'ollama'

interface RoutingConfig {
  modelPreference: ModelPreference
  hasImages: boolean
  deepThink: boolean
}

interface RoutingResult {
  provider: LLMProvider
  model: string
  fallbackChain: Array<{ provider: LLMProvider; model: string }>
}

/** Default models per provider */
const PROVIDER_DEFAULTS = {
  ollama: 'glm-5.1:cloud',
  groq: 'llama-3.3-70b-versatile',
  huggingface: 'google/gemma-4-31B-it:novita',
} as const

/**
 * Determine which provider and model to use for a given request.
 */
export function routeRequest(config: RoutingConfig): RoutingResult {
  const { modelPreference, hasImages } = config

  // Vision requests MUST go through HuggingFace (only vision-capable provider)
  if (hasImages) {
    return {
      provider: huggingFaceProvider,
      model: PROVIDER_DEFAULTS.huggingface,
      fallbackChain: [
        { provider: openRouterProvider, model: OPENROUTER_MODEL_MAP.auto },
      ],
    }
  }

  // Explicit Ollama selection
  if (modelPreference === 'ollama') {
    return {
      provider: ollamaProvider,
      model: PROVIDER_DEFAULTS.ollama,
      fallbackChain: [
        { provider: groqProvider, model: PROVIDER_DEFAULTS.groq },
        { provider: openRouterProvider, model: OPENROUTER_MODEL_MAP.auto },
      ],
    }
  }

  // Explicit Groq selection
  if (modelPreference === 'groq') {
    return {
      provider: groqProvider,
      model: PROVIDER_DEFAULTS.groq,
      fallbackChain: [
        { provider: openRouterProvider, model: OPENROUTER_MODEL_MAP.auto },
      ],
    }
  }

  // All other model preferences route through OpenRouter
  if (modelPreference !== 'auto' && OPENROUTER_MODEL_MAP[modelPreference]) {
    return {
      provider: openRouterProvider,
      model: OPENROUTER_MODEL_MAP[modelPreference],
      fallbackChain: [
        { provider: groqProvider, model: PROVIDER_DEFAULTS.groq },
      ],
    }
  }

  // Auto mode: Groq first (fastest), then OpenRouter, then Ollama
  const hasGroq = Boolean(process.env.GROQ_API_KEY)
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY)

  if (hasGroq) {
    return {
      provider: groqProvider,
      model: PROVIDER_DEFAULTS.groq,
      fallbackChain: [
        ...(hasOpenRouter ? [{ provider: openRouterProvider, model: OPENROUTER_MODEL_MAP.auto }] : []),
        { provider: ollamaProvider, model: PROVIDER_DEFAULTS.ollama },
      ],
    }
  }

  if (hasOpenRouter) {
    return {
      provider: openRouterProvider,
      model: OPENROUTER_MODEL_MAP.auto,
      fallbackChain: [
        { provider: ollamaProvider, model: PROVIDER_DEFAULTS.ollama },
      ],
    }
  }

  // Last resort: Ollama
  return {
    provider: ollamaProvider,
    model: PROVIDER_DEFAULTS.ollama,
    fallbackChain: [],
  }
}

/**
 * Execute a completion with automatic fallback.
 */
export async function executeCompletion(
  request: CompletionRequest,
  config: RoutingConfig,
): Promise<CompletionResponse> {
  const { provider, model, fallbackChain } = routeRequest(config)
  const requestWithModel = { ...request, model }

  // Try primary provider
  try {
    const response = await provider.fetchCompletion({ ...request, model })
    if (response.text || response.toolCalls) {
      log.info('LLM_COMPLETION', {
        provider: provider.name,
        model,
        latencyMs: response.latencyMs,
        tokensUsed: response.tokensUsed,
      })
      return response
    }
  } catch (err) {
    log.warn('LLM_PRIMARY_FAILED', {
      provider: provider.name,
      model,
      error: err instanceof Error ? err.message : String(err),
    })
  }

  // Try fallback chain
  for (const fallback of fallbackChain) {
    try {
      const fbRequest = { ...request, model: fallback.model }
      const response = await fallback.provider.fetchCompletion(fbRequest)
      if (response.text) {
        log.info('LLM_FALLBACK_SUCCESS', {
          provider: fallback.provider.name,
          model: fallback.model,
          latencyMs: response.latencyMs,
        })
        return response
      }
    } catch (err) {
      log.warn('LLM_FALLBACK_FAILED', {
        provider: fallback.provider.name,
        model: fallback.model,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  throw new Error('All AI providers failed. Please try again later.')
}

/**
 * Execute a streaming completion with automatic fallback.
 */
export async function executeStreamingCompletion(
  request: CompletionRequest,
  config: RoutingConfig,
): Promise<{ stream: ReadableStream<Uint8Array>; provider: string; model: string }> {
  const { provider, model, fallbackChain } = routeRequest(config)
  const requestWithModel = { ...request, model }

  // Try primary provider
  try {
    const stream = await provider.fetchStreamingCompletion(requestWithModel)
    log.info('LLM_STREAM_START', { provider: provider.name, model })
    return { stream, provider: provider.name, model }
  } catch (err) {
    log.warn('LLM_STREAM_PRIMARY_FAILED', {
      provider: provider.name,
      model,
      error: err instanceof Error ? err.message : String(err),
    })
  }

  // Try fallback chain
  for (const fallback of fallbackChain) {
    try {
      const fbRequest = { ...request, model: fallback.model }
      const stream = await fallback.provider.fetchStreamingCompletion(fbRequest)
      log.info('LLM_STREAM_FALLBACK_SUCCESS', {
        provider: fallback.provider.name,
        model: fallback.model,
      })
      return { stream, provider: fallback.provider.name, model: fallback.model }
    } catch (err) {
      log.warn('LLM_STREAM_FALLBACK_FAILED', {
        provider: fallback.provider.name,
        model: fallback.model,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  throw new Error('All AI providers failed to start streaming.')
}

/**
 * Get health status of all registered providers.
 */
export async function getAllProviderHealth(): Promise<Record<string, ProviderHealth>> {
  const [ollama, groq, openRouter, huggingFace] = await Promise.allSettled([
    ollamaProvider.healthCheck(),
    groqProvider.healthCheck(),
    openRouterProvider.healthCheck(),
    huggingFaceProvider.healthCheck(),
  ])

  return {
    ollama: ollama.status === 'fulfilled' ? ollama.value : { available: false, error: 'Health check failed' },
    groq: groq.status === 'fulfilled' ? groq.value : { available: false, error: 'Health check failed' },
    openRouter: openRouter.status === 'fulfilled' ? openRouter.value : { available: false, error: 'Health check failed' },
    huggingFace: huggingFace.status === 'fulfilled' ? huggingFace.value : { available: false, error: 'Health check failed' },
  }
}
