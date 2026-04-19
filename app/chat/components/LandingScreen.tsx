'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '@/lib/translations'
import EngagementStory from '../../../components/EngagementStory'

interface LandingScreenProps {
  lang: Lang
  onStartQuiz: () => void
  onSkipToChat: () => void
}

export default function LandingScreen({ lang, onStartQuiz, onSkipToChat }: LandingScreenProps) {
  const tx = t[lang]

  return (
    <div style={{ position: 'relative', zIndex: 1, maxWidth: 840, margin: '0 auto', textAlign: 'center', padding: '4rem 1.5rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={{ fontSize: '1rem', color: 'var(--accent-main)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          ✦ Clinical Intelligence
        </div>
        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
          color: 'var(--text-main)', 
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          fontWeight: 500
        }}>
          {tx.title}
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--text-muted)', 
          maxWidth: 580, 
          margin: '0 auto 3.5rem',
          lineHeight: 1.6
        }}>
          {tx.subtitle}
        </p>
      </motion.div>

      <div className="glass-surface" style={{ padding: '3rem', marginBottom: '1.5rem', borderRadius: '32px', background: 'var(--surface-low)', border: '1px solid var(--border-low)' }}>
        <EngagementStory />
        <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>🔬</div>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)', fontSize: '1.75rem', textAlign: 'center', fontWeight: 600, marginBottom: '0.75rem' }}>Precision Diagnostic</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', textAlign: 'center', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Identify underlying bio-energetic imbalances through a structured 5-minute clinical protocol.
        </p>
        <button 
          onClick={onStartQuiz} 
          className="btn-primary"
          style={{ width: '100%', height: 64, fontSize: '1.1rem', borderRadius: '18px' }}
        >
          Start Clinical Intake
        </button>
      </div>
      
      <button 
        onClick={onSkipToChat} 
        style={{ 
          width: '100%', 
          padding: '1.25rem', 
          background: 'transparent', 
          color: 'var(--text-muted)', 
          border: '1px solid var(--border-low)', 
          borderRadius: 18, 
          fontSize: '0.95rem', 
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-low)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {tx.skip_btn}
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '4rem', flexWrap: 'wrap', opacity: 0.4 }}>
        {[['Charaka Samhita'],['Huangdi Neijing'],['Sowa Rigpa'],['Evidence-Based']].map(([s],i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-main)' }} />
            <span>{s}</span>
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '3rem', lineHeight: 1.6, maxWidth: 600, margin: '3rem auto 0', opacity: 0.5 }}>{tx.disclaimer}</p>
    </div>
  )
}
准确
