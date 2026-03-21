import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — AyuraHealth',
  description: 'How AyuraHealth handles your data and protects your privacy. We collect minimal data and never sell it.',
}

const sections = [
  {
    title: '1. Who We Are',
    content: 'AyuraHealth ("we", "our", "us") is an AI-powered holistic health companion providing educational health information based on Ayurveda, Traditional Chinese Medicine, and 6 other healing traditions. We are not a medical provider. Website: ayurahealth.com · Based in Tokyo, Japan.',
  },
  {
    title: '2. What Data We Collect',
    content: `We collect minimal data:\n\n• Conversations: Stored only in your browser's localStorage. Never sent to or stored on our servers beyond real-time AI processing.\n• Dosha quiz results: Stored locally in your browser only.\n• Uploaded files (images, PDFs): Processed in real-time for AI analysis. Never stored on our servers.\n• Language preference: Stored locally in your browser.\n• Anonymous analytics: Page views via Vercel Analytics. No personal identifiers collected.\n• Email (optional): Only if you voluntarily contact us or sign up for updates.`,
  },
  {
    title: '3. How We Use Your Data',
    content: `• To provide AI health guidance responses\n• To personalize your experience based on your dosha type\n• To improve our service through anonymous analytics\n\nWe never sell your data. We never use your data for advertising. We never share personal information with third parties except as described below.`,
  },
  {
    title: '4. Third-Party Services',
    content: `• Groq API (groq.com): Processes your messages to generate AI responses. Subject to Groq's privacy policy.\n• OpenRouter / NVIDIA Nemotron: Used for Deep Mind mode. Subject to their privacy policies.\n• Vercel Analytics: Anonymous usage statistics only.\n• Google Fonts: Font loading. Subject to Google's privacy policy.\n\nWe do not use Facebook Pixel, invasive tracking cookies, or advertising networks.`,
  },
  {
    title: '5. Data Storage & Security',
    content: `• All conversations are stored in your browser's localStorage — never on our servers.\n• Uploaded medical documents are processed in real-time only. Never stored.\n• All data in transit is encrypted via HTTPS/TLS.\n• We recommend not uploading documents with your full name, national ID, or financial information.`,
  },
  {
    title: '6. Your Rights (GDPR & Global)',
    content: `You have the right to:\n• Access: Request what data we hold about you\n• Deletion: Clear all local data using the 🗑️ button in the app\n• Portability: Your conversation data is in your browser — you control it\n• Opt-out: Unsubscribe from any emails via the unsubscribe link\n\nFor requests: privacy@ayurahealth.com`,
  },
  {
    title: "7. Children's Privacy",
    content: "AyuraHealth is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us at privacy@ayurahealth.com.",
  },
  {
    title: '8. Medical Disclaimer',
    content: 'AyuraHealth provides educational information only. Nothing on this platform constitutes medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical decisions. In emergencies, contact your local emergency services immediately (110 in Japan, 112 in India, 911 in USA).',
  },
  {
    title: '9. Changes to This Policy',
    content: 'We may update this policy occasionally. We will notify users of significant changes via the app. Continued use after changes constitutes acceptance. Last updated: March 2026.',
  },
  {
    title: '10. Contact Us',
    content: 'Privacy questions: privacy@ayurahealth.com\nGeneral inquiries: hello@ayurahealth.com\n\nAyuraHealth · Tokyo, Japan',
  },
]

export default function PrivacyPolicy() {
  return (
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', fontFamily: '"DM Sans", -apple-system, sans-serif' }}>

  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #05100a; }
    .section { margin-bottom: 2.5rem; padding-bottom: 2.5rem; border-bottom: 1px solid rgba(106,191,138,0.07); }
    .section:last-child { border-bottom: none; }
    a { color: #6abf8a; text-decoration: none; }
    a:hover { text-decoration: underline; }
  `}</style>

      <nav style={{ background: 'rgba(5,16,10,0.95)', borderBottom: '1px solid rgba(106,191,138,0.1)', padding: '0 2rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)' }}>
        <Link href="/" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', fontWeight: 600, color: '#c9a84c', textDecoration: 'none', letterSpacing: '0.02em' }}>🌿 AyuraHealth</Link>
        <Link href="/chat" style={{ fontSize: '0.8rem', color: 'rgba(106,191,138,0.7)', textDecoration: 'none', border: '1px solid rgba(106,191,138,0.2)', padding: '0.3rem 0.8rem', borderRadius: 20, transition: 'all 0.2s' }}>Open App →</Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: '#c9a84c', marginBottom: '0.5rem' }}>Privacy Policy</h1>
          <p style={{ color: 'rgba(232,223,200,0.3)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Last updated: March 2026 · AyuraHealth, Tokyo, Japan</p>
          <p style={{ color: 'rgba(232,223,200,0.45)', fontSize: '0.9rem', lineHeight: 1.7, marginTop: '1rem', padding: '1rem', background: 'rgba(106,191,138,0.05)', borderRadius: 12, border: '1px solid rgba(106,191,138,0.1)' }}>
            Your privacy matters deeply to us. AyuraHealth is built on a simple principle: your health data belongs to you. We store conversations only in your browser — never on our servers.
          </p>
        </div>
        {sections.map((s, i) => (
          <div key={i} className="section">
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.25rem', fontWeight: 400, color: '#6abf8a', marginBottom: '0.75rem' }}>{s.title}</h2>
            <p style={{ color: 'rgba(232,223,200,0.55)', fontSize: '0.88rem', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{s.content}</p>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '1px solid rgba(106,191,138,0.08)', padding: '2rem', textAlign: 'center', marginTop: '4rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['Home', '/'], ['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['For Clinics', '/clinic'], ['Contact', '/contact']].map(([label, href]) => (
            <Link key={href} href={href} style={{ color: 'rgba(232,223,200,0.2)', fontSize: '0.72rem', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <p style={{ color: 'rgba(232,223,200,0.1)', fontSize: '0.7rem', marginTop: '1rem' }}>© 2026 AyuraHealth · Tokyo, Japan · For educational purposes only</p>
      </footer>

    </main>
  )
}
