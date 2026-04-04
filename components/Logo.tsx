'use client'
import Link from 'next/link'

import Image from 'next/image'

interface LogoProps {
  size?: number
  showText?: boolean
  href?: string
}

export default function Logo({ size = 36, showText = true, href = '/' }: LogoProps) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        textDecoration: 'none',
        transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'pointer',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      <Image
        src="/favicon.svg"
        alt="AyuraHealth"
        width={size}
        height={size}
        style={{ width: size, height: size, display: 'block', flexShrink: 0 }}
      />
      {showText && (
        <span style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: `${Math.round(size * 0.42)}px`,
          fontWeight: 700,
          color: '#6abf8a',
          letterSpacing: '0.025em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}>
          AyuraHealth
        </span>
      )}
    </Link>
  )
}
