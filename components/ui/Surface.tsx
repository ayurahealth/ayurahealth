import { PropsWithChildren, type CSSProperties } from 'react'

type SurfaceVariant = 'default' | 'strong'

interface SurfaceProps extends PropsWithChildren {
  style?: CSSProperties
  className?: string
  variant?: SurfaceVariant
}

export default function Surface({ children, style, className, variant = 'default' }: SurfaceProps) {
  const background = variant === 'strong' ? 'var(--surface-mid)' : 'var(--surface-low)'
  return (
    <div
      className={`flat-card${className ? ` ${className}` : ''}`}
      style={{
        background,
        border: '1px solid var(--border-low)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
