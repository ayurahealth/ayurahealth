/**
 * LLM Router — Central AI orchestration engine for Ayura Intelligence Lab.
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

function isConfigured(...values: Array<string | undefined>): boolean {
  return values.some(value => Boolean(value?.trim()))
}

function hasGroqConfig(): boolean {
  return isConfigured(
    process.env.GROQ_API_KEY,
    process.env.GROK_API_KEY,
    process.env.GROQ_KEY,
    process.env.GROQ_APIKEY,
  )
}

function hasOpenRouterConfig(): boolean {
  return isConfigured(process.env.OPENROUTER_API_KEY)
}

/** Ollama's localhost default is useful in development, but points at the app
 * server in production. In production it must be explicitly configured. */
function hasOllamaConfig(): boolean {
  return isConfigured(process.env.OLLAMA_BASE_URL) || process.env.NODE_ENV !== 'production'
}

function cloudFallbacks(includeOpenRouter: boolean, includeGroq: boolean, includeOllama = true) {
  return [
    ...(includeOpenRouter && hasOpenRouterConfig()
      ? [{ provider: openRouterProvider, model: OPENROUTER_MODEL_MAP.auto }]
      : []),
    ...(includeGroq && hasGroqConfig()
      ? [{ provider: groqProvider, model: PROVIDER_DEFAULTS.groq }]
      : []),
    ...(includeOllama && hasOllamaConfig()
      ? [{ provider: ollamaProvider, model: PROVIDER_DEFAULTS.ollama }]
      : []),
  ]
}

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
      fallbackChain: cloudFallbacks(true, false, false),
    }
  }

  // Explicit Ollama selection
  if (modelPreference === 'ollama') {
    return {
      provider: ollamaProvider,
      model: PROVIDER_DEFAULTS.ollama,
      fallbackChain: cloudFallbacks(true, true, false),
    }
  }

  // Explicit Groq selection
  if (modelPreference === 'groq') {
    return {
      provider: groqProvider,
      model: PROVIDER_DEFAULTS.groq,
      fallbackChain: cloudFallbacks(true, false),
    }
  }

  // All other model preferences route through OpenRouter
  if (modelPreference !== 'auto' && OPENROUTER_MODEL_MAP[modelPreference]) {
    return {
      provider: openRouterProvider,
      model: OPENROUTER_MODEL_MAP[modelPreference],
      fallbackChain: cloudFallbacks(false, true),
    }
  }

  // Auto mode: Groq first (fastest), then OpenRouter, then Ollama
  const hasGroq = hasGroqConfig()
  const hasOpenRouter = hasOpenRouterConfig()
  const ollamaFallback = hasOllamaConfig()

  if (hasGroq) {
    return {
      provider: groqProvider,
      model: PROVIDER_DEFAULTS.groq,
      fallbackChain: [
        ...(hasOpenRouter ? [{ provider: openRouterProvider, model: OPENROUTER_MODEL_MAP.auto }] : []),
        ...(ollamaFallback ? [{ provider: ollamaProvider, model: PROVIDER_DEFAULTS.ollama }] : []),
      ],
    }
  }

  if (hasOpenRouter) {
    return {
      provider: openRouterProvider,
      model: OPENROUTER_MODEL_MAP.auto,
      fallbackChain: [
        ...(ollamaFallback ? [{ provider: ollamaProvider, model: PROVIDER_DEFAULTS.ollama }] : []),
      ],
    }
  }

  // Last resort: local Ollama in development, or explicitly configured Ollama.
  if (!ollamaFallback) {
    throw new Error('No AI provider is configured. Add a valid GROQ_API_KEY or OPENROUTER_API_KEY in the deployment environment.')
  }
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
  const errors: string[] = []

  // Try primary provider
  try {
    const stream = await provider.fetchStreamingCompletion(requestWithModel)
    log.info('LLM_STREAM_START', { provider: provider.name, model })
    return { stream, provider: provider.name, model }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    errors.push(`${provider.name}: ${msg}`)
    log.warn('LLM_STREAM_PRIMARY_FAILED', {
      provider: provider.name,
      model,
      error: msg,
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
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(`${fallback.provider.name}: ${msg}`)
      log.warn('LLM_STREAM_FALLBACK_FAILED', {
        provider: fallback.provider.name,
        model: fallback.model,
        error: msg,
      })
    }
  }

  const attemptedProviders = errors.map(error => error.slice(0, error.indexOf(':'))).join(', ')
  const diagnostic = errors.join(' | ')
  log.error('LLM_ALL_PROVIDERS_FAILED', { error: diagnostic })
  if (errors.some(error => /OpenRouter[^|]*\b401\b/i.test(error))) {
    throw new Error('OpenRouter rejected its credentials (401). Update OPENROUTER_API_KEY or configure GROQ_API_KEY as a fallback.')
  }
  throw new Error(
    attemptedProviders
      ? `No configured AI provider could complete the request (${attemptedProviders}). Check provider credentials and deployment configuration.`
      : 'No AI provider is configured. Add a valid GROQ_API_KEY or OPENROUTER_API_KEY in the deployment environment.'
  )
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
