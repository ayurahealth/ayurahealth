'use client'

import React, { useMemo } from 'react'

interface VedicHealthScoreProps {
  score: number           // 0 - 100
  doshaBalance: number    // 0 - 100
  dashaInfluence: number  // 0 - 100
  sentimentScore: number  // 0 - 100
  loading?: boolean
}

/**
 * VEDIC HEALTH SCORE WIDGET
 * A premium, interactive visualization of holistic wellness.
 * Features a pulsing "Prana Lotus" and detailed scoring breakdown.
 */
export default function VedicHealthScore({ 
  score = 72, 
  doshaBalance = 80, 
  dashaInfluence = 65, 
  sentimentScore = 70,
  loading = false 
}: VedicHealthScoreProps) {
  
  const statusColor = useMemo(() => {
    if (score > 85) return 'hsl(var(--sage-accent))' // Balanced
    if (score > 60) return 'hsl(var(--gold-accent))' // Moderate
    return 'hsl(var(--gold-accent))'                // Imbalanced (using baseline gold)
  }, [score])

  const statusLabel = useMemo(() => {
    if (score > 85) return 'SAMA (Balanced)'
    if (score > 60) return 'MADHYAMA (Stable)'
    return 'VISHAMA (Imbalanced)'
  }, [score])

  return (
    <div className="premium-glass" style={{
      borderRadius: 'var(--ios-radius-xl)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      color: 'hsl(var(--gold-pale))',
      minWidth: '280px',
      border: `1px solid ${statusColor}44`
    }}>
      {/* Background Pulse */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '150px',
        height: '150px',
        background: `radial-gradient(circle, ${statusColor}22 0%, transparent 70%)`,
        filter: 'blur(30px)',
        zIndex: 0,
        animation: 'pulse 4s infinite ease-in-out'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
          <div>
            <h3 style={{ 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.15em', 
              color: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.5)',
              margin: 0
            }}>Holistic Wellness Score</h3>
            <p style={{ 
              fontSize: '0.65rem', 
              color: statusColor, 
              margin: '2px 0 0',
              fontWeight: 600
            }}>{statusLabel}</p>
          </div>
          <div style={{ 
            fontSize: '1.8rem', 
            fontWeight: 800, 
            color: statusColor,
            textShadow: `0 0 10px ${statusColor}44`
          }}>
            {loading ? '--' : score}
          </div>
        </div>

        {/* The Prana Lotus Visualization */}
        <div style={{ 
          height: '80px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="lotusGradient">
                <stop offset="0%" stopColor={statusColor} stopOpacity="0.8" />
                <stop offset="100%" stopColor={statusColor} stopOpacity="0.1" />
              </radialGradient>
            </defs>
            {/* Lotus Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <ellipse
                key={i}
                cx="50" cy="50" rx="15" ry="30"
                fill="url(#lotusGradient)"
                transform={`rotate(${angle} 50 50) translate(0, -15)`}
                style={{
                  opacity: 0.7,
                  animation: `petal-pulse ${3 + i*0.2}s infinite ease-in-out`
                }}
              />
            ))}
            {/* Core */}
            <circle cx="50" cy="50" r={8 + (score/20)} fill={statusColor} style={{ opacity: 0.8 }} />
          </svg>
        </div>

        {/* Breakdown Bars */}
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          <ScoreBar label="Physical (Dosha)" value={doshaBalance} color="hsl(var(--sage-accent))" />
          <ScoreBar label="Temporal (Dasha)" value={dashaInfluence} color="hsl(var(--gold-accent))" />
          <ScoreBar label="Emotional (Prana)" value={sentimentScore} color="hsl(var(--gold-pale))" />
        </div>

        <div style={{ 
          marginTop: '1.25rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.1)',
          fontSize: '0.74rem',
          lineHeight: 1.6,
          color: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.6)'
        }}>
          <span style={{ color: statusColor, fontWeight: 700 }}>💡 Guidance:</span> {
            score > 85 ? 'System is in peak harmony. Maintain current Dinacharya.' :
            score > 60 ? 'Minor instability detected. Focus on grounding foods and warm liquids.' :
            'Significant Vitiation. Consult VAIDYA for a corrective Panchakarma plan.'
          }
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        @keyframes petal-pulse {
          0%, 100% { transform: rotate(var(--rot)) translate(0, -15) scale(1); }
          50% { transform: rotate(var(--rot)) translate(0, -20) scale(1.1); }
        }
      `}</style>
    </div>
  )
}

function ScoreBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.68rem', color: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.5)' }}>{label}</span>
        <span style={{ fontSize: '0.68rem', color: color, fontWeight: 600 }}>{value}%</span>
      </div>
      <div style={{ 
        height: '4px', 
        background: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.1)', 
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          height: '100%', 
          width: `${value}%`, 
          background: color,
          borderRadius: '2px',
          boxShadow: `0 0 8px ${color}44`
        }} />
      </div>
    </div>
  )
}
