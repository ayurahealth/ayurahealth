'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Nav from '../components/Nav'
import { CreditCard, Hospital, Zap, Activity, BookOpen, ArrowRight, MessageSquare } from 'lucide-react'

import { useTranslation } from '@/lib/i18n/LanguageContext'

export default function LandingPage() {
  const { language: lang, t } = useTranslation()
  const isRTL = ['ar', 'fa', 'ur', 'he'].includes(lang)
  const [teaserPrompt, setTeaserPrompt] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [terminalText, setTerminalText] = useState('')
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const fullTerminalText = `> INITIALIZING TRADITION SYNERGY...
> CROSS-REFERENCING: CHARAKA SAMHITA [CH. 1-4], NEI JING [SEC 2]
> DETECTING PHYSIOLOGICAL SYNERGY... [VAT+PIT]
> SYNTHESIZING CLINICAL GUIDANCE...
> TRACE COMPLETE: ACCURACY 99.4% | CITATIONS 14 / FOUNDATIONAL TEXTS`

  useEffect(() => {
    let currentIndex = 0
    const intervalId = setInterval(() => {
      setTerminalText(fullTerminalText.slice(0, currentIndex + 1))
      currentIndex++
      if (currentIndex === fullTerminalText.length) {
        clearInterval(intervalId)
      }
    }, 45) // Typist speed
    return () => clearInterval(intervalId)
  }, [fullTerminalText])


  const handleTeaserSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!teaserPrompt.trim()) return
    router.push(`/chat?q=${encodeURIComponent(teaserPrompt.trim())}`)
  }

  const navLinks = [
    { label: t('nav_pricing'), href: '/pricing', icon: CreditCard },
    { label: t('nav_clinic'), href: '/clinic', icon: Hospital },
  ]

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'} style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)', position: 'relative', overflow: 'hidden' }}>
      <Nav showLangPicker={true} links={navLinks} />

      {/* ─── Ambient Intelligence Background ─── */}
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '120vw', height: '100vh', background: 'radial-gradient(circle at center, hsla(144, 20%, 60%, 0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ─── Hero Intelligence Center ─── */}
      <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: 'max(15vh, 8rem)', paddingBottom: '6rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="ios-badge"
            style={{ marginBottom: '2rem', display: 'inline-flex' }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 10px currentColor', animation: 'neuralPulse 2s ease-in-out infinite' }} />
            Ayura Intelligence Lab — v1.1.0 Live
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: '1.5rem', whiteSpace: 'pre-line', letterSpacing: '-0.03em' }}
          >
            {t('landing_tagline')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto 4rem', lineHeight: 1.7, letterSpacing: '-0.008em' }}
          >
            {t('landing_sub')}
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
                  placeholder={t('teaser_placeholder')}
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
                      <Activity size={14} /> {t('teaser_trad')}
                    </button>
                    <button type="button" className="btn-secondary" style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookOpen size={14} /> {t('teaser_trace')}
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
                <MessageSquare size={16} /> {t('teaser_enter')}
              </Link>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'var(--accent-main)', marginRight: '0.5rem' }}>●</span> {t('landing_free')}
              </div>
            </div>
          </motion.div>
          {/* ─── Capabilities Grid ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
            {[
              { name: t('cap_1_name'), desc: t('cap_1_desc'), icon: BookOpen },
              { name: t('cap_2_name'), desc: t('cap_2_desc'), icon: Zap },
              { name: t('cap_3_name'), desc: t('cap_3_desc'), icon: Activity },
            ].map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                className="ios-glass-thin ios-glass-mirror"
                style={{ padding: '2rem 1.75rem' }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'hsla(144,18%,60%,0.10)', border: '1px solid var(--border-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-main)', marginBottom: '1.25rem', boxShadow: '0 0 16px hsla(144,18%,60%,0.12)' }}>
                  <cap.icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>{cap.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{cap.desc}</p>
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
            <div style={{ padding: '3rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--accent-main)', opacity: 0.8, lineHeight: 1.8 }}>
              {terminalText}
              <motion.span 
                animate={{ opacity: [1, 0, 1] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ display: 'inline-block', width: 8, height: 15, background: 'var(--accent-main)', marginLeft: 4, verticalAlign: 'middle' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: '1px solid var(--border-low)', padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {[
            {label: t('footer_research'), href: '/'},
            {label: t('footer_compliance'), href: '/'},
            {label: 'Intelligence Integrity', href: '/'},
            {label: t('footer_support'), href: '/'},
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</Link>
          ))}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: 640, margin: '0 auto 2rem', opacity: 0.4, lineHeight: 1.8 }}>Powered by Ayura Intelligence Lab. Verified Clinical Reasoning Standards v1.1.0</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', opacity: 0.2 }}>{t('footer_copy')}</p>
      </footer>
    </main>
  )
}
