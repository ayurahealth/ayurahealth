export type SupportedLang = 'en' | 'ja' | 'hi' | 'sa' | 'ar' | 'es' | 'fr' | 'zh';

const en = {
  nav_dashboard: 'Intelligence Suite',
  nav_diet: 'Synergy Lab',
  nav_clinic: 'Intelligence Console',
  nav_pricing: 'Pricing',
  sign_in: 'Sign In',
  
  btn_start_intake: 'Start Clinical Intake',
  btn_skip: 'Skip quiz — go straight to chat',
  btn_send: 'Send',
  btn_ask_vaidya: 'Ask VAIDYA',
  btn_retake: 'Retake quiz',
  btn_prev: '← Previous Step',

  heading_precision: 'Precision Diagnostic',
  heading_pricing: 'Clinical Grade Pricing',
  heading_faq: 'Common Questions',
  
  pricing_monthly: 'Monthly',
  pricing_annual: 'Annual (-20%)',
  pricing_free: 'Free Forever',
  pricing_clinical: 'Clinical',
  pricing_enterprise: 'Clinical Plus',
  pricing_sub: 'Direct, standardized rates for individuals and clinical practitioners. All assessments are browser-local by default.',
  pricing_start_free: 'Start Free Consultations',
  pricing_start_trial: 'Start 7-Day Free Trial',

  landing_tagline: 'Intelligence for Humanity\nSynthesizing Ancient Medical Logic.',
  landing_sub: 'Access the world\'s most sophisticated clinical reasoning engine. Rooted in 8 classical medical traditions, designed for modern longevity.',
  landing_free: '3 Active Neural Sessions · No Credit Card',
  
  hero_title: 'Neural Synthesis. Strategic Health.',
  hero_sub: 'Institutional-grade health synthesis from 8 classical traditions — Ayurveda, Chinese Medicine, Homeopathy, and more.',
  disclaimer: '⚠️ For educational purposes only. Not a substitute for professional medical advice.',
  
  greeting: 'Neural Link Active. 🙏 Welcome to Ayura Intelligence Lab. I\'m Vaidya, your institutional health synthesis engine drawing from 8 classical traditions. What health protocol shall we analyze today?',
  greeting_dosha: 'Namaste! 🙏 Based on your quiz, you have a **{dosha}** constitution — {tagline}.\n\n{desc}\n\nI\'ll personalize all my recommendations to balance your {dosha} dosha. What health topic would you like to explore today?',
  
  teaser_placeholder: 'How can Ayura Intelligence assist your clinical observation today?',
  teaser_trad: 'Traditional Engine',
  teaser_trace: 'Reasoning Trace',
  teaser_enter: 'Enter Full Interface',
  
  cap_1_name: 'Classical Reasoning',
  cap_1_desc: 'Synthesizing 5,000 years of clinical logic into actionable health insights.',
  cap_2_name: 'Neural Tracing',
  cap_2_desc: 'Verifiable citations from primary medical texts in every individual response.',
  cap_3_name: 'Tradition Synthesis',
  cap_3_desc: 'Unified cross-analysis between Ayurveda, TCM, and 6 other medical paradigms.',

  footer_research: 'Research',
  footer_compliance: 'Compliance',
  footer_privacy: 'Data Privacy',
  footer_support: 'Clinical Support',
  footer_copy: '© 2026 Ayura Intelligence Lab. Verified Neural Protocol',

  msg_initializing: 'Initializing Ayura Intelligence...',
  msg_limit: 'Synthesis Limit Reached',
  msg_upgrade: 'Upgrade to Ayura Intelligence Pro for unlimited clinical analysis.',
  btn_upgrade: 'Upgrade Now',
  btn_close: 'Close',

  q1: 'What best describes your body frame?', q1e: '🧍',
  q1a: 'Thin & light — hard to gain weight',
  q1b: 'Medium & athletic — gain/lose easily',
  q1c: 'Large & solid — gain weight easily',
  
  q2: 'How is your digestion usually?', q2e: '🌿',
  q2a: 'Irregular — sometimes constipated or gassy',
  q2b: 'Strong & sharp — get very hungry, irritable if I skip meals',
  q2c: 'Slow & steady — rarely hungry, feel heavy after eating',

  q3: 'How do you typically sleep?', q3e: '🌙',
  q3a: 'Light sleeper — wake easily, vivid dreams',
  q3b: 'Moderate — intense dreams, wake feeling warm',
  q3c: 'Deep & long — hard to wake up, love sleeping',

  q4: 'When stressed, you tend to become…', q4e: '🧠',
  q4a: 'Anxious, worried, or overwhelmed',
  q4b: 'Irritable, intense, or critical',
  q4c: 'Withdrawn, stubborn, or unmotivated',

  q5: 'What best describes your skin?', q5e: '✨',
  q5a: 'Dry, rough, or cool to touch',
  q5b: 'Warm, sensitive, or prone to redness',
  q5c: 'Thick, oily, or soft and moist',

  quiz_step: 'Step',
  quiz_of: 'of',
  quiz_protocol: 'Protocol Phase',
  
  chat_placeholder: 'Message Vaidya...',
  chat_placeholder_dosha: 'Message Vaidya ({dosha} Intelligence)...',
};

// Providing fallback/direct mappings for other languages to satisfy requirements.
// A production app would translate these specifically. For now, utilizing English keys.
export const translations: Record<SupportedLang, Record<string, string>> = {
  en,
  ja: { ...en, nav_dashboard: 'インテリジェンス・スイート', nav_diet: 'シナジー・ラボ', nav_pricing: '価格', btn_send: '送信' },
  hi: { ...en, nav_dashboard: 'इंटेलिजेंस सुइट', nav_diet: 'सिनर्जी लैब', nav_pricing: 'मूल्य निर्धारण', btn_send: 'भेजें' },
  sa: { ...en, nav_dashboard: 'प्रज्ञा कक्ष', nav_diet: 'समन्वय प्रयोगशाला', nav_pricing: 'मूल्य' },
  ar: { ...en, nav_dashboard: 'جناح الذكاء', nav_diet: 'مختبر التآزر', nav_pricing: 'التسعير' },
  es: { ...en, nav_dashboard: 'Suite de Inteligencia', nav_diet: 'Laboratorio de Sinergia', nav_pricing: 'Precios', btn_send: 'Enviar' },
  fr: { ...en, nav_dashboard: 'Suite d\'Intelligence', nav_diet: 'Laboratoire de Synergie', nav_pricing: 'Tarification', btn_send: 'Envoyer' },
  zh: { ...en, nav_dashboard: '智能套件', nav_diet: '协同实验室', nav_pricing: '定价', btn_send: '发送' }
};

