'use client'
import { useState, useEffect } from 'react'
import type { DailyGuidance } from '../../lib/vedic/types'

interface Props { guidance: DailyGuidance }

const DOSHA_TIMES = [
  { dosha: 'Kapha', start: 6, end: 10, icon: '🌿', color: 'hsl(var(--sage-accent))', description: 'Grounding, slow, steady. Best for exercise and heavy breakfast.' },
  { dosha: 'Pitta', start: 10, end: 14, icon: '🔥', color: 'hsl(var(--gold-accent))', description: 'Sharpest digestion. Best for focused work and main meal.' },
  { dosha: 'Vata', start: 14, end: 18, icon: '💨', color: 'hsl(var(--gold-pale))', description: 'Creative, light, mobile. Best for creative work and light snacks.' },
  { dosha: 'Kapha', start: 18, end: 22, icon: '🌙', color: 'hsl(var(--sage-accent))', description: 'Wind down. Early dinner, gentle activity.' },
  { dosha: 'Pitta', start: 22, end: 2, icon: '⚡', color: 'hsl(var(--gold-accent))', description: 'Metabolic repair. Should be sleeping for deep restoration.' },
  { dosha: 'Vata', start: 2, end: 6, icon: '🌌', color: 'hsl(var(--gold-pale))', description: 'Spiritual insights, light sleep. Brahma Muhurta at 4-6 AM.' },
]

export default function VedicClockWidget({ guidance }: Props) {
  const [currentHour, setCurrentHour] = useState(new Date().getHours())

  useEffect(() => {
    const interval = setInterval(() => setCurrentHour(new Date().getHours()), 60000)
    return () => clearInterval(interval)
  }, [])

  const currentDosha = DOSHA_TIMES.find(d => {
    if (d.start < d.end) return currentHour >= d.start && currentHour < d.end
    return currentHour >= d.start || currentHour < d.end
  }) || DOSHA_TIMES[0]

  return (
    <div className="premium-glass" style={{
      padding: '1.25rem',
      borderRadius: 'var(--ios-radius-xl)',
      background: `linear-gradient(135deg, hsla(var(--gold-accent-h), var(--gold-accent-s), var(--gold-accent-l), 0.1), hsla(var(--gold-accent-h), var(--gold-accent-s), var(--gold-accent-l), 0.05))`,
      border: `1px solid hsla(var(--gold-accent-h), var(--gold-accent-s), var(--gold-accent-l), 0.2)`,
      marginBottom: '1rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Current time indicator */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '2rem', margin: '0 0 0.3rem' }}>{currentDosha.icon}</p>
        <p style={{ color: currentDosha.color, fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '0.05em' }}>
          {currentDosha.dosha.toUpperCase()} TIME — {currentHour}:00
        </p>
        <p style={{ color: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.6)', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
          {currentDosha.description}
        </p>
      </div>

      {/* Daily Vedic data */}
      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem', 
        marginTop: '1.25rem',
        marginBottom: '1rem'
      }}>
        {[
          { label: 'Tithi', value: guidance.tithi, icon: '🌙' },
          { label: 'Nakshatra', value: guidance.nakshatra, icon: '⭐' },
          { label: 'Color', value: guidance.colorToWear, icon: '🎨' },
          { label: 'Day Type', value: guidance.yoga.split(':')[0] || 'Auspicious', icon: '✨' },
        ].map(({ label, value, icon }) => (
          <div key={label} style={{
            background: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.02)', borderRadius: 10, padding: '0.6rem',
            border: '1px solid hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.04)'
          }}>
            <p style={{ color: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.4)', fontSize: '0.65rem', margin: '0 0 0.2rem' }}>{icon} {label}</p>
            <p style={{ color: 'hsl(var(--gold-pale))', fontSize: '0.78rem', fontWeight: 600, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Today's mantra */}
      {guidance.mantraForToday && (
        <div style={{
          marginTop: '1rem',
          background: 'hsla(var(--gold-accent-h), var(--gold-accent-s), var(--gold-accent-l), 0.05)',
          borderRadius: 12, 
          padding: '1rem',
          border: '1px solid hsla(var(--gold-accent-h), var(--gold-accent-s), var(--gold-accent-l), 0.1)',
          textAlign: 'center'
        }}>
          <p style={{ color: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.4)', fontSize: '0.65rem', margin: '0 0 0.3rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Today&apos;s mantra</p>
          <p style={{ color: 'hsl(var(--gold-accent))', fontSize: '0.85rem', fontStyle: 'italic', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            &quot;{guidance.mantraForToday}&quot;
          </p>
        </div>
      )}

      {/* Health advice */}
      <div style={{
        marginTop: '1rem',
        background: 'hsla(var(--sage-accent-h), var(--sage-accent-s), var(--sage-accent-l), 0.05)',
        borderRadius: 12, padding: '1rem',
        border: '1px solid hsla(var(--sage-accent-h), var(--sage-accent-s), var(--sage-accent-l), 0.1)'
      }}>
        <p style={{ color: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.4)', fontSize: '0.65rem', margin: '0 0 0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🌿 Clinical Guidance</p>
        <p style={{ color: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.7)', fontSize: '0.75rem', margin: 0, lineHeight: 1.6 }}>
          {guidance.healthAdvice}
        </p>
      </div>
    </div>
  )
}
