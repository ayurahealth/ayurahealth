'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'zh', name: 'Chinese', native: '简体中文' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'fa', name: 'Persian', native: 'فارسی' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
  { code: 'th', name: 'Thai', native: 'ภาษาไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල' },
  { code: 'my', name: 'Burmese', native: 'မြန်မာဘာသာ' },
  { code: 'km', name: 'Khmer', native: 'ភាសាខ្មែរ' },
  { code: 'mn', name: 'Mongolian', native: 'Монгол' },
  { code: 'ka', name: 'Georgian', native: 'ქართული' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans' },
  { code: 'da', name: 'Danish', native: 'Dansk' },
  { code: 'fi', name: 'Finnish', native: 'Suomi' },
  { code: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'zh-TW', name: 'Chinese Traditional', native: '繁體中文' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'lo', name: 'Lao', native: 'ພາສາລາວ' },
  { code: 'bg', name: 'Bulgarian', native: 'Български' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', native: 'Српски' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina' },
]

const T: Record<string, {
  tagline: string, sub: string, cta: string, free: string,
  traditions: string, tradSub: string,
  how: string, s1t: string, s1d: string, s2t: string, s2d: string, s3t: string, s3d: string,
  finalCta: string, finalSub: string, footer: string, clinic: string
}> = {
  en: {
    tagline: 'AYURAHEALTH\nAI Wellness Platform',
    sub: 'Personalized Ayurvedic guidance powered by AI.',
    cta: 'Begin Your Journey', free: 'Free · No account required · Private',
    traditions: '8 Healing Traditions', tradSub: 'The first AI to unify all major healing systems',
    how: 'How VAIDYA Heals You',
    s1t: 'Discover Your Constitution', s1d: 'A 5-question assessment reveals your Vata, Pitta, or Kapha type — drawn from 5,000 years of Ayurvedic wisdom.',
    s2t: 'VAIDYA Consults All Traditions', s2d: 'Cross-references Charaka Samhita, Huangdi Neijing, and 6 other classical texts. Ancient wisdom meets modern evidence.',
    s3t: 'Deep Mind Mode', s3d: 'Advanced reasoning across all 8 traditions. Deeper cross-tradition analysis for complex health questions.',
    finalCta: 'Healing has always been natural.', finalSub: 'Let VAIDYA guide you back to balance. Free, always.',
    footer: 'For educational purposes only · Not a substitute for professional medical advice', clinic: 'For Clinics →',
  },
  sa: {
    tagline: 'प्राचीनं ज्ञानम्।\nआधुनिकं AI।\nप्राकृतिकी चिकित्सा।',
    sub: 'आयुर्वेद, चीनीयचिकित्सा च षट् अन्याभिः परम्पराभिः सहितः आपणः स्वास्थ्यसहायकः।',
    cta: 'यात्रां आरभ्यताम्', free: 'निःशुल्कम् · खाता न आवश्यकम् · गोपनीयम्',
    traditions: '८ चिकित्साः परम्पराः', tradSub: 'सर्वाः प्रमुखाः चिकित्साप्रणाल्यः एकीकर्तुं प्रथमः AI',
    how: 'वैद्यः कथं चिकित्सति',
    s1t: 'स्वप्रकृतिं जानीयात्', s1d: 'पञ्चप्रश्नैः वात-पित्त-कफप्रकृतिः निर्धार्यते। ५,०००-वर्षीयायुर्वेदज्ञानात्।',
    s2t: 'वैद्यः सर्वाः परम्पराः परामर्शयति', s2d: 'चरकसंहिता, हुआंगदीनेइजिंग च षट् अन्यग्रन्थान् एकदा संदर्भयति।',
    s3t: 'दीपमनःप्रकारः', s3d: 'सर्वाभ्यः ८ परम्पराभ्यः उन्नतं विचारणम्। जटिलस्वास्थ्यप्रश्नेभ्यः गभीरतरं विश्लेषणम्।',
    finalCta: 'आरोग्यं सदा प्राकृतिकम् आसीत्।', finalSub: 'वैद्यः भवन्तं संतुलनं प्रति नयतु। सर्वदा निःशुल्कम्।',
    footer: 'केवलं शैक्षिकप्रयोजनाय · वृत्तिगतचिकित्साप्रस्तावस्य विकल्पः नास्ति', clinic: 'चिकित्सालयेभ्यः →',
  },
  hi: {
    tagline: 'प्राचीन ज्ञान।\nआधुनिक AI।\nप्राकृतिक उपचार।',
    sub: 'आयुर्वेद, चीनी चिकित्सा और 6 प्राचीन परंपराओं को AI के साथ जोड़ने वाला आपका स्वास्थ्य साथी।',
    cta: 'यात्रा शुरू करें', free: 'निःशुल्क · कोई खाता नहीं · निजी',
    traditions: '8 उपचार परंपराएं', tradSub: 'सभी प्रमुख उपचार प्रणालियों को एकीकृत करने वाला पहला AI',
    how: 'VAIDYA आपको कैसे ठीक करता है',
    s1t: 'अपनी प्रकृति जानें', s1d: '5 प्रश्नों से वात, पित्त या कफ की पहचान — 5,000 वर्षों के आयुर्वेदिक ज्ञान से।',
    s2t: 'VAIDYA सभी परंपराओं से परामर्श करता है', s2d: 'चरक संहिता, हुआंगदी नेइजिंग और 6 अन्य ग्रंथों को एक साथ संदर्भित करता है।',
    s3t: 'डीप माइंड मोड', s3d: 'सभी 8 परंपराओं में उन्नत तर्क। जटिल स्वास्थ्य प्रश्नों के लिए गहरा विश्लेषण।',
    finalCta: 'उपचार हमेशा प्रकृति में था।', finalSub: 'VAIDYA को आपको संतुलन की ओर ले जाने दें। हमेशा मुफ्त।',
    footer: 'केवल शैक्षिक उद्देश्यों के लिए · पेशेवर चिकित्सा सलाह का विकल्प नहीं', clinic: 'क्लीनिक के लिए →',
  },
  ja: {
    tagline: '古代の智慧。\n現代のAI。\n自然な癒し。',
    sub: 'アーユルヴェーダ、中医学、そして6つの伝統医学とAIを統合したパーソナルヘルスコンパニオン。',
    cta: '旅を始める', free: '無料 · アカウント不要 · プライベート',
    traditions: '8つの癒しの伝統', tradSub: 'すべての主要な癒しシステムを統合した初のAI',
    how: 'ヴァイドヤの癒しの仕組み',
    s1t: '体質を発見', s1d: '5つの質問でヴァータ、ピッタ、カパを特定。5,000年のアーユルヴェーダの知恵から。',
    s2t: 'ヴァイドヤが全伝統を参照', s2d: 'チャラカ・サンヒター、黄帝内経など8つの古典文献を同時に参照。',
    s3t: 'ディープマインドモード', s3d: '8つの伝統全体にわたる高度な推論。複雑な健康問題に対するより深い分析。',
    finalCta: '癒しはいつも自然の中にありました。', finalSub: 'ヴァイドヤがバランスへの道を案内します。常に無料。',
    footer: '教育目的のみ · 専門的な医療アドバイスの代替ではありません', clinic: 'クリニック向け →',
  },
  zh: {
    tagline: '古代智慧。\n现代AI。\n自然疗愈。',
    sub: '结合阿育吠陀、中医和6种古老治愈传统与AI力量的个人健康伴侣。',
    cta: '开始您的旅程', free: '免费 · 无需账户 · 私密',
    traditions: '8种治愈传统', tradSub: '第一个统一所有主要治愈系统的AI',
    how: 'VAIDYA如何治愈您',
    s1t: '了解您的体质', s1d: '5个问题揭示您的瓦塔、皮塔或卡法类型——源自5000年的阿育吠陀智慧。',
    s2t: 'VAIDYA参考所有传统', s2d: '同时参考查拉卡本集、黄帝内经和其他6部经典文献。',
    s3t: '深度思维模式', s3d: '跨越8种传统的高级推理。对复杂健康问题进行更深入的跨传统分析。',
    finalCta: '治愈一直存在于自然之中。', finalSub: '让VAIDYA引导您回归平衡。永远免费。',
    footer: '仅供教育目的 · 不能替代专业医疗建议', clinic: '诊所专区 →',
  },
  ko: {
    tagline: '고대의 지혜。\n현대 AI。\n자연 치유。',
    sub: '아유르베다, 중국 의학, 그리고 6가지 고대 치유 전통을 AI와 결합한 개인 건강 동반자。',
    cta: '여행 시작하기', free: '무료 · 계정 불필요 · 비공개',
    traditions: '8가지 치유 전통', tradSub: '모든 주요 치유 시스템을 통합한 최초의 AI',
    how: 'VAIDYA가 당신을 치유하는 방법',
    s1t: '체질 발견', s1d: '5가지 질문으로 바타, 피타 또는 카파 유형을 파악합니다.',
    s2t: 'VAIDYA가 모든 전통을 참고', s2d: '차라카 삼히타, 황제내경 등 8개 고전 문헌을 동시에 참조합니다。',
    s3t: '딥 마인드 모드', s3d: '8가지 전통 전반에 걸친 고급 추론。복잡한 건강 문제에 대한 심층 분석。',
    finalCta: '치유는 항상 자연에 있었습니다。', finalSub: 'VAIDYA가 균형으로 안내합니다。항상 무료。',
    footer: '교육 목적으로만 · 전문 의료 조언을 대체하지 않음', clinic: '클리닉 전용 →',
  },
  ar: {
    tagline: 'الحكمة القديمة.\nالذكاء الاصطناعي الحديث.\nالشفاء الطبيعي.',
    sub: 'رفيقك الصحي الشخصي — يجمع بين الأيورفيدا والطب الصيني و6 تقاليد علاجية قديمة.',
    cta: 'ابدأ رحلتك', free: 'مجاني · لا حساب مطلوب · خاص',
    traditions: '٨ تقاليد علاجية', tradSub: 'أول ذكاء اصطناعي يوحد جميع أنظمة الشفاء الرئيسية',
    how: 'كيف يشفيك VAIDYA',
    s1t: 'اكتشف دستورك الصحي', s1d: '٥ أسئلة تكشف نوعك من فاتا أو بيتا أو كافا — مستمدة من ٥٠٠٠ عام من حكمة الأيورفيدا.',
    s2t: 'VAIDYA يستشير جميع التقاليد', s2d: 'يرجع في آنٍ واحد إلى شاراكا سامهيتا وهوانغدي نيجينغ و٦ نصوص كلاسيكية أخرى.',
    s3t: 'وضع العقل العميق', s3d: 'استدلال متقدم عبر جميع التقاليد الثماني. تحليل أعمق للأسئلة الصحية المعقدة.',
    finalCta: 'الشفاء كان دائماً في الطبيعة.', finalSub: 'دع VAIDYA يرشدك نحو التوازن. مجاني دائماً.',
    footer: 'للأغراض التعليمية فقط · لا يغني عن الاستشارة الطبية المتخصصة', clinic: 'للعيادات →',
  },
  es: {
    tagline: 'Sabiduría Antigua.\nIA Moderna.\nSanación Natural.',
    sub: 'Tu compañero de salud personal — combinando Ayurveda, Medicina China y 6 tradiciones de sanación ancestrales con IA.',
    cta: 'Comienza Tu Viaje', free: 'Gratis · Sin cuenta · Privado',
    traditions: '8 Tradiciones de Sanación', tradSub: 'La primera IA que unifica todos los sistemas de curación principales',
    how: 'Cómo VAIDYA Te Sana',
    s1t: 'Descubre Tu Constitución', s1d: 'Una evaluación de 5 preguntas revela tu tipo Vata, Pitta o Kapha — basada en 5,000 años de sabiduría Ayurvédica.',
    s2t: 'VAIDYA Consulta Todas las Tradiciones', s2d: 'Cruza referencias entre Charaka Samhita, Huangdi Neijing y 6 textos clásicos más simultáneamente.',
    s3t: 'Modo Mente Profunda', s3d: 'Razonamiento avanzado a través de las 8 tradiciones. Análisis más profundo para preguntas de salud complejas.',
    finalCta: 'La sanación siempre ha sido natural.', finalSub: 'Deja que VAIDYA te guíe de vuelta al equilibrio. Gratis, siempre.',
    footer: 'Solo con fines educativos · No es un sustituto del consejo médico profesional', clinic: 'Para Clínicas →',
  },
  fr: {
    tagline: 'Sagesse Ancienne.\nIA Moderne.\nGuérison Naturelle.',
    sub: 'Votre compagnon de santé personnel — combinant l\'Ayurveda, la Médecine Chinoise et 6 traditions de guérison ancestrales avec l\'IA.',
    cta: 'Commencez Votre Voyage', free: 'Gratuit · Sans compte · Privé',
    traditions: '8 Traditions de Guérison', tradSub: 'La première IA à unifier tous les grands systèmes de guérison',
    how: 'Comment VAIDYA Vous Guérit',
    s1t: 'Découvrez Votre Constitution', s1d: 'Une évaluation de 5 questions révèle votre type Vata, Pitta ou Kapha — issue de 5 000 ans de sagesse Ayurvédique.',
    s2t: 'VAIDYA Consulte Toutes les Traditions', s2d: 'Croise les références entre Charaka Samhita, Huangdi Neijing et 6 autres textes classiques simultanément.',
    s3t: 'Mode Esprit Profond', s3d: 'Raisonnement avancé à travers les 8 traditions. Analyse plus approfondie pour les questions de santé complexes.',
    finalCta: 'La guérison a toujours été naturelle.', finalSub: 'Laissez VAIDYA vous guider vers l\'équilibre. Gratuit, toujours.',
    footer: 'À des fins éducatives uniquement · Ne remplace pas les conseils médicaux professionnels', clinic: 'Pour les Cliniques →',
  },
  de: {
    tagline: 'Altes Wissen.\nModerne KI.\nNatürliche Heilung.',
    sub: 'Ihr persönlicher Gesundheitsbegleiter — kombiniert Ayurveda, Chinesische Medizin und 6 alte Heiltraditionen mit KI.',
    cta: 'Beginnen Sie Ihre Reise', free: 'Kostenlos · Kein Konto · Privat',
    traditions: '8 Heiltraditionen', tradSub: 'Die erste KI, die alle wichtigen Heilsysteme vereint',
    how: 'Wie VAIDYA Sie Heilt',
    s1t: 'Entdecken Sie Ihre Konstitution', s1d: 'Eine 5-Fragen-Bewertung enthüllt Ihren Vata-, Pitta- oder Kapha-Typ — aus 5.000 Jahren Ayurvedischer Weisheit.',
    s2t: 'VAIDYA Konsultiert Alle Traditionen', s2d: 'Vergleicht gleichzeitig Charaka Samhita, Huangdi Neijing und 6 weitere klassische Texte.',
    s3t: 'Tiefgeist-Modus', s3d: 'Erweitertes Denken über alle 8 Traditionen hinweg. Tiefere Analyse für komplexe Gesundheitsfragen.',
    finalCta: 'Heilung war schon immer natürlich.', finalSub: 'Lassen Sie VAIDYA Sie zurück ins Gleichgewicht führen. Immer kostenlos.',
    footer: 'Nur zu Bildungszwecken · Kein Ersatz für professionellen medizinischen Rat', clinic: 'Für Kliniken →',
  },
}

// For languages without full translation, use English
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

export default function LandingPage() {
  const [lang, setLang] = useState('en')
  const [showPicker, setShowPicker] = useState(false)
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const t = getT(lang)
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]
  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const saved = localStorage.getItem('ayura_lang')
    if (saved && LANGUAGES.find(l => l.code === saved)) {
      setLang(saved)
    }
  }, [])

  useEffect(() => {
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
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setShowPicker(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectLang = (code: string) => {
    setLang(code)
    localStorage.setItem('ayura_lang', code)
    setShowPicker(false)
  }

  const isRTL = ['ar', 'fa', 'ur', 'he'].includes(lang)

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'} style={{ background: '#ffffff', minHeight: '100vh', color: '#2d5a1b', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #ffffff; color: #3d4a3e; }
        .hero-tagline { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem, 5vw, 4.5rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; white-space: pre-line; background: linear-gradient(160deg, #1a4d2e 0%, #3d7a28 50%, #6abf8a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .fade { animation: fadeUp 0.9s ease forwards; }
        .fade-2 { animation: fadeUp 0.9s 0.1s ease forwards; opacity: 0; }
        .fade-3 { animation: fadeUp 0.9s 0.2s ease forwards; opacity: 0; }
        .fade-4 { animation: fadeUp 0.9s 0.3s ease forwards; opacity: 0; }
        .fade-5 { animation: fadeUp 0.9s 0.4s ease forwards; opacity: 0; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }
        .btn-primary { display: inline-block; background: linear-gradient(135deg, #2d5a1b, #3d7a28); color: #e8dfc8; padding: 1rem 2.4rem; border-radius: 980px; font-size: 1rem; font-weight: 600; text-decoration: none; transition: all 0.25s; box-shadow: 0 4px 24px rgba(45,90,27,0.4); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(45,90,27,0.55); }
        .btn-secondary { display: inline-block; color: #e8dfc8; padding: 1rem 1.8rem; border-radius: 980px; font-size: 0.95rem; font-weight: 500; text-decoration: none; transition: all 0.2s; border: 1px solid rgba(232,223,200,0.3); }
        .btn-secondary:hover { background: rgba(232,223,200,0.08); border-color: rgba(232,223,200,0.6); }
        .lang-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(106,191,138,0.2); color: rgba(232,223,200,0.85); padding: 0.28rem 0.85rem; border-radius: 980px; font-size: 0.78rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; }
        .lang-btn:hover { border-color: rgba(106,191,138,0.5); color: #e8dfc8; background: rgba(106,191,138,0.08); }
        .nav-link { color: rgba(232,223,200,0.75); font-size: 0.82rem; text-decoration: none; transition: all 0.2s; border: 1px solid rgba(106,191,138,0.2); padding: 0.28rem 0.85rem; border-radius: 980px; }
        .nav-link:hover { color: #e8dfc8; border-color: rgba(106,191,138,0.5); }
        .picker-overlay { position: fixed; inset: 0; z-index: 999; display: flex; align-items: flex-start; justify-content: flex-end; padding: 56px 1rem 0; }
        .picker-box { background: rgba(12,22,12,0.97); border: 1px solid rgba(106,191,138,0.15); border-radius: 14px; width: 280px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.6); backdrop-filter: blur(20px); }
        .picker-search { width: 100%; background: rgba(255,255,255,0.04); border: none; border-bottom: 1px solid rgba(106,191,138,0.08); color: #e8dfc8; padding: 0.75rem 1rem; font-size: 0.85rem; outline: none; font-family: -apple-system, sans-serif; }
        .picker-search::placeholder { color: rgba(232,223,200,0.3); }
        .picker-list { max-height: 320px; overflow-y: auto; }
        .picker-list::-webkit-scrollbar { width: 3px; }
        .picker-list::-webkit-scrollbar-thumb { background: rgba(106,191,138,0.2); border-radius: 2px; }
        .lang-item { display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 1rem; cursor: pointer; transition: background 0.15s; }
        .lang-item:hover { background: rgba(106,191,138,0.06); }
        .lang-item.active { background: rgba(106,191,138,0.08); }
        .feature-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(106,191,138,0.1); border-radius: 16px; padding: 1.5rem; transition: all 0.25s; }
        .feature-card:hover { background: rgba(106,191,138,0.05); border-color: rgba(106,191,138,0.25); transform: translateY(-2px); }
        .trad-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(106,191,138,0.08); border-radius: 16px; padding: 1.25rem; transition: all 0.25s; }
        .trad-card:hover { background: rgba(106,191,138,0.06); border-color: rgba(106,191,138,0.2); transform: translateY(-3px); }
        .divider { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(106,191,138,0.12), transparent); }
        .step-row { display: grid; grid-template-columns: 80px 1fr; gap: 2rem; align-items: start; padding: 2.5rem 0; border-bottom: 1px solid rgba(106,191,138,0.08); }
        .step-row:last-child { border-bottom: none; }
        .step-num { font-family: 'Cormorant Garamond', serif; font-size: 4rem; font-weight: 300; line-height: 1; color: rgba(201,168,76,0.45); }
        .glow { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        @media (max-width: 600px) { .step-row { grid-template-columns: 56px 1fr; gap: 1rem; } .step-num { font-size: 2.8rem; } .picker-overlay { justify-content: center; padding-top: 56px; } .picker-box { width: calc(100vw - 2rem); } }
      `}</style>

      {showPicker && (
        <div className="picker-overlay" onClick={() => setShowPicker(false)}>
          <div className="picker-box" ref={pickerRef} onClick={e => e.stopPropagation()}>
            <input ref={searchRef} className="picker-search" placeholder="Search language..." value={search} onChange={e => setSearch(e.target.value)} />
            <div className="picker-list">
              {filtered.length === 0 && <div style={{ padding: '1rem', color: 'rgba(232,223,200,0.3)', fontSize: '0.8rem', textAlign: 'center' }}>No languages found</div>}
              {filtered.map(l => (
                <div key={l.code} className={`lang-item${l.code === lang ? ' active' : ''}`} onClick={() => selectLang(l.code)}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#e8dfc8' }}>{l.native}</span>
                    {l.native !== l.name && <span style={{ fontSize: '0.7rem', color: 'rgba(232,223,200,0.35)' }}>{l.name}</span>}
                  </div>
                  {l.code === lang && <span style={{ color: '#6abf8a', fontSize: '0.85rem' }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(106,191,138,0.15)' : 'none', transition: 'all 0.35s', boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} >
          <img src="/favicon.svg" alt="AyuraHealth" style={{ height: 38, width: 38 }} />
          <span style={{ fontFamily: '&quot;Cormorant Garamond&quot;, serif', fontSize: '1.35rem', fontWeight: 700, color: '#1a4d2e', letterSpacing: '0.02em' }}>AyuraHealth</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="lang-btn" onClick={() => setShowPicker(!showPicker)}>
            <span style={{ fontSize: '0.8rem' }}>🌐</span>
            <span>{currentLang.native}</span>
            <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>▾</span>
          </button>
          <Link href="/pricing" className="nav-link">💳 Pricing</Link>
          <Link href="/clinic" className="nav-link">{t.clinic}</Link>
        </div>
      </nav>

      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '7rem 2rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div className="glow" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 700, background: 'radial-gradient(ellipse, rgba(45,90,27,0.18) 0%, transparent 65%)' }} />
        <div className="fade" style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(106,191,138,0.08)', border: '1px solid rgba(106,191,138,0.2)', borderRadius: 980, padding: '0.35rem 1rem', marginBottom: '1.75rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6abf8a', display: 'inline-block' }}/>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(106,191,138,0.85)', fontFamily: '-apple-system, sans-serif' }}>Free · No account required · Private</span>
        </div>
        <div className="hero-tagline fade-2" style={{ position: 'relative', zIndex: 1, marginBottom: '1.5rem' }}>{t.tagline}</div>
        <p className="fade-3" style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)', color: 'rgba(232,223,200,0.65)', maxWidth: 600, lineHeight: 1.7, marginBottom: '2.5rem', fontFamily: '-apple-system, sans-serif' }}>
          {t.sub}
        </p>
        <div className="fade-5" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href={`/chat?lang=${lang}`} className="btn-primary">Start Your Assessment →</Link>
            <Link href="/diet" className="btn-secondary">🌿 Get Diet Chart</Link>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'rgba(232,223,200,0.3)', letterSpacing: '0.05em', fontFamily: '-apple-system, sans-serif' }}>50+ languages · Sanskrit included · always free</span>
        </div>
      </section>

      <div className="divider" />

      <section style={{ padding: '5rem 2rem', maxWidth: 980, margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: 'rgba(232,223,200,0.3)', fontSize: '0.75rem', marginBottom: '2.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: '-apple-system, sans-serif' }}>What AyuraHealth does for you</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '🧬', title: 'Discover Your Dosha', desc: 'A 5-question quiz identifies your Vata, Pitta or Kapha body type. Every recommendation is then personalized to you.' },
            { icon: '🌿', title: 'Herb & Diet Guidance', desc: 'Specific herbs with classical doses from Charaka Samhita. Generate a personalized 7-day diet chart for your constitution.' },
            { icon: '📄', title: 'Blood Report Analysis', desc: 'Upload your lab reports. VAIDYA analyzes each biomarker from both modern medicine and Ayurvedic perspectives.' },
            { icon: '🧠', title: 'VAIDYA Deep Mind', desc: 'Advanced reasoning across all 8 traditions for complex conditions. Deeper analysis with classical citations.' },
            { icon: '🌍', title: '50+ Languages', desc: 'Consult in Hindi, Tamil, Japanese, Arabic, Sanskrit and 45+ more. Ancient wisdom in your own language.' },
            { icon: '🔒', title: 'Private by Default', desc: 'Your conversations stay in your browser only. Nothing stored on servers. No account needed. Ever.' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e8dfc8', marginBottom: '0.5rem', fontFamily: '-apple-system, sans-serif' }}>{f.title}</div>
              <div style={{ fontSize: '0.83rem', color: 'rgba(232,223,200,0.45)', lineHeight: 1.7, fontFamily: '-apple-system, sans-serif' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      <section style={{ padding: '5rem 2rem', maxWidth: 700, margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: 'rgba(232,223,200,0.3)', fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: '-apple-system, sans-serif' }}>Sample VAIDYA Response</p>
        <h2 style={{ fontFamily: '&quot;Cormorant Garamond&quot;, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, textAlign: 'center', color: '#e8dfc8', marginBottom: '2rem' }}>Ask anything. Get wisdom from 5,000 years.</h2>
        <div style={{ background: 'rgba(5,16,10,0.8)', border: '1px solid rgba(106,191,138,0.15)', borderRadius: 20, padding: '1.5rem 2rem', fontFamily: '-apple-system, sans-serif' }}>
          <div style={{ background: 'rgba(45,90,27,0.15)', border: '1px solid rgba(106,191,138,0.1)', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.88rem', color: 'rgba(232,223,200,0.6)' }}>
            💬 &quot;I feel anxious, sleep poorly, and my digestion is irregular. What should I do?&quot;
          </div>
          <p style={{ color: '#c9a84c', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>✦ VAIDYA&apos;S SYNTHESIS</p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(232,223,200,0.7)', lineHeight: 1.8, marginBottom: '0.85rem' }}>These three symptoms together point to classic <strong style={{ color: '#6abf8a' }}>Vata imbalance</strong> — your air and space elements are in excess. Charaka Samhita describes this exact pattern in Nidanasthana Ch.1.</p>
          <p style={{ color: '#6abf8a', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.8rem' }}>🌿 Ayurvedic View</p>
          <p style={{ fontSize: '0.82rem', color: 'rgba(232,223,200,0.55)', lineHeight: 1.7, marginBottom: '0.85rem' }}>Ashwagandha 500mg with warm milk at night. Brahmi for the mind. Sesame oil self-massage before bed. Warm cooked foods only.</p>
          <p style={{ color: '#6abf8a', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.8rem' }}>☯️ Chinese Medicine View</p>
          <p style={{ fontSize: '0.82rem', color: 'rgba(232,223,200,0.4)', lineHeight: 1.7, marginBottom: '1.25rem' }}>Heart and Spleen Qi deficiency. Jujube seed tea (酸枣仁) before sleep. Acupoints HT-7, SP-6 recommended...</p>
          <Link href="/chat" style={{ display: 'inline-block', fontSize: '0.82rem', color: '#6abf8a', textDecoration: 'none', border: '1px solid rgba(106,191,138,0.25)', padding: '0.5rem 1rem', borderRadius: 980 }}>
            Get your full personalized response →
          </Link>
        </div>
      </section>

      <div className="divider" />

      <section style={{ padding: '5rem 2rem', maxWidth: 860, margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: 'rgba(232,223,200,0.3)', fontSize: '0.75rem', marginBottom: '3rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: '-apple-system, sans-serif' }}>Why people trust AyuraHealth</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { quote: 'Finally explains WHY I should take turmeric — not just that I should. The Charaka Samhita citations are real.', name: 'Priya S.', location: 'Mumbai, India' },
            { quote: 'I uploaded my blood report and VAIDYA mapped my high cortisol to Pitta aggravation. My Ayurvedic doctor agreed completely.', name: 'Kenji T.', location: 'Tokyo, Japan' },
            { quote: 'Most authentic AI health tool I have found. It actually knows the classical texts and uses them properly.', name: 'Arjun M.', location: 'Bangalore, India' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(106,191,138,0.08)', borderRadius: 16, padding: '1.5rem' }}>
              <div style={{ fontSize: '1.2rem', color: '#c9a84c', marginBottom: '0.75rem' }}>❝</div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(232,223,200,0.6)', lineHeight: 1.7, fontFamily: '-apple-system, sans-serif', marginBottom: '1rem' }}>{item.quote}</p>
              <div style={{ fontSize: '0.78rem', color: '#6abf8a', fontFamily: '-apple-system, sans-serif' }}>{item.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(232,223,200,0.3)', fontFamily: '-apple-system, sans-serif' }}>{item.location}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(45,90,27,0.06)', border: '1px solid rgba(106,191,138,0.1)', borderRadius: 16, padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: '📚', title: 'Classical Sources', desc: 'Every recommendation traces to primary texts — Charaka Samhita, Ashtanga Hridayam, Huangdi Neijing. Not generic internet wellness.' },
            { icon: '🔬', title: 'How the AI Works', desc: 'VAIDYA cross-references 8 healing tradition databases simultaneously. Deep Mind uses a 120B parameter model for complex analysis.' },
            { icon: '⚕️', title: 'Safety First', desc: 'Educational guidance only. Not a substitute for professional medical care. Always consult a qualified practitioner for serious conditions.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e8dfc8', marginBottom: '0.35rem', fontFamily: '-apple-system, sans-serif' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(232,223,200,0.4)', lineHeight: 1.6, fontFamily: '-apple-system, sans-serif' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      <section style={{ padding: '5rem 2rem', maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 300, textAlign: 'center', marginBottom: '0.5rem', color: '#e8dfc8' }}>{t.traditions}</h2>
        <p style={{ textAlign: 'center', color: 'rgba(232,223,200,0.3)', fontSize: '0.78rem', marginBottom: '2.5rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: '-apple-system, sans-serif' }}>{t.tradSub}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '0.75rem' }}>
          {TRADITIONS.map((item, i) => (
            <div key={i} className="trad-card">
              <div style={{ fontSize: '1.6rem', marginBottom: '0.65rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#e8dfc8', marginBottom: '0.25rem', fontFamily: '-apple-system, sans-serif' }}>{item.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(232,223,200,0.3)', fontFamily: '-apple-system, sans-serif' }}>{item.origin}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      <section style={{ padding: '5rem 2rem', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 300, marginBottom: '3rem', color: '#e8dfc8' }}>{t.how}</h2>
        {[
          { n: '01', title: t.s1t, desc: t.s1d, badge: null },
          { n: '02', title: t.s2t, desc: t.s2d, badge: null },
          { n: '03', title: t.s3t, desc: t.s3d, badge: 'VAIDYA Deep Mind' },
        ].map((s, i) => (
          <div key={i} className="step-row">
            <div className="step-num">{s.n}</div>
            <div style={{ paddingTop: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.45rem', fontWeight: 400, color: '#e8dfc8' }}>{s.title}</h3>
                {s.badge && <span style={{ fontSize: '0.62rem', background: 'rgba(118,185,0,0.12)', border: '1px solid rgba(118,185,0,0.3)', color: 'rgba(118,185,0,0.85)', padding: '0.15rem 0.5rem', borderRadius: 980, letterSpacing: '0.05em', fontFamily: '-apple-system, sans-serif', whiteSpace: 'nowrap' }}>{s.badge}</span>}
              </div>
              <p style={{ color: 'rgba(232,223,200,0.45)', fontSize: '0.9rem', lineHeight: 1.8, fontFamily: '-apple-system, sans-serif' }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="divider" />

      <section style={{ padding: '7rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="glow" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(45,90,27,0.15) 0%, transparent 65%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌿</div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: '1rem', color: '#e8dfc8' }}>{t.finalCta}</h2>
          <p style={{ color: 'rgba(232,223,200,0.4)', marginBottom: '2.5rem', fontSize: '0.95rem', fontFamily: '-apple-system, sans-serif' }}>{t.finalSub}</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/chat?lang=${lang}`} className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.8rem' }}>Start Free Assessment →</Link>
            <Link href="/diet" className="btn-secondary">Generate Diet Chart</Link>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(232,223,200,0.2)', fontFamily: '-apple-system, sans-serif' }}>⚕️ Educational guidance only · Not a substitute for professional medical advice</p>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{ padding: '3rem 1rem', background: 'linear-gradient(135deg, rgba(26,77,46,0.1) 0%, rgba(212,165,116,0.05) 100%)', borderTop: '1px solid rgba(106,191,138,0.08)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e8dfb8', marginBottom: '0.5rem' }}>Stay Updated</h3>
          <p style={{ color: 'rgba(232,223,200,0.7)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Get the latest updates on new features, health tips, and AyuraHealth announcements.</p>
          <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px', margin: '0 auto' }}>
            <input type="email" placeholder="your@email.com" style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.9rem' }} />
            <button style={{ padding: '0.75rem 1.5rem', background: '#6abf8a', color: '#05100a', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#5aad7a')}
              onMouseLeave={e => (e.currentTarget.style.background = '#6abf8a')}
            >Subscribe</button>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(106,191,138,0.08)', padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
        <p style={{ color: 'rgba(232,223,200,0.2)', fontSize: '0.72rem', marginBottom: '1rem', fontFamily: '-apple-system, sans-serif' }}>{t.footer}</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Testimonials', '/testimonials'], ['Press Kit', '/press-kit'], ['Pricing', '/pricing'], ['For Clinics', '/clinic'], ['Diet Chart', '/diet'], ['Contact', '/contact']].map(([label, href]) => (
            <a key={href} href={href} style={{ color: 'rgba(232,223,200,0.25)', fontSize: '0.72rem', textDecoration: 'none', fontFamily: '-apple-system, sans-serif', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,223,200,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,223,200,0.25)')}
            >{label}</a>
          ))}
        </div>
      </footer>
    </main>
  )
}