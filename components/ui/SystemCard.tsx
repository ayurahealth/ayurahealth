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
      className={`ios-chip${active ? ' active' : ''}`}
      style={{
        padding: '0.55rem 0.45rem',
        borderRadius: 12,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.28rem',
        minHeight: 62,
        boxShadow: active ? 'var(--ios-shadow-md)' : 'none',
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
