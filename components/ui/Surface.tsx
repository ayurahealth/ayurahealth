'use client'

import { PropsWithChildren, type CSSProperties } from 'react'
import { motion } from 'framer-motion'

type SurfaceVariant = 'default' | 'strong' | 'glass' | 'ultra' | 'thin' | 'thick' | 'accent'

interface SurfaceProps extends PropsWithChildren {
  style?: CSSProperties
  className?: string
  variant?: SurfaceVariant
  delay?: number
  onClick?: () => void
}

export default function Surface({ children, style, className, variant = 'default', delay = 0, onClick }: SurfaceProps) {
  const getBaseClass = () => {
    switch (variant) {
      case 'glass':  return 'ios-glass'
      case 'ultra':  return 'ios-glass-ultra'
      case 'thin':   return 'ios-glass-thin'
      case 'thick':  return 'ios-glass-thick'
      case 'accent': return 'ios-glass-accent'
      case 'strong': return 'flat-card'
      default:       return 'ios-glass-thin'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`${getBaseClass()} ios-glass-mirror ios-glass-shimmer${className ? ` ${className}` : ''}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </motion.div>
  )
}
