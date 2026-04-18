'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Nav from '../components/Nav'
import Surface from '../components/ui/Surface'
import { CreditCard, Hospital, Zap, Activity, BookOpen, Search, ArrowRight, MessageSquare } from 'lucide-react'

/* ─── AI Organization Translations ────────────────────────────────────────── */
const T: Record<string, {
  tagline: string; sub: string; cta: string; free: string;
  traditions: string; tradSub: string;
  how: string; s1t: string; s1d: string; s2t: string; s2d: string; s3t: string; s3d: string;
  finalCta: string; finalSub: string; footer: string; clinic: string;
}> = {
  en: {
    tagline: 'Intelligence for Humanity\nSynthesizing Ancient Medical Logic.',
    sub: 'Access the world\'s most sophisticated clinical reasoning engine. Rooted in 8 classical medical traditions, designed for modern longevity.',
    cta: 'Initialize Assessment', free: '3 Active Neural Sessions · No Credit Card',
    traditions: '8 Intelligence Pillars', tradSub: 'A unified reasoning system connecting classical medical paradigms.',
    how: 'Core Capabilities',
    s1t: 'Neural Synthesis', s1d: 'Standardized assessment algorithms reveal your clinical profile based on verified Ayurvedic and Traditional logic.',
    s2t: 'Reasoning Traceability', s2d: 'Every intelligence output cross-references primary sources like Charaka Samhita and Huangdi Neijing via live neural tracing.',
    s3t: 'Analytical Integrity', s3d: 'Multi-step tradition analysis for complex physiological pathways, providing depth beyond simple pattern matching.',
    finalCta: 'The future of healing is intelligent.', finalSub: 'Ayura Intelligence Lab is live. Initialize your first session today.',
    footer: 'Clinical Intelligence Research Mode · For educational purposes only · Not medical advice', clinic: 'Analytics Portal',
  },
}

const getT = (code: string) => T[code] || T['en']

const CAPABILITIES = [
  { name: 'Classical Reasoning', desc: 'Synthesizing 5,000 years of clinical logic into actionable health insights.', icon: BookOpen },
  { name: 'Neural Tracing', desc: 'Verifiable citations from primary medical texts in every individual response.', icon: Zap },
  { name: 'Tradition Synthesis', desc: 'Unified cross-analysis between Ayurveda, TCM, and 6 other medical paradigms.', icon: Activity },
]

export default function LandingPage() {
  const [lang, setLang] = useState('en')
  const t = getT(lang)
  const isRTL = ['ar', 'fa', 'ur', 'he'].includes(lang)
  const [teaserPrompt, setTeaserPrompt] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('ayura_lang')
    if (saved && saved !== lang) {
      setLang(saved)
    }
  }, [lang])

  const handleTeaserSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!teaserPrompt.trim()) return
    router.push(`/chat?q=${encodeURIComponent(teaserPrompt.trim())}`)
  }

  const navLinks = [
    { label: 'Pricing', href: '/pricing', icon: CreditCard },
    { label: t.clinic, href: '/clinic', icon: Hospital },
  ]

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'} style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)', position: 'relative', overflow: 'hidden' }}>
      <Nav lang={lang} onLangChange={setLang} showLangPicker={true} links={navLinks} />

      {/* ─── Ambient Intelligence Background ─── */}
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '120vw', height: '100vh', background: 'radial-gradient(circle at center, hsla(144, 20%, 60%, 0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ─── Hero Intelligence Center ─── */}
      <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: 'max(15vh, 8rem)', paddingBottom: '6rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1rem', background: 'var(--surface-low)', border: '1px solid var(--border-low)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-main)', letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 10px currentColor' }} />
            Ayura Intelligence Lab — v1.1.0 Live
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: '1.5rem', whiteSpace: 'pre-line', letterSpacing: '-0.03em' }}
          >
            {t.tagline}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: 680, margin: '0 auto 4rem', lineHeight: 1.6 }}
          >
            {t.sub}
          </motion.p>

          {/* ─── The Main Intelligence Composer (Claude/Perplexity Style) ─── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ maxWidth: 760, margin: '0 auto 5rem', position: 'relative' }}
          >
            <div 
              className="glass-surface" 
              style={{ 
                padding: '0.75rem', 
                borderRadius: '24px', 
                background: isFocused ? 'var(--surface-low)' : 'var(--bg-main)', 
                border: isFocused ? '1px solid var(--accent-main)' : '1px solid var(--border-high)',
                boxShadow: isFocused ? '0 0 40px hsla(144, 20%, 60%, 0.1)' : '0 20px 40px rgba(0,0,0,0.3)',
                transition: 'all 0.3s var(--ease-out)',
                cursor: 'text'
              }}
              onClick={() => textareaRef.current?.focus()}
            >
              <form onSubmit={handleTeaserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <textarea
                  ref={textareaRef}
                  value={teaserPrompt}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setTeaserPrompt(e.target.value)}
                  placeholder="How can Ayura Intelligence assist your clinical observation today?"
                  style={{ 
                    width: '100%', 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-main)', 
                    padding: '1rem', 
                    resize: 'none', 
                    height: 80, 
                    outline: 'none', 
                    fontSize: '1.2rem',
                    fontFamily: 'inherit',
                    lineHeight: 1.5
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleTeaserSubmit()
                    }
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem 0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="button" className="btn-secondary" style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Activity size={14} /> Traditional Engine
                    </button>
                    <button type="button" className="btn-secondary" style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookOpen size={14} /> Reasoning Trace
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    disabled={!teaserPrompt.trim()} 
                    className="btn-primary" 
                    style={{ height: 48, width: 48, padding: 0, borderRadius: 14, opacity: teaserPrompt.trim() ? 1 : 0.4 }}
                  >
                    <ArrowRight size={22} />
                  </button>
                </div>
              </form>
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
               <Link href="/chat" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                <MessageSquare size={16} /> Enter Full Interface
              </Link>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'var(--accent-main)', marginRight: '0.5rem' }}>●</span> {t.free}
              </div>
            </div>
          </motion.div>

          {/* ─── Capabilities Grid ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                className="flat-card"
                style={{ background: 'hsla(var(--bg-main-hsl), 0.5)', border: '1px solid var(--border-low)' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--surface-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-main)', marginBottom: '1.25rem' }}>
                  <cap.icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>{cap.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Reasoning Background Mockup ─── */}
      <section style={{ padding: '4rem 1.5rem', borderTop: '1px solid var(--border-low)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="flat-card" style={{ background: '#000', padding: 0, overflow: 'hidden', border: '1px solid var(--border-mid)' }}>
             <div style={{ borderBottom: '1px solid var(--border-low)', padding: '0.75rem 1.25rem', background: 'var(--surface-low)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'monospace', opacity: 0.6 }}>ayura_neural_engine_synthesis.v1</span>
            </div>
            <div style={{ padding: '3rem', whiteSpace: 'pre-line', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--accent-main)', opacity: 0.8, lineHeight: 1.8 }}>
              {`> INITIALIZING TRADITION SYNERGY...
> CROSS-REFERENCING: CHARAKA SAMHITA [CH. 1-4], NEI JING [SEC 2]
> DETECTING PHYSIOLOGICAL SYNERGY... [VAT+PIT]
> SYNTHESIZING CLINICAL GUIDANCE...
> TRACE COMPLETE: ACCURACY 99.4% | CITATIONS 14 / FOUNDATIONAL TEXTS`}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: '1px solid var(--border-low)', padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {['Research', 'Compliance', 'Intelligence Integrity', 'API Support'].map((label) => (
            <Link key={label} href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{label}</Link>
          ))}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: 640, margin: '0 auto 2rem', opacity: 0.4, lineHeight: 1.8 }}>Powered by Ayura Intelligence Lab. Verified Clinical Reasoning Standards v1.1.0</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', opacity: 0.2 }}>© 2026 Ayura Intelligence · Tokyo Laboratory</p>
      </footer>
    </main>
  )
}
