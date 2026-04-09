import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
export const runtime = 'nodejs'

import { checkRateLimit } from '../../../lib/rateLimit'
import { COUNCIL_OF_AGENTS, SYNTHESIS_PROMPT } from '../../../lib/ai/agents'
import { AYURAHEALTH_MYTHOS } from '../../../lib/ai/mythos'
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
  modelPreference: z.enum(['auto', 'claude', 'gpt', 'gemini', 'deepseek', 'mistral', 'llama', 'groq']).optional(),
  webSearch: z.boolean().optional(),
  sessionId: z.string().uuid().optional(),
  vedicContext: z.string().max(20000).optional(),
})

interface KnowledgeChunkResult {
  title: string;
  content: string;
  tradition: string;
  source: string;
  similarity: number;
}

interface WebSearchResult {
  title: string
  source: string
  content: string
}

interface AgentTraceItem {
  id: 'planner' | 'researcher' | 'synthesizer'
  label: string
  summary: string
}

interface ChatSessionRecord {
  id: string
}

interface MessageCreateInput {
  sessionId: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatPart {
  type: 'text' | 'image_url'
  text?: string
  image_url?: { url: string }
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string | ChatPart[]
}

interface ResponseQuality {
  formatScore: number
  completeness: number
  latencyMs: number
  repaired: boolean
}

interface PromptProfile {
  name: 'balanced' | 'strict' | 'recovery'
  instruction: string
  temperatureAdjust: number
}

interface AutoRecoveryPolicy {
  applied: boolean
  reasons: string[]
  webSearchSuppressed: boolean
  forceDeepThink: boolean
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

    const {
      messages,
      systems,
      dosha,
      lang,
      attachments,
      deepThink,
      modelPreference,
      webSearch,
      sessionId,
      vedicContext,
    } = validation.data
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

    const preferredModel = modelPreference || 'auto'
    const promptProfile = buildPromptProfile(messages)
    const autoRecoveryPolicy = buildAutoRecoveryPolicy({
      promptProfile,
      requestedDeepThink: Boolean(deepThink),
      requestedWebSearch: Boolean(webSearch),
    })
    const effectiveDeepThink = autoRecoveryPolicy.forceDeepThink ? true : Boolean(deepThink)
    const effectiveWebSearch = autoRecoveryPolicy.webSearchSuppressed ? false : Boolean(webSearch)

    // ── AI Brain: Vector Search (RAG) ────────────────────────────────────────
    let knowledgeCtx = ''
    let chunks: KnowledgeChunkResult[] = []
    let webChunks: KnowledgeChunkResult[] = []

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

    if (effectiveWebSearch && userQuery && userQuery.length > 3) {
      try {
        const webResults = await fetchWebSearchResults(userQuery)
        if (webResults.length > 0) {
          webChunks = webResults.map((r) => ({
            title: r.title,
            content: r.content,
            tradition: 'Web',
            source: r.source,
            similarity: 1,
          }))
          knowledgeCtx += `\nWEB SEARCH (RECENT SOURCES):\n` +
            webResults.map((r) => `[Web] ${r.title}: ${r.content} (${r.source})`).join('\n')
        }
      } catch (err) {
        console.error('WEB_SEARCH_ERROR:', err)
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

    const vedicSection = vedicContext ? `

${vedicContext}

As VAIDYA, integrate the above Vedic Intelligence into your response. Reference the user's current Mahadasha, their elemental imbalances, and today's Vedic guidance when making recommendations. This is what sets AyuraHealth apart from every other health AI — the depth of personalisation through Jyotish, Vedic Science, and Vedic Mathematics.
` : ''

    const responseTemplate = `OUTPUT CONTRACT (ALWAYS FOLLOW):
- Keep responses concise and practical.
- Use this exact section order with markdown headings:
### Answer
[2-5 short paragraphs or bullets with direct recommendation]
### Key Points
- [3-6 actionable bullets]
### Sources
- [Only if sources are available; otherwise write: "- No external sources used."]
### Follow-ups
- [2-4 smart next questions the user can ask]
- Never invent clinical certainty. If unsure, state uncertainty briefly and provide safe next step.`

    const systemPrompt = `${VAIDYA_SYSTEM}
${AYURAHEALTH_MYTHOS}
${safeSystems.length === 1 ? strictStyle : safeSystems.length > 1 ? multiStyle : SYNTHESIS_PROMPT}
${selectedSystems}
${doshaCtx}
${councilBrief}
LANGUAGE: ${languageInstruction}
${isBloodReport ? bloodReportPrompt : ''}
${effectiveDeepThink ? 'DEEP MIND MODE: Be more thorough within the selected system only. Keep final answer concise and practical.' : ''}
RESPONSE STYLE: concise, practical, 5-8 bullet points max unless user asks for detail.
PROMPT PROFILE: ${promptProfile.name.toUpperCase()}
${promptProfile.instruction}
${autoRecoveryPolicy.applied ? `AUTO RECOVERY POLICY ACTIVE: ${autoRecoveryPolicy.reasons.join(' | ')}` : ''}
${responseTemplate}${vedicSection}`

    const hasImages = safeAttachments.some(a => a.type === 'image')

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

    const openRouterModelMap = {
      claude: process.env.OPENROUTER_MODEL_CLAUDE || 'anthropic/claude-3.5-sonnet',
      gpt: process.env.OPENROUTER_MODEL_GPT || 'openai/gpt-4o-mini',
      gemini: process.env.OPENROUTER_MODEL_GEMINI || 'google/gemini-2.0-flash-001',
      deepseek: process.env.OPENROUTER_MODEL_DEEPSEEK || 'deepseek/deepseek-chat-v3-0324',
      mistral: process.env.OPENROUTER_MODEL_MISTRAL || 'mistralai/mistral-small-3.2-24b-instruct',
      llama: process.env.OPENROUTER_MODEL_LLAMA || 'meta-llama/llama-3.3-70b-instruct',
      auto: process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku',
    } as const

    const shouldUseOpenRouter = hasOpenRouter && (
      (preferredModel !== 'auto' && preferredModel !== 'groq') || prefersNemotron
    )
    const useOpenRouter = shouldUseOpenRouter

    const apiUrl = useOpenRouter
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.groq.com/openai/v1/chat/completions'

    const model = useOpenRouter
      ? openRouterModelMap[preferredModel === 'groq' ? 'auto' : preferredModel]
      : hasImages
        ? 'meta-llama/llama-4-scout-17b-16e-instruct'
        : 'llama-3.3-70b-versatile'

    const authKey = useOpenRouter ? process.env.OPENROUTER_API_KEY : process.env.GROQ_API_KEY
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
    if (useOpenRouter) {
      fetchHeaders['HTTP-Referer'] = 'https://ayurahealth.com'
      fetchHeaders['X-Title'] = 'AyuraHealth VAIDYA Multi-Model'
    }

    const agentTrace: AgentTraceItem[] = []
    const orchestrateAgents = Boolean(effectiveDeepThink || effectiveWebSearch)
    if (orchestrateAgents && typeof userQuery === 'string' && userQuery.trim().length > 0) {
      try {
        const planner = await runAgentStep({
          apiUrl,
          headers: fetchHeaders,
          model,
          roleInstruction: 'You are Planner Agent. Build a short plan for answering this user health query safely. Return max 4 bullets.',
          userInput: userQuery,
        })
        if (planner) {
          agentTrace.push({ id: 'planner', label: 'Planner', summary: planner.slice(0, 320) })
        }

        const researcher = await runAgentStep({
          apiUrl,
          headers: fetchHeaders,
          model,
          roleInstruction: `You are Research Agent. Use this context and return concise evidence bullets:\n${knowledgeCtx || 'No extra context found.'}`,
          userInput: userQuery,
        })
        if (researcher) {
          agentTrace.push({ id: 'researcher', label: 'Researcher', summary: researcher.slice(0, 420) })
        }
      } catch (err) {
        console.error('AGENT_ORCHESTRATION_ERROR:', err)
      }
    }

    const synthesizedAgentContext = agentTrace.length > 0
      ? `\nAGENT TRACE BRIEF:\n${agentTrace.map((a) => `- ${a.label}: ${a.summary}`).join('\n')}\n`
      : ''
    if (orchestrateAgents) {
      agentTrace.push({
        id: 'synthesizer',
        label: 'Synthesizer',
        summary: 'Combining planner and research outputs into one concise clinical response.',
      })
    }

    const completionMessages: ChatMessage[] = [
      { role: 'system', content: `${systemPrompt}${synthesizedAgentContext}` },
      ...formattedMessages,
    ]
    const maxTokens = effectiveDeepThink ? 4000 : 2500
    const temperature = Math.max(0.2, Math.min(0.8, (effectiveDeepThink ? 0.6 : 0.7) + promptProfile.temperatureAdjust + (autoRecoveryPolicy.applied ? -0.05 : 0)))
    const requestStartedAt = Date.now()
    let completionText = await fetchCompletionText({
      apiUrl,
      headers: fetchHeaders,
      model,
      messages: completionMessages,
      maxTokens,
      temperature,
    })

    if (!completionText && useOpenRouter && hasGroq) {
      completionText = await fetchCompletionText({
        apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
        headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: `${systemPrompt}${synthesizedAgentContext}` }, ...formattedMessages],
        maxTokens: 3000,
        temperature: 0.6,
      })
      if (completionText) {
        const fallbackQuality = scoreResponseQuality(completionText, false, Date.now() - requestStartedAt)
        return new NextResponse(createTextStream(completionText, {
          sources: [...chunks, ...webChunks],
          agentTrace,
          modelUsed: 'llama-3.3-70b-versatile',
          providerUsed: 'Groq',
          quality: fallbackQuality,
          policy: autoRecoveryPolicy,
        }), { headers: streamHeaders })
      }
      return NextResponse.json({ error: 'AI service temporarily unavailable.', details: 'Primary and fallback providers failed.' }, { status: 500 })
    }

    if (!completionText) {
      return NextResponse.json({ error: 'AI service temporarily unavailable.', details: 'No completion returned.' }, { status: 500 })
    }

    let wasRepaired = false
    if (!hasStructuredSections(completionText)) {
      const retryMessages: ChatMessage[] = [
        ...completionMessages,
        {
          role: 'system',
          content: 'FORMAT REPAIR: Re-write the previous answer using exactly these markdown headings: ### Answer, ### Key Points, ### Sources, ### Follow-ups. Keep same meaning, concise, no extra headings.',
        },
      ]
      const repairedText = await fetchCompletionText({
        apiUrl,
        headers: fetchHeaders,
        model,
        messages: retryMessages,
        maxTokens,
        temperature: 0.3,
      })
      if (repairedText) {
        completionText = repairedText
        wasRepaired = true
      }
    }
    const quality = scoreResponseQuality(completionText, wasRepaired, Date.now() - requestStartedAt)

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

    return new NextResponse(createTextStream(completionText, {
      sources: [...chunks, ...webChunks],
      sessionId: activeSessionId,
      userId: clerkUser?.id,
      agentTrace,
      modelUsed: model,
      providerUsed: useOpenRouter ? 'OpenRouter' : 'Groq',
      quality,
      policy: autoRecoveryPolicy,
    }), { headers: streamHeaders })

  } catch (err) {
    console.error('CHAT_API_CRASH:', err)
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 })
  }
}

async function fetchWebSearchResults(query: string): Promise<WebSearchResult[]> {
  const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; AyuraHealthBot/1.0; +https://ayurahealth.com)',
    },
  })
  if (!response.ok) return []
  const html = await response.text()

  const anchorRegex = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g
  const results: WebSearchResult[] = []
  let match: RegExpExecArray | null

  while ((match = anchorRegex.exec(html)) !== null && results.length < 5) {
    const source = decodeHtml(match[1] || '').trim()
    const title = stripTags(decodeHtml(match[2] || '')).trim()
    if (!source || !title) continue
    results.push({
      title,
      source,
      content: `Recent reference related to "${query}".`,
    })
  }

  return results
}

async function runAgentStep(args: {
  apiUrl: string
  headers: Record<string, string>
  model: string
  roleInstruction: string
  userInput: string
}): Promise<string> {
  const response = await fetch(args.apiUrl, {
    method: 'POST',
    headers: args.headers,
    body: JSON.stringify({
      model: args.model,
      stream: false,
      temperature: 0.2,
      max_tokens: 350,
      messages: [
        { role: 'system', content: args.roleInstruction },
        { role: 'user', content: args.userInput },
      ],
    }),
  })
  if (!response.ok) return ''
  const json = await response.json().catch(() => null) as { choices?: Array<{ message?: { content?: string } }> } | null
  return json?.choices?.[0]?.message?.content?.trim() || ''
}

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, '')
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

const streamHeaders = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
}

function createTextStream(text: string, metadata?: {
  sources?: KnowledgeChunkResult[]
  sessionId?: string
  userId?: string
  agentTrace?: AgentTraceItem[]
  modelUsed?: string
  providerUsed?: 'OpenRouter' | 'Groq'
  quality?: ResponseQuality
  policy?: AutoRecoveryPolicy
}): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      // ── Send Metadata First ───────────────────────────────────────────────
      if (metadata && (metadata.sources || metadata.sessionId || metadata.agentTrace || metadata.modelUsed || metadata.providerUsed || metadata.quality || metadata.policy)) {
        const metaStr = JSON.stringify({ 
          sources: metadata.sources || [], 
          sessionId: metadata.sessionId,
          agentTrace: metadata.agentTrace || [],
          modelUsed: metadata.modelUsed || '',
          providerUsed: metadata.providerUsed || '',
          quality: metadata.quality || null,
          policy: metadata.policy || null,
        })
        controller.enqueue(new TextEncoder().encode(`data: ${metaStr}\n\n`))
      }

      try {
        const chunkSize = 120
        for (let i = 0; i < text.length; i += chunkSize) {
          const content = text.slice(i, i + chunkSize)
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`))
        }
      } catch (err) {
        console.error('TEXT_STREAM_ERROR:', err)
      } finally {
        // Enforce save on close
        if (metadata?.sessionId && text) {
          try {
            const prismaMod = await import('../../../lib/prisma')
            const prismaClient = prismaMod.prisma as unknown as PrismaChatClient
            await prismaClient.message.create({
              data: { 
                sessionId: metadata.sessionId, 
                role: 'assistant', 
                content: text 
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

function hasStructuredSections(text: string): boolean {
  const normalized = text.toLowerCase()
  return normalized.includes('### answer')
    && normalized.includes('### key points')
    && normalized.includes('### sources')
    && normalized.includes('### follow-ups')
}

function scoreResponseQuality(text: string, repaired: boolean, latencyMs: number): ResponseQuality {
  const normalized = text.toLowerCase()
  const checks = [
    normalized.includes('### answer'),
    normalized.includes('### key points'),
    normalized.includes('### sources'),
    normalized.includes('### follow-ups'),
  ]
  const hitCount = checks.filter(Boolean).length
  const completeness = Math.round((hitCount / checks.length) * 100)
  const formatScore = Math.round((completeness * 0.75) + (repaired ? 15 : 25))
  return {
    formatScore: Math.min(100, formatScore),
    completeness,
    latencyMs: Math.max(0, Math.round(latencyMs)),
    repaired,
  }
}

function buildPromptProfile(messages: Array<{ role: 'user' | 'assistant'; content: string }>): PromptProfile {
  const recentAssistantMessages = messages
    .filter((m) => m.role === 'assistant')
    .slice(-4)

  if (recentAssistantMessages.length === 0) {
    return {
      name: 'balanced',
      instruction: 'Keep tone warm and concise. Follow the output contract exactly.',
      temperatureAdjust: 0,
    }
  }

  const structuredCount = recentAssistantMessages.filter((m) => hasStructuredSections(m.content)).length
  const compliance = structuredCount / recentAssistantMessages.length

  if (compliance < 0.4) {
    return {
      name: 'recovery',
      instruction: 'High priority: recover strict markdown structure. Never skip any required section headings.',
      temperatureAdjust: -0.2,
    }
  }

  if (compliance < 0.75) {
    return {
      name: 'strict',
      instruction: 'Prioritize section correctness and concise bullets over stylistic variety.',
      temperatureAdjust: -0.1,
    }
  }

  return {
    name: 'balanced',
    instruction: 'Keep quality high while preserving natural tone and concise actionability.',
    temperatureAdjust: 0,
  }
}

function buildAutoRecoveryPolicy(args: {
  promptProfile: PromptProfile
  requestedDeepThink: boolean
  requestedWebSearch: boolean
}): AutoRecoveryPolicy {
  const reasons: string[] = []
  let webSearchSuppressed = false
  let forceDeepThink = false

  if (args.promptProfile.name === 'recovery') {
    forceDeepThink = true
    reasons.push('Quality recovery mode forced deeper reasoning.')
    if (args.requestedWebSearch) {
      webSearchSuppressed = true
      reasons.push('Web search suppressed temporarily to improve formatting stability.')
    }
  } else if (args.promptProfile.name === 'strict' && args.requestedWebSearch) {
    webSearchSuppressed = true
    reasons.push('Strict mode temporarily reduced web noise for cleaner output contract.')
  }

  return {
    applied: reasons.length > 0,
    reasons,
    webSearchSuppressed,
    forceDeepThink: forceDeepThink || args.requestedDeepThink,
  }
}

async function fetchCompletionText(args: {
  apiUrl: string
  headers: Record<string, string>
  model: string
  messages: ChatMessage[]
  maxTokens: number
  temperature: number
}): Promise<string> {
  const response = await fetch(args.apiUrl, {
    method: 'POST',
    headers: args.headers,
    body: JSON.stringify({
      model: args.model,
      messages: args.messages,
      max_tokens: args.maxTokens,
      temperature: args.temperature,
      stream: false,
    }),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const details = errorData.error?.message || response.statusText
    console.error('VAIDYA_AI_ERROR:', { status: response.status, details, model: args.model })
    return ''
  }
  const json = await response.json().catch(() => null) as { choices?: Array<{ message?: { content?: string } }> } | null
  return json?.choices?.[0]?.message?.content?.trim() || ''
}
