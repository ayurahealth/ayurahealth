'use client'
import { useState, useEffect } from 'react'
import type { DailyGuidance } from '@/lib/vedic/types'

interface Props { guidance: DailyGuidance }

const DOSHA_TIMES = [
  { dosha: 'Kapha', start: 6, end: 10, icon: '🌿', color: '#54a0ff', description: 'Grounding, slow, steady. Best for exercise and heavy breakfast.' },
  { dosha: 'Pitta', start: 10, end: 14, icon: '🔥', color: '#ff9f43', description: 'Sharpest digestion. Best for focused work and main meal.' },
  { dosha: 'Vata', start: 14, end: 18, icon: '💨', color: '#9b7fd4', description: 'Creative, light, mobile. Best for creative work and light snacks.' },
  { dosha: 'Kapha', start: 18, end: 22, icon: '🌙', color: '#54a0ff', description: 'Wind down. Early dinner, gentle activity.' },
  { dosha: 'Pitta', start: 22, end: 2, icon: '⚡', color: '#ff9f43', description: 'Metabolic repair. Should be sleeping for deep restoration.' },
  { dosha: 'Vata', start: 2, end: 6, icon: '🌌', color: '#9b7fd4', description: 'Spiritual insights, light sleep. Brahma Muhurta at 4-6 AM.' },
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
    <div>
      {/* Current time indicator */}
      <div style={{
        background: `linear-gradient(135deg, ${currentDosha.color}18, ${currentDosha.color}08)`,
        borderRadius: 14,
        padding: '1rem',
        border: `1px solid ${currentDosha.color}30`,
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '2rem', margin: '0 0 0.3rem' }}>{currentDosha.icon}</p>
        <p style={{ color: currentDosha.color, fontSize: '1rem', fontWeight: 700, margin: '0 0 0.2rem', fontFamily: 'Georgia, serif' }}>
          {currentDosha.dosha} Time — {currentHour}:00
        </p>
        <p style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
          {currentDosha.description}
        </p>
      </div>

      {/* Daily Vedic data */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem', marginBottom: '1rem'
      }}>
        {[
          { label: 'Tithi', value: guidance.tithi, icon: '🌙' },
          { label: 'Nakshatra', value: guidance.nakshatra, icon: '⭐' },
          { label: 'Color', value: guidance.colorToWear, icon: '🎨' },
          { label: 'Day Type', value: guidance.yoga.split(':')[0] || 'Auspicious', icon: '✨' },
        ].map(({ label, value, icon }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '0.6rem',
            border: '1px solid rgba(255,255,255,0.04)'
          }}>
            <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.65rem', margin: '0 0 0.2rem' }}>{icon} {label}</p>
            <p style={{ color: '#e8dfc8', fontSize: '0.78rem', fontWeight: 600, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* 24-hour Vedic clock visual */}
      <h3 style={{ color: '#c9a84c', fontSize: '0.82rem', marginBottom: '0.6rem' }}>🕐 24-Hour Vedic Clock</h3>
      {DOSHA_TIMES.map((slot, i) => {
        const isActive = slot.start === currentDosha.start
        return (
          <div key={slot.dosha + i.toString()} style={{
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            padding: '0.5rem 0.7rem',
            background: isActive ? `${slot.color}12` : 'rgba(255,255,255,0.01)',
            borderRadius: 8, marginBottom: '0.3rem',
            border: isActive ? `1px solid ${slot.color}30` : '1px solid rgba(255,255,255,0.03)'
          }}>
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{slot.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: isActive ? slot.color : '#e8dfc8', fontSize: '0.75rem', fontWeight: isActive ? 700 : 400 }}>
                  {slot.dosha}
                </span>
                <span style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.68rem' }}>
                  {slot.start}:00 – {slot.end}:00
                </span>
              </div>
              {isActive && (
                <p style={{ color: 'rgba(232,223,200,0.5)', fontSize: '0.65rem', margin: '0.15rem 0 0', lineHeight: 1.4 }}>
                  {slot.description}
                </p>
              )}
            </div>
            {isActive && <div style={{ width: 6, height: 6, borderRadius: '50%', background: slot.color, flexShrink: 0 }} />}
          </div>
        )
      })}

      {/* Today's mantra */}
      {guidance.mantraForToday && (
        <div style={{
          marginTop: '1rem',
          background: 'rgba(201,168,76,0.05)',
          borderRadius: 10, padding: '0.8rem',
          border: '1px solid rgba(201,168,76,0.1)',
          textAlign: 'center'
        }}>
          <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.65rem', margin: '0 0 0.3rem' }}>Today&apos;s Mantra</p>
          <p style={{ color: '#c9a84c', fontSize: '0.78rem', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
            {guidance.mantraForToday}
          </p>
        </div>
      )}

      {/* Health advice */}
      <div style={{
        marginTop: '0.7rem',
        background: 'rgba(106,191,138,0.05)',
        borderRadius: 10, padding: '0.8rem',
        border: '1px solid rgba(106,191,138,0.1)'
      }}>
        <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.65rem', margin: '0 0 0.3rem' }}>🌿 Vedic Health Guidance Today</p>
        <p style={{ color: 'rgba(232,223,200,0.7)', fontSize: '0.73rem', margin: 0, lineHeight: 1.5 }}>
          {guidance.healthAdvice}
        </p>
      </div>
    </div>
  )
}

