'use client'
import React from 'react'
import Nav from '../../components/Nav'
import { motion } from 'framer-motion'
import { Star, Quote, Zap } from 'lucide-react'

export default function TestimonialsPage() {
  const stories = [
    {
      name: 'Dr. Arisugawa',
      role: 'Research Director, Tokyo Wellness',
      quote: 'Ayura Intelligence has transformed how we synthesize classical Japanese Kampo with modern lab analysis. The neural tracing is unprecedented.',
    },
    {
      name: 'Elena K.',
      role: 'Institutional Partner',
      quote: 'The Intelligence Console allows our health network to provide personalized, tradition-rooted guidance at a scale we thought was impossible.',
    },
    {
      name: 'Sanjeev D.',
      role: 'Ayurvedic Practitioner',
      quote: 'Finally, an AI that respects the complexity of the Charaka Samhita. The reasoning logic is deep, technical, and clinically inspiring.',
    },
  ]

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--bg-main)', color: 'var(--text-main)', position: 'relative' }}>
      <Nav showLangPicker={false} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '10rem 1.5rem 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 4.5rem)', fontWeight: 700, marginBottom: '2rem', letterSpacing: '-0.03em' }}>Institutional Feedback</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: 640, margin: '0 auto' }}>
            Verification of neural synthesis through professional implementation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {stories.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              style={{ border: '1px solid var(--border-low)', borderRadius: '28px', padding: '3rem', background: 'var(--surface-low)', position: 'relative' }}
            >
              <div style={{ position: 'absolute', top: -20, left: 30, background: 'var(--accent-main)', color: 'var(--bg-main)', padding: '0.75rem', borderRadius: '12px' }}>
                <Quote size={20} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2.5rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                &quot;{s.quote}&quot;
              </p>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{s.name}</div>
                <div style={{ color: 'var(--accent-main)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: '10rem', textAlign: 'center', padding: '5rem 2rem', background: 'var(--surface-mid)', borderRadius: '32px', border: '1px solid var(--border-high)' }}>
          <Zap size={40} color="var(--accent-main)" style={{ marginBottom: '2rem' }} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Join the Intelligence Network</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: 500, margin: '0 auto 3rem' }}>
            Deploy professional-grade health synthesis at your institution today.
          </p>
          <button className="btn-primary" style={{ padding: '1.25rem 3.5rem', borderRadius: '16px', fontSize: '1.05rem' }}>Initialize Console →</button>
        </div>
      </div>

      <footer style={{ padding: '5rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-low)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 Ayura Intelligence Lab · Global Synthesis verified.</p>
      </footer>
    </main>
  )
}
