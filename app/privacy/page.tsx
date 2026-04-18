'use client'


import Nav from '../../components/Nav'

export default function PrivacyPolicy() {
  const sections = [
    {
      title: '1. Neural Privacy Principles',
      content: 'Ayura Intelligence Lab ("we", "our", "us") is dedicated to extreme privacy. We utilize edge-based neural processing and local storage protocols to ensure your health queries remain under your control. We do not sell research data or patient profiles.',
    },
    {
      title: '2. Sub-processors & Intelligence Partners',
      content: `To deliver high-fidelity research, we utilize the following technical partners:\n\n• Groq API: High-speed neural inference.\n• OpenRouter / NVIDIA: Large-scale reasoning synthesis.\n• Clerk: Anonymous authentication & encrypted session management.\n• Razorpay / Stripe: PCI-compliant institutional billing.\n\nAll partners are vetted for extreme data encryption at rest and in transit.`,
    },
    {
      title: '3. Data Sovereignty',
      content: 'Your clinical observations and synthesis reports are stored in your local browser environment. Ayura Intelligence does not maintain persistent health records on centralized servers without explicit institutional synchronization.',
    },
    {
      title: '4. Contact Intelligence Compliance',
      content: 'Privacy requests: privacy@ayura.ai\nAyura Intelligence Lab · Tokyo, Japan',
    },
  ]

  return (
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)' }}>
      <Nav showLangPicker={false} />

      <div style={{ padding: '8rem 2rem 4rem', textAlign: 'center', background: 'var(--surface-low)', borderBottom: '1px solid var(--border-mid)' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.03em' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Protocol v1.1 · Updated April 2026</p>
      </div>

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ marginBottom: '4rem', padding: '2rem', background: 'var(--surface-mid)', border: '1px solid var(--border-high)', borderRadius: '24px' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-main)', textAlign: 'center' }}>
            &quot;Your intelligence is your own. We focus on neural synthesis, not data harvesting.&quot;
          </p>
        </div>

        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--border-low)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-main)', marginBottom: '1.5rem' }}>{s.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{s.content}</p>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '1px solid var(--border-low)', padding: '5rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© 2026 Ayura Intelligence Lab · Private Neural Processing Enabled</p>
      </footer>
    </main>
  )
}
