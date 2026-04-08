import { type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'

interface IOSButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  style?: CSSProperties
  className?: string
}

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
  padding: '0.9rem 1.2rem',
  borderRadius: 999,
  width: '100%',
  fontSize: '0.95rem',
  fontWeight: 600,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 0.22s ease',
  border: '1px solid transparent',
}

const variants: Record<'primary' | 'secondary', CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #1a4d2e, #2d7a45)',
    color: 'var(--ios-text)',
    borderColor: 'rgba(106,191,138,0.34)',
    boxShadow: 'var(--ios-shadow-md)',
  },
  secondary: {
    background: 'rgba(255,255,255,0.02)',
    color: 'rgba(232,223,200,0.8)',
    borderColor: 'var(--ios-stroke)',
  },
}

export default function IOSButton({ children, href, onClick, variant = 'primary', style, className }: IOSButtonProps) {
  const merged = { ...baseStyle, ...variants[variant], ...style }
  if (href) {
    return (
      <Link href={href} className={className} style={merged}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={className} style={merged}>
      {children}
    </button>
  )
}
