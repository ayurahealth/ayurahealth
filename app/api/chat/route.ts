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

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous'
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
  }

  try {
    const { messages, systems, incognito, dosha, lang, attachments, deepThink } = await req.json()

    const langMap: Record<string, string> = {
      en: 'Respond in English.',
      ja: '日本語で回答してください。',
      hi: 'हिंदी में उत्तर दें।',
    }

    const systemsMap: Record<string, string> = {
      ayurveda: 'Ayurveda', tcm: 'TCM', western: 'Western Medicine',
      homeopathy: 'Homeopathy', naturopathy: 'Naturopathy',
      unani: 'Unani', siddha: 'Siddha', tibetan: 'Tibetan Medicine',
    }

    const selectedSystems = systems?.length > 0
      ? `Focus on: ${systems.map((s: string) => systemsMap[s] || s).join(', ')}.`
      : 'Draw from all 8 traditions.'

    const doshaCtx = dosha
      ? `Patient is ${dosha} dominant. Tailor ALL recommendations to ${dosha}. ${dosha === 'Vata' ? 'Grounding, warming, nourishing.' : dosha === 'Pitta' ? 'Cooling, calming, anti-inflammatory.' : 'Stimulating, lightening, activating.'}`
      : ''

    const attachmentCtx = attachments?.length > 0
      ? attachments.filter((a: {type: string}) => a.type !== 'image')
          .map((a: {type: string; content: string; name: string; url?: string}) =>
            a.type === 'pdf' ? `\n[MEDICAL DOCUMENT: "${a.name}"]\n${a.content}` :
            a.type === 'link' ? `\n[ARTICLE: "${a.name}"]\n${a.content}` : ''
          ).join('') : ''

    const systemPrompt = `${VAIDYA_SYSTEM}
${selectedSystems}
${doshaCtx}
LANGUAGE: Respond entirely and only in ${langName}. Every word of your response must be in ${langName}.
${deepThink ? 'DEEP MIND MODE: Maximum reasoning depth. Cross-reference all 8 traditions thoroughly. Show nuanced multi-tradition connections. Be comprehensive and cite specific classical chapters.' : ''}`

    const hasImages = attachments?.some((a: {type: string}) => a.type === 'image')
    const lastMsg = messages[messages.length - 1]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedMessages: any[] = []
    for (let i = 0; i < messages.length - 1; i++) {
      formattedMessages.push({ role: messages[i].role, content: messages[i].content })
    }

    if (hasImages) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parts: any[] = [{ type: 'text', text: lastMsg.content + attachmentCtx }]
      attachments.filter((a: {type: string}) => a.type === 'image').forEach((a: {mimeType?: string; content: string}) => {
        parts.push({ type: 'image_url', image_url: { url: `data:${a.mimeType || 'image/jpeg'};base64,${a.content}` } })
      })
      formattedMessages.push({ role: 'user', content: parts })
    } else {
      formattedMessages.push({ role: 'user', content: lastMsg.content + attachmentCtx })
    }

    const useNemotron = deepThink && !hasImages && !!process.env.OPENROUTER_API_KEY

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
      fetchHeaders['HTTP-Referer'] = 'https://ayurahealth.vercel.app'
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
      const err = await response.text()
      console.error('AI API error:', model, err)
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

  } catch (error) {
    console.error('VAIDYA error:', error)
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
            } catch {}
          }
        }
      }
    },
  })
}
