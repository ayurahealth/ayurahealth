'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

type Lang = 'en' | 'ja' | 'hi'

const T = {
  en: {
    cta: 'Begin Your Journey',
    sub: 'The AI that unifies Ayurveda, Chinese Medicine, and 6 more ancient healing traditions.',
    free: 'Free · No account required · Private by default',
    traditions: '8 Healing Traditions',
    how: 'How VAIDYA Works',
    step1t: 'Discover Your Constitution',
    step1d: 'A 5-question assessment reveals your Vata, Pitta, or Kapha type — drawn from 5,000 years of Ayurvedic wisdom.',
    step2t: 'VAIDYA Consults',
    step2d: 'Cross-references all 8 traditions simultaneously. Cites Charaka Samhita, Huangdi Neijing, and other classical texts.',
    step3t: 'Deep Mind Mode',
    step3d: 'Powered by NVIDIA Nemotron 120B. Activates deeper reasoning for complex health questions.',
    finalCta: 'The healer has been waiting.',
    finalSub: 'Begin your consultation. Free, always.',
    footer: 'For educational purposes only · Not a substitute for medical advice',
  },
  ja: {
    cta: '旅を始める',
    sub: 'アーユルヴェーダ、中医学、そして6つの伝統医学を統合したAI。',
    free: '無料 · アカウント不要 · プライベート',
    traditions: '8つの癒しの伝統',
    how: 'ヴァイドヤの仕組み',
    step1t: '体質を発見',
    step1d: '5つの質問でヴァータ、ピッタ、カパを特定。5,000年のアーユルヴェーダの知恵から。',
    step2t: 'ヴァイドヤが相談',
    step2d: '8つの伝統を同時に参照。チャラカ・サンヒター、黄帝内経などの古典文献を引用。',
    step3t: 'ディープマインドモード',
    step3d: 'NVIDIA Nemotron 120Bで動作。複雑な健康問題に対してより深い推論を行います。',
    finalCta: '癒し手があなたを待っています。',
    finalSub: '相談を始めましょう。常に無料。',
    footer: '教育目的のみ · 医療アドバイスの代替ではありません',
  },
  hi: {
    cta: 'यात्रा शुरू करें',
    sub: 'आयुर्वेद, चीनी चिकित्सा और 6 प्राचीन परंपराओं को एकीकृत करने वाला AI।',
    free: 'निःशुल्क · कोई खाता नहीं · निजी',
    traditions: '8 उपचार परंपराएं',
    how: 'वैद्य कैसे काम करता है',
    step1t: 'अपनी प्रकृति जानें',
    step1d: '5 प्रश्नों से वात, पित्त या कफ की पहचान — 5,000 वर्षों के आयुर्वेदिक ज्ञान से।',
    step2t: 'वैद्य परामर्श करता है',
    step2d: '8 परंपराओं को एक साथ संदर्भित करता है। चरक संहिता, हुआंगदी नेइजिंग का हवाला देता है।',
    step3t: 'डीप माइंड मोड',
    step3d: 'NVIDIA Nemotron 120B द्वारा संचालित। जटिल प्रश्नों के लिए गहरी सोच।',
    finalCta: 'वैद्य आपका इंतजार कर रहा है।',
    finalSub: 'परामर्श शुरू करें। हमेशा मुफ्त।',
    footer: 'केवल शैक्षिक उद्देश्यों के लिए · चिकित्सा सलाह का विकल्प नहीं',
  },
}

const TRADITIONS = [
  { icon: '🌿', name: 'Ayurveda', origin: 'India · 5,000 BCE' },
  { icon: '☯️', name: 'Chinese Medicine', origin: 'China · 3,000 BCE' },
  { icon: '🏔️', name: 'Tibetan Medicine', origin: 'Tibet · 600 CE' },
  { icon: '🌙', name: 'Unani', origin: 'Arabia · 900 CE' },
  { icon: '✨', name: 'Siddha', origin: 'Tamil Nadu · Ancient' },
  { icon: '💧', name: 'Homeopathy', origin: 'Germany · 1796' },
  { icon: '🌱', name: 'Naturopathy', origin: 'Europe · 19th C' },
  { icon: '💊', name: 'Western Medicine', origin: 'Evidence-based' },
]

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const t = T[lang]

  useEffect(() => {
    const saved = localStorage.getItem('ayura_lang') as Lang
    if (saved && T[saved]) setLang(saved)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const selectLang = (l: Lang) => {
    setLang(l)
    localStorage.setItem('ayura_lang', l)
  }

  return (
    <main style={{ background: '#000', minHeight: '100vh', color: '#f5f5f7', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; }
        .hero-text { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(3.5rem, 9vw, 7.5rem); font-weight: 300; line-height: 1.05; letter-spacing: -0.02em; background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.5) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .fade { animation: fadeIn 1s ease forwards; }
        .fade-2 { animation: fadeIn 1s 0.2s ease forwards; opacity: 0; }
        .fade-3 { animation: fadeIn 1s 0.4s ease forwards; opacity: 0; }
        .fade-4 { animation: fadeIn 1s 0.6s ease forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .btn-primary { display: inline-block; background: #fff; color: #000; padding: 0.85rem 2rem; border-radius: 980px; font-size: 0.95rem; font-weight: 500; text-decoration: none; letter-spacing: -0.01em; transition: all 0.2s; }
        .btn-primary:hover { background: rgba(255,255,255,0.85); transform: scale(0.98); }
        .btn-ghost { display: inline-block; color: rgba(255,255,255,0.5); padding: 0.85rem 1.5rem; font-size: 0.9rem; text-decoration: none; transition: color 0.2s; letter-spacing: -0.01em; }
        .btn-ghost:hover { color: #fff; }
        .lang-pill { background: transparent; border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.4); padding: 0.2rem 0.6rem; border-radius: 980px; font-size: 0.72rem; cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em; }
        .lang-pill:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.8); }
        .lang-pill.on { border-color: rgba(255,255,255,0.4); color: #fff; background: rgba(255,255,255,0.06); }
        .trad-card { background: #111; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 1.25rem; transition: all 0.25s; cursor: default; }
        .trad-card:hover { background: #1a1a1a; border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
        .step { display: grid; grid-template-columns: 64px 1fr; gap: 1.5rem; align-items: start; padding: 2rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .step:last-child { border-bottom: none; }
        .step-num { font-family: 'Cormorant Garamond', serif; font-size: 3.5rem; font-weight: 300; color: rgba(255,255,255,0.08); line-height: 1; }
        .divider { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); margin: 0; }
        .nav-link { color: rgba(255,255,255,0.5); font-size: 0.8rem; text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        .glow { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; }
        @media (max-width: 600px) { .step { grid-template-columns: 48px 1fr; gap: 1rem; } .step-num { font-size: 2.5rem; } }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(0,0,0,0.72)' : 'transparent', backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none', transition: 'all 0.4s' }}>
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', fontWeight: 600, color: '#c9a84c', letterSpacing: '0.02em' }}>🌿 AyuraHealth</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {(['en', 'ja', 'hi'] as Lang[]).map(l => (
            <button key={l} className={`lang-pill${lang === l ? ' on' : ''}`} onClick={() => selectLang(l)}>
              {l === 'en' ? '🇬🇧 EN' : l === 'ja' ? '🇯🇵 JA' : '🇮🇳 HI'}
            </button>
          ))}
          <Link href="/clinic" className="nav-link" style={{ marginLeft: '0.75rem' }}>For Clinics</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '7rem 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="glow" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(45,90,27,0.18) 0%, transparent 70%)' }} />
        <div className="glow" style={{ top: '40%', left: '30%', width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />

        <p className="fade" style={{ fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', marginBottom: '1.75rem', fontFamily: '-apple-system, sans-serif' }}>
          NVIDIA Nemotron · 8 Traditions · $0/month
        </p>

        <h1 className="hero-text fade-2" style={{ marginBottom: '1.75rem' }}>
          Ancient Wisdom.<br />Modern AI.
        </h1>

        <p className="fade-3" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.4)', maxWidth: 500, lineHeight: 1.7, marginBottom: '2.5rem', fontFamily: '-apple-system, sans-serif', letterSpacing: '-0.01em' }}>
          {t.sub}
        </p>

        <div className="fade-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/chat" className="btn-primary">{t.cta}</Link>
            <Link href="/chat" className="btn-ghost">Deep Mind Consultation →</Link>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em', fontFamily: '-apple-system, sans-serif' }}>{t.free}</span>
        </div>
      </section>

      <div className="divider" />

      {/* 8 Traditions */}
      <section style={{ padding: '6rem 2rem', maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 300, textAlign: 'center', marginBottom: '0.75rem', color: '#f5f5f7' }}>{t.traditions}</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', marginBottom: '3rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: '-apple-system, sans-serif' }}>
          The first AI to unify all major healing systems
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {TRADITIONS.map((t, i) => (
            <div key={i} className="trad-card" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ background: hovered === i ? '#1a1a1a' : '#111', borderColor: hovered === i ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)', transform: hovered === i ? 'translateY(-2px)' : 'none' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.6rem' }}>{t.icon}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#f5f5f7', marginBottom: '0.25rem', fontFamily: '-apple-system, sans-serif' }}>{t.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', fontFamily: '-apple-system, sans-serif' }}>{t.origin}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* How it works */}
      <section style={{ padding: '6rem 2rem', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 300, marginBottom: '3rem', color: '#f5f5f7' }}>{t.how}</h2>
        <div>
          {[
            { n: '01', title: t.step1t, desc: t.step1d, badge: null },
            { n: '02', title: t.step2t, desc: t.step2d, badge: null },
            { n: '03', title: t.step3t, desc: t.step3d, badge: 'NVIDIA Nemotron' },
          ].map((s, i) => (
            <div key={i} className="step">
              <div className="step-num">{s.n}</div>
              <div style={{ paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', fontWeight: 400, color: '#f5f5f7' }}>{s.title}</h3>
                  {s.badge && <span style={{ fontSize: '0.65rem', background: 'rgba(118,185,0,0.15)', border: '1px solid rgba(118,185,0,0.3)', color: 'rgba(118,185,0,0.9)', padding: '0.15rem 0.5rem', borderRadius: 980, letterSpacing: '0.05em', fontFamily: '-apple-system, sans-serif' }}>{s.badge}</span>}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', lineHeight: 1.75, fontFamily: '-apple-system, sans-serif' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* Final CTA */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="glow" style={{ bottom: '0%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(45,90,27,0.12) 0%, transparent 70%)' }} />
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '1rem', color: '#f5f5f7' }}>
          {t.finalCta}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.25)', marginBottom: '2.5rem', fontSize: '0.9rem', fontFamily: '-apple-system, sans-serif' }}>{t.finalSub}</p>
        <Link href="/chat" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>{t.cta}</Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.72rem', marginBottom: '1rem', fontFamily: '-apple-system, sans-serif', letterSpacing: '0.02em' }}>{t.footer}</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['For Clinics', '/clinic'], ['Contact', 'mailto:hello@ayurahealth.com']].map(([label, href]) => (
            <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', textDecoration: 'none', fontFamily: '-apple-system, sans-serif', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
            >{label}</a>
          ))}
        </div>
      </footer>
    </main>
  )
}
