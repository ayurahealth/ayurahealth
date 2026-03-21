'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

type Lang = 'en' | 'ja' | 'hi'

const T = {
  en: {
    tagline: 'Ancient Wisdom.\nModern AI.\nNatural Healing.',
    sub: 'Your personal health companion — combining Ayurveda, Chinese Medicine, and 6 ancient healing traditions with the power of modern AI.',
    cta: 'Begin Your Journey',
    deepcta: 'Deep Mind Consultation →',
    free: 'Free · No account required · Private by default',
    traditions: '8 Healing Traditions',
    tradSub: 'The first AI to unify all major healing systems',
    how: 'How VAIDYA Heals You',
    s1t: 'Discover Your Constitution', s1d: 'A 5-question assessment reveals your Vata, Pitta, or Kapha type — drawn from 5,000 years of Ayurvedic wisdom.',
    s2t: 'VAIDYA Consults All Traditions', s2d: 'Cross-references Charaka Samhita, Huangdi Neijing, and 6 other classical texts simultaneously. Ancient wisdom meets modern evidence.',
    s3t: 'Deep Mind Mode', s3d: 'Powered by NVIDIA Nemotron 120B. Activates for complex conditions — deeper reasoning, more thorough cross-tradition analysis.',
    finalCta: 'Healing has always been natural.',
    finalSub: 'Let VAIDYA guide you back to balance. Free, always.',
    footer: 'For educational purposes only · Not a substitute for professional medical advice',
    clinic: 'For Clinics →',
  },
  ja: {
    tagline: '古代の智慧。\n現代のAI。\n自然な癒し。',
    sub: 'アーユルヴェーダ、中医学、そして6つの伝統医学とAIを統合したパーソナルヘルスコンパニオン。',
    cta: '旅を始める', deepcta: 'ディープマインド相談 →',
    free: '無料 · アカウント不要 · プライベート',
    traditions: '8つの癒しの伝統', tradSub: 'すべての主要な癒しシステムを統合した初のAI',
    how: 'ヴァイドヤの癒しの仕組み',
    s1t: '体質を発見', s1d: '5つの質問でヴァータ、ピッタ、カパを特定。5,000年の知恵から。',
    s2t: 'ヴァイドヤが全伝統を参照', s2d: 'チャラカ・サンヒター、黄帝内経など8つの古典文献を同時に参照。',
    s3t: 'ディープマインドモード', s3d: 'NVIDIA Nemotron 120Bで動作。複雑な症状に対してより深い推論を行います。',
    finalCta: '癒しはいつも自然の中にありました。',
    finalSub: 'ヴァイドヤがバランスへの道を案内します。常に無料。',
    footer: '教育目的のみ · 医療アドバイスの代替ではありません',
    clinic: 'クリニック向け →',
  },
  hi: {
    tagline: 'प्राचीन ज्ञान।\nआधुनिक AI।\nप्राकृतिक उपचार।',
    sub: 'आयुर्वेद, चीनी चिकित्सा और 6 प्राचीन परंपराओं को आधुनिक AI के साथ जोड़ने वाला आपका स्वास्थ्य साथी।',
    cta: 'यात्रा शुरू करें', deepcta: 'डीप माइंड परामर्श →',
    free: 'निःशुल्क · कोई खाता नहीं · निजी',
    traditions: '8 उपचार परंपराएं', tradSub: 'सभी प्रमुख उपचार प्रणालियों को एकीकृत करने वाला पहला AI',
    how: 'वैद्य कैसे आपको ठीक करता है',
    s1t: 'अपनी प्रकृति जानें', s1d: '5 प्रश्नों से वात, पित्त या कफ की पहचान — 5,000 वर्षों के ज्ञान से।',
    s2t: 'वैद्य सभी परंपराओं से परामर्श करता है', s2d: 'चरक संहिता, हुआंगदी नेइजिंग और 6 अन्य ग्रंथों को एक साथ संदर्भित करता है।',
    s3t: 'डीप माइंड मोड', s3d: 'NVIDIA Nemotron 120B द्वारा संचालित। जटिल स्वास्थ्य प्रश्नों के लिए गहरी सोच।',
    finalCta: 'उपचार हमेशा प्रकृति में था।',
    finalSub: 'वैद्य आपको संतुलन की ओर ले जाएगा। हमेशा मुफ्त।',
    footer: 'केवल शैक्षिक उद्देश्यों के लिए · चिकित्सा सलाह का विकल्प नहीं',
    clinic: 'क्लीनिक के लिए →',
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
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #05100a; }
        .hero-text {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.02em;
          white-space: pre-line;
          background: linear-gradient(160deg, #e8dfc8 0%, #c9a84c 50%, #6abf8a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .fade { animation: fadeUp 0.9s ease forwards; }
        .fade-2 { animation: fadeUp 0.9s 0.15s ease forwards; opacity: 0; }
        .fade-3 { animation: fadeUp 0.9s 0.3s ease forwards; opacity: 0; }
        .fade-4 { animation: fadeUp 0.9s 0.45s ease forwards; opacity: 0; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(28px); } to { opacity:1; transform: translateY(0); } }
        .btn-primary { display: inline-block; background: linear-gradient(135deg, #2d5a1b, #3d7a28); color: #e8dfc8; padding: 0.9rem 2.2rem; border-radius: 980px; font-size: 0.95rem; font-weight: 500; text-decoration: none; transition: all 0.25s; box-shadow: 0 4px 24px rgba(45,90,27,0.35); }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(45,90,27,0.5); }
        .btn-ghost { display: inline-block; color: rgba(232,223,200,0.4); padding: 0.9rem 1.2rem; font-size: 0.9rem; text-decoration: none; transition: color 0.2s; }
        .btn-ghost:hover { color: #e8dfc8; }
        .lang-pill { background: transparent; border: 1px solid rgba(106,191,138,0.15); color: rgba(232,223,200,0.35); padding: 0.22rem 0.6rem; border-radius: 980px; font-size: 0.72rem; cursor: pointer; transition: all 0.2s; }
        .lang-pill:hover { border-color: rgba(106,191,138,0.4); color: rgba(232,223,200,0.8); }
        .lang-pill.on { border-color: rgba(106,191,138,0.5); color: #e8dfc8; background: rgba(106,191,138,0.08); }
        .trad-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(106,191,138,0.08); border-radius: 16px; padding: 1.25rem; transition: all 0.25s; }
        .trad-card:hover { background: rgba(106,191,138,0.06); border-color: rgba(106,191,138,0.2); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(45,90,27,0.2); }
        .divider { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(106,191,138,0.12), transparent); }
        .nav-link { color: rgba(232,223,200,0.35); font-size: 0.8rem; text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: #e8dfc8; }
        .glow { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .step-row { display: grid; grid-template-columns: 80px 1fr; gap: 2rem; align-items: start; padding: 2.5rem 0; border-bottom: 1px solid rgba(106,191,138,0.08); }
        .step-row:last-child { border-bottom: none; }
        .step-num { font-family: 'Cormorant Garamond', serif; font-size: 4rem; font-weight: 300; line-height: 1; color: rgba(201,168,76,0.35); }
        @media (max-width: 600px) { .step-row { grid-template-columns: 56px 1fr; gap: 1rem; } .step-num { font-size: 2.8rem; } }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(5,16,10,0.88)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(106,191,138,0.1)' : 'none', transition: 'all 0.35s' }}>
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.15rem', fontWeight: 600, color: '#c9a84c', letterSpacing: '0.02em' }}>🌿 AyuraHealth</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {(['en', 'ja', 'hi'] as Lang[]).map(l => (
            <button key={l} className={`lang-pill${lang === l ? ' on' : ''}`} onClick={() => selectLang(l)}>
              {l === 'en' ? '🇬🇧 EN' : l === 'ja' ? '🇯🇵 日本語' : '🇮🇳 हिन्दी'}
            </button>
          ))}
          <Link href="/clinic" className="nav-link" style={{ marginLeft: '0.6rem', border: '1px solid rgba(106,191,138,0.15)', padding: '0.25rem 0.7rem', borderRadius: 20 }}>{t.clinic}</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="glow" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 600, background: 'radial-gradient(ellipse, rgba(45,90,27,0.2) 0%, transparent 65%)' }} />
        <div className="glow" style={{ bottom: '10%', right: '10%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

        <div className="fade" style={{ position: 'relative', zIndex: 1, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(106,191,138,0.6)', marginBottom: '1.75rem', fontFamily: '-apple-system, sans-serif' }}>
          NVIDIA Nemotron · 8 Traditions · Always Free
        </div>

        <h1 className="hero-text fade-2" style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
          {t.tagline}
        </h1>

        <p className="fade-3" style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'rgba(232,223,200,0.45)', maxWidth: 520, lineHeight: 1.75, marginBottom: '2.5rem', fontFamily: '-apple-system, sans-serif', letterSpacing: '-0.01em' }}>
          {t.sub}
        </p>

        <div className="fade-4" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/chat" className="btn-primary">{t.cta}</Link>
            <Link href="/chat" className="btn-ghost">{t.deepcta}</Link>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'rgba(232,223,200,0.2)', letterSpacing: '0.05em', fontFamily: '-apple-system, sans-serif' }}>{t.free}</span>
        </div>
      </section>

      <div className="divider" />

      {/* 8 Traditions */}
      <section style={{ padding: '6rem 2rem', maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 300, textAlign: 'center', marginBottom: '0.6rem', color: '#e8dfc8' }}>{t.traditions}</h2>
        <p style={{ textAlign: 'center', color: 'rgba(232,223,200,0.25)', fontSize: '0.8rem', marginBottom: '3rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: '-apple-system, sans-serif' }}>{t.tradSub}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '0.75rem' }}>
          {TRADITIONS.map((item, i) => (
            <div key={i} className="trad-card">
              <div style={{ fontSize: '1.6rem', marginBottom: '0.65rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#e8dfc8', marginBottom: '0.25rem', fontFamily: '-apple-system, sans-serif' }}>{item.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(232,223,200,0.25)', fontFamily: '-apple-system, sans-serif' }}>{item.origin}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* How it works */}
      <section style={{ padding: '6rem 2rem', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 300, marginBottom: '3rem', color: '#e8dfc8' }}>{t.how}</h2>
        <div>
          {[
            { n: '01', title: t.s1t, desc: t.s1d, badge: null },
            { n: '02', title: t.s2t, desc: t.s2d, badge: null },
            { n: '03', title: t.s3t, desc: t.s3d, badge: 'NVIDIA Nemotron' },
          ].map((s, i) => (
            <div key={i} className="step-row">
              <div className="step-num">{s.n}</div>
              <div style={{ paddingTop: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.45rem', fontWeight: 400, color: '#e8dfc8' }}>{s.title}</h3>
                  {s.badge && <span style={{ fontSize: '0.62rem', background: 'rgba(118,185,0,0.12)', border: '1px solid rgba(118,185,0,0.3)', color: 'rgba(118,185,0,0.85)', padding: '0.15rem 0.5rem', borderRadius: 980, letterSpacing: '0.05em', fontFamily: '-apple-system, sans-serif', whiteSpace: 'nowrap' }}>{s.badge}</span>}
                </div>
                <p style={{ color: 'rgba(232,223,200,0.38)', fontSize: '0.9rem', lineHeight: 1.8, fontFamily: '-apple-system, sans-serif' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* What people ask */}
      <section style={{ padding: '5rem 2rem', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, textAlign: 'center', marginBottom: '0.5rem', color: '#e8dfc8' }}>What People Ask VAIDYA</h2>
        <p style={{ textAlign: 'center', color: 'rgba(232,223,200,0.25)', fontSize: '0.8rem', marginBottom: '2.5rem', fontFamily: '-apple-system, sans-serif' }}>Real questions, answered from multiple healing traditions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.65rem' }}>
          {[
            'What herbs help with stress and anxiety?',
            'How can I improve my digestion naturally?',
            'What does Ayurveda say about sleep?',
            'Natural remedies for headaches?',
            'How do I balance Pitta dosha?',
            'What foods should I avoid for my body type?',
            'TCM approach to managing fatigue',
            'Natural ways to boost immunity',
          ].map((q, i) => (
            <Link key={i} href="/chat" style={{ display: 'block', background: 'rgba(106,191,138,0.04)', border: '1px solid rgba(106,191,138,0.1)', borderRadius: 14, padding: '0.9rem 1.1rem', color: 'rgba(232,223,200,0.5)', fontSize: '0.85rem', lineHeight: 1.6, textDecoration: 'none', transition: 'all 0.2s', fontFamily: '-apple-system, sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(106,191,138,0.08)'; e.currentTarget.style.borderColor = 'rgba(106,191,138,0.25)'; e.currentTarget.style.color = 'rgba(232,223,200,0.8)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(106,191,138,0.04)'; e.currentTarget.style.borderColor = 'rgba(106,191,138,0.1)'; e.currentTarget.style.color = 'rgba(232,223,200,0.5)' }}
            >
              "{q}"
            </Link>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* Final CTA */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="glow" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(45,90,27,0.15) 0%, transparent 65%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌿</div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: '1rem', color: '#e8dfc8' }}>
            {t.finalCta}
          </h2>
          <p style={{ color: 'rgba(232,223,200,0.3)', marginBottom: '2.5rem', fontSize: '0.95rem', fontFamily: '-apple-system, sans-serif' }}>{t.finalSub}</p>
          <Link href="/chat" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.8rem' }}>{t.cta}</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(106,191,138,0.08)', padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
        <p style={{ color: 'rgba(232,223,200,0.15)', fontSize: '0.72rem', marginBottom: '1rem', fontFamily: '-apple-system, sans-serif' }}>{t.footer}</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['For Clinics', '/clinic'], ['Contact', 'mailto:hello@ayurahealth.com']].map(([label, href]) => (
            <a key={href} href={href} style={{ color: 'rgba(232,223,200,0.2)', fontSize: '0.72rem', textDecoration: 'none', fontFamily: '-apple-system, sans-serif', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,223,200,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,223,200,0.2)')}
            >{label}</a>
          ))}
        </div>
      </footer>
    </main>
  )
}
