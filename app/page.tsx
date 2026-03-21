'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'zh', name: 'Chinese (Simplified)', native: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'fa', name: 'Persian', native: 'فارسی' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'da', name: 'Danish', native: 'Dansk' },
  { code: 'fi', name: 'Finnish', native: 'Suomi' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
  { code: 'th', name: 'Thai', native: 'ภาษาไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina' },
  { code: 'bg', name: 'Bulgarian', native: 'Български' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', native: 'Српски' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල' },
  { code: 'my', name: 'Burmese', native: 'မြန်မာဘာသာ' },
  { code: 'km', name: 'Khmer', native: 'ភាសាខ្មែរ' },
  { code: 'lo', name: 'Lao', native: 'ພາສາລາວ' },
  { code: 'mn', name: 'Mongolian', native: 'Монгол' },
  { code: 'ka', name: 'Georgian', native: 'ქართული' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ' },
]

// Core translations for key languages
const T: Record<string, { tagline: string; sub: string; cta: string; free: string }> = {
  en: { tagline: 'Ancient Wisdom.\nModern AI.\nNatural Healing.', sub: 'Your personal health companion — combining Ayurveda, Chinese Medicine, and 6 ancient healing traditions with the power of AI.', cta: 'Begin Your Journey', free: 'Free · No account required · Private' },
  sa: { tagline: 'प्राचीनं ज्ञानम्।\nआधुनिकं AI।\nप्राकृतिकी चिकित्सा।', sub: 'आयुर्वेद, चीनीयचिकित्सा च षट् अन्याभिः परम्पराभिः सहितः आपणः स्वास्थ्यसहायकः।', cta: 'यात्रां आरभ्यताम्', free: 'निःशुल्कम् · खाता न आवश्यकम् · गोपनीयम्' },
  hi: { tagline: 'प्राचीन ज्ञान।\nआधुनिक AI।\nप्राकृतिक उपचार।', sub: 'आयुर्वेद, चीनी चिकित्सा और 6 प्राचीन परंपराओं को AI के साथ जोड़ने वाला आपका स्वास्थ्य साथी।', cta: 'यात्रा शुरू करें', free: 'निःशुल्क · कोई खाता नहीं · निजी' },
  ja: { tagline: '古代の智慧。\n現代のAI。\n自然な癒し。', sub: 'アーユルヴェーダ、中医学、そして6つの伝統医学とAIを統合したパーソナルヘルスコンパニオン。', cta: '旅を始める', free: '無料 · アカウント不要 · プライベート' },
  zh: { tagline: '古代智慧。\n现代AI。\n自然疗愈。', sub: '结合阿育吠陀、中医和6种古老治愈传统与AI力量的个人健康伴侣。', cta: '开始您的旅程', free: '免费 · 无需账户 · 私密' },
  ar: { tagline: 'الحكمة القديمة.\nالذكاء الاصطناعي الحديث.\nالشفاء الطبيعي.', sub: 'رفيقك الصحي الشخصي — يجمع بين الأيورفيدا والطب الصيني و6 تقاليد علاجية قديمة.', cta: 'ابدأ رحلتك', free: 'مجاني · لا حساب مطلوب · خاص' },
  es: { tagline: 'Sabiduría Antigua.\nIA Moderna.\nSanación Natural.', sub: 'Tu compañero de salud personal — combinando Ayurveda, Medicina China y 6 tradiciones de sanación ancestrales con IA.', cta: 'Comienza Tu Viaje', free: 'Gratis · Sin cuenta · Privado' },
  fr: { tagline: 'Sagesse Ancienne.\nIA Moderne.\nGuérison Naturelle.', sub: 'Votre compagnon de santé personnel — combinant l\'Ayurveda, la Médecine Chinoise et 6 traditions de guérison ancestrales avec l\'IA.', cta: 'Commencez Votre Voyage', free: 'Gratuit · Sans compte · Privé' },
  de: { tagline: 'Altes Wissen.\nModerne KI.\nNatürliche Heilung.', sub: 'Ihr persönlicher Gesundheitsbegleiter — kombiniert Ayurveda, Chinesische Medizin und 6 alte Heiltraditionen mit KI.', cta: 'Beginnen Sie Ihre Reise', free: 'Kostenlos · Kein Konto · Privat' },
  pt: { tagline: 'Sabedoria Antiga.\nIA Moderna.\nCura Natural.', sub: 'Seu companheiro de saúde pessoal — combinando Ayurveda, Medicina Chinesa e 6 tradições de cura ancestrais com IA.', cta: 'Inicie Sua Jornada', free: 'Gratuito · Sem conta · Privado' },
  ru: { tagline: 'Древняя Мудрость.\nСовременный ИИ.\nЕстественное Исцеление.', sub: 'Ваш личный помощник по здоровью — объединяет Аюрведу, Китайскую медицину и 6 древних целительных традиций с ИИ.', cta: 'Начните Путешествие', free: 'Бесплатно · Без аккаунта · Конфиденциально' },
  ko: { tagline: '고대의 지혜.\n현대 AI.\n자연 치유.', sub: '아유르베다, 중국 의학, 그리고 6가지 고대 치유 전통을 AI와 결합한 개인 건강 동반자.', cta: '여행 시작하기', free: '무료 · 계정 불필요 · 비공개' },
}

const getT = (code: string) => T[code] || { ...T.en, sub: T.en.sub }

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
  const [langCode, setLangCode] = useState('en')
  const [showPicker, setShowPicker] = useState(false)
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const currentLang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0]
  const t = getT(langCode)

  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const saved = localStorage.getItem('ayura_lang')
    if (saved && LANGUAGES.find(l => l.code === saved)) setLangCode(saved)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (showPicker) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
  }, [showPicker])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectLang = (code: string) => {
    setLangCode(code)
    localStorage.setItem('ayura_lang', code)
    setShowPicker(false)
  }

  return (
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #05100a; }
        .hero-text { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(3rem, 8vw, 6.5rem); font-weight: 300; line-height: 1.08; letter-spacing: -0.02em; white-space: pre-line; background: linear-gradient(160deg, #e8dfc8 0%, #c9a84c 50%, #6abf8a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .fade { animation: fadeUp 0.9s ease forwards; }
        .fade-2 { animation: fadeUp 0.9s 0.15s ease forwards; opacity: 0; }
        .fade-3 { animation: fadeUp 0.9s 0.3s ease forwards; opacity: 0; }
        .fade-4 { animation: fadeUp 0.9s 0.45s ease forwards; opacity: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        .btn-primary { display: inline-block; background: linear-gradient(135deg, #2d5a1b, #3d7a28); color: #e8dfc8; padding: 0.9rem 2.2rem; border-radius: 980px; font-size: 0.95rem; font-weight: 500; text-decoration: none; transition: all 0.25s; box-shadow: 0 4px 24px rgba(45,90,27,0.35); }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(45,90,27,0.5); }
        .btn-ghost { display: inline-block; color: rgba(232,223,200,0.4); padding: 0.9rem 1.2rem; font-size: 0.9rem; text-decoration: none; transition: color 0.2s; }
        .btn-ghost:hover { color: #e8dfc8; }
        .lang-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(106,191,138,0.15); color: rgba(232,223,200,0.6); padding: 0.28rem 0.85rem; border-radius: 980px; font-size: 0.78rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; }
        .lang-btn:hover { border-color: rgba(106,191,138,0.35); color: #e8dfc8; background: rgba(106,191,138,0.08); }
        .picker-overlay { position: fixed; inset: 0; z-index: 999; display: flex; align-items: flex-start; justify-content: flex-end; padding: 56px 1rem 0; }
        .picker-box { background: rgba(12,22,12,0.96); border: 1px solid rgba(106,191,138,0.15); border-radius: 14px; width: 280px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(106,191,138,0.05); backdrop-filter: blur(20px); }
        .picker-search { width: 100%; background: rgba(255,255,255,0.04); border: none; border-bottom: 1px solid rgba(106,191,138,0.08); color: #e8dfc8; padding: 0.75rem 1rem; font-size: 0.85rem; outline: none; font-family: -apple-system, sans-serif; }
        .picker-search::placeholder { color: rgba(232,223,200,0.25); }
        .picker-list { max-height: 320px; overflow-y: auto; }
        .picker-list::-webkit-scrollbar { width: 3px; }
        .picker-list::-webkit-scrollbar-thumb { background: rgba(106,191,138,0.2); border-radius: 2px; }
        .lang-item { display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 1rem; cursor: pointer; transition: background 0.15s; }
        .lang-item:hover { background: rgba(106,191,138,0.06); }
        .lang-item.active { background: rgba(106,191,138,0.08); }
        .lang-item-left { display: flex; flex-direction: column; gap: 0.1rem; }
        .lang-native { font-size: 0.85rem; color: #e8dfc8; font-family: -apple-system, sans-serif; }
        .lang-english { font-size: 0.7rem; color: rgba(232,223,200,0.3); font-family: -apple-system, sans-serif; }
        .checkmark { color: #6abf8a; font-size: 0.85rem; }
        .trad-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(106,191,138,0.08); border-radius: 16px; padding: 1.25rem; transition: all 0.25s; }
        .trad-card:hover { background: rgba(106,191,138,0.06); border-color: rgba(106,191,138,0.2); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(45,90,27,0.2); }
        .divider { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(106,191,138,0.12), transparent); }
        .nav-link { color: rgba(232,223,200,0.35); font-size: 0.8rem; text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: #e8dfc8; }
        .glow { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .step-row { display: grid; grid-template-columns: 80px 1fr; gap: 2rem; align-items: start; padding: 2.5rem 0; border-bottom: 1px solid rgba(106,191,138,0.08); }
        .step-row:last-child { border-bottom: none; }
        .step-num { font-family: 'Cormorant Garamond', serif; font-size: 4rem; font-weight: 300; line-height: 1; color: rgba(201,168,76,0.45); }
        @media (max-width: 600px) { .step-row { grid-template-columns: 56px 1fr; gap: 1rem; } .step-num { font-size: 2.8rem; } .picker-overlay { justify-content: center; padding-top: 56px; } .picker-box { width: calc(100vw - 2rem); } }
      `}</style>

      {/* Language Picker */}
      {showPicker && (
        <div className="picker-overlay" onClick={() => setShowPicker(false)}>
          <div className="picker-box" ref={pickerRef} onClick={e => e.stopPropagation()}>
            <input
              ref={searchRef}
              className="picker-search"
              placeholder="Search language..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="picker-list">
              {filtered.length === 0 && (
                <div style={{ padding: '1rem', color: 'rgba(232,223,200,0.3)', fontSize: '0.8rem', textAlign: 'center' }}>No languages found</div>
              )}
              {filtered.map(l => (
                <div key={l.code} className={`lang-item${l.code === langCode ? ' active' : ''}`} onClick={() => selectLang(l.code)}>
                  <div className="lang-item-left">
                    <span className="lang-native">{l.native}</span>
                    {l.native !== l.name && <span className="lang-english">{l.name}</span>}
                  </div>
                  {l.code === langCode && <span className="checkmark">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(5,16,10,0.88)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(106,191,138,0.1)' : 'none', transition: 'all 0.35s' }}>
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.15rem', fontWeight: 600, color: '#c9a84c', letterSpacing: '0.02em' }}>🌿 AyuraHealth</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="lang-btn" onClick={() => setShowPicker(!showPicker)}>
            <span style={{ fontSize: '0.8rem' }}>🌐</span>
            <span>{currentLang.native}</span>
            <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>▾</span>
          </button>
          <Link href="/clinic" className="nav-link" style={{ border: '1px solid rgba(106,191,138,0.15)', padding: '0.25rem 0.7rem', borderRadius: 20 }}>For Clinics</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="glow" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 600, background: 'radial-gradient(ellipse, rgba(45,90,27,0.2) 0%, transparent 65%)' }} />
        <div className="glow" style={{ bottom: '10%', right: '10%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

        <div className="fade" style={{ position: 'relative', zIndex: 1, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(106,191,138,0.6)', marginBottom: '1.75rem', fontFamily: '-apple-system, sans-serif' }}>
          8 Ancient Traditions · Always Free
        </div>

        <h1 className="hero-text fade-2" style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
          {t.tagline}
        </h1>

        <p className="fade-3" style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'rgba(232,223,200,0.45)', maxWidth: 520, lineHeight: 1.75, marginBottom: '2.5rem', fontFamily: '-apple-system, sans-serif' }}>
          {t.sub}
        </p>

        <div className="fade-4" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href={`/chat?lang=${langCode}`} className="btn-primary">{t.cta}</Link>
            <Link href={`/chat?lang=${langCode}`} className="btn-ghost">Deep Mind Consultation →</Link>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'rgba(232,223,200,0.2)', letterSpacing: '0.05em', fontFamily: '-apple-system, sans-serif' }}>{t.free}</span>
        </div>
      </section>

      <div className="divider" />

      {/* 8 Traditions */}
      <section style={{ padding: '6rem 2rem', maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 300, textAlign: 'center', marginBottom: '0.6rem', color: '#e8dfc8' }}>8 Healing Traditions</h2>
        <p style={{ textAlign: 'center', color: 'rgba(232,223,200,0.25)', fontSize: '0.8rem', marginBottom: '3rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: '-apple-system, sans-serif' }}>The first AI to unify all major healing systems</p>
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
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 300, marginBottom: '3rem', color: '#e8dfc8' }}>How VAIDYA Heals You</h2>
        {[
          { n: '01', t: 'Discover Your Constitution', d: 'A 5-question assessment reveals your Vata, Pitta, or Kapha type — drawn from 5,000 years of Ayurvedic wisdom.', badge: null },
          { n: '02', t: 'VAIDYA Consults All Traditions', d: 'Cross-references Charaka Samhita, Huangdi Neijing, and 6 other classical texts. Ancient wisdom meets modern evidence.', badge: null },
          { n: '03', t: 'Deep Mind Mode', d: 'Advanced reasoning across all 8 traditions. Deeper cross-tradition analysis for complex health questions.', badge: 'VAIDYA Deep Mind' },
        ].map((s, i) => (
          <div key={i} className="step-row">
            <div className="step-num">{s.n}</div>
            <div style={{ paddingTop: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.45rem', fontWeight: 400, color: '#e8dfc8' }}>{s.t}</h3>
                {s.badge && <span style={{ fontSize: '0.62rem', background: 'rgba(118,185,0,0.12)', border: '1px solid rgba(118,185,0,0.3)', color: 'rgba(118,185,0,0.85)', padding: '0.15rem 0.5rem', borderRadius: 980, letterSpacing: '0.05em', fontFamily: '-apple-system, sans-serif', whiteSpace: 'nowrap' }}>{s.badge}</span>}
              </div>
              <p style={{ color: 'rgba(232,223,200,0.38)', fontSize: '0.9rem', lineHeight: 1.8, fontFamily: '-apple-system, sans-serif' }}>{s.d}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="divider" />

      {/* Final CTA */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="glow" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(45,90,27,0.15) 0%, transparent 65%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌿</div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: '1rem', color: '#e8dfc8' }}>
            Healing has always been natural.
          </h2>
          <p style={{ color: 'rgba(232,223,200,0.3)', marginBottom: '2.5rem', fontSize: '0.95rem', fontFamily: '-apple-system, sans-serif' }}>Let VAIDYA guide you back to balance. Free, always.</p>
          <Link href={`/chat?lang=${langCode}`} className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.8rem' }}>{t.cta}</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(106,191,138,0.08)', padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
        <p style={{ color: 'rgba(232,223,200,0.15)', fontSize: '0.72rem', marginBottom: '1rem', fontFamily: '-apple-system, sans-serif' }}>For educational purposes only · Not a substitute for professional medical advice</p>
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
