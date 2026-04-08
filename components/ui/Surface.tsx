import { PropsWithChildren, type CSSProperties } from 'react'

type SurfaceVariant = 'default' | 'strong'

interface SurfaceProps extends PropsWithChildren {
  style?: CSSProperties
  className?: string
  variant?: SurfaceVariant
}

export default function Surface({ children, style, className, variant = 'default' }: SurfaceProps) {
  const background = variant === 'strong' ? 'var(--ios-surface-strong)' : 'var(--ios-surface)'
  return (
    <div
      className={`ios-surface${className ? ` ${className}` : ''}`}
      style={{
        background,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
