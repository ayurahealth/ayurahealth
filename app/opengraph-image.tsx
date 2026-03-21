import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AyuraHealth — Ancient Wisdom, Modern AI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '1200px', height: '630px', background: '#05100a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>

        {/* Background glow */}
        <div style={{ position: 'absolute', top: '50%', left: '35%', transform: 'translate(-50%,-50%)', width: '600px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(45,90,27,0.3) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', top: '30%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 70%)', display: 'flex' }} />

        {/* Border */}
        <div style={{ position: 'absolute', inset: '20px', border: '1px solid rgba(106,191,138,0.1)', borderRadius: '20px', display: 'flex' }} />

        {/* Left — decorative neem leaf pattern */}
        <div style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', fontSize: '280px', opacity: 0.06, display: 'flex', lineHeight: 1 }}>🌿</div>
        <div style={{ position: 'absolute', left: '60px', top: '10%', fontSize: '80px', opacity: 0.08, display: 'flex', transform: 'rotate(-20deg)' }}>🌿</div>
        <div style={{ position: 'absolute', left: '20px', bottom: '10%', fontSize: '60px', opacity: 0.06, display: 'flex', transform: 'rotate(15deg)' }}>🌿</div>

        {/* Right content */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '700px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 72px' }}>

          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <span style={{ fontSize: '36px', display: 'flex' }}>🌿</span>
            <span style={{ fontSize: '24px', color: '#c9a84c', fontWeight: 600, letterSpacing: '0.04em' }}>AyuraHealth</span>
          </div>

          {/* Badge */}
          <div style={{ display: 'flex', marginBottom: '24px', background: 'rgba(106,191,138,0.08)', border: '1px solid rgba(106,191,138,0.2)', borderRadius: '100px', padding: '6px 18px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(106,191,138,0.9)', letterSpacing: '0.08em' }}>VAIDYA Deep Mind · 8 Healing Traditions · Free</span>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
            <span style={{ fontSize: '68px', fontWeight: 300, lineHeight: 1.0, color: '#e8dfc8' }}>Ancient</span>
            <span style={{ fontSize: '68px', fontWeight: 300, lineHeight: 1.0, color: '#c9a84c' }}>Wisdom.</span>
            <span style={{ fontSize: '68px', fontWeight: 300, lineHeight: 1.0, color: '#6abf8a' }}>Modern AI.</span>
          </div>

          {/* Description */}
          <div style={{ fontSize: '19px', color: 'rgba(232,223,200,0.35)', lineHeight: 1.5, marginBottom: '36px', display: 'flex' }}>
            Ayurveda · TCM · Tibetan · Unani · Siddha · Homeopathy
          </div>

          {/* URL */}
          <div style={{ background: 'rgba(45,90,27,0.5)', border: '1px solid rgba(106,191,138,0.25)', borderRadius: '100px', padding: '12px 28px', display: 'flex' }}>
            <span style={{ color: '#e8dfc8', fontSize: '18px' }}>ayurahealth.com</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
