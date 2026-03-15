import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — AyuraHealth',
  description: 'How AyuraHealth handles your data and protects your privacy.',
}

export default function PrivacyPolicy() {
  return (
    <main style={{ minHeight: '100vh', background: '#05100a', fontFamily: '"DM Sans", system-ui, sans-serif', color: '#e8dfc8' }}>
      <header style={{ background: 'rgba(5,16,10,0.95)', borderBottom: '1px solid rgba(106,191,138,0.12)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', fontWeight: 700, color: '#c9a84c', textDecoration: 'none' }}>🌿 AyuraHealth</Link>
        <Link href="/chat" style={{ fontSize: '0.85rem', color: '#6abf8a', textDecoration: 'none' }}>Open App →</Link>
      </header>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#c9a84c', marginBottom: '0.5rem' }}>Privacy Policy</h1>
        <p style={{ color: 'rgba(200,200,200,0.4)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        {[
          {
            title: '1. Who We Are',
            content: 'AyuraHealth ("we", "our", "us") is an AI-powered holistic health companion that provides educational health information based on Ayurvedic, Traditional Chinese Medicine, and other healing traditions. We are not a medical provider. Our website is ayurahealth.vercel.app.'
          },
          {
            title: '2. What Data We Collect',
            content: `We collect minimal data to provide our service:
            
- Conversation data: Your questions and our AI responses, stored locally in your browser (localStorage) only. We do not store conversations on our servers.
- Dosha quiz results: Stored locally in your browser only.
- Uploaded files: Images, PDFs, and links you share are processed in real-time for AI analysis and are never stored on our servers.
- Usage analytics: Anonymous page views and interaction data via Vercel Analytics. No personal identifiers are collected.
- Email address: Only if you voluntarily submit it through our email capture form (Formspree). We use this only to send health tips and product updates.`
          },
          {
            title: '3. How We Use Your Data',
            content: `• To provide AI health guidance responses
- To personalize your experience based on your dosha type
- To improve our service through anonymous analytics
- To send occasional health tips if you opted in via email
            
We never sell your data. We never use your data for advertising. We never share your personal information with third parties except as described below.`
          },
          {
            title: '4. Third-Party Services',
            content: `We use these third-party services:
            
- Groq API (groq.com): Processes your messages to generate AI responses. Subject to Groq's privacy policy.
- Vercel Analytics: Anonymous usage statistics. No personal data collected.
- Formspree: Email collection if you opt in. Subject to Formspree's privacy policy.
- Google Fonts: Font loading. Subject to Google's privacy policy.
            
We do not use Facebook Pixel, invasive tracking, or advertising networks.`
          },
          {
            title: '5. Data Storage & Security',
            content: `• Conversations: Stored only in your browser's localStorage. Never sent to our servers beyond real-time processing.
- Uploaded medical documents: Processed in real-time by our AI. Never stored on our servers.
- All data in transit is encrypted via HTTPS/TLS.
- We recommend not uploading documents containing your name, national ID, or financial information.`
          },
          {
            title: '6. Your Rights (GDPR & Global)',
            content: `You have the right to:
- Access: Request what data we hold about you
- Deletion: Clear all your local data using the trash icon in the app
- Portability: Your conversation data is in your browser — you control it
- Opt-out: Unsubscribe from emails at any time via the unsubscribe link
            
For GDPR requests, contact us at: privacy@ayurahealth.com`
          },
          {
            title: '7. Children\'s Privacy',
            content: 'AyuraHealth is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us.'
          },
          {
            title: '8. Medical Disclaimer',
            content: 'AyuraHealth provides educational information only. Nothing on this platform constitutes medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical decisions. In emergencies, contact your local emergency services immediately.'
          },
          {
            title: '9. Changes to This Policy',
            content: 'We may update this policy occasionally. We will notify users of significant changes via the app. Continued use after changes constitutes acceptance.'
          },
          {
            title: '10. Contact Us',
            content: 'For privacy questions or requests: privacy@ayurahealth.com\n\nFor general inquiries: hello@ayurahealth.com'
          },
        ].map((section, i) => (
          <section key={i} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(106,191,138,0.08)' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', color: '#6abf8a', marginBottom: '0.75rem' }}>{section.title}</h2>
            <p style={{ color: 'rgba(232,223,200,0.7)', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{section.content}</p>
          </section>
        ))}
      </div>
      <footer style={{ borderTop: '1px solid rgba(106,191,138,0.08)', padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(200,200,200,0.3)', fontSize: '0.8rem' }}>
          <Link href="/" style={{ color: 'rgba(200,200,200,0.4)', textDecoration: 'none' }}>Home</Link>
          {' · '}
          <Link href="/terms" style={{ color: 'rgba(200,200,200,0.4)', textDecoration: 'none' }}>Terms of Service</Link>
          {' · '}
          <Link href="/chat" style={{ color: 'rgba(200,200,200,0.4)', textDecoration: 'none' }}>Open App</Link>
        </p>
      </footer>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; }`}</style>
    </main>
  )
}
