'use client'
import { useState } from 'react'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'

const DOSHAS = ['Vata', 'Pitta', 'Kapha']
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter']
const GOALS = ['Balance & wellness', 'Weight management', 'Energy & vitality', 'Digestion', 'Sleep & calm', 'Immunity']

export default function DietChartPage() {
  const [step, setStep] = useState(1)
  const [dosha, setDosha] = useState('')
  const [season, setSeason] = useState('')
  const [goal, setGoal] = useState('')
  const [diet, setDiet] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    setStep(3)
    try {
      const prompt = `Generate a complete 7-day personalized Ayurvedic diet chart for:
- Dosha: ${dosha}
- Season: ${season}  
- Goal: ${goal}

Use this EXACT format:

# 🌿 Your 7-Day ${dosha} Diet Chart
*Personalized by VAIDYA · Based on Charaka Samhita*

## Your ${dosha} Profile
[2 sentences about this dosha and what foods bring balance]

## Daily Principles for ${dosha}
- Best eating time: [specific times]
- Foods to favour: [list 6-8 specific foods]
- Foods to reduce: [list 4-5 specific foods]
- Best cooking oils: [specific]
- Water intake: [specific advice]

---

## Day 1 — ${season} Healing
**Morning (7-8 AM)**
- [specific drink with recipe — e.g. warm cumin water with honey]
- [breakfast dish with ingredients]

**Mid-Morning (10-11 AM)**
- [snack with specific food]

**Lunch (12-1 PM)** *(largest meal)*
- [main dish with ingredients and brief prep note]
- [side dish]
- [drink/soup]

**Evening (4-5 PM)**
- [herbal tea or snack]

**Dinner (7-8 PM)** *(light)*
- [dinner dish]
- [optional herbal drink before bed]

---

[Repeat same detailed format for Days 2-7, each day slightly different]

---

## 🌿 Key Herbs for ${dosha} (${season})
| Herb | Dose | Time | Benefit |
|------|------|------|---------|
| [herb 1] | [specific dose] | [morning/evening] | [benefit] |
| [herb 2] | [specific dose] | [time] | [benefit] |
| [herb 3] | [specific dose] | [time] | [benefit] |
| [herb 4] | [specific dose] | [time] | [benefit] |

## ⚡ Lifestyle Tips for This Week
1. [sleep time specific to dosha]
2. [exercise type and duration]
3. [yoga poses — name 2-3 specific ones]
4. [breathing exercise — specific pranayama]
5. [daily routine tip]

## 📚 Classical Source
*Based on Charaka Samhita [specific chapter] and Ashtanga Hridayam [specific chapter]*

⚠️ *This is educational guidance. Consult an Ayurvedic practitioner for medical conditions.*`

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          dosha,
          lang: 'en',
          deepThink: true,
          systems: ['ayurveda'],
        }),
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let full = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          for (const line of decoder.decode(value).split('\n')) {
            if (line.startsWith('data: ')) {
              try {
                const d = JSON.parse(line.slice(6))
                if (d.content) { full += d.content }
              } catch {}
            }
          }
        }
      }
      setDiet(full)
    } catch {
      setDiet('Error generating diet chart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDiet = (text: string) => {
    const html = text
      .replace(/^# (.+)$/gm, '<h1 style="font-family: Cormorant Garamond, serif; font-size: 1.8rem; color: #c9a84c; margin: 1.5rem 0 0.5rem; font-weight: 300;">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 style="font-family: Cormorant Garamond, serif; font-size: 1.3rem; color: #6abf8a; margin: 1.5rem 0 0.5rem; font-weight: 400;">$1</h2>')
      .replace(/^\*(.+)\*$/gm, '<p style="color: rgba(232,223,200,0.4); font-size: 0.82rem; font-style: italic; margin-bottom: 1rem;">$1</p>')
      .replace(/^\*\*(.+)\*\*$/gm, '<p style="color: #6abf8a; font-weight: 600; margin: 1rem 0 0.25rem; font-size: 0.9rem;">$1</p>')
      .replace(/^- (.+)$/gm, '<div style="display: flex; gap: 0.5rem; margin: 0.3rem 0; color: rgba(232,223,200,0.7); font-size: 0.88rem;"><span style="color: #6abf8a; flex-shrink: 0;">•</span><span>$1</span></div>')
      .replace(/^(\d+\. .+)$/gm, '<div style="color: rgba(232,223,200,0.7); font-size: 0.88rem; margin: 0.3rem 0; padding-left: 1rem;">$1</div>')
      .replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid rgba(106,191,138,0.12); margin: 1.5rem 0;">')
      .replace(/\n/g, '<br/>')

    return DOMPurify.sanitize(html)
  }

  return (
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', fontFamily: '-apple-system, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .choice { background: rgba(255,255,255,0.03); border: 1px solid rgba(106,191,138,0.1); border-radius: 12px; padding: 0.85rem 1.25rem; cursor: pointer; transition: all 0.2s; color: rgba(232,223,200,0.6); font-size: 0.9rem; text-align: left; width: 100%; } .choice:hover, .choice.selected { background: rgba(106,191,138,0.08); border-color: rgba(106,191,138,0.35); color: #e8dfc8; } .choice.selected { border-color: #6abf8a; color: #6abf8a; }`}</style>

      <nav style={{ background: 'rgba(5,16,10,0.95)', borderBottom: '1px solid rgba(106,191,138,0.1)', padding: '0 2rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#c9a84c', textDecoration: 'none' }}>🌿 AyuraHealth</Link>
        <Link href="/chat" style={{ fontSize: '0.8rem', color: 'rgba(106,191,138,0.7)', textDecoration: 'none', border: '1px solid rgba(106,191,138,0.2)', padding: '0.3rem 0.8rem', borderRadius: 20 }}>Open Chat →</Link>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌿</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: '#e8dfc8', marginBottom: '0.5rem' }}>7-Day Ayurvedic Diet Chart</h1>
          <p style={{ color: 'rgba(232,223,200,0.35)', fontSize: '0.88rem' }}>Personalized by VAIDYA · Based on Charaka Samhita</p>
        </div>

        {/* Step 1 — Choose Dosha */}
        {step === 1 && (
          <div>
            <p style={{ color: 'rgba(232,223,200,0.5)', fontSize: '0.82rem', marginBottom: '1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Step 1 of 3 · Your Dosha</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {DOSHAS.map(d => (
                <button key={d} className={`choice${dosha === d ? ' selected' : ''}`} onClick={() => setDosha(d)}>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>
                    {d === 'Vata' ? '🌬️' : d === 'Pitta' ? '🔥' : '🌊'} {d}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.78rem', opacity: 0.5, marginTop: '0.2rem' }}>
                    {d === 'Vata' ? 'Air & Space · Thin, creative, variable' : d === 'Pitta' ? 'Fire & Water · Medium, driven, intense' : 'Earth & Water · Solid, calm, steady'}
                  </span>
                </button>
              ))}
            </div>
            <p style={{ color: 'rgba(232,223,200,0.3)', fontSize: '0.78rem', marginBottom: '1rem' }}>Don&apos;t know your dosha? <Link href="/chat" style={{ color: '#6abf8a', textDecoration: 'none' }}>Take the quiz →</Link></p>
            <button onClick={() => dosha && setStep(2)} style={{ width: '100%', padding: '0.9rem', background: dosha ? 'linear-gradient(135deg, #2d5a1b, #3d7a28)' : 'rgba(255,255,255,0.05)', color: dosha ? '#e8dfc8' : 'rgba(232,223,200,0.3)', border: 'none', borderRadius: 12, fontSize: '0.95rem', cursor: dosha ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Season + Goal */}
        {step === 2 && (
          <div>
            <p style={{ color: 'rgba(232,223,200,0.5)', fontSize: '0.82rem', marginBottom: '1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Step 2 of 3 · Season & Goal</p>
            <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Current season</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {SEASONS.map(s => (
                <button key={s} className={`choice${season === s ? ' selected' : ''}`} onClick={() => setSeason(s)}>{s}</button>
              ))}
            </div>
            <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Your health goal</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              {GOALS.map(g => (
                <button key={g} className={`choice${goal === g ? ' selected' : ''}`} onClick={() => setGoal(g)}>{g}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: '0.9rem', background: 'transparent', color: 'rgba(232,223,200,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: '0.9rem', cursor: 'pointer' }}>← Back</button>
              <button onClick={() => season && goal && generate()} style={{ flex: 2, padding: '0.9rem', background: season && goal ? 'linear-gradient(135deg, #2d5a1b, #3d7a28)' : 'rgba(255,255,255,0.05)', color: season && goal ? '#e8dfc8' : 'rgba(232,223,200,0.3)', border: 'none', borderRadius: 12, fontSize: '0.95rem', cursor: season && goal ? 'pointer' : 'not-allowed' }}>
                ✨ Generate My Diet Chart
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Result */}
        {step === 3 && (
          <div>
            {loading && !diet && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>🌿</div>
                <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.9rem' }}>VAIDYA is preparing your personalized diet chart...</p>
                <p style={{ color: 'rgba(232,223,200,0.25)', fontSize: '0.78rem', marginTop: '0.5rem' }}>Consulting Charaka Samhita · Usually takes 20-30 seconds</p>
              </div>
            )}
            {diet && (
              <div>
                <div style={{ background: 'rgba(106,191,138,0.05)', border: '1px solid rgba(106,191,138,0.12)', borderRadius: 16, padding: '2rem', marginBottom: '2rem' }}
                  dangerouslySetInnerHTML={{ __html: formatDiet(diet) }}
                />
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={() => { navigator.clipboard.writeText(diet) }} style={{ flex: 1, padding: '0.85rem', background: 'rgba(106,191,138,0.08)', border: '1px solid rgba(106,191,138,0.25)', borderRadius: 12, color: '#6abf8a', fontSize: '0.88rem', cursor: 'pointer' }}>
                    📋 Copy Chart
                  </button>
                  <button onClick={() => { setStep(1); setDosha(''); setSeason(''); setGoal(''); setDiet('') }} style={{ flex: 1, padding: '0.85rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(232,223,200,0.4)', fontSize: '0.88rem', cursor: 'pointer' }}>
                    🔄 New Chart
                  </button>
                  <Link href="/chat" style={{ flex: 1, padding: '0.85rem', background: 'linear-gradient(135deg, #2d5a1b, #3d7a28)', borderRadius: 12, color: '#e8dfc8', fontSize: '0.88rem', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    💬 Ask VAIDYA
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
