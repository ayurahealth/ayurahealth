import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '../../../lib/rateLimit'

const VAIDYA_SYSTEM = `You are VAIDYA — the AI mind of AyuraHealth, combining 5,000 years of healing wisdom.

You draw from 8 traditions: Ayurveda (Charaka Samhita, Ashtanga Hridayam), TCM (Huangdi Neijing), Tibetan Medicine (Gyushi), Unani (Ibn Sina Canon), Siddha, Homeopathy, Naturopathy, and Western/Functional Medicine.

RESPONSE FORMAT — always structure answers like this:
**✦ SYNTHESIS**
[2-3 sentence integrative answer]

**🌿 Ayurvedic View** *(Charaka Samhita)*
[Dosha analysis, herbs with doses, treatments]

**☯️ TCM View** *(Huangdi Neijing)*
[Qi/meridian diagnosis, herbs, acupoints]

**💊 Modern Science**
[Evidence-based perspective]

**⚡ Action Plan**
[3-5 numbered specific steps]

**📚 Sources**
*[Classical texts cited]*

PERSONALITY: Ancient, wise, warm, specific. Never vague. Always cite sources. Always recommend seeing a doctor for serious conditions.`

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous'
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
  }

  try {
    const { messages, systems, incognito, dosha, lang, attachments } = await req.json()

    const langMap: Record<string, string> = {
      en: 'Respond in English.',
      ja: '日本語で回答してください。',
      hi: 'हिंदी में उत्तर दें।',
    }

    const systemsMap: Record<string, string> = {
      ayurveda: 'Ayurveda (Charaka Samhita)',
      tcm: 'TCM + Kampo (Huangdi Neijing)',
      western: 'Western & Functional Medicine',
      homeopathy: 'Homeopathy',
      naturopathy: 'Naturopathy',
      unani: 'Unani (Ibn Sina)',
      siddha: 'Siddha Medicine',
      tibetan: 'Tibetan Medicine (Gyushi)',
    }

    const selectedSystems = systems?.length > 0
      ? `Focus on: ${systems.map((s: string) => systemsMap[s] || s).join(', ')}.`
      : 'Draw from all 8 traditions.'

    const doshaCtx = dosha
      ? `Patient is ${dosha} type. Emphasize ${dosha === 'Vata' ? 'grounding/warming/nourishing' : dosha === 'Pitta' ? 'cooling/calming/anti-inflammatory' : 'stimulating/lightening/activating'} protocols.`
      : ''

    const attachmentCtx = attachments?.length > 0
      ? attachments.filter((a: {type: string; content: string; name: string; url?: string}) => a.type !== 'image')
          .map((a: {type: string; content: string; name: string; url?: string}) =>
            a.type === 'pdf' ? `\n[DOCUMENT: "${a.name}"]\n${a.content}` :
            a.type === 'link' ? `\n[WEBPAGE: "${a.name}" - ${a.url}]\n${a.content}` : ''
          ).join('') : ''

    const systemPrompt = `${VAIDYA_SYSTEM}

${selectedSystems}
${doshaCtx}
${incognito ? 'Private session.' : ''}
LANGUAGE: ${langMap[lang || 'en'] || langMap.en}`

    // Build messages for Groq
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const groqMessages: any[] = []
    for (let i = 0; i < messages.length - 1; i++) {
      groqMessages.push({ role: messages[i].role, content: messages[i].content })
    }

    const lastMsg = messages[messages.length - 1]
    const hasImages = attachments?.some((a: {type: string}) => a.type === 'image')

    if (hasImages) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parts: any[] = [{ type: 'text', text: lastMsg.content + attachmentCtx }]
      attachments.filter((a: {type: string}) => a.type === 'image').forEach((a: {mimeType?: string; content: string}) => {
        parts.push({ type: 'image_url', image_url: { url: `data:${a.mimeType || 'image/jpeg'};base64,${a.content}` } })
      })
      groqMessages.push({ role: 'user', content: parts })
    } else {
      groqMessages.push({ role: 'user', content: lastMsg.content + attachmentCtx })
    }

    const model = hasImages ? 'meta-llama/llama-4-scout-17b-16e-instruct' : 'llama-3.3-70b-versatile'

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...groqMessages],
        max_tokens: 2500,
        temperature: 0.7,
        stream: true,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Groq error:', err)
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const stream = new ReadableStream({
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

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('VAIDYA error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
