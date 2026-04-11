/**
 * VAIDYA Chat API — Refactored to modular architecture.
 * 
 * This route handles:
 * 1. Request validation (Zod)
 * 2. Rate limiting + paywall enforcement
 * 3. Input sanitization (prompt injection defense)
 * 4. Delegates to modular services for prompt building, LLM routing, and context assembly
 * 5. Returns true SSE streaming responses
 * 
 * All business logic has been extracted to:
 * - lib/ai/llm-router.ts — Provider selection + fallback chains
 * - lib/ai/prompt-manager.ts — System prompt construction
 * - lib/ai/context-engine.ts — RAG, Clinical Memory, Web Search, Agents
 * - lib/security/input-sanitizer.ts — Safety + injection defense
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'

import { checkRateLimit } from '../../../lib/rateLimit'
import { sanitizeUserInput, sanitizeAIResponse } from '../../../lib/security/input-sanitizer'
import {
  validateLang,
  validateSystems,
  validateDosha,
  validateAttachments,
  buildPromptProfile,
  buildAutoRecoveryPolicy,
  buildSystemPrompt,
  formatMessagesForApi,
  scoreResponseQuality,
} from '../../../lib/ai/prompt-manager'
import type { ResponseQuality, AutoRecoveryPolicy } from '../../../lib/ai/prompt-manager'
import {
  fetchClinicalMemory,
  fetchKnowledgeContext,
  fetchWebContext,
  orchestrateAgents,
} from '../../../lib/ai/context-engine'
import { executeCompletion, executeStreamingCompletion, routeRequest } from '../../../lib/ai/llm-router'
import type { ModelPreference } from '../../../lib/ai/llm-router'
import type { ChatMessage } from '../../../lib/ai/providers/types'
import { VAIDYA_TOOLS, executeToolCall } from '../../../lib/ai/tool-executor'
import { log } from '../../../lib/logger'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
export const runtime = 'nodejs'

// ── Request Schema ──────────────────────────────────────────────────────────
const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(10000),
  })).min(1).max(50),
  systems: z.array(z.string()).optional(),
  dosha: z.enum(['Vata', 'Pitta', 'Kapha']).nullable().optional(),
  lang: z.string().max(10).optional(),
  attachments: z.array(z.object({
    type: z.enum(['pdf', 'image', 'link']),
    content: z.string().max(100000),
    name: z.string().max(255).optional(),
    mimeType: z.string().max(100).optional(),
    url: z.string().url().optional(),
  })).max(5).optional(),
  deepThink: z.boolean().optional(),
  modelPreference: z.enum(['auto', 'claude', 'gpt', 'gemini', 'deepseek', 'mistral', 'llama', 'groq', 'ollama']).optional(),
  webSearch: z.boolean().optional(),
  sessionId: z.string().uuid().optional(),
  vedicContext: z.string().max(20000).optional(),
})

const MAX_CONTENT_BYTES = 200_000
const FREE_MESSAGE_LIMIT = 10

interface PrismaChatSession { id: string }
interface PrismaChatClient {
  chatSession: {
    create(args: { data: { userId: string; topic: string; summary: string } }): Promise<PrismaChatSession>
  }
  message: {
    create(args: { data: { sessionId: string; role: string; content: string } }): Promise<unknown>
  }
}

interface ToolTraceItem {
  id: string
  name: string
  args: string
  output: string
}

// ── Stream Headers ──────────────────────────────────────────────────────────
const STREAM_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
}

// ── Main Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {

  // 1. Size guard
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > MAX_CONTENT_BYTES) {
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
  }

  // 2. Rate limiting + CEO Bypass
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous'
  const ceoToken = req.cookies.get('ayura_ceo_token')?.value
  const CEO_BYPASS_KEY = process.env.CEO_BYPASS_KEY
  const isCeo = Boolean(CEO_BYPASS_KEY && ceoToken === CEO_BYPASS_KEY)

  const { allowed } = await checkRateLimit(ip, isCeo)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
  }
  if (isCeo) log.info('CEO_BYPASS_ACTIVE', { ip })

  // 3. Auth + Paywall
  const clerkUser = await currentUser()
  const tier = (clerkUser?.publicMetadata?.tier as string) || 'free'

  try {
    // 4. Parse + Validate
    const body = await req.text()
    if (body.length > MAX_CONTENT_BYTES) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
    }

    const json = JSON.parse(body) as any

    const validation = chatSchema.safeParse(json)
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request data', details: validation.error.format() }, { status: 400 })
    }

    const { messages, systems, dosha, lang, attachments, deepThink, modelPreference, webSearch, sessionId, vedicContext } = validation.data

    // 5. Paywall enforcement
    if (tier === 'free') {
      const assistantCount = messages.filter(m => m.role === 'assistant').length
      if (assistantCount >= FREE_MESSAGE_LIMIT) {
        return NextResponse.json(
          { error: 'PAYWALL_LIMIT', message: `Free plan includes ${FREE_MESSAGE_LIMIT} consultations. Upgrade to continue.` },
          { status: 402 }
        )
      }
    }

    // 6. Validate + Sanitize inputs
    const safeLang = validateLang(lang)
    const safeSystems = validateSystems(systems)
    const safeDosha = validateDosha(dosha)
    const safeAttachments = validateAttachments(attachments)
    const preferredModel = (modelPreference || 'auto') as ModelPreference

    const lastMsg = messages[messages.length - 1]
    const userQuery = lastMsg.role === 'user' ? lastMsg.content : ''

    // 7. Input safety check (NEW — previously defined but never called)
    const sanitized = sanitizeUserInput(userQuery, safeLang)
    if (sanitized.blocked) {
      return new NextResponse(
        createTextStream(sanitized.sanitizedContent, {}),
        { headers: STREAM_HEADERS }
      )
    }
    if (sanitized.warnings.length > 0) {
      log.warn('INPUT_WARNINGS', { warnings: sanitized.warnings, ip })
    }

    // 8. Build prompt profile + auto-recovery
    const promptProfile = buildPromptProfile(messages)
    const autoRecoveryPolicy = buildAutoRecoveryPolicy({
      promptProfile,
      requestedDeepThink: Boolean(deepThink),
      requestedWebSearch: Boolean(webSearch),
    })
    const effectiveDeepThink = autoRecoveryPolicy.forceDeepThink ? true : Boolean(deepThink)
    const effectiveWebSearch = autoRecoveryPolicy.webSearchSuppressed ? false : Boolean(webSearch)

    // 9. Fetch context (in parallel)
    const [clinicalMemoryCtx, knowledgeResult, webResult] = await Promise.all([
      clerkUser?.id ? fetchClinicalMemory(clerkUser.id) : Promise.resolve(''),
      fetchKnowledgeContext(userQuery),
      effectiveWebSearch ? fetchWebContext(userQuery) : Promise.resolve({ context: '', chunks: [] as Array<{ title: string; content: string; tradition: string; source: string; similarity: number }> }),
    ])

    const allKnowledgeCtx = [knowledgeResult.context, webResult.context].filter(Boolean).join('')
    const allChunks = [...knowledgeResult.chunks, ...webResult.chunks]

    // 10. Agent orchestration
    const agentTrace: Array<{ id: 'planner' | 'researcher' | 'synthesizer'; label: string; summary: string }> = []
    const agentTraceCtxResult = await (async (): Promise<string> => {
      if (effectiveDeepThink || effectiveWebSearch) {
        const routing = routeRequest({ modelPreference: preferredModel, hasImages: false, deepThink: effectiveDeepThink })
        const key = routing.provider.name === 'Groq' ? process.env.GROQ_API_KEY || ''
          : routing.provider.name === 'OpenRouter' ? process.env.OPENROUTER_API_KEY || ''
          : ''
        if (key) {
          const apiUrl = routing.provider.name === 'Groq' ? 'https://api.groq.com/openai/v1/chat/completions'
            : 'https://openrouter.ai/api/v1/chat/completions'
          const headers: Record<string, string> = { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' }
          if (routing.provider.name === 'OpenRouter') {
            headers['HTTP-Referer'] = 'https://ayurahealth.com'
            headers['X-Title'] = 'AyuraHealth VAIDYA'
          }
          const result = await orchestrateAgents({
            userQuery,
            knowledgeCtx: allKnowledgeCtx,
            apiUrl,
            headers,
            model: routing.model,
          })
          agentTrace.push(...result.agentTrace)
          return result.context
        }
      }
      return ''
    })()
    const agentTraceCtx = agentTraceCtxResult

    // 11. Build system prompt
    const systemPrompt = buildSystemPrompt({
      messages,
      systems: safeSystems,
      dosha: safeDosha,
      lang: safeLang,
      attachments: safeAttachments,
      deepThink: effectiveDeepThink,
      vedicContext,
      knowledgeCtx: allKnowledgeCtx,
      clinicalMemoryCtx,
      agentTraceCtx,
      promptProfile,
      autoRecoveryPolicy,
    })

    // 12. Format messages for API
    const completionMessages = formatMessagesForApi(messages, safeAttachments, systemPrompt)
    const hasImages = safeAttachments.some(a => a.type === 'image')
    const maxTokens = effectiveDeepThink ? 4000 : 2500
    const temperature = Math.max(0.2, Math.min(0.8,
      (effectiveDeepThink ? 0.6 : 0.7) +
      promptProfile.temperatureAdjust +
      (autoRecoveryPolicy.applied ? -0.05 : 0)
    ))

    // 13. Agentic Tool Execution Loop (up to 3 iterations)
    const currentMessages: ChatMessage[] = [...completionMessages]
    const toolTrace: ToolTraceItem[] = []
    
    // Only use tools if Deep Think or specific tags are present, or in Researcher mode
    const useTools = effectiveWebSearch || effectiveDeepThink || userQuery.toLowerCase().includes('search') || userQuery.toLowerCase().includes('profile')

    if (useTools) {
      for (let i = 0; i < 3; i++) {
        log.info('TOOL_CHECK_ITERATION', { iteration: i, provider: preferredModel })
        try {
          const check = await executeCompletion(
            { model: '', messages: currentMessages, maxTokens: 1000, temperature: 0.1, tools: VAIDYA_TOOLS },
            { modelPreference: preferredModel, hasImages, deepThink: effectiveDeepThink },
          )

          if (check.toolCalls && check.toolCalls.length > 0) {
            log.info('LLM_REQUESTED_TOOLS', { count: check.toolCalls.length })
            for (const tool of check.toolCalls) {
              const result = await executeToolCall(tool)
              const toolName = tool.function.name
              currentMessages.push({ role: 'assistant', content: `[CALLING_TOOL: ${toolName}]` })
              currentMessages.push({ role: 'system', content: `TOOL_RESULT [${toolName}]: ${result.output}` })
              toolTrace.push({ id: tool.id, name: toolName, args: tool.function.arguments, output: result.output })
            }
            continue // Check again if LLM needs more tools
          }
        } catch (err) {
          log.error('TOOL_LOOP_FAILED', { error: String(err) })
          break
        }
        break // No tool calls, proceed to stream
      }
    }

    // 14. Execute final LLM streaming completion
    // 14. Execute final LLM streaming completion
    const streamResult = await executeStreamingCompletion(
      { model: '', messages: currentMessages, maxTokens, temperature },
      { modelPreference: preferredModel, hasImages, deepThink: effectiveDeepThink },
    ).catch(err => {
      log.error('ALL_PROVIDERS_FAILED', { error: String(err) })
      return null
    })

    if (!streamResult) {
      return NextResponse.json({ error: 'AI service temporarily unavailable.' }, { status: 500 })
    }

    // 15. Return composite streaming response
    return new NextResponse(createCompositeStream({
      llmStream: streamResult.stream,
      metadata: {
        sources: allChunks,
        sessionId,
        agentTrace: [...agentTrace, ...toolTrace.map(t => ({ id: 'researcher', label: `Executed ${t.name}`, summary: t.output.slice(0, 100) }))],
        modelUsed: streamResult.model,
        providerUsed: streamResult.provider,
        policy: autoRecoveryPolicy,
      },
      clerkUserId: clerkUser?.id,
      userQuery,
    }), { headers: STREAM_HEADERS })

  } catch (err) {
    log.error('CHAT_API_CRASH', { error: String(err), stack: err instanceof Error ? err.stack : undefined })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function createCompositeStream(args: {
  llmStream: ReadableStream<Uint8Array>
  metadata: {
    sources: KnowledgeSource[]
    sessionId?: string
    agentTrace: TraceItem[]
    modelUsed: string
    providerUsed: string
    policy: AutoRecoveryPolicy
  }
  clerkUserId?: string
  userQuery: string
}): ReadableStream {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const startAt = Date.now()
  let firstTokenAt = 0
  let fullText = ''
  let activeSessionId = args.metadata.sessionId

  return new ReadableStream({
    async start(controller) {
      // 1. Resolve Session ID Logic ... (truncated for brevity)
      if (args.clerkUserId && !activeSessionId) {
        try {
          const prismaMod = await import('../../../lib/prisma')
          const prismaClient = prismaMod.prisma as unknown as PrismaChatClient
          const session = await prismaClient.chatSession.create({
            data: { userId: args.clerkUserId, topic: args.userQuery.slice(0, 50), summary: '' }
          })
          activeSessionId = session.id
          await prismaClient.message.create({
            data: { sessionId: activeSessionId, role: 'user', content: args.userQuery }
          })
        } catch (err) {
          log.error('SESSION_INIT_ERROR', { error: String(err) })
        }
      } else if (args.clerkUserId && activeSessionId) {
        try {
          const prismaMod = await import('../../../lib/prisma')
          const prismaClient = prismaMod.prisma as unknown as PrismaChatClient
          await prismaClient.message.create({
            data: { sessionId: activeSessionId, role: 'user', content: args.userQuery }
          })
        } catch (err) {
          log.error('USER_MSG_SAVE_ERROR', { error: String(err) })
        }
      }

      const metaStr = JSON.stringify({ ...args.metadata, sessionId: activeSessionId })
      controller.enqueue(encoder.encode(`data: ${metaStr}\n\n`))

      const reader = args.llmStream.getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          if (!firstTokenAt) {
            firstTokenAt = Date.now()
          }

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || !trimmed.startsWith('data: ')) continue
            try {
              const data = JSON.parse(trimmed.slice(6))
              if (data.content) {
                fullText += data.content
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: data.content })}\n\n`))
              }
            } catch {}
          }
        }
      } catch (err) {
        log.error('LLM_STREAM_ERROR', { error: String(err) })
      } finally {
        if (activeSessionId && fullText) {
          const sanitizedText = sanitizeAIResponse(fullText)
          const quality = scoreResponseQuality(sanitizedText, false, Date.now() - startAt)
          
          log.info('CHAT_STREAM_TELEMETRY', {
            ttft: firstTokenAt ? firstTokenAt - startAt : 0,
            totalLatency: Date.now() - startAt,
            model: args.metadata.modelUsed,
            provider: args.metadata.providerUsed,
            sessionId: activeSessionId
          })

          try {
            const prismaMod = await import('../../../lib/prisma')
            const prismaClient = prismaMod.prisma as unknown as PrismaChatClient
            await prismaClient.message.create({
              data: { sessionId: activeSessionId, role: 'assistant', content: sanitizedText }
            })
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ quality, modelUsed: args.metadata.modelUsed })}\n\n`))
          } catch (err) {
            log.error('ASSISTANT_MSG_SAVE_ERROR', { error: String(err) })
          }
        }
        controller.close()
        reader.releaseLock()
      }
    },
  })
}
