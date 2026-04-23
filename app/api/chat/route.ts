/**
 * VAIDYA Chat API — Refactored to modular architecture.
 * 
 * This route handles:
 * 1. Request validation (Zod)
 * 2. Rate limiting + paywall enforcement
 * 3. Input sanitization (prompt injection defense)
 * 4. Delegates to modular services for prompt building, LLM routing, and context assembly
 * 5. Returns true SSE streaming responses
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'

import { checkRateLimitDistributed } from '@/lib/security/ratelimit'

import { sanitizeInput } from '@/lib/security/sanitizer'

// Response Sanitization
function sanitizeAIResponse(text: string): string {
  return text
    .replace(/PROMPT PROFILE:\s*(BALANCED|STRICT|RECOVERY)/gi, '')
    .replace(/AUTO RECOVERY POLICY ACTIVE:[^\n]*/gi, '')
    .replace(/OUTPUT CONTRACT \(ALWAYS FOLLOW\):[^]*?(?=###|$)/gi, '')
    .replace(/VAIDYA CLINICAL MEMORY \(PATIENT FILE\):[^\n]*/gi, '')
}

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
} from '@/lib/ai/prompt-manager'
import type { AutoRecoveryPolicy } from '@/lib/ai/prompt-manager'
import {
  fetchClinicalMemory,
  fetchPatientProfile,
  fetchChatHistory,
  fetchKnowledgeContext,
  fetchWebContext,
  orchestrateAgents,
} from '@/lib/ai/context-engine'
import { KnowledgeChunkResult } from '@/lib/ai/types'
import { executeCompletion, executeStreamingCompletion } from '@/lib/ai/llm-router'
import type { ModelPreference } from '@/lib/ai/llm-router'
import type { ChatMessage } from '@/lib/ai/providers/types'
import { VAIDYA_TOOLS, executeToolCall } from '@/lib/ai/tool-executor'
import { log } from '@/lib/logger'

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
  cavemanMode: z.boolean().optional(),
})

const MAX_CONTENT_BYTES = 200_000
const FREE_MESSAGE_LIMIT = 10


interface ToolTraceItem {
  id: string
  name: string
  args: string
  output: string
}

const STREAM_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
}

// ── Main Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous'
  const isAllowed = await checkRateLimitDistributed(ip)
  if (!isAllowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait 1 minute.' }, { status: 429 })
  }

  const ceoToken = req.cookies.get('ayura_ceo_token')?.value
  const CEO_BYPASS_KEY = process.env.CEO_BYPASS_KEY
  const isCeo = Boolean(CEO_BYPASS_KEY && ceoToken === CEO_BYPASS_KEY)
  if (isCeo) log.info('CEO_BYPASS_ACTIVE', { ip })

  const clerkUser = await currentUser()
  const tier = (clerkUser?.publicMetadata?.tier as string) || 'free'

  try {
    const body = await req.text()
    if (body.length > MAX_CONTENT_BYTES) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
    }

    const json = JSON.parse(body) as Record<string, unknown>
    const validation = chatSchema.safeParse(json)
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request data', details: validation.error.format() }, { status: 400 })
    }

    const { messages, systems, dosha, lang, attachments, deepThink, modelPreference, webSearch, sessionId, vedicContext, cavemanMode } = validation.data

    if (tier === 'free') {
      const assistantCount = messages.filter(m => m.role === 'assistant').length
      if (assistantCount >= FREE_MESSAGE_LIMIT) {
        return NextResponse.json(
          { error: 'PAYWALL_LIMIT', message: `Free plan includes ${FREE_MESSAGE_LIMIT} consultations. Upgrade to continue.` },
          { status: 402 }
        )
      }
    }

    const safeLang = validateLang(lang)
    const safeSystems = validateSystems(systems)
    const safeDosha = validateDosha(dosha)
    const safeAttachments = validateAttachments(attachments)
    const preferredModel = (modelPreference || 'auto') as ModelPreference

    const lastMsg = messages[messages.length - 1]
    const userQuery = lastMsg.role === 'user' ? sanitizeInput(lastMsg.content) : ''

    const promptProfile = buildPromptProfile(messages)
    const autoRecoveryPolicy = buildAutoRecoveryPolicy({
      promptProfile,
      requestedDeepThink: Boolean(deepThink),
      requestedWebSearch: Boolean(webSearch),
    })
    const effectiveDeepThink = autoRecoveryPolicy.forceDeepThink ? true : Boolean(deepThink)
    const effectiveWebSearch = autoRecoveryPolicy.webSearchSuppressed ? false : Boolean(webSearch)

    // 9. Fetch context (in parallel)
    const [clinicalMemoryCtx, patientProfileCtx, knowledgeResult, webResult, historyBackfill] = await Promise.all([
      clerkUser?.id ? fetchClinicalMemory(clerkUser.id) : Promise.resolve(''),
      clerkUser?.id ? fetchPatientProfile(clerkUser.id) : Promise.resolve(''),
      fetchKnowledgeContext(userQuery),
      effectiveWebSearch ? fetchWebContext(userQuery) : Promise.resolve({ context: '', chunks: [] as KnowledgeChunkResult[] }),
      (sessionId && messages.length === 1) ? fetchChatHistory(sessionId) : Promise.resolve([]),
    ])

    const effectiveMessages = historyBackfill.length > 0 ? [...historyBackfill, messages[messages.length - 1]] : messages
    const allKnowledgeCtx = [knowledgeResult.context, webResult.context].filter(Boolean).join('\n')
    const allChunks = [...knowledgeResult.chunks, ...webResult.chunks]

    // 10. Agent orchestration
    const { agentTrace, context: agentTraceCtx } = await (async () => {
      if (effectiveDeepThink || effectiveWebSearch) {
        return orchestrateAgents({
          userQuery,
          knowledgeCtx: allKnowledgeCtx,
          modelPreference: preferredModel
        })
      }
      return { agentTrace: [], context: '' }
    })()

    // 11. Build system prompt
    const systemPrompt = buildSystemPrompt({
      messages: effectiveMessages,
      systems: safeSystems,
      dosha: safeDosha,
      lang: safeLang,
      attachments: safeAttachments,
      deepThink: effectiveDeepThink,
      vedicContext,
      knowledgeCtx: allKnowledgeCtx,
      clinicalMemoryCtx,
      patientProfileCtx,
      agentTraceCtx,
      cavemanMode: Boolean(cavemanMode),
      promptProfile,
      autoRecoveryPolicy,
    })

    const completionMessages = formatMessagesForApi(effectiveMessages, safeAttachments, systemPrompt)
    const hasImages = safeAttachments.some(a => a.type === 'image')
    const maxTokens = effectiveDeepThink ? 4000 : 2500
    const temperature = Math.max(0.2, Math.min(0.8,
      (effectiveDeepThink ? 0.6 : 0.7) +
      promptProfile.temperatureAdjust +
      (autoRecoveryPolicy.applied ? -0.05 : 0)
    ))

    const currentMessages: ChatMessage[] = [...completionMessages]
    const toolTrace: ToolTraceItem[] = []
    const useTools = effectiveWebSearch || effectiveDeepThink || userQuery.toLowerCase().includes('search') || userQuery.toLowerCase().includes('profile')

    if (useTools) {
      for (let i = 0; i < 4; i++) {
        try {
          const check = await executeCompletion(
            { model: '', messages: currentMessages, maxTokens: 1000, temperature: 0.1, tools: VAIDYA_TOOLS },
            { modelPreference: preferredModel, hasImages, deepThink: effectiveDeepThink },
          )

          if (check.toolCalls && check.toolCalls.length > 0) {
            const results = await Promise.all(
              check.toolCalls.map(async (tool) => {
                const result = await executeToolCall(tool)
                return { tool, result }
              })
            )

            for (const { tool, result } of results) {
              const toolName = tool.function.name
              currentMessages.push({ role: 'assistant', content: `[CALLING_TOOL: ${toolName}]` })
              currentMessages.push({ role: 'system', content: `TOOL_RESULT [${toolName}]: ${result.output}` })
              toolTrace.push({ id: tool.id, name: toolName, args: tool.function.arguments, output: result.output })
            }
            continue
          }
        } catch {
          break
        }
        break
      }
    }

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

    return new NextResponse(createCompositeStream({
      llmStream: streamResult.stream,
      metadata: {
        sources: allChunks,
        sessionId,
        agentTrace: [...agentTrace, ...toolTrace.map(t => ({ id: 'researcher' as const, label: `Executed ${t.name}`, summary: t.output.slice(0, 100) }))],
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
    sources: KnowledgeChunkResult[]
    sessionId?: string
    agentTrace: unknown[]
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
      if (args.clerkUserId && !activeSessionId) {
        try {
          const prismaMod = await import('@/lib/prisma')
          const prismaClient = prismaMod.prisma
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
          const prismaMod = await import('@/lib/prisma')
          const prismaClient = prismaMod.prisma
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
          if (!firstTokenAt) firstTokenAt = Date.now()

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
      } catch {
        log.error('LLM_STREAM_ERROR', { error: 'Stream interrupted' })
      } finally {
        if (activeSessionId && fullText) {
          const sanitizedText = sanitizeAIResponse(fullText)
          const quality = scoreResponseQuality(sanitizedText, false, Date.now() - startAt)
          
          try {
            const prismaMod = await import('@/lib/prisma')
            const prismaClient = prismaMod.prisma
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
