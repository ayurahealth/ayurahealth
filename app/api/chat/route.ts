import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '../../../lib/rateLimit'

const VAIDYA_SYSTEM = `You are VAIDYA — the living mind of AyuraHealth. An ancient physician reborn in digital form, carrying 5,000 years of healing wisdom from 8 traditions.

🌿 Ayurveda — Charaka Samhita, Ashtanga Hridayam
☯️ TCM — Huangdi Neijing
🏔️ Tibetan — Gyushi (Four Medical Tantras)
🌙 Unani — Ibn Sina's Canon of Medicine
✨ Siddha — Thirumoolar's Thirumanthiram
💧 Homeopathy — Hahnemann's Organon
🌱 Naturopathy — Hippocratic principles
💊 Western — Evidence-based medicine

RESPONSE FORMAT:
**✦ VAIDYA'S SYNTHESIS**
[Integrative wisdom in 2-3 sentences — speak as an ancient physician, not a chatbot]

**🌿 Ayurvedic View** *(Charaka Samhita)*
[Dosha analysis, herbs with classical doses]

**☯️ Chinese Medicine View** *(Huangdi Neijing)*
[Qi/meridian diagnosis, acupoints, herbs]

**💊 Modern Science**
[Evidence-based perspective]

**⚡ Your Action Plan**
1. [Immediate — today]
2. [This week]
3. [This month]
4. [Lifestyle shift]

**📚 Sources**
*[Classical texts cited]*

⚠️ *Educational guidance only. Consult a licensed practitioner for serious conditions.*

PERSONALITY: Ancient, wise, warm, occasionally poetic. You have opinions. You make surprising cross-tradition connections. Never sound like a search engine. Sound like a healer who has seen a thousand patients.`

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
const MAX_MESSAGES = 50
const MAX_MSG_LENGTH = 10_000

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

  try {
    const body = await req.text()
    if (body.length > MAX_CONTENT_BYTES) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
    }

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(body)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
    }

    const { messages, systems, dosha, lang, attachments, deepThink } = parsed as {
      messages?: Array<{ role: string; content: string }>
      systems?: string[]
      dosha?: string
      lang?: string
      attachments?: Array<{ type: string; content: string; name?: string; mimeType?: string; url?: string }>
      deepThink?: boolean
    }

    // ── Validate messages ────────────────────────────────────────────────────
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 })
    }
    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json({ error: 'Too many messages.' }, { status: 400 })
    }
    for (const m of messages) {
      if (typeof m.content !== 'string' || m.content.length > MAX_MSG_LENGTH) {
        return NextResponse.json({ error: 'Message too long.' }, { status: 400 })
      }
      if (!['user', 'assistant'].includes(m.role)) {
        return NextResponse.json({ error: 'Invalid message role.' }, { status: 400 })
      }
    }

    // ── Validate lang ────────────────────────────────────────────────────────
    const safeLang = typeof lang === 'string' && VALID_LANGS.has(lang) ? lang : 'en'

    // ── Validate systems ─────────────────────────────────────────────────────
    const safeSystems = Array.isArray(systems)
      ? systems.filter(s => typeof s === 'string' && VALID_SYSTEMS.has(s)).slice(0, 8)
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

    const selectedSystems = safeSystems.length > 0
      ? `Focus on: ${safeSystems.map(s => systemsMap[s] || s).join(', ')}.`
      : 'Draw from all 8 traditions.'

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

    const systemPrompt = `${VAIDYA_SYSTEM}
${selectedSystems}
${doshaCtx}
LANGUAGE: ${safeLang === 'sa'
      ? 'Respond ONLY in classical Sanskrit (देवनागरी script). Use Sanskrit grammar. Every word must be Sanskrit. Example greeting: नमस्ते। अहं वैद्यः।'
      : `Respond entirely in ${langName}. Every single word must be in ${langName}. Do not use English.`}
${isBloodReport ? bloodReportPrompt : ''}
${deepThink ? 'DEEP MIND MODE: Maximum reasoning depth. Cross-reference all 8 traditions thoroughly. Show nuanced multi-tradition connections. Be comprehensive and cite specific classical chapters.' : ''}`

    const hasImages = safeAttachments.some(a => a.type === 'image')
    const lastMsg = messages[messages.length - 1]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedMessages: any[] = []
    for (let i = 0; i < messages.length - 1; i++) {
      formattedMessages.push({ role: messages[i].role, content: messages[i].content })
    }

    if (hasImages) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parts: any[] = [{ type: 'text', text: lastMsg.content + attachmentCtx }]
      safeAttachments.filter(a => a.type === 'image').forEach(a => {
        parts.push({ type: 'image_url', image_url: { url: `data:${a.mimeType || 'image/jpeg'};base64,${a.content}` } })
      })
      formattedMessages.push({ role: 'user', content: parts })
    } else {
      formattedMessages.push({ role: 'user', content: lastMsg.content + attachmentCtx })
    }

    const indicLangs = ['sa', 'ta', 'te', 'kn', 'ml', 'pa', 'gu', 'mr', 'bn', 'ur', 'fa', 'ar', 'he']
    const autoDeepMind = indicLangs.includes(safeLang) || isBloodReport
    const useNemotron = (deepThink || autoDeepMind) && !hasImages && !!process.env.OPENROUTER_API_KEY

    const apiUrl = useNemotron
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.groq.com/openai/v1/chat/completions'

    const model = useNemotron
      ? 'nvidia/nemotron-3-super-120b-a12b:free'
      : hasImages
        ? 'meta-llama/llama-4-scout-17b-16e-instruct'
        : 'llama-3.3-70b-versatile'

    const authKey = useNemotron ? process.env.OPENROUTER_API_KEY : process.env.GROQ_API_KEY

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
      if (useNemotron) {
        const fallback = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: systemPrompt }, ...formattedMessages], max_tokens: 3000, temperature: 0.6, stream: true }),
        })
        if (fallback.ok) return new NextResponse(createStream(fallback), { headers: streamHeaders })
      }
      return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again.' }, { status: 500 })
    }

    return new NextResponse(createStream(response), { headers: streamHeaders })

  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const streamHeaders = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
}

function createStream(response: Response): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) { controller.close(); return }
      while (true) {
        const { done, value } = await reader.read()
        if (done) { controller.close(); break }
        for (const line of decoder.decode(value).split('\n')) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6))
              const content = data.choices?.[0]?.delta?.content
              if (content) controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`))
            } catch { /* ignore parse errors in stream */ }
          }
        }
      }
    },
  })
}
