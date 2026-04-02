'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useSpring } from 'framer-motion'
import Nav from '../components/Nav'

/* ─── Translations ─────────────────────────────────────────────────────── */
const T: Record<string, {
  tagline: string; sub: string; cta: string; free: string;
  traditions: string; tradSub: string;
  how: string; s1t: string; s1d: string; s2t: string; s2d: string; s3t: string; s3d: string;
  finalCta: string; finalSub: string; footer: string; clinic: string;
}> = {
  en: {
    tagline: 'Ancient Wisdom.\nModern AI.\nNatural Healing.',
    sub: 'Your personal health companion — unifying Ayurveda, Chinese Medicine, and 6 ancient healing traditions with the power of AI.',
    cta: 'Begin Your Journey', free: '3 free consultations · No credit card needed',
    traditions: '8 Healing Traditions', tradSub: 'The first AI to unify all major healing systems',
    how: 'How VAIDYA Heals You',
    s1t: 'Discover Your Constitution', s1d: 'A 5-question assessment reveals your Vata, Pitta, or Kapha type — drawn from 5,000 years of Ayurvedic wisdom.',
    s2t: 'VAIDYA Consults All Traditions', s2d: 'Cross-references Charaka Samhita, Huangdi Neijing, and 6 other classical texts simultaneously.',
    s3t: 'Deep Mind Mode', s3d: 'Advanced reasoning across all 8 traditions. Deeper cross-tradition analysis for complex health questions.',
    finalCta: 'Healing has always been natural.', finalSub: 'Start free with 3 consultations. Unlock unlimited access from $4.99/mo.',
    footer: 'For educational purposes only · Not a substitute for professional medical advice', clinic: 'For Clinics →',
  },
  hi: {
    tagline: 'प्राचीन ज्ञान।\nआधुनिक AI।\nप्राकृतिक उपचार।',
    sub: 'आयुर्वेद, चीनी चिकित्सा और 6 प्राचीन परंपराओं को AI के साथ जोड़ने वाला आपका स्वास्थ्य साथी।',
    cta: 'यात्रा शुरू करें', free: 'निःशुल्क · कोई खाता नहीं · निजी',
    traditions: '8 उपचार परंपराएं', tradSub: 'सभी प्रमुख उपचार प्रणालियों को एकीकृत करने वाला पहला AI',
    how: 'VAIDYA आपको कैसे ठीक करता है',
    s1t: 'अपनी प्रकृति जानें', s1d: '5 प्रश्नों से वात, पित्त या कफ की पहचान।',
    s2t: 'VAIDYA सभी परंपराओं से परामर्श करता है', s2d: 'चरक संहिता, हुआंगदी नेइजिंग और 6 अन्य ग्रंथों को एक साथ संदर्भित करता है।',
    s3t: 'डीप माइंड मोड', s3d: 'सभी 8 परंपराओं में उन्नत तर्क।',
    finalCta: 'उपचार हमेशा प्रकृति में था।', finalSub: 'VAIDYA को आपको संतुलन की ओर ले जाने दें। हमेशा मुफ्त।',
    footer: 'केवल शैक्षिक उद्देश्यों के लिए', clinic: 'क्लीनिक के लिए →',
  },
  ja: {
    tagline: '古代の智慧。\n現代のAI。\n自然な癒し。',
    sub: 'アーユルヴェーダ、中医学、そして6つの伝統医学とAIを統合したパーソナルヘルスコンパニオン。',
    cta: '旅を始める', free: '無料 · アカウント不要 · プライベート',
    traditions: '8つの癒しの伝統', tradSub: 'すべての主要な癒しシステムを統合した初のAI',
    how: 'ヴァイドヤの癒しの仕組み',
    s1t: '体質を発見', s1d: '5つの質問でヴァータ、ピッタ、カパを特定。',
    s2t: 'ヴァイドヤが全伝統を参照', s2d: 'チャラカ・サンヒターなど8つの古典文献を同時参照。',
    s3t: 'ディープマインドモード', s3d: '8つの伝統全体にわたる高度な推論。',
    finalCta: '癒しはいつも自然の中にありました。', finalSub: 'ヴァイドヤがバランスへの道を案内します。常に無料。',
    footer: '教育目的のみ', clinic: 'クリニック向け →',
  },
  zh: {
    tagline: '古代智慧。\n现代AI。\n自然疗愈。',
    sub: '结合阿育吠陀、中医和6种古老治愈传统与AI力量的个人健康伴侣。',
    cta: '开始您的旅程', free: '免费 · 无需账户 · 私密',
    traditions: '8种治愈传统', tradSub: '第一个统一所有主要治愈系统的AI',
    how: 'VAIDYA如何治愈您',
    s1t: '了解您的体质', s1d: '5个问题揭示您的瓦塔、皮塔或卡法类型。',
    s2t: 'VAIDYA参考所有传统', s2d: '同时参考查拉卡本集、黄帝内经和其他6部经典文献。',
    s3t: '深度思维模式', s3d: '跨越8种传统的高级推理。',
    finalCta: '治愈一直存在于自然之中。', finalSub: '让VAIDYA引导您回归平衡。永远免费。',
    footer: '仅供教育目的', clinic: '诊所专区 →',
  },
  ko: {
    tagline: '고대의 지혜。\n현대 AI。\n자연 치유。',
    sub: '아유르베다, 중국 의학, 그리고 6가지 고대 치유 전통을 AI와 결합한 개인 건강 동반자。',
    cta: '여행 시작하기', free: '무료 · 계정 불필요 · 비공개',
    traditions: '8가지 치유 전통', tradSub: '모든 주요 치유 시스템을 통합한 최초의 AI',
    how: 'VAIDYA가 당신을 치유하는 방법',
    s1t: '체질 발견', s1d: '5가지 질문으로 바타, 피타 또는 카파 유형을 파악합니다.',
    s2t: 'VAIDYA가 모든 전통을 참고', s2d: '차라카 삼히타 등 8개 고전 문헌을 동시에 참조합니다。',
    s3t: '딥 마인드 모드', s3d: '8가지 전통 전반에 걸친 고급 추론。',
    finalCta: '치유는 항상 자연에 있었습니다。', finalSub: 'VAIDYA가 균형으로 안내합니다。항상 무료。',
    footer: '교육 목적으로만', clinic: '클리닉 전용 →',
  },
  ar: {
    tagline: 'الحكمة القديمة.\nالذكاء الاصطناعي.\nالشفاء الطبيعي.',
    sub: 'رفيقك الصحي — يجمع بين الأيورفيدا والطب الصيني و6 تقاليد علاجية قديمة.',
    cta: 'ابدأ رحلتك', free: 'مجاني · لا حساب · خاص',
    traditions: '٨ تقاليد علاجية', tradSub: 'أول ذكاء اصطناعي يوحد جميع أنظمة الشفاء الرئيسية',
    how: 'كيف يشفيك VAIDYA',
    s1t: 'اكتشف دستورك الصحي', s1d: '٥ أسئلة تكشف نوعك.',
    s2t: 'VAIDYA يستشير جميع التقاليد', s2d: 'يرجع إلى شاراكا سامهيتا وهوانغدي نيجينغ في آنٍ واحد.',
    s3t: 'وضع العقل العميق', s3d: 'استدلال متقدم عبر جميع التقاليد الثماني.',
    finalCta: 'الشفاء كان دائماً في الطبيعة.', finalSub: 'دع VAIDYA يرشدك نحو التوازن. مجاني دائماً.',
    footer: 'للأغراض التعليمية فقط', clinic: 'للعيادات →',
  },
  es: {
    tagline: 'Sabiduría Antigua.\nIA Moderna.\nSanación Natural.',
    sub: 'Tu compañero de salud — combinando Ayurveda, Medicina China y 6 tradiciones de sanación con IA.',
    cta: 'Comienza Tu Viaje', free: 'Gratis · Sin cuenta · Privado',
    traditions: '8 Tradiciones de Sanación', tradSub: 'La primera IA que unifica todos los sistemas de curación',
    how: 'Cómo VAIDYA Te Sana',
    s1t: 'Descubre Tu Constitución', s1d: 'Una evaluación de 5 preguntas revela tu tipo Vata, Pitta o Kapha.',
    s2t: 'VAIDYA Consulta Todas las Tradiciones', s2d: 'Cruza referencias entre 8 textos clásicos simultáneamente.',
    s3t: 'Modo Mente Profunda', s3d: 'Razonamiento avanzado a través de las 8 tradiciones.',
    finalCta: 'La sanación siempre ha sido natural.', finalSub: 'Deja que VAIDYA te guíe de vuelta al equilibrio.',
    footer: 'Solo con fines educativos', clinic: 'Para Clínicas →',
  },
}

const getT = (code: string) => T[code] || T['en']

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

const STATS = [
  { num: '50+', label: 'Languages' },
  { num: '8', label: 'Traditions' },
  { num: '5K', label: 'Years of Wisdom' },
  { num: '100%', label: 'Free' },
]

const FEATURES = [
  { icon: '🧬', title: 'Discover Your Dosha', desc: 'A 5-question quiz identifies your Vata, Pitta or Kapha body type. Every recommendation is then personalized to you.' },
  { icon: '🌿', title: 'Herb & Diet Guidance', desc: 'Specific herbs with classical doses from Charaka Samhita. Generate a personalized 7-day diet chart for your constitution.' },
  { icon: '📄', title: 'Blood Report Analysis', desc: 'Upload your lab reports. VAIDYA analyzes each biomarker from both modern medicine and Ayurvedic perspectives.' },
  { icon: '🧠', title: 'VAIDYA Deep Mind', desc: 'Advanced reasoning across all 8 traditions for complex conditions. Deeper analysis with classical citations.' },
  { icon: '🌍', title: '50+ Languages', desc: 'Consult in Hindi, Tamil, Japanese, Arabic, Sanskrit and 45+ more. Ancient wisdom in your own language.' },
  { icon: '🔒', title: 'Private by Default', desc: 'Your conversations stay in your browser only. Nothing stored on servers. No account needed. Ever.' },
]

export default function LandingPage() {
  const [lang, setLang] = useState('en')
  const t = getT(lang)
  const isRTL = ['ar', 'fa', 'ur', 'he'].includes(lang)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('ayura_lang')
    if (saved) setLang(saved)
  }, [])

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'} style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #05100a !important; color: #e8dfc8; -webkit-font-smoothing: antialiased; }

        /* ── Scroll progress ── */
        .scroll-bar { position: fixed; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #2d7a45, #6abf8a, #c9a84c); transform-origin: 0%; z-index: 999; }

        /* ── Hero ── */
        .hero-tagline {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.4rem, 6.5vw, 5.8rem);
          font-weight: 700;
          line-height: 1.06;
          letter-spacing: -0.025em;
          white-space: pre-line;
          background: linear-gradient(150deg, #e8dfc8 0%, #c9a84c 35%, #6abf8a 65%, #2d7a45 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Buttons ── */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: linear-gradient(135deg, #1a4d2e 0%, #2d7a45 50%, #3a9455 100%);
          color: #e8dfc8; padding: 0.95rem 2.4rem; border-radius: 980px;
          font-size: 1rem; font-weight: 600; text-decoration: none;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 4px 28px rgba(45,122,69,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
          border: 1px solid rgba(106,191,138,0.35);
          position: relative; overflow: hidden;
        }
        .btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent);
          opacity: 0; transition: opacity 0.25s;
        }
        .btn-primary:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 14px 44px rgba(45,122,69,0.65), inset 0 1px 0 rgba(255,255,255,0.15); }
        .btn-primary:hover::before { opacity: 1; }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          color: rgba(232,223,200,0.85); padding: 0.95rem 2rem; border-radius: 980px;
          font-size: 0.95rem; font-weight: 500; text-decoration: none;
          transition: all 0.22s; border: 1px solid rgba(232,223,200,0.16);
        }
        .btn-secondary:hover { background: rgba(232,223,200,0.06); border-color: rgba(232,223,200,0.4); transform: translateY(-1px); }

        /* ── Stat bar ── */
        .stat-card { text-align: center; }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem; font-weight: 300; color: #6abf8a; line-height: 1;
          background: linear-gradient(135deg, #6abf8a, #c9a84c);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .stat-label { font-size: 0.72rem; color: rgba(232,223,200,0.4); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.35rem; }

        /* ── Feature cards (glassmorphism) ── */
        .feat-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(106,191,138,0.03) 100%);
          border: 1px solid rgba(106,191,138,0.1);
          border-radius: 20px; padding: 1.8rem;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          position: relative; overflow: hidden;
          backdrop-filter: blur(4px);
        }
        .feat-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at top left, rgba(106,191,138,0.06), transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .feat-card::after {
          content: ''; position: absolute;
          top: -1px; left: -1px; right: -1px; bottom: -1px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(106,191,138,0.2), transparent 40%, rgba(201,168,76,0.1));
          opacity: 0; transition: opacity 0.3s;
          pointer-events: none;
        }
        .feat-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.45); border-color: transparent; }
        .feat-card:hover::before { opacity: 1; }
        .feat-card:hover::after { opacity: 1; }
        .feat-icon { font-size: 2rem; margin-bottom: 1rem; display: block; filter: drop-shadow(0 0 8px rgba(106,191,138,0.3)); }

        /* ── Tradition cards ── */
        .trad-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(106,191,138,0.08);
          border-radius: 16px; padding: 1.3rem;
          transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
        }
        .trad-card:hover { background: rgba(106,191,138,0.06); border-color: rgba(106,191,138,0.25); transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); }

        /* ── Steps ── */
        .step-row { display: grid; grid-template-columns: 80px 1fr; gap: 2rem; align-items: start; padding: 2.5rem 0; border-bottom: 1px solid rgba(106,191,138,0.07); }
        .step-row:last-child { border-bottom: none; }
        .step-num { font-family: 'Cormorant Garamond', serif; font-size: 4rem; font-weight: 300; line-height: 1; color: rgba(201,168,76,0.35); }

        /* ── Divider ── */
        .divider { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(106,191,138,0.1), transparent); }

        /* ── Glow orbs ── */
        .glow { position: absolute; border-radius: 50%; filter: blur(130px); pointer-events: none; }

        /* ── Testimonial ── */
        .quote-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(106,191,138,0.07); border-radius: 18px; padding: 1.7rem; transition: all 0.25s; }
        .quote-card:hover { border-color: rgba(106,191,138,0.18); transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.4); }

        /* ── Newsletter ── */
        .newsletter-input {
          flex: 1; padding: 0.85rem 1.2rem;
          border-radius: 980px; border: 1px solid rgba(106,191,138,0.2);
          background: rgba(255,255,255,0.04); color: #e8dfc8;
          font-size: 0.9rem; outline: none; font-family: inherit;
          transition: border-color 0.2s, background 0.2s;
        }
        .newsletter-input::placeholder { color: rgba(232,223,200,0.3); }
        .newsletter-input:focus { border-color: rgba(106,191,138,0.5); background: rgba(255,255,255,0.06); }

        /* ── Footer links ── */
        .footer-link { color: rgba(232,223,200,0.25); font-size: 0.72rem; text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: rgba(232,223,200,0.65); }

        /* ── Badge pill ── */
        .badge { display: inline-flex; align-items: center; gap: 0.45rem; background: rgba(106,191,138,0.07); border: 1px solid rgba(106,191,138,0.18); border-radius: 980px; padding: 0.38rem 1.1rem; }

        /* ── Sample response box ── */
        .sample-box { background: rgba(4,12,8,0.9); border: 1px solid rgba(106,191,138,0.14); border-radius: 22px; padding: 1.8rem 2rem; backdrop-filter: blur(16px); }

        @media(max-width:640px) {
          .step-row { grid-template-columns: 52px 1fr; gap: 1rem; }
          .step-num { font-size: 2.6rem; }
          .sample-box { padding: 1.2rem 1.2rem; }
        }
      `}</style>

      {/* Scroll progress bar */}
      <motion.div className="scroll-bar" style={{ scaleX }} />

      {/* Shared Nav */}
      <Nav lang={lang} onLangChange={setLang} showLangPicker={true} links={[
        { label: '💳 Pricing', href: '/pricing' },
        { label: t.clinic, href: '/clinic' },
      ]} />

      {/* ═══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glows */}
        <div className="glow" style={{ top: '-15%', left: '50%', transform: 'translateX(-50%)', width: 1200, height: 900, background: 'radial-gradient(ellipse, rgba(26,77,46,0.32) 0%, rgba(106,191,138,0.05) 40%, transparent 65%)' }} />
        <div className="glow" style={{ top: '30%', right: '-20%', width: 600, height: 600, background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
        <div className="glow" style={{ bottom: '5%', left: '-15%', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(45,122,69,0.1) 0%, transparent 70%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 22 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Live badge */}
          <div className="badge" style={{ marginBottom: '2rem' }}>
            <span className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#6abf8a', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(106,191,138,0.85)', fontFamily: '-apple-system, sans-serif' }}>
              {t.free}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 70, damping: 20, delay: 0.08 }}
          className="hero-tagline"
          style={{ position: 'relative', zIndex: 1, marginBottom: '1.8rem' }}
        >
          {t.tagline}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 22, delay: 0.18 }}
          style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: 'rgba(232,223,200,0.58)', maxWidth: 560, lineHeight: 1.8, marginBottom: '3rem', fontFamily: '-apple-system, sans-serif' }}
        >
          {t.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 22, delay: 0.28 }}
          style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href={`/chat?lang=${lang}`} className="btn-primary">
              Start Free Assessment →
            </Link>
            <Link href="/diet" className="btn-secondary">🌿 Get Diet Chart</Link>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'rgba(106,191,138,0.45)', letterSpacing: '0.07em', fontFamily: '-apple-system, sans-serif' }}>
            3 free AI consultations · Upgrade from $4.99/mo · No credit card needed
          </span>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '3rem 2rem', borderTop: '1px solid rgba(106,191,138,0.07)', borderBottom: '1px solid rgba(106,191,138,0.07)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              className="stat-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 80, damping: 20 }}
            >
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 2rem', maxWidth: 1060, margin: '0 auto' }}>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ textAlign: 'center', color: 'rgba(106,191,138,0.4)', fontSize: '0.72rem', marginBottom: '3rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: '-apple-system, sans-serif' }}
        >
          What AyuraHealth does for you
        </motion.p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="feat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 80, damping: 20 }}
            >
              <span className="feat-icon">{f.icon}</span>
              <div style={{ fontSize: '0.97rem', fontWeight: 600, color: '#e8dfc8', marginBottom: '0.6rem', fontFamily: '-apple-system, sans-serif' }}>{f.title}</div>
              <div style={{ fontSize: '0.83rem', color: 'rgba(232,223,200,0.42)', lineHeight: 1.75, fontFamily: '-apple-system, sans-serif' }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════════════════════════════════════════════
          SAMPLE RESPONSE
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 2rem', maxWidth: 720, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p style={{ textAlign: 'center', color: 'rgba(106,191,138,0.4)', fontSize: '0.72rem', marginBottom: '1rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '-apple-system, sans-serif' }}>Sample VAIDYA Response</p>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 300, textAlign: 'center', color: '#e8dfc8', marginBottom: '2.5rem' }}>
            Ask anything. Get wisdom from 5,000 years.
          </h2>
          <div className="sample-box">
            <div style={{ background: 'rgba(45,90,27,0.12)', border: '1px solid rgba(106,191,138,0.1)', borderRadius: 12, padding: '0.85rem 1.1rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: 'rgba(232,223,200,0.55)', fontFamily: '-apple-system, sans-serif' }}>
              💬 &quot;I feel anxious, sleep poorly, and my digestion is irregular. What should I do?&quot;
            </div>
            <p style={{ color: '#c9a84c', fontWeight: 600, marginBottom: '0.6rem', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>✦ VAIDYA&apos;S SYNTHESIS</p>
            <p style={{ fontSize: '0.86rem', color: 'rgba(232,223,200,0.7)', lineHeight: 1.85, marginBottom: '1rem', fontFamily: '-apple-system, sans-serif' }}>
              These three symptoms together point to classic <strong style={{ color: '#6abf8a' }}>Vata imbalance</strong> — your air and space elements are in excess. Charaka Samhita describes this exact pattern in Nidanasthana Ch.1.
            </p>
            <p style={{ color: '#6abf8a', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.78rem' }}>🌿 Ayurvedic View</p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(232,223,200,0.5)', lineHeight: 1.75, marginBottom: '1rem', fontFamily: '-apple-system, sans-serif' }}>Ashwagandha 500mg with warm milk at night. Brahmi for the mind. Sesame oil self-massage. Warm cooked foods only.</p>
            <p style={{ color: '#6abf8a', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.78rem' }}>☯️ Chinese Medicine View</p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(232,223,200,0.38)', lineHeight: 1.75, marginBottom: '1.5rem', fontFamily: '-apple-system, sans-serif' }}>Heart and Spleen Qi deficiency. Jujube seed tea (酸枣仁) before sleep. Acupoints HT-7, SP-6 recommended...</p>
            <Link href="/chat" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#6abf8a', textDecoration: 'none', border: '1px solid rgba(106,191,138,0.22)', padding: '0.55rem 1.1rem', borderRadius: 980, transition: 'all 0.2s' }}>
              Get your full personalized response →
            </Link>
          </div>
        </motion.div>
      </section>

      <div className="divider" />

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 2rem', maxWidth: 920, margin: '0 auto' }}>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ textAlign: 'center', color: 'rgba(106,191,138,0.4)', fontSize: '0.72rem', marginBottom: '3.5rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '-apple-system, sans-serif' }}>
          Why people trust AyuraHealth
        </motion.p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
          {[
            { quote: 'Finally explains WHY I should take turmeric — not just that I should. The Charaka Samhita citations are real.', name: 'Priya S.', location: 'Mumbai, India' },
            { quote: 'I uploaded my blood report and VAIDYA mapped my high cortisol to Pitta aggravation. My Ayurvedic doctor agreed completely.', name: 'Kenji T.', location: 'Tokyo, Japan' },
            { quote: 'Most authentic AI health tool I have found. It actually knows the classical texts and uses them properly.', name: 'Arjun M.', location: 'Bangalore, India' },
          ].map((item, i) => (
            <motion.div key={i} className="quote-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div style={{ fontSize: '1.4rem', color: '#c9a84c', marginBottom: '0.85rem', lineHeight: 1 }}>❝</div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(232,223,200,0.58)', lineHeight: 1.8, fontFamily: '-apple-system, sans-serif', marginBottom: '1.1rem' }}>{item.quote}</p>
              <div style={{ fontSize: '0.78rem', color: '#6abf8a', fontFamily: '-apple-system, sans-serif' }}>{item.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(232,223,200,0.28)', fontFamily: '-apple-system, sans-serif' }}>{item.location}</div>
            </motion.div>
          ))}
        </div>

        {/* Trust pillars */}
        <div style={{ background: 'rgba(45,90,27,0.05)', border: '1px solid rgba(106,191,138,0.09)', borderRadius: 18, padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: '📚', title: 'Classical Sources', desc: 'Every recommendation traces to primary texts — Charaka Samhita, Ashtanga Hridayam, Huangdi Neijing. Not generic internet wellness.' },
            { icon: '🔬', title: 'How the AI Works', desc: 'VAIDYA cross-references 8 healing tradition databases simultaneously. Deep Mind uses a 120B parameter model for complex analysis.' },
            { icon: '⚕️', title: 'Safety First', desc: 'Educational guidance only. Always consult a qualified practitioner for serious conditions or emergencies.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e8dfc8', marginBottom: '0.4rem', fontFamily: '-apple-system, sans-serif' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(232,223,200,0.38)', lineHeight: 1.65, fontFamily: '-apple-system, sans-serif' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════════════════════════════════════════════
          8 TRADITIONS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', fontWeight: 300, textAlign: 'center', marginBottom: '0.5rem', color: '#e8dfc8' }}>{t.traditions}</h2>
          <p style={{ textAlign: 'center', color: 'rgba(106,191,138,0.4)', fontSize: '0.75rem', marginBottom: '3rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: '-apple-system, sans-serif' }}>{t.tradSub}</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '0.85rem' }}>
          {TRADITIONS.map((item, i) => (
            <motion.div key={i} className="trad-card" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <div style={{ fontSize: '1.7rem', marginBottom: '0.7rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#e8dfc8', marginBottom: '0.3rem', fontFamily: '-apple-system, sans-serif' }}>{item.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(232,223,200,0.28)', fontFamily: '-apple-system, sans-serif' }}>{item.origin}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════════════════════════════════════════════
          HOW VAIDYA WORKS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 2rem', maxWidth: 780, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', fontWeight: 300, marginBottom: '3.5rem', color: '#e8dfc8' }}>
          {t.how}
        </motion.h2>
        {[
          { n: '01', title: t.s1t, desc: t.s1d, badge: null },
          { n: '02', title: t.s2t, desc: t.s2d, badge: null },
          { n: '03', title: t.s3t, desc: t.s3d, badge: 'VAIDYA Deep Mind' },
        ].map((s, i) => (
          <motion.div key={i} className="step-row" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <div className="step-num">{s.n}</div>
            <div style={{ paddingTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', fontWeight: 400, color: '#e8dfc8' }}>{s.title}</h3>
                {s.badge && <span style={{ fontSize: '0.62rem', background: 'rgba(106,191,138,0.1)', border: '1px solid rgba(106,191,138,0.28)', color: 'rgba(106,191,138,0.85)', padding: '0.15rem 0.55rem', borderRadius: 980, letterSpacing: '0.05em', whiteSpace: 'nowrap', fontFamily: '-apple-system, sans-serif' }}>{s.badge}</span>}
              </div>
              <p style={{ color: 'rgba(232,223,200,0.42)', fontSize: '0.9rem', lineHeight: 1.85, fontFamily: '-apple-system, sans-serif' }}>{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="divider" />

      {/* ═══════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="glow" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 600, background: 'radial-gradient(ellipse, rgba(26,77,46,0.2) 0%, transparent 65%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3.2rem', marginBottom: '1.5rem' }}>🌿</div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', fontWeight: 300, lineHeight: 1.12, marginBottom: '1.1rem', color: '#e8dfc8' }}>{t.finalCta}</h2>
          <p style={{ color: 'rgba(232,223,200,0.38)', marginBottom: '2.8rem', fontSize: '0.95rem', fontFamily: '-apple-system, sans-serif' }}>{t.finalSub}</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/chat?lang=${lang}`} className="btn-primary" style={{ fontSize: '1.05rem', padding: '1rem 3rem' }}>Start Free Assessment →</Link>
            <Link href="/diet" className="btn-secondary">Generate Diet Chart</Link>
          </div>
          <p style={{ marginTop: '1.8rem', fontSize: '0.73rem', color: 'rgba(232,223,200,0.18)', fontFamily: '-apple-system, sans-serif' }}>⚕️ Educational guidance only · Not a substitute for professional medical advice</p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '3.5rem 1rem', background: 'rgba(45,90,27,0.05)', borderTop: '1px solid rgba(106,191,138,0.07)' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 300, fontFamily: '"Cormorant Garamond", serif', color: '#e8dfc8', marginBottom: '0.6rem' }}>Stay Updated</h3>
          <p style={{ color: 'rgba(232,223,200,0.45)', marginBottom: '1.5rem', fontSize: '0.88rem', fontFamily: '-apple-system, sans-serif' }}>Get the latest on new features, health insights, and announcements.</p>
          <form style={{ display: 'flex', gap: '0.6rem', maxWidth: 400, margin: '0 auto' }} onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" className="newsletter-input" />
            <button
              type="submit"
              style={{ padding: '0.85rem 1.5rem', background: 'linear-gradient(135deg, #1a4d2e, #2d7a45)', color: '#e8dfc8', border: '1px solid rgba(106,191,138,0.3)', borderRadius: 980, fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(45,122,69,0.5)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = '' }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid rgba(106,191,138,0.07)', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(232,223,200,0.18)', fontSize: '0.7rem', marginBottom: '1.2rem', fontFamily: '-apple-system, sans-serif' }}>{t.footer}</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Testimonials', '/testimonials'], ['Press Kit', '/press-kit'], ['Pricing', '/pricing'], ['For Clinics', '/clinic'], ['Diet Chart', '/diet'], ['Contact', '/contact']].map(([label, href]) => (
            <a key={href} href={href} className="footer-link">{label}</a>
          ))}
        </div>
        <p style={{ color: 'rgba(232,223,200,0.12)', fontSize: '0.68rem', fontFamily: '-apple-system, sans-serif' }}>© 2026 AyuraHealth · Tokyo, Japan</p>
      </footer>

      <style>{`
        @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.82); } }
        @media(max-width:480px) { .stat-card .stat-num { font-size: 1.7rem; } }
      `}</style>
    </main>
  )
}