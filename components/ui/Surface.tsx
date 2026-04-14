'use client'

import { PropsWithChildren, type CSSProperties } from 'react'
import { motion } from 'framer-motion'

type SurfaceVariant = 'default' | 'strong' | 'glass'

interface SurfaceProps extends PropsWithChildren {
  style?: CSSProperties
  className?: string
  variant?: SurfaceVariant
  delay?: number
  onClick?: () => void
}

export default function Surface({ children, style, className, variant = 'default', delay = 0, onClick }: SurfaceProps) {
  const getBaseClass = () => {
    if (variant === 'glass') return 'glass-surface'
    return 'flat-card'
  }

  const background = variant === 'strong' ? 'var(--surface-mid)' : undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`${getBaseClass()}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      style={{
        background,
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}
