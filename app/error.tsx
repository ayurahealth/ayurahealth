'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Error handling - not logged to console for security
  }, [error])
  
  return (
    <div style={{ minHeight: '100vh', background: '#05100a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
      <div style={{ fontSize: '3rem' }}>🌿</div>
      <h2 style={{ color: '#c9a84c', fontSize: '1.5rem', fontFamily: '"Cormorant Garamond", serif', textAlign: 'center' }}>VAIDYA encountered an issue</h2>
      <p style={{ color: 'rgba(200,200,200,0.5)', fontSize: '0.9rem', textAlign: 'center', maxWidth: 400, lineHeight: 1.6 }}>Something went wrong. This has been noted and will be fixed. Please try again.</p>
      <button onClick={reset} style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #2d5a1b, #3d7a28)', color: '#f0e6c8', border: 'none', borderRadius: 12, fontSize: '1rem', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
        Try again →
      </button>
      <a href="/" style={{ color: 'rgba(200,200,200,0.3)', fontSize: '0.8rem', textDecoration: 'none' }}>← Back to home</a>
    </div>
  )
}
