import Link from 'next/link'

export default function LandingPage() {
  return (
    <main style={{ fontFamily: 'Georgia, serif', background: '#faf8f2', minHeight: '100vh' }}>

      {/* Header */}
      <header style={{
        background: '#2d5a1b', padding: '0.9rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}>
        <div>
          <span style={{ color: '#f0e6c8', fontSize: '1.3rem', fontWeight: 700 }}>🌿 AyuraHealth</span>
        </div>
        <Link href="/chat" style={{
          background: '#f0e6c8', color: '#2d5a1b',
          padding: '0.5rem 1.2rem', borderRadius: 20,
          fontSize: '0.85rem', fontWeight: 700,
          textDecoration: 'none',
        }}>
          Try Free →
        </Link>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth: 720, margin: '0 auto',
        padding: '4rem 1.5rem 3rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>🌿</div>
        <h1 style={{
          color: '#2d5a1b', fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem',
        }}>
          Ancient Wisdom,<br />Modern AI
        </h1>
        <p style={{
          color: '#5a7a4a', fontSize: '1.15rem',
          lineHeight: 1.7, marginBottom: '2rem', maxWidth: 560, margin: '0 auto 2rem',
        }}>
          Your personal holistic health companion — combining Ayurveda, Chinese Medicine,
          Homeopathy, and 5 more healing traditions into one intelligent AI.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/chat" style={{
            background: '#2d5a1b', color: '#f0e6c8',
            padding: '0.9rem 2rem', borderRadius: 14,
            fontSize: '1rem', fontWeight: 700, textDecoration: 'none',
            display: 'inline-block',
          }}>
            Discover Your Dosha →
          </Link>
          <Link href="/chat" style={{
            background: 'transparent', color: '#2d5a1b',
            padding: '0.9rem 2rem', borderRadius: 14,
            fontSize: '1rem', border: '1.5px solid #2d5a1b',
            textDecoration: 'none', display: 'inline-block',
          }}>
            Start Consulting
          </Link>
        </div>
        <p style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '1rem' }}>
          Free to use · No account required · Private by default
        </p>
      </section>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #e0ddd0', maxWidth: 720, margin: '0 auto' }} />

      {/* 8 Traditions */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', color: '#2d5a1b', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          8 Healing Traditions, One Platform
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7a5a', fontSize: '0.95rem', marginBottom: '2rem' }}>
          No other platform combines this depth of holistic knowledge with AI
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.75rem',
        }}>
          {[
            { emoji: '🌿', name: 'Ayurveda', desc: 'India · 5,000 years' },
            { emoji: '☯️', name: 'Chinese Medicine', desc: 'China · 3,000 years' },
            { emoji: '💧', name: 'Homeopathy', desc: 'Germany · 230 years' },
            { emoji: '💊', name: 'Western Medicine', desc: 'Evidence-based' },
            { emoji: '🌱', name: 'Naturopathy', desc: 'Nature as healer' },
            { emoji: '🌙', name: 'Unani', desc: 'Greco-Arabic · 900 years' },
            { emoji: '✨', name: 'Siddha', desc: 'Tamil Nadu · Ancient' },
            { emoji: '🏔️', name: 'Tibetan Medicine', desc: 'Sowa Rigpa · 2,500 years' },
          ].map((t, i) => (
            <div key={i} style={{
              background: '#fff',
              border: '1px solid #e0ddd0',
              borderRadius: 14, padding: '1rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{t.emoji}</div>
              <div style={{ color: '#2d5a1b', fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
              <div style={{ color: '#aaa', fontSize: '0.75rem', marginTop: '0.2rem' }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#f0f7ec', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#2d5a1b', fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>
            How It Works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { step: '1', emoji: '🧬', title: 'Discover your dosha', desc: 'Take our 5-question Ayurvedic quiz to identify your Vata, Pitta, or Kapha constitution.' },
              { step: '2', emoji: '🎯', title: 'Get personalized guidance', desc: 'The AI tailors every recommendation to your unique constitution and selected traditions.' },
              { step: '3', emoji: '🌏', title: 'Explore multiple traditions', desc: 'Toggle between Ayurveda, TCM, Homeopathy and more to see how different traditions approach your concern.' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
                background: '#fff', borderRadius: 14,
                border: '1px solid #e0ddd0', padding: '1.25rem',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: '#2d5a1b', color: '#f0e6c8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1rem', flexShrink: 0,
                }}>
                  {item.step}
                </div>
                <div>
                  <div style={{ color: '#2d5a1b', fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>
                    {item.emoji} {item.title}
                  </div>
                  <div style={{ color: '#6b7a5a', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you can ask */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', color: '#2d5a1b', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          What People Ask AyuraHealth
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7a5a', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Real questions, answered from multiple healing traditions
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {[
            'What herbs help with stress and anxiety?',
            'How can I improve my digestion naturally?',
            'What does Ayurveda say about sleep?',
            'Natural remedies for headaches?',
            'How do I balance Pitta dosha?',
            'What foods should I avoid for my body type?',
            'TCM approach to managing fatigue',
            'Natural ways to boost immunity this winter',
          ].map((q, i) => (
            <Link key={i} href="/chat" style={{
              display: 'block',
              background: '#fff', border: '1px solid #e0ddd0',
              borderRadius: 12, padding: '0.85rem 1rem',
              color: '#3a5a2a', fontSize: '0.875rem',
              lineHeight: 1.5, textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}>
              "{q}"
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: '#2d5a1b', padding: '3.5rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌿</div>
        <h2 style={{ color: '#f0e6c8', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Start Your Holistic Health Journey
        </h2>
        <p style={{ color: '#a8c5a0', fontSize: '1rem', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
          Free to use. No account needed. Personalized to your unique constitution in 2 minutes.
        </p>
        <Link href="/chat" style={{
          background: '#f0e6c8', color: '#2d5a1b',
          padding: '1rem 2.5rem', borderRadius: 14,
          fontSize: '1.05rem', fontWeight: 700,
          textDecoration: 'none', display: 'inline-block',
        }}>
          Take the Dosha Quiz — Free →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1e3d12', padding: '1.5rem',
        textAlign: 'center',
      }}>
        <p style={{ color: '#6a8a5a', fontSize: '0.8rem', margin: 0 }}>
          🌿 AyuraHealth · For educational purposes only · Not a substitute for professional medical advice
        </p>
        <p style={{ color: '#4a6a3a', fontSize: '0.75rem', marginTop: '0.4rem' }}>
          Built with ancient wisdom &amp; modern AI
        </p>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <a href="/privacy" style={{ color: '#4a6a3a', fontSize: '0.75rem', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: '#4a6a3a', fontSize: '0.75rem', textDecoration: 'none' }}>Terms of Service</a>
          <a href="mailto:hello@ayurahealth.com" style={{ color: '#4a6a3a', fontSize: '0.75rem', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>

    </main>
  )
}
