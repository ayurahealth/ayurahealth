'use client'
import React from 'react'
import Nav from '../../components/Nav'
import { ShieldCheck, Info, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function SafetyPage() {
  const boundaries = [
    {
      title: 'Neural Integrity Scope',
      icon: ShieldCheck,
      body: 'Ayura Intelligence provides high-fidelity research synthesis inspired by traditional medical systems. Our models are trained to extract technical logic from classical texts for educational awareness.',
    },
    {
      title: 'Clinical Boundaries',
      icon: Info,
      body: 'The platform does not provide diagnosis, treatment, or clinical prescriptions. Ayura Intelligence is a synthesis engine, not a licensed medical professional.',
    },
    {
      title: 'Verified Tracing',
      icon: CheckCircle2,
      body: 'Every intelligence output aims for citation accuracy. However, users must verify any synthesis with a qualified practitioner before implementation.',
    },
  ]

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--bg-main)', color: 'var(--text-main)', position: 'relative' }}>
      <Nav showLangPicker={false} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '10rem 1.5rem 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4rem)', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>Safety & Neural Scope</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: 600, margin: '0 auto' }}>
            Understanding the clinical boundaries of Ayura Intelligence Lab.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
          {boundaries.map((b, i) => (
            <div key={i} style={{ border: '1px solid var(--border-low)', borderRadius: '24px', padding: '2.5rem', background: 'var(--surface-low)' }}>
              <div style={{ color: 'var(--accent-main)', marginBottom: '1.5rem' }}>
                <b.icon size={32} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>{b.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{b.body}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'hsla(30, 80%, 50%, 0.05)', border: '1px solid hsla(30, 80%, 50%, 0.2)', borderRadius: '32px', padding: '4rem 3rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--accent-secondary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <AlertTriangle size={48} />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Clinical Synthesis Restriction</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>
            Ayura Intelligence reports are intended for research curiosity and institutional analysis. If you are experiencing a medical emergency, please contact 911 (USA) or your local emergency response unit immediately.
          </p>
        </div>
      </div>

      <footer style={{ padding: '5rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-low)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 Ayura Intelligence Lab · Verified Clinical Scope</p>
      </footer>
    </main>
  )
}
