import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — AyuraHealth',
  description: 'Terms and conditions for using AyuraHealth.',
}

export default function Terms() {
  return (
    <main style={{ minHeight: '100vh', background: '#05100a', fontFamily: '"DM Sans", system-ui, sans-serif', color: '#e8dfc8' }}>
      <header style={{ background: 'rgba(5,16,10,0.95)', borderBottom: '1px solid rgba(106,191,138,0.12)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', fontWeight: 700, color: '#c9a84c', textDecoration: 'none' }}>🌿 AyuraHealth</Link>
        <Link href="/chat" style={{ fontSize: '0.85rem', color: '#6abf8a', textDecoration: 'none' }}>Open App →</Link>
      </header>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#c9a84c', marginBottom: '0.5rem' }}>Terms of Service</h1>
        <p style={{ color: 'rgba(200,200,200,0.4)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By accessing or using AyuraHealth ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.'
          },
          {
            title: '2. Description of Service',
            content: 'AyuraHealth is an AI-powered educational platform that provides information about holistic health traditions including Ayurveda, Traditional Chinese Medicine, Homeopathy, and others. The Service is for educational purposes only.'
          },
          {
            title: '3. Medical Disclaimer — Read Carefully',
            content: `THE SERVICE IS NOT A MEDICAL DEVICE AND DOES NOT PROVIDE MEDICAL ADVICE.

AyuraHealth is not a licensed healthcare provider. Information provided by the Service:
- Is for educational and informational purposes only
- Does not constitute medical advice, diagnosis, or treatment
- Should not replace consultation with qualified healthcare professionals
- May not be accurate, complete, or up-to-date

ALWAYS SEEK PROFESSIONAL MEDICAL ADVICE for health conditions. In emergencies, call your local emergency services immediately (110 in Japan, 112 in India, 911 in US).`
          },
          {
            title: '4. User Responsibilities',
            content: `You agree to:
- Use the Service only for lawful purposes
- Not upload content that is illegal, harmful, or violates others' rights
- Not attempt to reverse engineer, hack, or abuse the Service
- Not use the Service to provide medical advice to others
- Be at least 13 years old to use the Service
- Not submit false, misleading, or fraudulent information`
          },
          {
            title: '5. Intellectual Property',
            content: 'All content, design, code, and branding of AyuraHealth is owned by AyuraHealth. The traditional medical knowledge referenced is in the public domain but our presentation, curation, and AI synthesis is proprietary. You may not copy, reproduce, or distribute our content without written permission.'
          },
          {
            title: '6. Uploaded Content',
            content: 'When you upload medical reports, images, or other documents to the Service, you grant us a temporary license to process this content solely for the purpose of generating your AI response. We do not store uploaded content on our servers beyond the duration of your session.'
          },
          {
            title: '7. Limitation of Liability',
            content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:

AyuraHealth shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to:
- Health decisions made based on information from the Service
- Inaccuracy or incompleteness of AI-generated health information
- Loss of data
- Service interruptions

Our total liability to you shall not exceed $0 (the Service is provided free of charge).`
          },
          {
            title: '8. Indemnification',
            content: 'You agree to indemnify and hold harmless AyuraHealth, its founders, and contributors from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.'
          },
          {
            title: '9. Service Availability',
            content: 'We provide the Service "as is" without warranty of any kind. We do not guarantee uptime, accuracy, or continuity of the Service. We may modify or discontinue the Service at any time without notice.'
          },
          {
            title: '10. Governing Law',
            content: 'These Terms are governed by the laws of Japan. Any disputes shall be resolved in the courts of Tokyo, Japan.'
          },
          {
            title: '11. Changes to Terms',
            content: 'We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.'
          },
          {
            title: '12. Contact',
            content: 'For questions about these Terms: legal@ayurahealth.com\n\nAyuraHealth · Tokyo, Japan'
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
          <Link href="/privacy" style={{ color: 'rgba(200,200,200,0.4)', textDecoration: 'none' }}>Privacy Policy</Link>
          {' · '}
          <Link href="/chat" style={{ color: 'rgba(200,200,200,0.4)', textDecoration: 'none' }}>Open App</Link>
        </p>
      </footer>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; }`}</style>
    </main>
  )
}
