'use client'

import { type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface IOSButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive'
  style?: CSSProperties
  className?: string
  disabled?: boolean
}

export default function IOSButton({ children, href, onClick, variant = 'primary', style, className, disabled }: IOSButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary': return 'btn-secondary'
      case 'accent': return 'btn-accent'
      case 'destructive': return 'btn-destructive'
      default: return 'btn-primary'
    }
  }

  const commonProps = {
    whileTap: { scale: 0.97 },
    transition: { duration: 0.1 },
    style: { ...style, opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? 'none' as const : 'auto' as const },
    className: `${getVariantStyles()}${className ? ` ${className}` : ''}`
  }

  if (href) {
    return (
      <motion.div {...commonProps} style={{ display: 'inline-block', width: '100%', ...commonProps.style }}>
        <Link href={href} style={{ textDecoration: 'none', display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', color: 'inherit' }}>
          {children}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button 
      {...commonProps} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
