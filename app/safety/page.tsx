import Link from 'next/link'
import Logo from '../../components/Logo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Safety & Scope — AyuraHealth',
  description:
    'Understand what AyuraHealth does and does not do. Educational wellness guidance only, with clear medical safety boundaries.',
}

const sections = [
  {
    title: '1) Platform Scope',
    body: 'AyuraHealth provides educational wellness guidance inspired by Ayurveda, Traditional Chinese Medicine, and other traditional systems. It is designed for lifestyle education, habit support, and wellness awareness.',
  },
  {
    title: '2) Not Medical Advice',
    body: 'AyuraHealth does not provide diagnosis, treatment, prescriptions, or emergency care. Content is informational only and should not replace a licensed medical professional.',
  },
  {
    title: '3) When to Seek Medical Care Immediately',
    body: 'Call local emergency services or seek urgent care for chest pain, severe breathing issues, stroke symptoms, major bleeding, loss of consciousness, suicidal thoughts, severe allergic reaction, or any rapidly worsening condition.',
  },
  {
    title: '4) Responsible Use',
    body: 'Always verify recommendations with a qualified practitioner, especially if you are pregnant, breastfeeding, on medication, have chronic illness, or are planning major dietary/supplement changes.',
  },
  {
    title: '5) Data and Privacy Boundary',
    body: 'Do not upload national IDs, financial details, or unnecessary identifying information. Use only the minimum health information required for educational guidance.',
  },
]

export default function SafetyPage() {
  return (
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8' }}>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 1.2rem',
          height: 58,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(5,16,10,0.94)',
          borderBottom: '1px solid rgba(106,191,138,0.12)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <Logo size={30} showText={true} href="/" />
        <Link href="/" style={{ color: 'rgba(232,223,200,0.65)', textDecoration: 'none', fontSize: '0.84rem' }}>
          Back to Home
        </Link>
      </nav>

      <section style={{ maxWidth: 760, margin: '0 auto', padding: '3rem 1.25rem 4rem' }}>
        <h1
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 400,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: '#c9a84c',
            marginBottom: '0.8rem',
          }}
        >
          Safety & Scope
        </h1>
        <p style={{ color: 'rgba(232,223,200,0.62)', lineHeight: 1.75, marginBottom: '2rem' }}>
          AyuraHealth is built for educational wellness support. This page explains clear boundaries so users can benefit safely and responsibly.
        </p>

        {sections.map((item) => (
          <article
            key={item.title}
            style={{
              marginBottom: '1rem',
              padding: '1rem 1.1rem',
              borderRadius: 14,
              border: '1px solid rgba(106,191,138,0.14)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <h2 style={{ fontSize: '1rem', color: '#6abf8a', marginBottom: '0.45rem' }}>{item.title}</h2>
            <p style={{ color: 'rgba(232,223,200,0.62)', lineHeight: 1.7 }}>{item.body}</p>
          </article>
        ))}

        <div style={{ marginTop: '1.8rem', color: 'rgba(232,223,200,0.36)', fontSize: '0.84rem' }}>
          Last updated: April 2026
        </div>
      </section>
    </main>
  )
}
