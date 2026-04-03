import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — AyuraHealth',
  description: 'How AyuraHealth handles your data and protects your privacy. We collect minimal data and never sell it.',
}

const sections = [
  {
    title: '1. Who We Are',
    content: 'AyuraHealth ("we", "our", "us") is an AI-powered holistic health companion providing educational health information based on Ayurveda, Traditional Chinese Medicine, and 6 other healing traditions. We are not a medical provider.\n\nWebsite: ayurahealth.com · Based in Tokyo, Japan · Contact: privacy@ayurahealth.com',
  },
  {
    title: '2. What Data We Collect',
    content: `We collect minimal data:\n\n• Conversations: Stored only in your browser's localStorage. Never sent to or stored on our servers beyond real-time AI processing.\n• Dosha quiz results: Stored locally in your browser only.\n• Uploaded files (images, PDFs): Processed in real-time for AI analysis. Not stored on our servers.\n• Language preference: Stored locally in your browser.\n• Anonymous analytics: Page views via Vercel Analytics. No personal identifiers collected.\n• Email (optional): Only if you voluntarily subscribe to updates or contact us.\n• Payment data: Processed by Razorpay. We never see or store your card numbers.\n• Cookies: We use only a language preference cookie (ayura_lang). No advertising or tracking cookies.`,
  },
  {
    title: '3. How We Use Your Data',
    content: `• To provide AI health guidance responses\n• To personalize your experience based on your dosha type\n• To improve our service through anonymous analytics\n• To process subscription payments securely\n\nWe never sell your data. We never use your data for advertising. We never share personal information with third parties except as described in Section 4.`,
  },
  {
    title: '4. Third-Party Data Processors',
    content: `• Groq API (groq.com): Processes your messages to generate AI responses. Subject to Groq's privacy policy.\n• OpenRouter / NVIDIA Nemotron: Used for Deep Mind mode. Subject to their privacy policies.\n• Razorpay (razorpay.com): Payment processing (UPI, NetBanking, Cards, Wallets). Subject to Razorpay's privacy policy. We never store payment card data.\n• Clerk (clerk.com): Authentication for premium subscribers. Subject to Clerk's privacy policy.\n• Vercel Analytics: Anonymous usage statistics only. No personal identifiers.\n• Google Fonts: Font loading. Subject to Google's privacy policy.\n\nWe do not use Facebook Pixel, invasive tracking cookies, or advertising networks.`,
  },
  {
    title: '5. Payment Data & Security',
    content: `• Payment card numbers are never stored on our servers. All payment data is handled by Razorpay, which is PCI-DSS compliant.
• We store only the subscription tier (free/premium) associated with your account.
• Webhook events from Razorpay are verified via HMAC signatures before processing.\n• All data in transit is encrypted via HTTPS/TLS 1.3.`,
  },
  {
    title: '6. Data Storage & Retention',
    content: `• Free tier conversations: Stay in your browser's localStorage — never on our servers.\n• Premium account data: Retained while your account is active. Deleted within 30 days of account deletion request.\n• Uploaded medical documents: Processed in real-time only. Never stored.\n• Payment records: Retained as required by applicable law (typically 7 years for financial records).\n• We recommend not uploading documents with your full name, national ID, or financial information.`,
  },
  {
    title: '7. Your Rights (GDPR, PDPD, APPI & Global)',
    content: `You have the right to:\n• Access: Request what data we hold about you\n• Deletion: Clear all local data using the 🗑️ button in the app; request account deletion via email\n• Portability: Your conversation data is in your browser — you control it\n• Correction: Update your account information at any time\n• Opt-out: Unsubscribe from any emails via the unsubscribe link\n• Objection: Object to processing for marketing purposes\n\nFor requests: privacy@ayurahealth.com · Response within 30 days.`,
  },
  {
    title: "8. Children's Privacy",
    content: "AyuraHealth is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us at privacy@ayurahealth.com and we will delete it promptly.",
  },
  {
    title: '9. Cookie Policy',
    content: `We use minimal cookies:\n\n• ayura_lang (localStorage): Stores your language preference. Not a cookie — stored locally only.\n• Session: Clerk authentication session for premium users. Strictly necessary.\n• No third-party advertising cookies. No cross-site tracking.\n\nYou can clear all local data at any time by clearing your browser's localStorage or using the clear button in the app.`,
  },
  {
    title: '10. Medical Disclaimer',
    content: 'AyuraHealth provides educational information only. Nothing on this platform constitutes medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical decisions. In emergencies, contact your local emergency services immediately (110 in Japan, 112 in India, 911 in USA, 999 in UK).',
  },
  {
    title: '11. Changes to This Policy',
    content: 'We may update this policy occasionally. We will notify premium users of significant changes via email. Continued use after changes constitutes acceptance. Last updated: March 31, 2026.',
  },
  {
    title: '12. Contact Us',
    content: 'Privacy requests: privacy@ayurahealth.com\nGeneral inquiries: hello@ayurahealth.com\nLegal: legal@ayurahealth.com\n\nAyuraHealth · Tokyo, Japan',
  },
]

export default function PrivacyPolicy() {
  return (
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', fontFamily: '"DM Sans", -apple-system, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #05100a !important; }
        .section { margin-bottom: 2.5rem; padding-bottom: 2.5rem; border-bottom: 1px solid rgba(106,191,138,0.07); }
        .section:last-child { border-bottom: none; }
        a { color: #6abf8a; text-decoration: none; }
        a:hover { text-decoration: underline; }
        nav-link-hover:hover { color: #e8dfc8 !important; }
      `}</style>

      <nav style={{ background: 'rgba(5,16,10,0.94)', borderBottom: '1px solid rgba(106,191,138,0.1)', padding: '0 2rem', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(22px)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <img src="/favicon.svg" alt="AyuraHealth" width={32} height={32} style={{ display: 'block' }} />
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', fontWeight: 700, color: '#6abf8a', letterSpacing: '0.02em' }}>AyuraHealth</span>
        </Link>
        <Link href="/chat" style={{ fontSize: '0.8rem', color: 'rgba(106,191,138,0.7)', textDecoration: 'none', border: '1px solid rgba(106,191,138,0.18)', padding: '0.3rem 0.85rem', borderRadius: 20, transition: 'all 0.2s' }}>Open App →</Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: '#c9a84c', marginBottom: '0.5rem' }}>Privacy Policy</h1>
          <p style={{ color: 'rgba(232,223,200,0.3)', fontSize: '0.78rem', letterSpacing: '0.05em' }}>Last updated: March 31, 2026 · AyuraHealth, Tokyo, Japan</p>
          <p style={{ color: 'rgba(232,223,200,0.5)', fontSize: '0.9rem', lineHeight: 1.75, marginTop: '1.2rem', padding: '1rem 1.2rem', background: 'rgba(106,191,138,0.05)', borderRadius: 12, border: '1px solid rgba(106,191,138,0.1)' }}>
            Your privacy is foundational to AyuraHealth. Health data is deeply personal — we built this platform so your conversations stay in your browser, not on our servers.
          </p>
        </div>
        {sections.map((s, i) => (
          <div key={i} className="section">
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.25rem', fontWeight: 400, color: '#6abf8a', marginBottom: '0.85rem' }}>{s.title}</h2>
            <p style={{ color: 'rgba(232,223,200,0.55)', fontSize: '0.88rem', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{s.content}</p>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '1px solid rgba(106,191,138,0.07)', padding: '2rem', textAlign: 'center', marginTop: '3rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {[['Home', '/'], ['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Contact', '/contact']].map(([label, href]) => (
            <Link key={href} href={href} style={{ color: 'rgba(232,223,200,0.25)', fontSize: '0.72rem', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <p style={{ color: 'rgba(232,223,200,0.1)', fontSize: '0.7rem' }}>© 2026 AyuraHealth · Tokyo, Japan · For educational purposes only</p>
      </footer>
    </main>
  )
}
