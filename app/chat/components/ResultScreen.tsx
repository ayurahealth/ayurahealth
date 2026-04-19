'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '@/lib/translations'

const DOSHA_META = {
  Vata:  { emoji: '🌬️', color: 'var(--accent-main)', glow: 'hsla(var(--accent-main-hsl), 0.2)', taglineKey: 'vata_tagline', descKey: 'vata_desc', strengthsKey: 'vata_strengths', watchKey: 'vata_watch' },
  Pitta: { emoji: '🔥', color: 'var(--accent-secondary)', glow: 'hsla(var(--accent-secondary-hsl), 0.2)', taglineKey: 'pitta_tagline', descKey: 'pitta_desc', strengthsKey: 'pitta_strengths', watchKey: 'pitta_watch' },
  Kapha: { emoji: '🌍', color: 'var(--accent-main)', glow: 'hsla(var(--accent-main-hsl), 0.2)', taglineKey: 'kapha_tagline', descKey: 'kapha_desc', strengthsKey: 'kapha_strengths', watchKey: 'kapha_watch' },
}

interface ResultScreenProps {
  lang: Lang
  dosha: 'Vata' | 'Pitta' | 'Kapha'
  isSharing: boolean
  shareSuccess: boolean
  onStartChat: () => void
  onShare: () => void
  onRetake: () => void
}

export default function ResultScreen({ 
  lang, 
  dosha, 
  isSharing, 
  shareSuccess, 
  onStartChat, 
  onShare, 
  onRetake 
}: ResultScreenProps) {
  const tx = t[lang]
  const meta = DOSHA_META[dosha]

  return (
    <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto', padding: '4rem 1.5rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            style={{ fontSize: '6rem', marginBottom: '1rem', filter: `drop-shadow(0 0 30px ${meta.glow})` }}
          >
            {meta.emoji}
          </motion.div>
          <div style={{ color: 'var(--accent-main)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Foundational Constitution
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', fontWeight: 500, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
            {dosha}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginTop: '1rem', fontWeight: 400, maxWidth: 400, margin: '1rem auto 0' }}>
            {tx[meta.taglineKey as keyof typeof tx] as string}
          </p>
        </div>

        <div className="glass-surface" style={{ padding: '2.5rem', marginBottom: '2rem', borderRadius: '32px', border: `1px solid ${meta.color}30`, background: 'var(--surface-low)' }}>
          <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            {tx[meta.descKey as keyof typeof tx] as string}
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
            {[{ label: tx.strengths, key: meta.strengthsKey, color: 'var(--accent-main)' }, { label: tx.watch, key: meta.watchKey, color: 'var(--accent-secondary)' }].map((item, i) => (
              <div key={i}>
                <div style={{ 
                  color: item.color, 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.12em', 
                  textTransform: 'uppercase', 
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
                  {item.label}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {tx[item.key as keyof typeof tx] as string}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <button 
            onClick={onStartChat} 
            className="btn-primary"
            style={{ height: 68, fontSize: '1.15rem', borderRadius: '20px' }}
          >
            Sync with VAIDYA Protocol →
          </button>
          
          <button 
            onClick={onShare} 
            disabled={isSharing} 
            className="flat-card"
            style={{ 
              height: 60, 
              background: shareSuccess ? 'hsla(var(--accent-main-hsl), 0.1)' : 'var(--surface-low)', 
              border: `1px solid ${shareSuccess ? 'var(--accent-main)' : 'var(--border-low)'}`, 
              color: shareSuccess ? 'var(--accent-main)' : 'var(--text-main)', 
              borderRadius: 20, 
              fontSize: '1rem', 
              fontWeight: 600, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem',
              transition: 'all 0.2s'
            }}
          >
            {isSharing ? '⏳ Generating Signature...' : shareSuccess ? '✓ Protocol Card Saved' : '📤 Export Bio-Signature'}
          </button>

          <button 
            onClick={onRetake} 
            style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'center', opacity: 0.5, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
          >
            {tx.retake}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
