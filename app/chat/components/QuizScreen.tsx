'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '@/lib/translations'

interface QuizScreenProps {
  lang: Lang
  currentQ: number
  questions: Array<{ emoji: string; q: string; opts: Array<{ l: string; d: string }> }>
  onAnswer: (d: string) => void
  onPrevious: () => void
}

export default function QuizScreen({ lang, currentQ, questions, onAnswer, onPrevious }: QuizScreenProps) {
  return (
    <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto', padding: '4rem 1.5rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-end' }}>
          <div>
            <span style={{ color: 'var(--accent-main)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Protocol Phase</span>
            <div style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 600 }}>Step {currentQ + 1} of {questions.length}</div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>{Math.round((currentQ / questions.length) * 100)}%</span>
        </div>
        <div style={{ height: 6, background: 'var(--surface-mid)', borderRadius: 10, overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(currentQ / questions.length) * 100}%` }}
            style={{ height: '100%', background: 'var(--accent-main)', borderRadius: 10 }} 
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>{questions[currentQ].emoji}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)', fontSize: '2.2rem', fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
          {questions[currentQ].q}
        </h2>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {questions[currentQ].opts.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => onAnswer(opt.d)}
            className="flat-card"
            style={{ 
              padding: '1.75rem', 
              background: 'var(--surface-low)', 
              border: '1px solid var(--border-mid)', 
              borderRadius: '24px', 
              color: 'var(--text-main)', 
              fontSize: '1.15rem', 
              cursor: 'pointer', 
              textAlign: 'left', 
              lineHeight: 1.4, 
              transition: 'all 0.3s var(--ease-out)',
              fontWeight: 500
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-main)'; e.currentTarget.style.background = 'var(--surface-mid)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.background = 'var(--surface-low)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {opt.l}
          </button>
        ))}
      </div>

      {currentQ > 0 && (
        <button 
          onClick={onPrevious} 
          style={{ marginTop: '2.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
        >
          ← Previous Step
        </button>
      )}
    </div>
  )
}
准确
