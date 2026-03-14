'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { t, LANG_OPTIONS, type Lang } from '../../lib/translations'

interface Message { role: 'user' | 'assistant'; content: string }
type Dosha = 'Vata' | 'Pitta' | 'Kapha'
type Screen = 'landing' | 'quiz' | 'result' | 'chat'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SR = any

const DOSHA_META = {
  Vata:  { emoji: '🌬️', color: '#7aafd4', glow: 'rgba(122,175,212,0.3)', bg: 'rgba(122,175,212,0.08)', taglineKey: 'vata_tagline', descKey: 'vata_desc', strengthsKey: 'vata_strengths', watchKey: 'vata_watch' },
  Pitta: { emoji: '🔥', color: '#e8835a', glow: 'rgba(232,131,90,0.3)',  bg: 'rgba(232,131,90,0.08)',  taglineKey: 'pitta_tagline', descKey: 'pitta_desc', strengthsKey: 'pitta_strengths', watchKey: 'pitta_watch' },
  Kapha: { emoji: '🌍', color: '#6abf8a', glow: 'rgba(106,191,138,0.3)', bg: 'rgba(106,191,138,0.08)', taglineKey: 'kapha_tagline', descKey: 'kapha_desc', strengthsKey: 'kapha_strengths', watchKey: 'kapha_watch' },
}

const MEDICINE_SYSTEMS = [
  { id: 'ayurveda', label: '🌿 Ayurveda' },
  { id: 'tcm', label: '☯️ TCM' },
  { id: 'western', label: '💊 Western' },
  { id: 'homeopathy', label: '💧 Homeopathy' },
  { id: 'naturopathy', label: '🌱 Naturo' },
  { id: 'unani', label: '🌙 Unani' },
  { id: 'siddha', label: '✨ Siddha' },
  { id: 'tibetan', label: '🏔️ Tibetan' },
]

const QUESTIONS = (lang: Lang) => [
  { emoji: '🧍', q: t[lang].q1, opts: [{ l: t[lang].q1a, d: 'Vata' }, { l: t[lang].q1b, d: 'Pitta' }, { l: t[lang].q1c, d: 'Kapha' }] },
  { emoji: '🌿', q: t[lang].q2, opts: [{ l: t[lang].q2a, d: 'Vata' }, { l: t[lang].q2b, d: 'Pitta' }, { l: t[lang].q2c, d: 'Kapha' }] },
  { emoji: '🌙', q: t[lang].q3, opts: [{ l: t[lang].q3a, d: 'Vata' }, { l: t[lang].q3b, d: 'Pitta' }, { l: t[lang].q3c, d: 'Kapha' }] },
  { emoji: '🧠', q: t[lang].q4, opts: [{ l: t[lang].q4a, d: 'Vata' }, { l: t[lang].q4b, d: 'Pitta' }, { l: t[lang].q4c, d: 'Kapha' }] },
  { emoji: '✨', q: t[lang].q5, opts: [{ l: t[lang].q5a, d: 'Vata' }, { l: t[lang].q5b, d: 'Pitta' }, { l: t[lang].q5c, d: 'Kapha' }] },
]

function renderMarkdown(text: string, doshaColor = '#6abf8a'): string {
  return text
    .replace(/\*\*✦ SYNTHESIS\*\*/g, `<div class="synthesis-header">✦ SYNTHESIS</div>`)
    .replace(/\*\*([^*]+)\*\*/g, `<strong style="color:${doshaColor}">$1</strong>`)
    .replace(/\*([^*]+)\*/g, '<em style="opacity:0.85">$1</em>')
    .replace(/^### (.+)$/gm, `<h3 style="color:${doshaColor};font-size:1rem;font-weight:600;margin:1rem 0 0.4rem">$1</h3>`)
    .replace(/^(\d+)\. (.+)$/gm, '<div style="margin:0.3rem 0 0.3rem 0.5rem;display:flex;gap:0.5rem"><span style="opacity:0.5;min-width:1.2rem">$1.</span><span>$2</span></div>')
    .replace(/^- (.+)$/gm, '<div style="margin:0.25rem 0 0.25rem 0.5rem;display:flex;gap:0.5rem"><span style="opacity:0.4">•</span><span>$1</span></div>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
}

export default function ChatPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [screen, setScreen] = useState<Screen>('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [dosha, setDosha] = useState<Dosha | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState('')
  const [selectedSystems, setSelectedSystems] = useState(['ayurveda', 'tcm', 'western'])
  const [incognito, setIncognito] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [thinkingDots, setThinkingDots] = useState('.')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SR>(null)

  const doshaColor = dosha ? DOSHA_META[dosha].color : '#6abf8a'
  const tx = t[lang]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const w = window as SR
      if ((w.SpeechRecognition || w.webkitSpeechRecognition) && w.speechSynthesis) {
        setVoiceSupported(true)
      }
    }
  }, [])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, streaming])

  useEffect(() => {
    if (screen === 'result') setTimeout(() => setRevealed(true), 400)
    else setRevealed(false)
  }, [screen])

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => setThinkingDots(d => d.length >= 3 ? '.' : d + '.'), 500)
    return () => clearInterval(interval)
  }, [loading])

  const calcDosha = (ans: string[]): Dosha => {
    const counts: Record<string, number> = { Vata: 0, Pitta: 0, Kapha: 0 }
    ans.forEach(a => { counts[a] = (counts[a] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Dosha
  }

  const handleAnswer = (d: string) => {
    const newAnswers = [...answers, d]
    setAnswers(newAnswers)
    if (currentQ < QUESTIONS(lang).length - 1) setCurrentQ(currentQ + 1)
    else { setDosha(calcDosha(newAnswers)); setScreen('result') }
  }

  const startChat = useCallback((d?: Dosha | null) => {
    const activeDosha = d ?? dosha
    setScreen('chat')
    const dType = activeDosha || ''
    const meta = dType ? DOSHA_META[dType as Dosha] : null
    const greeting = meta
      ? tx.greeting_dosha.replace(/{dosha}/g, dType).replace('{tagline}', tx[meta.taglineKey as keyof typeof tx] as string).replace('{desc}', tx[meta.descKey as keyof typeof tx] as string)
      : tx.greeting
    setMessages([{ role: 'assistant', content: greeting }])
  }, [dosha, tx])

  const speakText = useCallback((text: string) => {
    if (!voiceSupported || typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const clean = text.replace(/\*\*?|#{1,3}|[📚🌿☯️💊🏔️⚡✦]/g, '').substring(0, 800)
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = lang === 'ja' ? 'ja-JP' : lang === 'hi' ? 'hi-IN' : 'en-US'
    utterance.rate = 0.9
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [lang, voiceSupported])

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return
    const w = window as SR
    const SRClass = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SRClass) return
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return }
    const recognition = new SRClass()
    recognition.lang = lang === 'ja' ? 'ja-JP' : lang === 'hi' ? 'hi-IN' : 'en-US'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: SR) => {
      const transcript = Array.from(event.results).map((r: SR) => r[0].transcript).join('')
      setInput(transcript)
      if (event.results[event.results.length - 1].isFinal) setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }, [lang, isListening])

  const sendMessage = async (text?: string) => {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true); setStreaming('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, systems: selectedSystems, incognito, dosha, lang }),
      })
      if (!res.ok) throw new Error('API error')
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let full = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          for (const line of decoder.decode(value).split('\n')) {
            if (line.startsWith('data: ')) {
              try { const d = JSON.parse(line.slice(6)); if (d.content) { full += d.content; setStreaming(full) } } catch {}
            }
          }
        }
      }
      setMessages(prev => [...prev, { role: 'assistant', content: full }])
      setStreaming('')
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection interrupted. Please try again.' }])
      setStreaming('')
    } finally { setLoading(false) }
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }
  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
  }

  const questions = QUESTIONS(lang)

  return (
    <main style={{ minHeight: '100vh', background: '#05100a', fontFamily: '"DM Sans", system-ui, sans-serif', color: '#e8dfc8', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <svg width="100%" height="100%" style={{ opacity: 0.04 }}>
          <defs>
            <pattern id="mandala" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#6abf8a" strokeWidth="0.5"/>
              <circle cx="60" cy="60" r="35" fill="none" stroke="#6abf8a" strokeWidth="0.5"/>
              <circle cx="60" cy="60" r="20" fill="none" stroke="#6abf8a" strokeWidth="0.5"/>
              <line x1="10" y1="60" x2="110" y2="60" stroke="#6abf8a" strokeWidth="0.3"/>
              <line x1="60" y1="10" x2="60" y2="110" stroke="#6abf8a" strokeWidth="0.3"/>
              <line x1="24.6" y1="24.6" x2="95.4" y2="95.4" stroke="#6abf8a" strokeWidth="0.3"/>
              <line x1="95.4" y1="24.6" x2="24.6" y2="95.4" stroke="#6abf8a" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mandala)"/>
        </svg>
        <div style={{ position: 'absolute', top: '-30%', left: '-20%', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(74,158,106,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,16,10,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(106,191,138,0.12)', padding: '0.7rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => setScreen('landing')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🌿</span>
          <div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '0.02em' }}>AyuraHealth</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(200,220,200,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Holistic Oracle</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          {LANG_OPTIONS.map(opt => (
            <button key={opt.code} onClick={() => setLang(opt.code)} style={{ padding: '0.25rem 0.5rem', borderRadius: 20, fontSize: '0.7rem', border: `1px solid ${lang === opt.code ? 'rgba(106,191,138,0.5)' : 'rgba(255,255,255,0.1)'}`, background: lang === opt.code ? 'rgba(106,191,138,0.12)' : 'transparent', color: lang === opt.code ? '#6abf8a' : 'rgba(200,200,200,0.5)', cursor: 'pointer', fontWeight: lang === opt.code ? 600 : 400 }}>
              {opt.flag} {opt.label}
            </button>
          ))}
          {dosha && screen === 'chat' && <div style={{ padding: '0.3rem 0.7rem', borderRadius: 20, fontSize: '0.75rem', border: `1px solid ${DOSHA_META[dosha].color}40`, background: DOSHA_META[dosha].bg, color: DOSHA_META[dosha].color }}>{DOSHA_META[dosha].emoji} {dosha}</div>}
          <button onClick={() => setIncognito(!incognito)} style={{ padding: '0.3rem 0.65rem', borderRadius: 20, fontSize: '0.7rem', border: `1px solid ${incognito ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`, background: incognito ? 'rgba(255,255,255,0.08)' : 'transparent', color: incognito ? '#fff' : 'rgba(200,200,200,0.5)', cursor: 'pointer' }}>
            {incognito ? '🔒' : '👁️'}
          </button>
        </div>
      </header>

      {screen === 'landing' && (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 30px rgba(106,191,138,0.4))' }}>🌿</div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 700, color: '#c9a84c', lineHeight: 1.15, marginBottom: '0.75rem', textShadow: '0 0 40px rgba(201,168,76,0.3)' }}>{tx.hero_title}</h1>
            <p style={{ color: 'rgba(232,223,200,0.65)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 2rem' }}>{tx.hero_sub}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(106,191,138,0.2)', borderRadius: 20, padding: '2rem', backdropFilter: 'blur(10px)', marginBottom: '1rem', boxShadow: '0 0 40px rgba(106,191,138,0.06)' }}>
            <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.75rem' }}>🧬</div>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#c9a84c', fontSize: '1.4rem', textAlign: 'center', fontWeight: 600, marginBottom: '0.5rem' }}>{tx.quiz_cta_title}</h3>
            <p style={{ color: 'rgba(232,223,200,0.55)', fontSize: '0.875rem', textAlign: 'center', lineHeight: 1.6, marginBottom: '1.5rem' }}>{tx.quiz_cta_sub}</p>
            <button onClick={() => { setCurrentQ(0); setAnswers([]); setScreen('quiz') }} style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #2d5a1b, #3d7a28)', color: '#f0e6c8', border: 'none', borderRadius: 14, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(45,90,27,0.4)' }}>{tx.quiz_btn}</button>
          </div>
          <button onClick={() => { setDosha(null); startChat(null) }} style={{ width: '100%', padding: '0.8rem', background: 'transparent', color: 'rgba(200,200,200,0.45)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, fontSize: '0.9rem', cursor: 'pointer' }}>{tx.skip_btn}</button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {[['📜','Charaka Samhita'],['☯️','Huangdi Neijing'],['🏔️','Sowa Rigpa'],['💊','Evidence-Based']].map(([e,s],i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(200,200,200,0.3)', fontSize: '0.75rem' }}><span>{e}</span><span>{s}</span></div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: 'rgba(200,200,200,0.25)', fontSize: '0.68rem', marginTop: '2rem', lineHeight: 1.5 }}>{tx.disclaimer}</p>
        </div>
      )}

      {screen === 'quiz' && (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'rgba(200,200,200,0.4)', fontSize: '0.8rem' }}>{tx.question_of} {currentQ + 1} {tx.of} {questions.length}</span>
              <span style={{ color: 'rgba(200,200,200,0.4)', fontSize: '0.8rem' }}>{Math.round((currentQ / questions.length) * 100)}%</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
              <div style={{ height: 3, background: 'linear-gradient(90deg, #3d7a28, #6abf8a)', borderRadius: 2, width: `${(currentQ / questions.length) * 100}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{questions[currentQ].emoji}</div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#e8dfc8', fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 }}>{questions[currentQ].q}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {questions[currentQ].opts.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt.d)} style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(106,191,138,0.15)', borderRadius: 16, color: 'rgba(232,223,200,0.85)', fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left', lineHeight: 1.5, transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(106,191,138,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(106,191,138,0.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(106,191,138,0.15)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
              >{opt.l}</button>
            ))}
          </div>
          {currentQ > 0 && <button onClick={() => { setCurrentQ(currentQ - 1); setAnswers(answers.slice(0, -1)) }} style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: 'rgba(200,200,200,0.35)', fontSize: '0.85rem', cursor: 'pointer' }}>{tx.back}</button>}
        </div>
      )}

      {screen === 'result' && dosha && (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 540, margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
          <div style={{ opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '0.5rem', filter: `drop-shadow(0 0 30px ${DOSHA_META[dosha].glow})` }}>{DOSHA_META[dosha].emoji}</div>
              <div style={{ color: 'rgba(200,200,200,0.4)', fontSize: '0.85rem', marginBottom: '0.4rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tx.your_dosha_is}</div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '3.5rem', fontWeight: 700, color: DOSHA_META[dosha].color, textShadow: `0 0 40px ${DOSHA_META[dosha].glow}`, margin: 0 }}>{dosha}</h2>
              <p style={{ color: 'rgba(200,200,200,0.5)', fontStyle: 'italic', marginTop: '0.5rem' }}>{tx[DOSHA_META[dosha].taglineKey as keyof typeof tx] as string}</p>
            </div>
            <div style={{ background: DOSHA_META[dosha].bg, border: `1px solid ${DOSHA_META[dosha].color}30`, borderRadius: 20, padding: '1.5rem', marginBottom: '1.25rem' }}>
              <p style={{ color: 'rgba(232,223,200,0.75)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{tx[DOSHA_META[dosha].descKey as keyof typeof tx] as string}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[{ label: tx.strengths, key: DOSHA_META[dosha].strengthsKey }, { label: tx.watch, key: DOSHA_META[dosha].watchKey }].map((item, i) => (
                  <div key={i}>
                    <div style={{ color: DOSHA_META[dosha].color, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{item.label}</div>
                    <div style={{ color: 'rgba(232,223,200,0.65)', fontSize: '0.85rem', lineHeight: 1.5 }}>{tx[item.key as keyof typeof tx] as string}</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => startChat(dosha)} style={{ width: '100%', padding: '1rem', background: `linear-gradient(135deg, ${DOSHA_META[dosha].color}90, ${DOSHA_META[dosha].color}60)`, color: '#fff', border: `1px solid ${DOSHA_META[dosha].color}50`, borderRadius: 16, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '0.75rem' }}>{tx.start_consult}</button>
            <button onClick={() => { setCurrentQ(0); setAnswers([]); setScreen('quiz') }} style={{ width: '100%', padding: '0.8rem', background: 'transparent', color: 'rgba(200,200,200,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, fontSize: '0.85rem', cursor: 'pointer' }}>{tx.retake}</button>
          </div>
        </div>
      )}

      {screen === 'chat' && (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 57px)' }}>
          <div style={{ padding: '0.6rem 1rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(106,191,138,0.08)', background: 'rgba(5,16,10,0.6)', backdropFilter: 'blur(10px)' }}>
            {MEDICINE_SYSTEMS.map(sys => (
              <button key={sys.id} onClick={() => setSelectedSystems(prev => prev.includes(sys.id) ? prev.filter(s => s !== sys.id) : [...prev, sys.id])} style={{ padding: '0.22rem 0.65rem', borderRadius: 20, border: `1px solid ${selectedSystems.includes(sys.id) ? 'rgba(106,191,138,0.4)' : 'rgba(255,255,255,0.07)'}`, background: selectedSystems.includes(sys.id) ? 'rgba(106,191,138,0.1)' : 'transparent', color: selectedSystems.includes(sys.id) ? '#6abf8a' : 'rgba(200,200,200,0.35)', fontSize: '0.7rem', cursor: 'pointer' }}>{sys.label}</button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1rem 0.5rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '0.5rem' }}>
                {msg.role === 'assistant' && <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #2d5a1b, #4a9e6a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🌿</div>}
                <div style={{ maxWidth: '82%' }}>
                  <div style={{ padding: msg.role === 'user' ? '0.75rem 1rem' : '1rem 1.25rem', borderRadius: msg.role === 'user' ? '20px 20px 6px 20px' : '6px 20px 20px 20px', background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(45,90,27,0.7), rgba(60,110,35,0.6))' : 'rgba(255,255,255,0.04)', border: msg.role === 'user' ? '1px solid rgba(106,191,138,0.25)' : '1px solid rgba(106,191,138,0.1)', fontSize: '0.9rem', lineHeight: 1.7, color: msg.role === 'user' ? '#f0e6c8' : 'rgba(232,223,200,0.85)', backdropFilter: 'blur(10px)' }}>
                    {msg.role === 'assistant' ? <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content, doshaColor) }} /> : msg.content}
                  </div>
                  {msg.role === 'assistant' && voiceSupported && (
                    <button onClick={() => speakText(msg.content)} style={{ marginTop: '0.4rem', background: 'none', border: 'none', color: isSpeaking ? '#6abf8a' : 'rgba(200,200,200,0.25)', fontSize: '0.75rem', cursor: 'pointer', padding: '0 0.25rem' }}>
                      {isSpeaking ? '🔊 speaking...' : '🔈 listen'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {streaming && (
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #2d5a1b, #4a9e6a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🌿</div>
                <div style={{ maxWidth: '82%', padding: '1rem 1.25rem', borderRadius: '6px 20px 20px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(106,191,138,0.1)', fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(232,223,200,0.85)' }}>
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(streaming, doshaColor) }} />
                  <span style={{ opacity: 0.4 }}>▋</span>
                </div>
              </div>
            )}
            {loading && !streaming && (
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #2d5a1b, #4a9e6a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🌿</div>
                <div style={{ padding: '0.6rem 1rem', borderRadius: '6px 16px 16px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(106,191,138,0.1)', color: 'rgba(200,200,200,0.4)', fontSize: '0.85rem' }}>
                  Vaidya is consulting{thinkingDots}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(5,16,10,0.85)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(106,191,138,0.08)' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', maxWidth: 700, margin: '0 auto' }}>
              {voiceSupported && (
                <button onClick={startListening} style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: isListening ? 'rgba(232,131,90,0.2)' : 'rgba(106,191,138,0.08)', border: `1px solid ${isListening ? 'rgba(232,131,90,0.5)' : 'rgba(106,191,138,0.2)'}`, color: isListening ? '#e8835a' : '#6abf8a', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isListening ? '⏸' : '🎤'}
                </button>
              )}
              <textarea ref={textareaRef} value={input} onChange={handleTextarea} onKeyDown={handleKey}
                placeholder={dosha ? tx.chat_placeholder_dosha.replace('{dosha}', dosha) : tx.chat_placeholder}
                rows={1} style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 22, border: '1px solid rgba(106,191,138,0.15)', background: 'rgba(255,255,255,0.04)', color: '#e8dfc8', fontSize: '0.9rem', resize: 'none', outline: 'none', lineHeight: 1.5, maxHeight: 140, overflowY: 'auto', fontFamily: '"DM Sans", system-ui, sans-serif' }} />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: loading || !input.trim() ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #2d5a1b, #4a9e6a)', border: 'none', color: loading || !input.trim() ? 'rgba(255,255,255,0.2)' : '#fff', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
            </div>
            <p style={{ textAlign: 'center', color: 'rgba(200,200,200,0.2)', fontSize: '0.62rem', marginTop: '0.4rem' }}>{tx.edu_disclaimer}</p>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; background: #05100a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(106,191,138,0.2); border-radius: 2px; }
        .synthesis-header { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 700; color: #c9a84c; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
      `}</style>
    </main>
  )
}
