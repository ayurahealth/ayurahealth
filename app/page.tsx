'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Nav from '../components/Nav'
import Surface from '../components/ui/Surface'
import IOSButton from '../components/ui/IOSButton'

/* ─── Translations (Sanitized) ────────────────────────────────────────── */
const T: Record<string, {
  tagline: string; sub: string; cta: string; free: string;
  traditions: string; tradSub: string;
  how: string; s1t: string; s1d: string; s2t: string; s2d: string; s3t: string; s3d: string;
  finalCta: string; finalSub: string; footer: string; clinic: string;
}> = {
  en: {
    tagline: 'Traditional Healing\nUnified for Modern Health.',
    sub: 'Get personalized health guidance rooted in Ayurveda, Chinese Medicine, and 6 other classical healing traditions.',
    cta: 'Start Your Assessment', free: '3 free consultations · No credit card required',
    traditions: '8 Global Traditions', tradSub: 'A unified system connecting classical medical texts.',
    how: 'The Implementation',
    s1t: 'Identify Body Constitution', s1d: 'Standardized assessments reveal your traditional health profile based on classical Ayurvedic definitions.',
    s2t: 'Classical Text Reference', s2d: 'Our system cross-references primary sources like Charaka Samhita and Huangdi Neijing for every response.',
    s3t: 'Analytical Reasoning', s3d: 'Multi-tradition analysis for complex health observations, providing depth and historical context.',
    finalCta: 'Healing is a natural process.', finalSub: 'Available now. Start with 3 free consultations.',
    footer: 'For educational purposes only · Not a substitute for professional medical advice', clinic: 'Clinical Portal →',
  },
}

const getT = (code: string) => T[code] || T['en']

const SOURCES = [
  { name: 'Charaka Samhita', tradition: 'Ayurveda', date: '500 BCE' },
  { name: 'Huangdi Neijing', tradition: 'Chinese Medicine', date: '300 BCE' },
  { name: 'Gyushi', tradition: 'Tibetan Medicine', date: '8th Century' },
  { name: 'Canon of Medicine', tradition: 'Unani', date: '1025 CE' },
]

export default function LandingPage() {
  const [lang, setLang] = useState('en')
  const t = getT(lang)
  const isRTL = ['ar', 'fa', 'ur', 'he'].includes(lang)
  const [teaserPrompt, setTeaserPrompt] = useState('')
  const router = useRouter()

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

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'}>
      <Nav lang={lang} onLangChange={setLang} showLangPicker={true} links={[
        { label: 'Pricing', href: '/pricing' },
        { label: t.clinic, href: '/clinic' },
      ]} />

      {/* ─── Hero ─── */}
      <section className="ds-section" style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 className="hero-tagline" style={{ color: 'var(--text-main)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '2rem', whiteSpace: 'pre-line' }}>
            {t.tagline}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto 3rem', lineHeight: 1.6 }}>
            {t.sub}
          </p>

          <div style={{ maxWidth: 680, margin: '0 auto 4rem' }}>
            <Surface style={{ padding: '0.6rem', borderRadius: '18px', background: 'var(--surface-low)', border: '1px solid var(--border-mid)' }}>
              <form onSubmit={handleTeaserSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <textarea
                  value={teaserPrompt}
                  onChange={(e) => setTeaserPrompt(e.target.value)}
                  placeholder="Describe a health observation... e.g., 'I feel heat in my stomach after meals'"
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '1rem', resize: 'none', height: 64, outline: 'none' }}
                />
                <button type="submit" disabled={!teaserPrompt.trim()} className="btn-primary" style={{ height: 64, width: 64, padding: 0, borderRadius: 14 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                </button>
              </form>
            </Surface>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              <Link href="/diet" className="btn-secondary" style={{ fontSize: '0.9rem' }}>Generate Traditional Diet Chart</Link>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'var(--accent-main)', marginRight: '0.4rem' }}>●</span> {t.free}
              </div>
            </div>
          </div>

          {/* Product Demo Mock (Instead of three cards) */}
          <div className="flat-card" style={{ textAlign: 'left', background: '#000', border: '1px solid var(--border-mid)', overflow: 'hidden', padding: 0 }}>
            <div style={{ borderBottom: '1px solid var(--border-low)', padding: '0.75rem 1.25rem', background: 'var(--surface-low)', display: 'flex', gap: '6px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
              <span style={{ marginLeft: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'monospace' }}>ayura_health_dashboard_v1.0.4.sh</span>
            </div>
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div>
                <div style={{ color: 'var(--accent-secondary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Core System</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>8 Tradition Engine</div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Synchronized analysis across 14,000+ classical medical citations from globally recognized texts.</p>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-low)', paddingLeft: '2rem' }}>
                <div style={{ color: 'var(--accent-main)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Dataset Status</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>1.2M Records</div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Verified database of herbs, minerals, and traditional diagnostic markers updated weekly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Methodology Section ─── */}
      <section className="ds-section" style={{ borderTop: '1px solid var(--border-low)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '3rem', textAlign: 'center' }}>Classical Sources Rooting our Intelligence</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {SOURCES.map((source, i) => (
            <div key={i} className="flat-card">
              <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{source.name}</div>
              <div style={{ color: 'var(--accent-main)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{source.tradition}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Circa {source.date}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="ds-section" style={{ background: 'var(--surface-low)', borderTop: '1px solid var(--border-low)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 400, marginBottom: '4rem' }}>{t.how}</h2>
          {[
            { n: '01', title: t.s1t, desc: t.s1d },
            { n: '02', title: t.s2t, desc: t.s2d },
            { n: '03', title: t.s3t, desc: t.s3d },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '3rem', padding: '3rem 0', borderBottom: i < 2 ? '1px solid var(--border-low)' : 'none' }}>
              <div style={{ fontSize: '4rem', fontWeight: 300, color: 'var(--accent-secondary)', opacity: 0.3, lineHeight: 1 }}>{s.n}</div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '1rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="ds-section" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>🌿</div>
          <h2 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '1.5rem' }}>{t.finalCta}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem' }}>{t.finalSub}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/chat" className="btn-primary" style={{ padding: '1rem 2rem' }}>Start Free Assessment</Link>
            <Link href="/diet" className="btn-secondary" style={{ padding: '1rem 2rem' }}>Generate Diet Plan</Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: '1px solid var(--border-low)', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {['Safety', 'Privacy', 'Terms', 'Pricing', 'Contact'].map((label) => (
            <Link key={label} href={`/${label.toLowerCase()}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>{label}</Link>
          ))}
        </div>
        <p style={{ color: 'rgba(232,223,200,0.2)', fontSize: '0.8rem', maxWidth: 600, margin: '0 auto 1.5rem' }}>{t.footer}</p>
        <p style={{ color: 'rgba(232,223,200,0.15)', fontSize: '0.75rem' }}>© 2026 AyuraHealth · Professional Holistic Intelligence</p>
      </footer>

      <style jsx>{`
        .hero-tagline {
          font-family: var(--font-display);
        }
      `}</style>
    </main>
  )
}