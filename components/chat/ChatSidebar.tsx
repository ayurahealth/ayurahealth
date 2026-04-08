'use client'

import SystemCard from '../ui/SystemCard'
import { traditionIcons } from '../TraditionIcons'

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
}

export default function ChatSidebar({
  systems,
  selectedSystems,
  onToggleSystem,
  systemDetail,
  messagesCount,
  incognito,
}: ChatSidebarProps) {
  return (
    <aside className="liquid-glass ios-surface chat-sidebar" style={{ padding: '0.9rem' }}>
      <div style={{ fontSize: '0.68rem', color: '#c9a84c', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
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
      <div style={{ marginTop: 8, fontSize: '0.68rem', color: 'rgba(200,200,200,0.4)' }}>
        Selected: {selectedSystems.length}/3
      </div>
      {!incognito && messagesCount > 1 && (
        <div style={{ marginTop: 6, textAlign: 'right', fontSize: '0.63rem', color: 'rgba(200,200,200,0.3)' }}>💾 auto-saved</div>
      )}
      {selectedSystems.length > 0 && (
        <div className="ios-surface" style={{ marginTop: '0.8rem', padding: '0.7rem 0.8rem', borderRadius: 14, boxShadow: 'none', fontSize: '0.77rem', color: 'rgba(232,223,200,0.8)' }}>
          <span style={{ color: '#6abf8a', fontWeight: 700 }}>Active:</span>{' '}
          {selectedSystems.map((id) => systems.find((s) => s.id === id)?.label || id).join(', ')}
          <div style={{ marginTop: 4, color: 'rgba(232,223,200,0.5)' }}>
            {selectedSystems.length === 1 ? systemDetail[selectedSystems[0]] : 'Combined synthesis from selected systems only.'}
          </div>
        </div>
      )}
    </aside>
  )
}
