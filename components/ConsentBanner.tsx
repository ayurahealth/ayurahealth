'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ConsentBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('ayura_consent_v1')
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('ayura_intel_consent_v1', 'accepted')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 2rem)',
      maxWidth: '600px',
      background: 'rgba(5, 16, 10, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(106, 191, 138, 0.2)',
      borderRadius: '24px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.5rem',
      zIndex: 1000,
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
      animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
      
      <div style={{ flex: 1 }}>
        <p style={{ color: '#e8dfc8', fontSize: '0.85rem', lineHeight: 1.5, opacity: 0.8 }}>
          By using Ayura Intelligence, you agree to our <Link href="/privacy" style={{ color: 'var(--accent-main)', textDecoration: 'none', borderBottom: '1px solid hsla(var(--accent-main-hsl), 0.3)' }}>Privacy Policy</Link> and <Link href="/terms" style={{ color: 'var(--accent-main)', textDecoration: 'none', borderBottom: '1px solid hsla(var(--accent-main-hsl), 0.3)' }}>Terms of Service</Link>. We use cookies to enhance your experience.
        </p>
      </div>

      <button 
        onClick={accept}
        style={{
          background: '#6abf8a',
          color: '#05100a',
          border: 'none',
          padding: '0.6rem 1.25rem',
          borderRadius: '99px',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'transform 0.2s, background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#81d4a0'; e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#6abf8a'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        I Accept
      </button>
    </div>
  )
}
