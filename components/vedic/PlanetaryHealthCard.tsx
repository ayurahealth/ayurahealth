'use client'
import type { GrahaPosition } from '@/lib/vedic/types'
import { GRAHA_HEALTH_PROFILES } from '@/lib/vedic/jyotish-engine'

interface Props { position: GrahaPosition }

const GRAHA_EMOJI: Record<string, string> = {
  Surya: '☀️', Chandra: '🌙', Mangal: '♂', Budha: '☿',
  Guru: '♃', Shukra: '♀', Shani: '♄', Rahu: '☊', Ketu: '☋'
}

export default function PlanetaryHealthCard({ position }: Props) {
  const profile = GRAHA_HEALTH_PROFILES[position.graha]
  const status = position.isExalted ? 'exalted' : position.isDebilitated ? 'debilitated' : 'normal'
  const statusColor = status === 'exalted' ? '#6abf8a' : status === 'debilitated' ? '#ff6b6b' : 'rgba(232,223,200,0.5)'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      borderRadius: 10,
      padding: '0.6rem',
      border: `1px solid ${status === 'exalted' ? 'rgba(106,191,138,0.2)' : status === 'debilitated' ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.05)'}`,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>
        {GRAHA_EMOJI[position.graha] || '⭐'}
      </div>
      <p style={{ color: '#e8dfc8', fontSize: '0.7rem', fontWeight: 600, margin: '0 0 0.1rem' }}>
        {position.graha}
      </p>
      <p style={{ color: 'rgba(232,223,200,0.5)', fontSize: '0.62rem', margin: '0 0 0.2rem' }}>
        {position.rashi} H{position.house}
      </p>
      {status !== 'normal' && (
        <span style={{
          fontSize: '0.55rem', padding: '0.1rem 0.35rem', borderRadius: 8,
          background: status === 'exalted' ? 'rgba(106,191,138,0.1)' : 'rgba(255,107,107,0.1)',
          color: statusColor
        }}>
          {status}
        </span>
      )}
      {position.isRetrograde && (
        <span style={{
          fontSize: '0.55rem', padding: '0.1rem 0.35rem', borderRadius: 8,
          background: 'rgba(201,168,76,0.1)', color: '#c9a84c',
          marginLeft: '0.2rem'
        }}
        >
          ℞
        </span>
      )}
      <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.58rem', margin: '0.3rem 0 0', lineHeight: 1.3 }}>
        {profile.organ[0]}
      </p>
    </div>
  )
}

