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
        gap: '0.65rem',
        textDecoration: 'none',
        transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'pointer',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {/* ── Logo Icon: Premium Neural Leaf with Mirror Glass Effect ── */}
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: Math.round(size * 0.22) + 'px',
          overflow: 'hidden',
          boxShadow: [
            `0 ${Math.round(size * 0.06)}px ${Math.round(size * 0.2)}px rgba(0,0,0,0.5)`,
            `0 0 ${Math.round(size * 0.28)}px hsla(144,18%,60%,0.15)`,
            `inset 0 1px 0 rgba(255,255,255,0.18)`,
          ].join(', '),
        }}
      >
        <Image
          src="/favicon.svg"
          alt="Ayura Intelligence"
          width={size}
          height={size}
          style={{ width: size, height: size, display: 'block' }}
          priority
        />
        {/* Specular mirror highlight — top edge glint (Apple glass effect) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: 'inherit',
          }}
        />
        {/* Bottom mirror reflection — faint inverted glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
            background:
              'linear-gradient(0deg, hsla(144,18%,60%,0.10) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Brand Text ── */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.05em', lineHeight: 1 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: `${Math.round(size * 0.42)}px`,
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
            }}
          >
            Ayura
            <span
              style={{
                color: 'var(--accent-main)',
                marginLeft: '0.2em',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              Intelligence
            </span>
          </span>
        </div>
      )}
    </Link>
  )
}
