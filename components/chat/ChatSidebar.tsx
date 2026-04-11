'use client'

import SystemCard from '../ui/SystemCard'
import { traditionIcons } from '../TraditionIcons'

import VedicHealthScore from '../vedic/VedicHealthScore'

interface MedicineSystem {
  id: string
  label: string
  icon: string
}

interface ChatSidebarProps {
  systems: MedicineSystem[]
  selectedSystems: string[]
  onToggleSystem: (id: string) => void
  systemDetail: Record<string, string>
  messagesCount: number
  incognito: boolean
  // Vedic Score Data
  healthScore?: number
  doshaBalance?: number
  dashaInfluence?: number
  sentimentScore?: number
}

export default function ChatSidebar({
  systems,
  selectedSystems,
  onToggleSystem,
  systemDetail,
  messagesCount,
  incognito,
  healthScore = 72,
  doshaBalance = 80,
  dashaInfluence = 65,
  sentimentScore = 70
}: ChatSidebarProps) {
  return (
    <aside className="liquid-glass ios-surface chat-sidebar" style={{ 
      padding: '0.9rem', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1rem',
      background: 'hsla(var(--sage-deep-h), var(--sage-deep-s), var(--sage-deep-l), 0.8)',
      borderRight: '1px solid hsla(var(--gold-accent-h), var(--gold-accent-s), var(--gold-accent-l), 0.1)'
    }}>
      <VedicHealthScore 
        score={healthScore}
        doshaBalance={doshaBalance}
        dashaInfluence={dashaInfluence}
        sentimentScore={sentimentScore}
      />
      <div style={{ 
        fontSize: '0.68rem', 
        color: 'hsl(var(--gold-accent))', 
        fontWeight: 700, 
        letterSpacing: '0.08em', 
        textTransform: 'uppercase', 
        marginBottom: '0.6rem' 
      }}>
        Consultation Systems
      </div>
      <div className="chat-system-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.45rem' }}>
        {systems.map((sys) => {
          const active = selectedSystems.includes(sys.id)
          return (
            <SystemCard
              key={sys.id}
              label={sys.label}
              icon={traditionIcons[sys.icon as keyof typeof traditionIcons]}
              active={active}
              onClick={() => onToggleSystem(sys.id)}
            />
          )
        })}
      </div>
      <div style={{ 
        marginTop: 8, 
        fontSize: '0.68rem', 
        color: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.4)' 
      }}>
        Selected: {selectedSystems.length}/3
      </div>
      {!incognito && messagesCount > 1 && (
        <div style={{ 
          marginTop: 6, 
          textAlign: 'right', 
          fontSize: '0.63rem', 
          color: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.3)' 
        }}>💾 auto-saved</div>
      )}
      {selectedSystems.length > 0 && (
        <div className="ios-surface premium-glass" style={{ 
          marginTop: '0.8rem', 
          padding: '0.7rem 0.8rem', 
          borderRadius: 14, 
          fontSize: '0.77rem', 
          color: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.8)',
          border: '1px solid hsla(var(--gold-accent-h), var(--gold-accent-s), var(--gold-accent-l), 0.1)'
        }}>
          <span style={{ color: 'hsl(var(--sage-accent))', fontWeight: 700 }}>Active:</span>{' '}
          {selectedSystems.map((id) => systems.find((s) => s.id === id)?.label || id).join(', ')}
          <div style={{ 
            marginTop: 4, 
            color: 'hsla(var(--gold-pale-h), var(--gold-pale-s), var(--gold-pale-l), 0.5)' 
          }}>
            {selectedSystems.length === 1 ? systemDetail[selectedSystems[0]] : 'Combined synthesis from selected systems only.'}
          </div>
        </div>
      )}
    </aside>
  )
}

