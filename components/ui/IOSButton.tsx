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
  padding: '0.8rem 1.4rem',
  borderRadius: '12px',
  width: '100%',
  fontSize: '0.9rem',
  fontWeight: 600,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  border: '1px solid transparent',
}

const variants: Record<'primary' | 'secondary', CSSProperties> = {
  primary: {
    background: 'var(--accent-main)',
    color: 'var(--bg-main)',
    borderColor: 'var(--accent-main)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--text-main)',
    borderColor: 'var(--border-mid)',
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
