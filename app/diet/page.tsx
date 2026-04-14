'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '../../components/Nav'
import IOSButton from '../../components/ui/IOSButton'
import Surface from '../../components/ui/Surface'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wind, 
  Flame, 
  Droplets, 
  Sun, 
  CloudRain, 
  CloudSun, 
  Snowflake, 
  Target, 
  Database,
  ArrowRight,
  ClipboardCheck,
  Plus,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'

const DOSHAS = [
  { id: 'Vata', label: 'Vata', icon: Wind, desc: 'Variable element · Cold & Dry qualities' },
  { id: 'Pitta', label: 'Pitta', icon: Flame, desc: 'Active element · Hot & Sharp qualities' },
  { id: 'Kapha', label: 'Kapha', icon: Droplets, desc: 'Stable element · Heavy & Moist qualities' }
]

const SEASONS = [
  { id: 'Spring', label: 'Spring', icon: CloudSun },
  { id: 'Summer', label: 'Summer', icon: Sun },
  { id: 'Autumn', label: 'Autumn', icon: CloudRain },
  { id: 'Winter', label: 'Winter', icon: Snowflake }
]

const GOALS = [
  { id: 'Balance & wellness', label: 'Balance & Wellness', icon: ShieldCheck },
  { id: 'Weight management', label: 'Weight Management', icon: Target },
  { id: 'Energy & vitality', label: 'Energy & Vitality', icon: Sun },
  { id: 'Digestion', label: 'Digestive Optimization', icon: Flame },
  { id: 'Sleep & calm', label: 'Systemic Restoration', icon: Snowflake },
  { id: 'Immunity', label: 'Immune Hardening', icon: ShieldCheck }
]

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
      .replace(/^# (.+)$/gm, '<h1 style="font-family: var(--font-display); font-size: 2rem; color: var(--accent-main); margin-bottom: 1.5rem; font-weight: 500;">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--accent-main); margin-top: 2rem; margin-bottom: 1rem; font-weight: 500;">$1</h2>')
      .replace(/^\*(.+)\*$/gm, '<p style="color: var(--text-muted); font-size: 0.9rem; font-style: italic; margin-bottom: 1rem;">$1</p>')
      .replace(/^\*\*(.+)\*\*$/gm, '<p style="color: var(--accent-main); font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 1rem;">$1</p>')
      .replace(/^- (.+)$/gm, '<div style="display: flex; gap: 0.75rem; margin: 0.5rem 0; color: var(--text-main); font-size: 0.95rem;"><span style="color: var(--accent-main); opacity: 0.6;">•</span><span>$1</span></div>')
      .replace(/^(\d+\. .+)$/gm, '<div style="color: var(--text-main); font-size: 0.95rem; margin: 0.5rem 0; padding-left: 1.25rem;">$1</div>')
      .replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid var(--border-low); margin: 2rem 0;">')
      .replace(/\n/g, '<br/>')
  }

  return (
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)', paddingBottom: 'calc(100px + env(safe-area-inset-bottom))' }}>
      <Nav />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
        
        {/* Progress Stepper */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '4rem', justifyContent: 'center' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ 
              height: 4, width: 40, borderRadius: 2,
              background: step >= i ? 'var(--accent-main)' : 'var(--surface-high)',
              transition: 'background 0.3s var(--ease-out)'
            }} />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div style={{ width: 64, height: 64, margin: '0 auto 1.5rem', background: 'hsla(var(--accent-main-hsl), 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-main)' }}>
            <ClipboardCheck size={32} />
          </div>
          <h1 className="hero-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-main)', marginBottom: '1rem' }}>Dietary Protocol</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: 540, margin: '0 auto' }}>Evidence-based systemic nutrition plans derived from classical clinical systems.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>1. Systemic Profile</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Select your primary constitution for baseline analysis.</p>
              </div>

              <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
                {DOSHAS.map(d => {
                  const Icon = d.icon
                  const active = dosha === d.id
                  return (
                    <Surface 
                      key={d.id} 
                      variant={active ? 'strong' : 'default'}
                      onClick={() => setDosha(d.id)}
                      style={{ 
                        display: 'flex', gap: '1.25rem', alignItems: 'center', cursor: 'pointer',
                        borderColor: active ? 'var(--accent-main)' : 'var(--border-low)',
                        padding: '1.5rem'
                      }}
                    >
                      <div style={{ 
                        width: 52, height: 52, borderRadius: '12px', 
                        background: active ? 'var(--accent-main)' : 'var(--surface-mid)',
                        color: active ? 'var(--bg-main)' : 'var(--accent-main)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Icon size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.15rem' }}>{d.label}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{d.desc}</div>
                      </div>
                      {active && <ChevronRight size={20} style={{ color: 'var(--accent-main)' }} />}
                    </Surface>
                  )
                })}
              </div>

              <IOSButton onClick={() => setStep(2)} disabled={!dosha}>
                Continue to Environmental Context
              </IOSButton>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>2. Environmental Context</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Define current seasonal and systemic objectives.</p>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Season</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  {SEASONS.map(s => {
                    const Icon = s.icon
                    const active = season === s.id
                    return (
                      <Surface 
                        key={s.id} 
                        variant={active ? 'strong' : 'default'}
                        onClick={() => setSeason(s.id)}
                        style={{ 
                          textAlign: 'center', cursor: 'pointer',
                          borderColor: active ? 'var(--accent-main)' : 'var(--border-low)',
                          padding: '1.25rem'
                        }}
                      >
                        <Icon size={24} style={{ color: active ? 'var(--accent-main)' : 'var(--text-muted)', marginBottom: '0.75rem' }} />
                        <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{s.label}</div>
                      </Surface>
                    )
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '3.5rem' }}>
                <p style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Health Objective</p>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {GOALS.map(g => {
                    const active = goal === g.id
                    return (
                      <Surface 
                        key={g.id} 
                        variant={active ? 'strong' : 'default'}
                        onClick={() => setGoal(g.id)}
                        style={{ 
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                          borderColor: active ? 'var(--accent-main)' : 'var(--border-low)',
                          padding: '0.85rem 1.25rem'
                        }}
                      >
                        <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{g.label}</span>
                        {active && <ShieldCheck size={18} style={{ color: 'var(--accent-main)' }} />}
                      </Surface>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <IOSButton variant="secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</IOSButton>
                <IOSButton onClick={generate} disabled={!season || !goal} style={{ flex: 2 }}>
                  Synthesize Protocol
                </IOSButton>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {loading && !diet ? (
                <Surface variant="glass" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ color: 'var(--accent-main)', marginBottom: '2rem' }}
                  >
                    <Database size={48} />
                  </motion.div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Generating Clinical Protocol</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 320, margin: '0 auto' }}>Cross-referencing classical texts and environmental variables...</p>
                </Surface>
              ) : (
                <div className="animate-fade-in">
                  <Surface variant="glass" style={{ padding: '3rem', marginBottom: '2.5rem' }}>
                     <div className="markdown-content" dangerouslySetInnerHTML={{ __html: formatDiet(diet) }} />
                  </Surface>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <IOSButton variant="secondary" onClick={() => { navigator.clipboard.writeText(diet) }} style={{ flex: 1 }}>
                      <ClipboardCheck size={18} />
                      Copy Protocol
                    </IOSButton>
                    <IOSButton onClick={() => { setStep(1); setDiet('') }} style={{ flex: 1 }}>
                      <Plus size={18} />
                      New Evaluation
                    </IOSButton>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
