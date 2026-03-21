import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AyuraHealth — Ancient Wisdom, Modern AI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#05100a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Background circles */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(45,90,27,0.25) 0%, transparent 70%)', display: 'flex' }} />

        {/* Border */}
        <div style={{ position: 'absolute', inset: '24px', border: '1px solid rgba(106,191,138,0.12)', borderRadius: '24px', display: 'flex' }} />

        {/* Top badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', background: 'rgba(106,191,138,0.08)', border: '1px solid rgba(106,191,138,0.2)', borderRadius: '100px', padding: '6px 20px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(106,191,138,0.8)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>NVIDIA Nemotron · 8 Traditions · Free</span>
        </div>

        {/* Logo */}
        <div style={{ fontSize: '64px', marginBottom: '16px', display: 'flex' }}>🌿</div>

        {/* Title */}
        <div style={{ fontSize: '80px', fontWeight: 300, lineHeight: 1.05, textAlign: 'center', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#e8dfc8' }}>Ancient Wisdom.</span>
          <span style={{ color: '#c9a84c' }}>Modern AI.</span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: '24px', color: 'rgba(232,223,200,0.45)', textAlign: 'center', maxWidth: '700px', lineHeight: 1.5, marginBottom: '40px', display: 'flex' }}>
          Ayurveda · Chinese Medicine · Tibetan · Unani · Siddha · Homeopathy · Naturopathy · Western
        </div>

        {/* CTA pill */}
        <div style={{ background: 'linear-gradient(135deg, #2d5a1b, #3d7a28)', borderRadius: '100px', padding: '14px 36px', display: 'flex' }}>
          <span style={{ color: '#e8dfc8', fontSize: '20px', fontWeight: 500 }}>ayurahealth.vercel.app</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
