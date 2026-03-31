import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — AyuraHealth',
  description: 'Terms and conditions for using AyuraHealth AI holistic health companion.',
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using AyuraHealth ("the Service"), you agree to be bound by these Terms. If you do not agree, do not use the Service. These Terms are governed by the laws of Japan. Last updated: March 31, 2026.',
  },
  {
    title: '2. Description of Service',
    content: 'AyuraHealth is an AI-powered educational platform providing health information from 8 healing traditions: Ayurveda, Traditional Chinese Medicine, Tibetan Medicine, Unani, Siddha, Homeopathy, Naturopathy, and Western/Functional Medicine.\n\nThe Service includes:\n• Free tier: AI health consultations, dosha quiz, diet chart, blood report analysis\n• Premium tier: Advanced features, consultation history, export, priority support\n• Premium Plus: All Premium features + unlimited consultations, doctor consultations',
  },
  {
    title: '3. Medical Disclaimer — Read Carefully',
    content: `THE SERVICE IS NOT A MEDICAL DEVICE AND DOES NOT PROVIDE MEDICAL ADVICE.\n\nAyuraHealth is not a licensed healthcare provider. Information provided:\n• Is for educational and informational purposes only\n• Does not constitute medical advice, diagnosis, or treatment\n• Should not replace consultation with qualified healthcare professionals\n• May not be accurate, complete, or up-to-date\n\nALWAYS SEEK PROFESSIONAL MEDICAL ADVICE for health conditions.\nIN EMERGENCIES, call your local emergency services immediately:\n→ Japan: 110 (Police) / 119 (Ambulance)\n→ India: 112\n→ USA: 911\n→ UK: 999\n→ EU: 112`,
  },
  {
    title: '4. VAIDYA AI & Deep Mind',
    content: `VAIDYA is powered by multiple AI models including:\n• Groq (llama-3.3-70b-versatile) for standard responses\n• NVIDIA Nemotron 120B via OpenRouter for Deep Mind mode\n• Meta Llama 4 Scout for image/document analysis\n\nAI responses:\n• Are generated automatically and may contain errors\n• Should be verified with qualified practitioners before acting on them\n• Represent educational synthesis of traditional knowledge\n• May vary between sessions as AI models are updated\n• Are not clinical recommendations`,
  },
  {
    title: '5. User Responsibilities',
    content: `You agree to:\n• Use the Service only for lawful educational purposes\n• Not upload illegal, harmful, or privacy-violating content\n• Not use the Service to diagnose or treat others professionally without appropriate licensing\n• Be at least 13 years old (18 in some jurisdictions)\n• Not attempt to reverse engineer, hack, circumvent rate limits, or abuse the Service\n• Not manipulate payment amounts or attempt fraudulent transactions\n• Provide accurate information when creating a premium account`,
  },
  {
    title: '6. Subscription & Billing',
    content: `Premium subscriptions:\n• Auto-renew at the end of each billing cycle unless cancelled\n• Prices are enforced server-side — the displayed price is the charged price\n• USD payments processed by Stripe; INR payments by Razorpay\n• 7-day free trial on Premium and Premium Plus plans\n• Cancel anytime — no cancellation fees\n• Downgrade to Free tier at end of billing cycle upon cancellation\n\nPricing (as of March 2026):\n• Premium: $4.99/month or $47.90/year | ₹399/month or ₹3,192/year\n• Premium Plus: $9.99/month or $95.90/year | ₹799/month or ₹6,392/year`,
  },
  {
    title: '7. Refund Policy',
    content: `We offer a 30-day money-back guarantee:\n• Submit refund requests within 30 days of payment\n• Email support@ayurahealth.com with your transaction ID\n• Refunds processed within 5-10 business days to your original payment method\n• One refund per account per calendar year\n• Annual plan refunds are prorated after 30 days\n\nFree trial users who do not cancel before trial end will be charged. Trial cancellations via email to support@ayurahealth.com are honored.`,
  },
  {
    title: '8. Intellectual Property',
    content: 'All content, design, code, and branding of AyuraHealth is owned by AyuraHealth. Traditional medical knowledge referenced is in the public domain, but our AI synthesis, presentation, and curation is proprietary. You may not copy, reproduce, or distribute our content without written permission.',
  },
  {
    title: '9. Uploaded Content',
    content: 'When you upload medical reports, images, or documents, you grant us a temporary license to process this content solely for generating your AI response. We do not store uploaded content on our servers beyond the duration of your request. You represent that you have the right to upload such content.',
  },
  {
    title: '10. Security & Payment Integrity',
    content: `We implement multiple security measures:\n• All payment amounts are verified server-side\n• Webhook events are verified via HMAC-SHA256 signatures\n• Rate limiting protects against abuse (5 payment requests/minute, 20 chat requests/minute)\n• CSRF protection on all payment endpoints\n• Content Security Policy enforced on all pages\n• HSTS (HTTP Strict Transport Security) enabled\n\nAny attempt to manipulate pricing, bypass rate limits, or gain unauthorized access will result in immediate account termination and may be reported to authorities.`,
  },
  {
    title: '11. Limitation of Liability',
    content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:\n\nAyuraHealth shall not be liable for any damages arising from your use of the Service, including health decisions made based on AI information.\n\nOur total liability for paid subscriptions shall not exceed the amount paid in the 3 months prior to the claim. For free tier usage, our liability is ¥0 / $0.`,
  },
  {
    title: '12. Service Availability',
    content: 'We provide the Service "as is" without warranty. We do not guarantee uptime, accuracy, or continuity. We may modify or discontinue features at any time with reasonable notice to premium subscribers. AI availability depends on third-party API providers (Groq, OpenRouter/NVIDIA).',
  },
  {
    title: '13. Governing Law & Disputes',
    content: 'These Terms are governed by the laws of Japan. Any disputes shall first be attempted to be resolved via email negotiation. Unresolved disputes shall be submitted to the courts of Tokyo, Japan.',
  },
  {
    title: '14. Contact',
    content: 'Legal inquiries: legal@ayurahealth.com\nSupport & billing: support@ayurahealth.com\nGeneral: hello@ayurahealth.com\n\nAyuraHealth · Tokyo, Japan · March 31, 2026',
  },
]

export default function Terms() {
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
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: '#c9a84c', marginBottom: '0.5rem' }}>Terms of Service</h1>
          <p style={{ color: 'rgba(232,223,200,0.3)', fontSize: '0.78rem', letterSpacing: '0.05em' }}>Last updated: March 31, 2026 · AyuraHealth, Tokyo, Japan</p>
          <p style={{ color: 'rgba(232,223,200,0.5)', fontSize: '0.9rem', lineHeight: 1.75, marginTop: '1.2rem', padding: '1rem 1.2rem', background: 'rgba(201,168,76,0.04)', borderRadius: 12, border: '1px solid rgba(201,168,76,0.1)' }}>
            ⚠️ <strong style={{ color: '#c9a84c' }}>Please read Section 3</strong> (Medical Disclaimer) carefully before using the Service. AyuraHealth provides educational information only — not medical advice.
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
