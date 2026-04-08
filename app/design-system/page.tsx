'use client'

import Logo from '../../components/Logo'
import Surface from '../../components/ui/Surface'
import IOSButton from '../../components/ui/IOSButton'
import SystemCard from '../../components/ui/SystemCard'
import { traditionIcons } from '../../components/TraditionIcons'

const systems = [
  { id: 'ayurveda', label: 'Ayurveda', icon: 'ayurveda' },
  { id: 'tcm', label: 'TCM', icon: 'tcm' },
  { id: 'western', label: 'Western', icon: 'western' },
]

export default function DesignSystemPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--ios-bg)', color: 'var(--ios-text)', padding: '1.2rem' }}>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Logo size={34} showText={true} href="/" />
        </div>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.1rem', marginBottom: '0.25rem' }}>Design System Preview</h1>
        <p className="ios-muted" style={{ marginBottom: '1.2rem' }}>AyuraHealth iOS-inspired tokens and components</p>

        <Surface style={{ padding: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Buttons</h2>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <IOSButton style={{ width: 'auto' }}>Primary Action</IOSButton>
            <IOSButton variant="secondary" style={{ width: 'auto' }}>Secondary Action</IOSButton>
          </div>
        </Surface>

        <Surface variant="strong" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>System Cards</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '0.6rem' }}>
            {systems.map((s, idx) => (
              <SystemCard
                key={s.id}
                label={s.label}
                icon={traditionIcons[s.icon]}
                active={idx === 0}
                onClick={() => undefined}
              />
            ))}
          </div>
        </Surface>

        <Surface style={{ padding: '1rem' }}>
          <h2 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Tokens</h2>
          <div className="ios-muted" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
            Primary: <span style={{ color: 'var(--ios-primary)' }}>#6abf8a</span> · Accent: <span style={{ color: 'var(--ios-accent)' }}>#c9a84c</span> · Surface: <span>glass blur</span>
          </div>
        </Surface>
      </div>
    </main>
  )
}
