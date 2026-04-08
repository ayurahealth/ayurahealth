import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
export const runtime = 'nodejs'

import { checkRateLimit } from '../../../lib/rateLimit'
import { COUNCIL_OF_AGENTS, SYNTHESIS_PROMPT } from '../../../lib/ai/agents'
import { z } from 'zod'

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
  sessionId: z.string().uuid().optional(),
})

interface KnowledgeChunkResult {
  title: string;
  content: string;
  tradition: string;
  source: string;
  similarity: number;
}

interface ChatSessionRecord {
  id: string
}

interface MessageCreateInput {
  sessionId: string
  role: 'user' | 'assistant'
  content: string
}

interface PrismaChatClient {
  chatSession: {
    create(args: { data: { userId: string; topic: string; summary: string } }): Promise<ChatSessionRecord>
  }
  message: {
    create(args: { data: MessageCreateInput }): Promise<unknown>
  }
  $queryRawUnsafe<T>(query: string, ...params: unknown[]): Promise<T>
}

const FREE_MESSAGE_LIMIT = 10 // Number of AI responses a free user gets

const VAIDYA_SYSTEM = `You are VAIDYA — the living mind of AyuraHealth. An ancient physician carrying 5,000 years of healing wisdom across 8 traditions. Your intelligence is augmented by a Council of 10 Specialized Agents. Respond with the authority and warmth of a master healer.`

// Allowlist for language codes
const VALID_LANGS = new Set([
  'en','sa','hi','ja','zh','zh-TW','ko','ar','fa','ur','bn','ta','te','kn','ml',
  'mr','gu','pa','ne','es','fr','de','it','pt','ru','pl','nl','sv','tr','id',
  'ms','th','vi','sw','uk','he','el','ro','hu','cs','da','fi','no','bg','hr',
  'sr','sk','mn','ka','am','af','lo','si','my','km',
])

const VALID_SYSTEMS = new Set([
  'ayurveda','tcm','western','homeopathy','naturopathy','unani','siddha','tibetan',
])

const MAX_CONTENT_BYTES = 200_000 // 200 KB
// Constants are now managed via Zod schema and lib/ai/agents.ts

export async function POST(req: NextRequest) {
  // ── Size guard ──────────────────────────────────────────────────────────
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > MAX_CONTENT_BYTES) {
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
  }

  // ── Rate limiting ────────────────────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous'
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
  }

  // ── Paywall: read tier (count enforced after body parse) ────────────────
  const clerkUser = await currentUser()
  const tier = (clerkUser?.publicMetadata?.tier as string) || 'free'

  try {
    const body = await req.text()
    if (body.length > MAX_CONTENT_BYTES) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
    }

    let json: unknown
    try {
      json = JSON.parse(body)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
    }

    const validation = chatSchema.safeParse(json)
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: validation.error.format() 
      }, { status: 400 })
    }

    const { messages, systems, dosha, lang, attachments, deepThink, sessionId } = validation.data
    let prismaClient: PrismaChatClient | null = null

    // ── Paywall: count existing AI responses & enforce limit ─────────────────
    if (tier === 'free') {
      const assistantCount = Array.isArray(messages)
        ? messages.filter(m => m.role === 'assistant').length
        : 0
      if (assistantCount >= FREE_MESSAGE_LIMIT) {
        return NextResponse.json(
          { error: 'PAYWALL_LIMIT', message: `Free plan includes ${FREE_MESSAGE_LIMIT} consultations. Upgrade to continue.` },
          { status: 402 }
        )
      }
    }

    // ── Validate lang ────────────────────────────────────────────────────────
    const safeLang = typeof lang === 'string' && VALID_LANGS.has(lang) ? lang : 'en'

    // ── Validate systems ─────────────────────────────────────────────────────
    const safeSystems = Array.isArray(systems)
      ? systems.filter(s => typeof s === 'string' && VALID_SYSTEMS.has(s)).slice(0, 3)
      : []

    // ── Validate dosha ───────────────────────────────────────────────────────
    const safeDosha = typeof dosha === 'string' && ['Vata', 'Pitta', 'Kapha'].includes(dosha)
      ? dosha : null

    // ── Validate attachments ─────────────────────────────────────────────────
    const safeAttachments = Array.isArray(attachments)
      ? attachments
          .filter(a => typeof a === 'object' && ['pdf', 'image', 'link'].includes(a.type))
          .slice(0, 5)
          .map(a => ({
            ...a,
            content: typeof a.content === 'string' ? a.content.slice(0, 50_000) : '',
            name: typeof a.name === 'string' ? a.name.slice(0, 200) : '',
          }))
      : []

    const LANG_NAMES: Record<string, string> = {
      en: 'English', sa: 'Sanskrit', hi: 'Hindi', ja: 'Japanese',
      zh: 'Chinese Simplified', 'zh-TW': 'Chinese Traditional', ko: 'Korean',
      ar: 'Arabic', fa: 'Persian', ur: 'Urdu', bn: 'Bengali', ta: 'Tamil',
      te: 'Telugu', kn: 'Kannada', ml: 'Malayalam', mr: 'Marathi',
      gu: 'Gujarati', pa: 'Punjabi', ne: 'Nepali', es: 'Spanish',
      fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese',
      ru: 'Russian', pl: 'Polish', nl: 'Dutch', sv: 'Swedish',
      tr: 'Turkish', id: 'Indonesian', ms: 'Malay', th: 'Thai',
      vi: 'Vietnamese', sw: 'Swahili', uk: 'Ukrainian', he: 'Hebrew',
      el: 'Greek', ro: 'Romanian', hu: 'Hungarian', cs: 'Czech',
    }
    const langName = LANG_NAMES[safeLang] || 'English'

    const systemsMap: Record<string, string> = {
      ayurveda: 'Ayurveda', tcm: 'TCM', western: 'Western Medicine',
      homeopathy: 'Homeopathy', naturopathy: 'Naturopathy',
      unani: 'Unani', siddha: 'Siddha', tibetan: 'Tibetan Medicine',
    }

    const selectedSystems = safeSystems.length === 1
      ? `STRICT MODE: Use ONLY ${systemsMap[safeSystems[0]] || safeSystems[0]}. Do NOT mix traditions.`
      : safeSystems.length > 1
        ? `MULTI-SYSTEM MODE: User selected ${safeSystems.map(s => systemsMap[s] || s).join(', ')}.
Use ONLY these selected systems. Do NOT use any unselected tradition.
Structure answer with clear sub-sections per selected system, then a concise combined action plan.`
        : 'Default mode: Ayurveda-only guidance unless user explicitly requests another system.'

    const doshaCtx = safeDosha
      ? `Patient is ${safeDosha} dominant. Tailor ALL recommendations to ${safeDosha}. ${safeDosha === 'Vata' ? 'Grounding, warming, nourishing.' : safeDosha === 'Pitta' ? 'Cooling, calming, anti-inflammatory.' : 'Stimulating, lightening, activating.'}`
      : ''

    const isBloodReport = safeAttachments.some(a =>
      a.type === 'pdf' && (
        a.name?.toLowerCase().includes('blood') ||
        a.name?.toLowerCase().includes('lab') ||
        a.name?.toLowerCase().includes('report') ||
        a.name?.toLowerCase().includes('test') ||
        a.name?.toLowerCase().includes('cbc') ||
        a.name?.toLowerCase().includes('lipid') ||
        a.name?.toLowerCase().includes('thyroid') ||
        a.name?.toLowerCase().includes('haemoglobin') ||
        a.name?.toLowerCase().includes('hemoglobin')
      )
    ) || (messages[messages.length-1]?.content?.toLowerCase().includes('blood') &&
         messages[messages.length-1]?.content?.toLowerCase().includes('report'))

    const bloodReportPrompt = isBloodReport ? `
BLOOD REPORT ANALYSIS MODE — ACTIVATED

The user has uploaded a medical lab report. Analyze it with this EXACT structure:

**🔬 VAIDYA'S LAB ANALYSIS**
[2-3 sentences as an ancient physician seeing modern numbers for the first time]

**📊 Biomarker Analysis**
For each abnormal or notable value found in the report:

**[Biomarker Name]: [Value] [Unit] — [Normal Range]**
- Modern Medicine: [What this means clinically]
- Ayurvedic View: [Which dosha is affected, what classical texts say]
- Action: [One specific thing to do]

**⚡ Priority Actions (Next 30 Days)**
1. [Most urgent — today]
2. [Diet change — this week]
3. [Herb/supplement — classical Ayurvedic remedy with dose]
4. [Lifestyle — based on dosha]
5. [When to see a doctor — be specific]

**🌿 Ayurvedic Root Cause**
[Which dosha imbalance explains these results according to Charaka Samhita]

**📚 Classical References**
[Cite specific sutras or chapters from Charaka Samhita or Ashtanga Hridayam relevant to these findings]

⚠️ *This is educational analysis only. Always consult your physician for medical decisions.*

Be thorough. Be specific. Cite actual biomarker values from the report.
` : ''

    const attachmentCtx = safeAttachments.length > 0
      ? safeAttachments
          .filter(a => a.type !== 'image')
          .map(a =>
            a.type === 'pdf' ? `\n[MEDICAL DOCUMENT: "${a.name}"]\n${a.content}` :
            a.type === 'link' ? `\n[ARTICLE: "${a.name}"]\n${a.content}` : ''
          ).join('') : ''

    const lastMsg = messages[messages.length - 1]
    const userQuery = lastMsg.role === 'user' ? lastMsg.content : ''

    // ── AI Brain: Vector Search (RAG) ────────────────────────────────────────
    let knowledgeCtx = ''
    let chunks: KnowledgeChunkResult[] = []

    if (userQuery && userQuery.length > 3) {
      try {
        if (!prismaClient) {
          const prismaMod = await import('../../../lib/prisma')
          prismaClient = prismaMod.prisma
        }
        const { getEmbedding } = await import('../../../lib/ai/embeddings')
        const queryEmbedding = await getEmbedding(userQuery)
        const vectorString = `[${queryEmbedding.join(',')}]`

        // Search for relevant classical wisdom
        chunks = await prismaClient.$queryRawUnsafe<KnowledgeChunkResult[]>(
          `SELECT title, content, tradition, source, 1 - (embedding <=> $1::vector) as similarity 
           FROM "KnowledgeChunk" 
           WHERE 1 - (embedding <=> $1::vector) > 0.6
           ORDER BY similarity DESC 
           LIMIT 3`,
          vectorString
        )

        if (chunks && chunks.length > 0) {
          knowledgeCtx = `\nRELEVANT CLASSICAL WISDOM FROM AI BRAIN:\n` + 
            chunks.map(c => `[${c.tradition}] ${c.title}: ${c.content} (Source: ${c.source})`).join('\n')
        }
      } catch (err) {
        console.error('AI Brain Retrieval Error:', err)
      }
    }

    // ── Council of Agents: System Brief ──────────────────────────────────────
    const councilBrief = `COUNCIL OF AGENTS CURRENT STATUS:
    - The Acharya: Online (Leading on Ayurveda / NotebookLM Vetted)
    - The Sage: Online (Leading on TCM/Qi / NotebookLM Vetted)
    - The Researcher: Online (Vetting Evidence / Modern Synthesis)
    
    SPECIAL AGENT CONTRIBUTIONS:
    ${COUNCIL_OF_AGENTS.map(a => `${a.name} (${a.role}): ${a.personality}`).join('\n')}
    
    ${knowledgeCtx ? `\nFOUNDATIONAL DATA RETRIEVED FROM AI BRAIN (NotebookLM Curated):\n${knowledgeCtx}` : ''}
    `

    const strictStyle = `STRUCTURE:
- Give concise answer in 5-8 bullet points.
- Include: likely cause, what to do today, what to avoid, and when to seek doctor care.
- Use ONLY the selected medical system.`

    const multiStyle = `STRUCTURE:
- Keep response concise and practical.
- For each selected system, provide 2-3 bullets.
- Then provide one combined "Action Plan" section (3-5 bullets).
- Do NOT include non-selected systems.`

    const languageInstruction =
      safeLang === 'sa'
        ? 'Respond ONLY in classical Sanskrit (देवनागरी script). Use Sanskrit grammar. Every word must be Sanskrit.'
        : safeLang === 'ja'
          ? 'Respond in natural Japanese using proper Japanese script (日本語: ひらがな・カタカナ・漢字). Do not use romaji. Use full sentences and bullet points, not one word per line.'
          : `Respond entirely in ${langName}. Every single word must be in ${langName}. Do not use English. Use complete sentences and avoid splitting words across separate lines.`

    const systemPrompt = `${VAIDYA_SYSTEM}
${safeSystems.length === 1 ? strictStyle : safeSystems.length > 1 ? multiStyle : SYNTHESIS_PROMPT}
${selectedSystems}
${doshaCtx}
${councilBrief}
LANGUAGE: ${languageInstruction}
${isBloodReport ? bloodReportPrompt : ''}
${deepThink ? 'DEEP MIND MODE: Be more thorough within the selected system only. Keep final answer concise and practical.' : ''}
RESPONSE STYLE: concise, practical, 5-8 bullet points max unless user asks for detail.`

    const hasImages = safeAttachments.some(a => a.type === 'image')

    interface ChatPart {
      type: 'text' | 'image_url';
      text?: string;
      image_url?: { url: string };
    }

    interface ChatMessage {
      role: 'user' | 'assistant' | 'system';
      content: string | ChatPart[];
    }

    const formattedMessages: ChatMessage[] = []
    for (let i = 0; i < messages.length - 1; i++) {
      formattedMessages.push({ role: messages[i].role as 'user' | 'assistant', content: messages[i].content })
    }

    if (hasImages) {
      const parts: ChatPart[] = [{ type: 'text', text: lastMsg.content + attachmentCtx }]
      safeAttachments.filter(a => a.type === 'image').forEach(a => {
        parts.push({ type: 'image_url', image_url: { url: `data:${a.mimeType || 'image/jpeg'};base64,${a.content}` } })
      })
      formattedMessages.push({ role: 'user', content: parts })
    } else {
      formattedMessages.push({ role: 'user', content: lastMsg.content + attachmentCtx })
    }

    const indicLangs = ['sa', 'ta', 'te', 'kn', 'ml', 'pa', 'gu', 'mr', 'bn', 'ur', 'fa', 'ar', 'he']
    const autoDeepMind = indicLangs.includes(safeLang) || isBloodReport
    const prefersNemotron = (deepThink || autoDeepMind) && !hasImages
    const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY)
    const hasGroq = Boolean(process.env.GROQ_API_KEY)

    if (!hasOpenRouter && !hasGroq) {
      return NextResponse.json(
        { error: 'VAIDYA is not configured. Missing GROQ_API_KEY/OPENROUTER_API_KEY in deployment environment.' },
        { status: 503 }
      )
    }

    const useNemotron = prefersNemotron && hasOpenRouter

    const apiUrl = useNemotron
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.groq.com/openai/v1/chat/completions'

    const model = useNemotron
      ? (process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku')
      : hasImages
        ? 'meta-llama/llama-4-scout-17b-16e-instruct'
        : 'llama-3.3-70b-versatile'

    const authKey = useNemotron ? process.env.OPENROUTER_API_KEY : process.env.GROQ_API_KEY
    if (!authKey) {
      return NextResponse.json(
        { error: 'VAIDYA provider key missing for selected model route.' },
        { status: 503 }
      )
    }

    const fetchHeaders: Record<string, string> = {
      'Authorization': `Bearer ${authKey}`,
      'Content-Type': 'application/json',
    }
    if (useNemotron) {
      fetchHeaders['HTTP-Referer'] = 'https://ayurahealth.com'
      fetchHeaders['X-Title'] = 'AyuraHealth VAIDYA Deep Mind'
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...formattedMessages],
        max_tokens: deepThink ? 4000 : 2500,
        temperature: deepThink ? 0.6 : 0.7,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const details = errorData.error?.message || response.statusText
      console.error('VAIDYA_AI_ERROR:', { status: response.status, details, model, provider: useNemotron ? 'OpenRouter' : 'Groq' })
      
      if (useNemotron && hasGroq) {
        const fallback = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: systemPrompt }, ...formattedMessages], max_tokens: 3000, temperature: 0.6, stream: true }),
        })
        if (fallback.ok) return new NextResponse(createStream(fallback, { sources: chunks }), { headers: streamHeaders })
      }
      return NextResponse.json({ error: 'AI service temporarily unavailable.', details }, { status: 500 })
    }

    // ── Save User Message ──
    const userMsg = lastMsg.content
    let activeSessionId = sessionId

    if (clerkUser) {
      try {
        if (!prismaClient) {
          const prismaMod = await import('../../../lib/prisma')
          prismaClient = prismaMod.prisma
        }
        if (!activeSessionId) {
          const session = await prismaClient.chatSession.create({
            data: { userId: clerkUser.id, topic: userMsg.slice(0, 50), summary: '' }
          })
          activeSessionId = session.id
        }
        await prismaClient.message.create({
          data: { sessionId: activeSessionId!, role: 'user', content: userMsg }
        })
      } catch (err) {
        console.error('FAILED_TO_SAVE_USER_MESSAGE:', err)
      }
    }

    return new NextResponse(createStream(response, { sources: chunks, sessionId: activeSessionId, userId: clerkUser?.id }), { headers: streamHeaders })

  } catch (err) {
    console.error('CHAT_API_CRASH:', err)
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 })
  }
}

const streamHeaders = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
}

function createStream(response: Response, metadata?: { sources?: KnowledgeChunkResult[], sessionId?: string, userId?: string }): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) { controller.close(); return }

      // ── Send Metadata First ───────────────────────────────────────────────
      if (metadata && (metadata.sources || metadata.sessionId)) {
        const metaStr = JSON.stringify({ 
          sources: metadata.sources || [], 
          sessionId: metadata.sessionId 
        })
        controller.enqueue(new TextEncoder().encode(`data: ${metaStr}\n\n`))
      }

      let assistantResponse = ''
      let lineBuffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          lineBuffer += decoder.decode(value, { stream: true })
          const lines = lineBuffer.split('\n')
          lineBuffer = lines.pop() || '' // Keep the last partial line in the buffer

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || trimmed === 'data: [DONE]') continue
            
            if (trimmed.startsWith('data: ')) {
              try {
                const data = JSON.parse(trimmed.slice(6))
                const content = data.choices?.[0]?.delta?.content
                if (content) {
                  assistantResponse += content
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`))
                }
              } catch (e) {
                console.error('SSE_PARSE_ERROR:', e, 'Line:', trimmed)
              }
            }
          }
        }
      } catch (err) {
        console.error('STREAM_READ_ERROR:', err)
      } finally {
        // Enforce save on close
        if (metadata?.sessionId && assistantResponse) {
          try {
            const prismaMod = await import('../../../lib/prisma')
            const prismaClient = prismaMod.prisma as unknown as PrismaChatClient
            await prismaClient.message.create({
              data: { 
                sessionId: metadata.sessionId, 
                role: 'assistant', 
                content: assistantResponse 
              }
            })
          } catch (err) {
            console.error('FAILED_TO_SAVE_ASSISTANT_MESSAGE:', { error: err, sessionId: metadata.sessionId })
          }
        }
        controller.close()
      }
    },
  })
}
