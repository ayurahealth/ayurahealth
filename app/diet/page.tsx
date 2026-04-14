'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '../../components/Nav'
import IOSButton from '../../components/ui/IOSButton'
import Surface from '../../components/ui/Surface'

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
      const prompt = `Generate a complete 7-day personalized dietary protocol for:
- Profile: ${dosha}
- Season: ${season}  
- Objective: ${goal}

Use a professional, clinical format with structured tables for herb dosages and specific timing.
Include classical source citations (e.g., Charaka Samhita).`

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
          const chunk = decoder.decode(value)
          for (const line of chunk.split('\n')) {
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
      setDiet('Error generating dietary protocol. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDiet = (text: string) => {
    return text
      .replace(/^# (.+)$/gm, '<h1 style="font-family: var(--font-display); font-size: 1.8rem; color: var(--accent-main); margin: 1.5rem 0 0.5rem; font-weight: 500;">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 style="font-family: var(--font-display); font-size: 1.3rem; color: var(--accent-main); margin: 1.5rem 0 0.5rem; font-weight: 500;">$1</h2>')
      .replace(/^\*(.+)\*$/gm, '<p style="color: var(--text-muted); font-size: 0.82rem; font-style: italic; margin-bottom: 1rem;">$1</p>')
      .replace(/^\*\*(.+)\*\*$/gm, '<p style="color: var(--accent-main); font-weight: 600; margin: 1rem 0 0.25rem; font-size: 0.9rem;">$1</p>')
      .replace(/^- (.+)$/gm, '<div style="display: flex; gap: 0.5rem; margin: 0.3rem 0; color: var(--text-main); font-size: 0.88rem;"><span style="color: var(--accent-main); flex-shrink: 0;">•</span><span>$1</span></div>')
      .replace(/^(\d+\. .+)$/gm, '<div style="color: var(--text-main); font-size: 0.88rem; margin: 0.3rem 0; padding-left: 1rem;">$1</div>')
      .replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid var(--border-low); margin: 1.5rem 0;">')
      .replace(/\n/g, '<br/>')
  }

  return (
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)' }}>
      <Nav />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🥗</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 500, color: 'var(--text-main)', marginBottom: '1rem' }}>Dietary Protocol</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>Evidence-based 7-day nutrition plans derived from classical health systems.</p>
        </div>

        {/* Step 1 — Profile Selection */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>1. Systemic Profile</p>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2.5rem' }}>
              {DOSHAS.map(d => (
                <button 
                  key={d} 
                  style={{ 
                    background: dosha === d ? 'var(--surface-mid)' : 'var(--surface-low)', 
                    border: dosha === d ? '1px solid var(--accent-main)' : '1px solid var(--border-low)',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }} 
                  onClick={() => setDosha(d)}
                >
                  <div style={{ color: dosha === d ? 'var(--accent-main)' : 'var(--text-main)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{d}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {d === 'Vata' ? 'Variable element · Cold & Dry qualities' : d === 'Pitta' ? 'Active element · Hot & Sharp qualities' : 'Stable element · Heavy & Moist qualities'}
                  </div>
                </button>
              ))}
            </div>
            <IOSButton onClick={() => dosha && setStep(2)} disabled={!dosha}>
              Continue to Preferences
            </IOSButton>
          </div>
        )}

        {/* Step 2 — Environmental Factors */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>2. Environmental Context</p>
            
            <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Season</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {SEASONS.map(s => (
                <button 
                  key={s} 
                  style={{ 
                    background: season === s ? 'var(--surface-mid)' : 'var(--surface-low)', 
                    border: season === s ? '1px solid var(--accent-main)' : '1px solid var(--border-low)',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    color: 'var(--text-main)',
                    cursor: 'pointer'
                  }} 
                  onClick={() => setSeason(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Primary Health Objective</p>
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '3rem' }}>
              {GOALS.map(g => (
                <button 
                  key={g} 
                  style={{ 
                    background: goal === g ? 'var(--surface-mid)' : 'var(--surface-low)', 
                    border: goal === g ? '1px solid var(--accent-main)' : '1px solid var(--border-low)',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    color: 'var(--text-main)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }} 
                  onClick={() => setGoal(g)}
                >
                  {g}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <IOSButton variant="secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</IOSButton>
              <IOSButton onClick={() => season && goal && generate()} disabled={!season || !goal} style={{ flex: 2 }}>
                Initialize Analysis
              </IOSButton>
            </div>
          </div>
        )}

        {/* Step 3 — Protocol Delivery */}
        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            {loading && !diet && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Synthesizing dietary protocol...</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', opacity: 0.5, marginTop: '0.5rem' }}>Cross-referencing classical texts and objectives</p>
              </div>
            )}
            {diet && (
              <div>
                <Surface style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                   <div dangerouslySetInnerHTML={{ __html: formatDiet(diet) }} />
                </Surface>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <IOSButton variant="secondary" onClick={() => { navigator.clipboard.writeText(diet) }} style={{ flex: 1 }}>
                    Copy Protocol
                  </IOSButton>
                  <IOSButton onClick={() => { setStep(1); setDiet('') }} style={{ flex: 1 }}>
                    New Analysis
                  </IOSButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
