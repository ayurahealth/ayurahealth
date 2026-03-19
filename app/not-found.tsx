import Link from 'next/link'
export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#05100a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
      <div style={{ fontSize: '3rem' }}>🌿</div>
      <h2 style={{ color: '#c9a84c', fontSize: '1.5rem', fontFamily: '"Cormorant Garamond", serif' }}>Page not found</h2>
      <p style={{ color: 'rgba(200,200,200,0.5)', fontSize: '0.9rem', textAlign: 'center' }}>This page doesn't exist in VAIDYA's library.</p>
      <Link href="/" style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #2d5a1b, #3d7a28)', color: '#f0e6c8', borderRadius: 12, fontSize: '1rem', textDecoration: 'none', fontFamily: 'Georgia, serif' }}>Return home →</Link>
    </div>
  )
}
