import { type CSSProperties, type ReactNode } from 'react'

interface SystemCardProps {
  label: string
  icon: ReactNode
  active: boolean
  onClick: () => void
  style?: CSSProperties
}

export default function SystemCard({ label, icon, active, onClick, style }: SystemCardProps) {
  return (
    <button
      onClick={onClick}
      className={`ios-chip${active ? ' active premium-glass' : ''}`}
      style={{
        padding: '0.65rem 0.5rem',
        borderRadius: 'var(--ios-radius-lg)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.35rem',
        minHeight: 68,
        transition: 'all 0.3s var(--ios-ease-standard)',
        ...style,
      }}
    >
      <span style={{ width: 16, height: 16, color: active ? 'var(--ios-primary)' : 'rgba(232,223,200,0.5)' }}>
        {icon}
      </span>
      <span style={{ fontSize: '0.66rem', fontWeight: active ? 700 : 500, lineHeight: 1.1 }}>{label}</span>
    </button>
  )
}
