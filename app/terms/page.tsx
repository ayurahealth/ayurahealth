'use client'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '../../components/Nav'

export default function Terms() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing or using Ayura Intelligence Lab ("the Service"), you agree to be bound by these Terms of Unity. If you do not agree, do not initialize the Service. These Terms are governed by the laws of Japan. Last updated: April 15, 2026.',
    },
    {
      title: '2. Description of Intelligence Service',
      content: 'Ayura Intelligence is a high-fidelity neural synthesis platform providing research-grade information from 8 classical healing traditions: Ayurveda, Traditional Chinese Medicine, Tibetan Medicine, Unani, Siddha, Homeopathy, Naturopathy, and Western Functional Medicine.\n\nThe Service includes:\n• Research Lab: AI health consultations, dosha quiz, diet chart, blood report analysis\n• Intelligence Console: Advanced features, consultation history, export, priority support\n• Institutional Suite: Global network access, hospital integration, dedicated manager',
    },
    {
      title: '3. Intelligence Disclaimer — Read Carefully',
      content: `THE SERVICE IS NOT A MEDICAL DEVICE AND DOES NOT PROVIDE MEDICAL ADVICE.\n\nAyura Intelligence is a research organization, not a licensed healthcare provider. Information provided:\n• Is for educational and informational research purposes only\n• Does not constitute medical advice, diagnosis, or treatment\n• Should not replace consultation with qualified healthcare professionals\n• Is synthesized by statistical neural networks and may vary in accuracy\n\nALWAYS SEEK PROFESSIONAL MEDICAL ADVICE for health conditions.\nIN EMERGENCIES, call your local emergency services immediately.`,
    },
    {
      title: '4. Neural Synthesis Protocol',
      content: `Platform intelligence is powered by multi-provider neural architectures including NVIDIA Nemotron, Llama 3.3, and proprietary synthesis layers.\n\nResearch outputs:\n• Are generated autonomously and may contain hallucinations\n• Represent a technical synthesis of public-domain classical knowledge\n• Are not clinical recommendations or definitive protocols`,
    },
    {
      title: '5. Institutional Integrity',
      content: `You agree to:\n• Use the Service only for lawful research purposes\n• Not attempt to reverse engineer neural logic or bypass rate limits\n• Protect the integrity of the platform by providing accurate data\n• Be at least 18 years old or supervised by a legal guardian`,
    },
    {
      title: '6. Subscription Architecture',
      content: `Access tiers auto-renew unless cancelled through the Intelligence Console.\n\nPricing:\n• Intelligence Console: $99/month\n• Institutional Suite: Custom Quote\n\nAll payments are processed via verified encrypted providers.`,
    },
    {
      title: '7. Intellectual Property',
      content: 'All design systems, neural logic, and branding are the property of Ayura Intelligence Lab. You may not reproduce or replicate our synthesis methodology without prior written authorization.',
    },
    {
      title: '8. Governing Law',
      content: 'These Terms are governed by the laws of Japan. Disputes shall be resolved via arbitration in Tokyo, Japan.',
    },
    {
      title: '9. Organization Contact',
      content: 'Legal: legal@ayura.ai\nSupport: support@ayura.ai\nAyura Intelligence Lab · Tokyo, Japan',
    },
  ]

  return (
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)' }}>
      <style>{`
        .section { margin-bottom: 3rem; padding-bottom: 3rem; border-bottom: 1px solid var(--border-low); }
        .section:last-child { border-bottom: none; }
        .legal-header { padding: 8rem 2rem 4rem; text-align: center; border-bottom: 1px solid var(--border-mid); background: var(--surface-low); }
      `}</style>

      <Nav showLangPicker={false} />

      <div className="legal-header">
        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.03em' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Ayura Intelligence Lab · Global Standards v1.1</p>
      </div>

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ marginBottom: '4rem', padding: '2rem', background: 'hsla(var(--accent-secondary-hsl), 0.05)', border: '1px solid var(--border-high)', borderRadius: '24px' }}>
          <p style={{ color: 'var(--accent-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 8, height: 8, background: 'currentColor', borderRadius: '50%' }} /> Critical Notice
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
            Please read **Section 3 (Intelligence Disclaimer)** carefully. Ayura Intelligence provides research-grade synthesis for educational curiosity only — not clinical diagnosis.
          </p>
        </div>

        {sections.map((s, i) => (
          <div key={i} className="section">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-main)', marginBottom: '1.5rem' }}>{s.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{s.content}</p>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '1px solid var(--border-low)', padding: '5rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>© 2026 Ayura Intelligence Lab · Tokyo, Japan</p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          {['Research Integrity', 'Compliance', 'Intelligence Protocol'].map((l) => (
            <span key={l} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', opacity: 0.4 }}>{l}</span>
          ))}
        </div>
      </footer>
    </main>
  )
}
