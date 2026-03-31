'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { t, type Lang } from '../../lib/translations'

interface Message { role: 'user' | 'assistant'; content: string }
interface Attachment {
  id: string; type: 'image' | 'pdf' | 'link'
  name: string; content: string
  preview?: string; mimeType?: string; url?: string; size?: string
}
type Dosha = 'Vata' | 'Pitta' | 'Kapha'
type Screen = 'landing' | 'welcome' | 'quiz' | 'result' | 'chat'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SR = any

const STORAGE_KEY = 'ayurahealth_v1'
interface SavedState { dosha: Dosha | null; messages: Message[]; selectedSystems: string[]; lang: Lang; savedAt: number; userName?: string }
function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SavedState
    if (Date.now() - parsed.savedAt > 7 * 24 * 60 * 60 * 1000) { localStorage.removeItem(STORAGE_KEY); return null }
    return parsed
  } catch { return null }
}
function saveState(s: SavedState) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {} }
function clearState() { try { localStorage.removeItem(STORAGE_KEY) } catch {} }

const DOSHA_META = {
  Vata:  { emoji: '🌬️', color: '#7aafd4', glow: 'rgba(122,175,212,0.3)', bg: 'rgba(122,175,212,0.08)', cardBg: '#0a1620', cardBorder: '#7aafd4', taglineKey: 'vata_tagline', descKey: 'vata_desc', strengthsKey: 'vata_strengths', watchKey: 'vata_watch' },
  Pitta: { emoji: '🔥', color: '#e8835a', glow: 'rgba(232,131,90,0.3)',  bg: 'rgba(232,131,90,0.08)',  cardBg: '#1a0e08', cardBorder: '#e8835a', taglineKey: 'pitta_tagline', descKey: 'pitta_desc', strengthsKey: 'pitta_strengths', watchKey: 'pitta_watch' },
  Kapha: { emoji: '🌍', color: '#6abf8a', glow: 'rgba(106,191,138,0.3)', bg: 'rgba(106,191,138,0.08)', cardBg: '#081510', cardBorder: '#6abf8a', taglineKey: 'kapha_tagline', descKey: 'kapha_desc', strengthsKey: 'kapha_strengths', watchKey: 'kapha_watch' },
}

const MEDICINE_SYSTEMS = [
  { id: 'ayurveda', label: '🌿 Ayurveda' }, { id: 'tcm', label: '☯️ TCM' },
  { id: 'western', label: '💊 Western' }, { id: 'homeopathy', label: '💧 Homeopathy' },
  { id: 'naturopathy', label: '🌱 Naturo' }, { id: 'unani', label: '🌙 Unani' },
  { id: 'siddha', label: '✨ Siddha' }, { id: 'tibetan', label: '🏔️ Tibetan' },
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
    .replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>')
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000), hours = Math.floor(diff / 3600000), days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1048576) return `${(bytes/1024).toFixed(1)}KB`
  return `${(bytes/1048576).toFixed(1)}MB`
}

function isValidUrl(str: string): boolean {
  try { new URL(str); return str.startsWith('http://') || str.startsWith('https://') }
  catch { return false }
}

export default function ChatPage() {
  const { user, isLoaded } = useUser()
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ayura_lang')
      if (saved === 'ja' || saved === 'hi') return saved as Lang
    }
    return 'en'
  })
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
  const [savedState, setSavedState] = useState<SavedState | null>(null)
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [attachLoading, setAttachLoading] = useState(false)
  const [linkInput, setLinkInput] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SR>(null)
  const shareCardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)

  // Save language preference whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ayura_lang', lang)
    }
  }, [lang])

  const doshaColor = dosha ? DOSHA_META[dosha].color : '#6abf8a'
  const tx = t[lang]

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
    script.async = true; document.head.appendChild(script)
    // Load PDF.js
    const pdfjsScript = document.createElement('script')
    pdfjsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    pdfjsScript.async = true; document.head.appendChild(pdfjsScript)
    return () => { try { document.head.removeChild(script); document.head.removeChild(pdfjsScript) } catch {} }
  }, [])

  useEffect(() => {
    const saved = loadState()
    if (saved && saved.messages.length > 1) { setSavedState(saved); setShowWelcomeBack(true) }
  }, [])

  useEffect(() => {
    if (incognito || messages.length === 0) return
    saveState({ dosha, messages, selectedSystems, lang, savedAt: Date.now() })
  }, [messages, dosha, selectedSystems, lang, incognito])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const w = window as SR
      if ((w.SpeechRecognition || w.webkitSpeechRecognition) && w.speechSynthesis) setVoiceSupported(true)
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setAttachLoading(true)
    for (const file of files) {
      if (attachments.length >= 4) break // max 4 attachments
      const id = Math.random().toString(36).slice(2)
      const size = formatSize(file.size)
      if (file.type.startsWith('image/')) {
        // Image: convert to base64
        const reader = new FileReader()
        await new Promise<void>(resolve => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1]
            setAttachments(prev => [...prev, {
              id, type: 'image', name: file.name,
              content: base64, preview: reader.result as string,
              mimeType: file.type, size,
            }])
            resolve()
          }
          reader.readAsDataURL(file)
        })
      } else if (file.type === 'application/pdf') {
        // PDF: extract text using PDF.js
        const reader = new FileReader()
        await new Promise<void>(resolve => {
          reader.onload = async () => {
            try {
              const w = window as SR
              if (w.pdfjsLib) {
                w.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
                const pdf = await w.pdfjsLib.getDocument({ data: reader.result }).promise
                let text = ''
                for (let p = 1; p <= Math.min(pdf.numPages, 10); p++) {
                  const page = await pdf.getPage(p)
                  const content = await page.getTextContent()
                  text += content.items.map((item: SR) => item.str).join(' ') + '\n'
                }
                setAttachments(prev => [...prev, { id, type: 'pdf', name: file.name, content: text.substring(0, 8000), size }])
              } else {
                setAttachments(prev => [...prev, { id, type: 'pdf', name: file.name, content: '[PDF content - AI will analyze]', size }])
              }
            } catch { setAttachments(prev => [...prev, { id, type: 'pdf', name: file.name, content: '[Could not extract PDF text]', size }]) }
            resolve()
          }
          reader.readAsArrayBuffer(file)
        })
      }
    }
    setAttachLoading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAddLink = async () => {
    const url = linkInput.trim()
    if (!isValidUrl(url)) return
    setAttachLoading(true)
    setShowLinkInput(false)
    setLinkInput('')
    try {
      const res = await fetch('/api/fetch-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const id = Math.random().toString(36).slice(2)
      setAttachments(prev => [...prev, { id, type: 'link', name: data.title || url, content: data.text, url }])
    } catch { alert('Could not fetch that link. Try a different URL.') }
    setAttachLoading(false)
  }

  const removeAttachment = (id: string) => setAttachments(prev => prev.filter(a => a.id !== id))

  const calcDosha = (ans: string[]): Dosha => {
    const counts: Record<string, number> = { Vata: 0, Pitta: 0, Kapha: 0 }
    ans.forEach(a => { counts[a] = (counts[a] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Dosha
  }

  const handleAnswer = (d: string) => {
    const newAnswers = [...answers, d]
    setAnswers(newAnswers)
    if (currentQ < QUESTIONS(lang).length - 1) setCurrentQ(currentQ + 1)
    else { 
      const resultDosha = calcDosha(newAnswers)
      setDosha(resultDosha)
      setScreen('result')

      // Save to Database if user is signed in
      if (user) {
        fetch('/api/user-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            primaryDosha: resultDosha,
            vataScore: newAnswers.filter(a => a === 'Vata').length * 20,
            pittaScore: newAnswers.filter(a => a === 'Pitta').length * 20,
            kaphaScore: newAnswers.filter(a => a === 'Kapha').length * 20
          })
        }).catch(err => console.error('Failed to save profile:', err))
      }
    }
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

  const resumeSession = () => {
    if (!savedState) return
    setDosha(savedState.dosha); setMessages(savedState.messages)
    setSelectedSystems(savedState.selectedSystems); setLang(savedState.lang)
    setScreen('chat'); setShowWelcomeBack(false)
  }

  const handleClearHistory = () => { clearState(); setMessages([]); setDosha(null); setShowClearConfirm(false); setScreen('landing') }

  const shareCard = async () => {
    if (!shareCardRef.current || !dosha) return
    setIsSharing(true)
    try {
      const w = window as SR
      if (!w.html2canvas) { setIsSharing(false); return }
      const canvas = await w.html2canvas(shareCardRef.current, { scale: 3, useCORS: true, backgroundColor: DOSHA_META[dosha].cardBg, width: 400, height: 500, logging: false })
      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) { setIsSharing(false); return }
        const file = new File([blob], `my-${dosha.toLowerCase()}-dosha.png`, { type: 'image/png' })
        const shareData = { title: `I am ${dosha} — AyuraHealth`, text: `I just discovered my Ayurvedic dosha is ${dosha} ${DOSHA_META[dosha].emoji}\n\nFind yours free → ayurahealth.com`, files: [file] }
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData); setShareSuccess(true); setTimeout(() => setShareSuccess(false), 3000)
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a'); a.href = url; a.download = `my-${dosha.toLowerCase()}-dosha.png`
          document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
          setShareSuccess(true); setTimeout(() => setShareSuccess(false), 3000)
        }
      }, 'image/png')
    } catch (e) { /* Error silently handled */ }
    finally { setIsSharing(false) }
  }

  const speakText = useCallback((text: string) => {
    if (!voiceSupported || typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const clean = text.replace(/\*\*?|#{1,3}|[📚🌿☯️💊🏔️⚡✦]/g, '').substring(0, 800)
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = lang === 'ja' ? 'ja-JP' : lang === 'hi' ? 'hi-IN' : 'en-US'
    utterance.rate = 0.9; utterance.onstart = () => setIsSpeaking(true); utterance.onend = () => setIsSpeaking(false)
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
    recognition.continuous = false; recognition.interimResults = true
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: SR) => {
      const transcript = Array.from(event.results).map((r: SR) => r[0].transcript).join('')
      setInput(transcript)
      if (event.results[event.results.length - 1].isFinal) setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false); recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition; recognition.start()
  }, [lang, isListening])

  const sendMessage = async (text?: string) => {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    const currentAttachments = [...attachments]
    setAttachments([])
    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages); setLoading(true); setStreaming('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, systems: selectedSystems, incognito, dosha, lang: (typeof window !== "undefined" ? localStorage.getItem("ayura_lang") || lang : lang), attachments: currentAttachments }),
      })
      if (!res.ok) throw new Error('API error')
      const reader = res.body?.getReader(); const decoder = new TextDecoder(); let full = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read(); if (done) break
          for (const line of decoder.decode(value).split('\n')) {
            if (line.startsWith('data: ')) { try { const d = JSON.parse(line.slice(6)); if (d.content) { full += d.content; setStreaming(full) } } catch {} }
          }
        }
      }
      setMessages(prev => [...prev, { role: 'assistant', content: full }]); setStreaming('')
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection interrupted. Please try again.' }]); setStreaming('') }
    finally { setLoading(false) }
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }
  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value); e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
  }
  const questions = QUESTIONS(lang)

  const attachmentIconMap = { image: '🖼️', pdf: '📄', link: '🔗' }
  const attachmentColorMap = { image: '#7aafd4', pdf: '#e8835a', link: '#c9a84c' }

  return (
    <main style={{ minHeight: '100vh', background: '#05100a', fontFamily: '"DM Sans", system-ui, sans-serif', color: '#e8dfc8', position: 'relative', overflow: 'hidden' }}>

      {/* Sacred geometry bg */}
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

      {/* Welcome back */}
      {showWelcomeBack && savedState && (
        <div style={{ position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 2rem)', maxWidth: 480, background: 'rgba(10,25,15,0.95)', border: `1px solid ${savedState.dosha ? DOSHA_META[savedState.dosha].color + '50' : 'rgba(106,191,138,0.3)'}`, borderRadius: 20, padding: '1.25rem 1.25rem 1rem', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', zIndex: 200, animation: 'slideDown 0.35s ease' }}>
          <button onClick={() => { setShowWelcomeBack(false); setSavedState(null) }} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', color: 'rgba(200,200,200,0.4)', fontSize: '1.2rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '2rem' }}>{savedState.dosha ? DOSHA_META[savedState.dosha].emoji : '🌿'}</div>
            <div>
              <div style={{ color: savedState.dosha ? DOSHA_META[savedState.dosha].color : '#6abf8a', fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', fontWeight: 700 }}>Welcome back{savedState.dosha ? `, ${savedState.dosha} ✦` : '!'}</div>
              <div style={{ color: 'rgba(200,200,200,0.45)', fontSize: '0.75rem', marginTop: '0.1rem' }}>{savedState.messages.length - 1} messages · {timeAgo(savedState.savedAt)}</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '0.6rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'rgba(200,200,200,0.5)', fontStyle: 'italic', lineHeight: 1.5, borderLeft: `2px solid ${savedState.dosha ? DOSHA_META[savedState.dosha].color + '40' : 'rgba(106,191,138,0.3)'}` }}>
            "{savedState.messages.filter(m => m.role === 'user').slice(-1)[0]?.content?.substring(0, 80) || 'Your consultation'}..."
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={resumeSession} style={{ flex: 1, padding: '0.65rem', background: savedState.dosha ? `${DOSHA_META[savedState.dosha].color}20` : 'rgba(106,191,138,0.15)', border: `1px solid ${savedState.dosha ? DOSHA_META[savedState.dosha].color + '40' : 'rgba(106,191,138,0.3)'}`, borderRadius: 12, color: savedState.dosha ? DOSHA_META[savedState.dosha].color : '#6abf8a', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Continue →</button>
            <button onClick={() => { setShowWelcomeBack(false); setSavedState(null) }} style={{ padding: '0.65rem 1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(200,200,200,0.4)', fontSize: '0.85rem', cursor: 'pointer' }}>Start fresh</button>
          </div>
        </div>
      )}

      {/* Clear confirm */}
      {showClearConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#0a1a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '1.5rem', maxWidth: 340, width: '100%' }}>
            <div style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>🗑️</div>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#e8dfc8', fontSize: '1.2rem', textAlign: 'center', marginBottom: '0.5rem' }}>Clear all history?</h3>
            <p style={{ color: 'rgba(200,200,200,0.5)', fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.6, marginBottom: '1.25rem' }}>Deletes your dosha, messages and preferences.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleClearHistory} style={{ flex: 1, padding: '0.7rem', background: 'rgba(200,60,60,0.15)', border: '1px solid rgba(200,60,60,0.3)', borderRadius: 12, color: '#e88080', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Clear</button>
              <button onClick={() => setShowClearConfirm(false)} style={{ flex: 1, padding: '0.7rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(200,200,200,0.5)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,16,10,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(106,191,138,0.12)', padding: '0.7rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => setScreen('landing')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🌿</span>
          <div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '0.02em' }}>AyuraHealth</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(200,220,200,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Holistic Oracle</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>

          {dosha && screen === 'chat' && <div style={{ padding: '0.3rem 0.7rem', borderRadius: 20, fontSize: '0.75rem', border: `1px solid ${DOSHA_META[dosha].color}40`, background: DOSHA_META[dosha].bg, color: DOSHA_META[dosha].color }}>{DOSHA_META[dosha].emoji} {dosha}</div>}
          {screen === 'chat' && !incognito && <button onClick={() => setShowClearConfirm(true)} style={{ padding: '0.3rem 0.5rem', borderRadius: 20, fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(200,200,200,0.3)', cursor: 'pointer' }}>🗑️</button>}
          <button onClick={() => setIncognito(!incognito)} style={{ padding: '0.3rem 0.65rem', borderRadius: 20, fontSize: '0.7rem', border: `1px solid ${incognito ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`, background: incognito ? 'rgba(255,255,255,0.08)' : 'transparent', color: incognito ? '#fff' : 'rgba(200,200,200,0.5)', cursor: 'pointer' }}>
            {incognito ? '🔒' : '👁️'}
          </button>
        </div>
      </header>

      {/* LANDING */}
      {screen === 'landing' && (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 30px rgba(106,191,138,0.4))' }}>🌿</div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 700, color: '#c9a84c', lineHeight: 1.15, marginBottom: '0.75rem', textShadow: '0 0 40px rgba(201,168,76,0.3)' }}>{tx.hero_title}</h1>
            <p style={{ color: 'rgba(232,223,200,0.65)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 2rem' }}>{tx.hero_sub}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(106,191,138,0.2)', borderRadius: 20, padding: '2rem', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
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

      {/* QUIZ */}
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
              <button key={i} onClick={() => handleAnswer(opt.d)}
                style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(106,191,138,0.15)', borderRadius: 16, color: 'rgba(232,223,200,0.85)', fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left', lineHeight: 1.5, transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(106,191,138,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(106,191,138,0.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(106,191,138,0.15)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
              >{opt.l}</button>
            ))}
          </div>
          {currentQ > 0 && <button onClick={() => { setCurrentQ(currentQ - 1); setAnswers(answers.slice(0, -1)) }} style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: 'rgba(200,200,200,0.35)', fontSize: '0.85rem', cursor: 'pointer' }}>{tx.back}</button>}
        </div>
      )}

      {/* RESULT */}
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
            {/* Hidden share card */}
            <div ref={shareCardRef} style={{ position: 'absolute', left: '-9999px', top: 0, width: 400, height: 500, overflow: 'hidden', background: DOSHA_META[dosha].cardBg, fontFamily: 'Georgia, serif' }}>
              <svg width="400" height="500" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.07 }}>
                <defs><pattern id="sc-m" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="50" cy="50" r="42" fill="none" stroke={DOSHA_META[dosha].color} strokeWidth="0.5"/>
                  <circle cx="50" cy="50" r="28" fill="none" stroke={DOSHA_META[dosha].color} strokeWidth="0.5"/>
                  <line x1="8" y1="50" x2="92" y2="50" stroke={DOSHA_META[dosha].color} strokeWidth="0.3"/>
                  <line x1="50" y1="8" x2="50" y2="92" stroke={DOSHA_META[dosha].color} strokeWidth="0.3"/>
                  <line x1="20" y1="20" x2="80" y2="80" stroke={DOSHA_META[dosha].color} strokeWidth="0.3"/>
                  <line x1="80" y1="20" x2="20" y2="80" stroke={DOSHA_META[dosha].color} strokeWidth="0.3"/>
                </pattern></defs>
                <rect width="400" height="500" fill="url(#sc-m)"/>
              </svg>
              <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, background: `radial-gradient(circle, ${DOSHA_META[dosha].color}18 0%, transparent 70%)`, borderRadius: '50%' }} />
              <div style={{ position: 'absolute', inset: 16, border: `1px solid ${DOSHA_META[dosha].color}25`, borderRadius: 24 }} />
              <div style={{ position: 'relative', textAlign: 'center', paddingTop: 44 }}>
                <div style={{ color: `${DOSHA_META[dosha].color}70`, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>My Ayurvedic Constitution</div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 80, lineHeight: 1 }}>{DOSHA_META[dosha].emoji}</div>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 64, fontWeight: 700, color: DOSHA_META[dosha].color, lineHeight: 1 }}>{dosha}</div>
                <div style={{ color: `${DOSHA_META[dosha].color}80`, fontSize: 14, fontStyle: 'italic', marginTop: 6 }}>{tx[DOSHA_META[dosha].taglineKey as keyof typeof tx] as string}</div>
              </div>
              <div style={{ margin: '20px 40px', height: 1, background: `linear-gradient(90deg, transparent, ${DOSHA_META[dosha].color}40, transparent)` }} />
              <div style={{ display: 'flex', gap: 0, margin: '0 32px' }}>
                <div style={{ flex: 1, paddingRight: 16, borderRight: `1px solid ${DOSHA_META[dosha].color}20` }}>
                  <div style={{ color: DOSHA_META[dosha].color, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Strengths</div>
                  <div style={{ color: 'rgba(232,223,200,0.7)', fontSize: 12, lineHeight: 1.6 }}>{tx[DOSHA_META[dosha].strengthsKey as keyof typeof tx] as string}</div>
                </div>
                <div style={{ flex: 1, paddingLeft: 16 }}>
                  <div style={{ color: DOSHA_META[dosha].color, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Watch for</div>
                  <div style={{ color: 'rgba(232,223,200,0.7)', fontSize: 12, lineHeight: 1.6 }}>{tx[DOSHA_META[dosha].watchKey as keyof typeof tx] as string}</div>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center' }}>
                <div style={{ color: '#c9a84c', fontSize: 16, fontWeight: 700, letterSpacing: '0.04em' }}>🌿 AyuraHealth</div>
                <div style={{ color: 'rgba(200,200,200,0.3)', fontSize: 11, marginTop: 4, letterSpacing: '0.06em' }}>ayurahealth.com</div>
              </div>
            </div>
            <button onClick={() => startChat(dosha)} style={{ width: '100%', padding: '1rem', background: `linear-gradient(135deg, ${DOSHA_META[dosha].color}90, ${DOSHA_META[dosha].color}60)`, color: '#fff', border: `1px solid ${DOSHA_META[dosha].color}50`, borderRadius: 16, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '0.75rem' }}>{tx.start_consult}</button>
            <button onClick={shareCard} disabled={isSharing} style={{ width: '100%', padding: '0.85rem', background: shareSuccess ? 'rgba(106,191,138,0.15)' : 'rgba(255,255,255,0.04)', color: shareSuccess ? '#6abf8a' : 'rgba(232,223,200,0.7)', border: `1px solid ${shareSuccess ? 'rgba(106,191,138,0.4)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 16, fontSize: '0.95rem', fontWeight: 500, cursor: isSharing ? 'wait' : 'pointer', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s' }}>
              {isSharing ? '⏳ Generating...' : shareSuccess ? '✅ Card saved! Share anywhere' : '📤 Share my dosha card'}
            </button>
            <button onClick={() => { setCurrentQ(0); setAnswers([]); setScreen('quiz') }} style={{ width: '100%', padding: '0.8rem', background: 'transparent', color: 'rgba(200,200,200,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, fontSize: '0.85rem', cursor: 'pointer' }}>{tx.retake}</button>
          </div>
        </div>
      )}

      {/* CHAT */}
      {screen === 'chat' && (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 57px)' }}>
          <div style={{ padding: '0.6rem 1rem', background: 'rgba(5,16,10,0.6)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(106,191,138,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ color: '#f0e6c8', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>🌿 AyuraHealth Chat</h1>
            <button onClick={() => setScreen('landing')} style={{ background: 'transparent', border: 'none', color: 'rgba(200,200,200,0.5)', fontSize: '0.8rem', cursor: 'pointer' }}>Exit</button>
          </div>
          {/* System pills */}
          <div style={{ padding: '0.6rem 1rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(106,191,138,0.08)', background: 'rgba(5,16,10,0.6)', backdropFilter: 'blur(10px)' }}>
            {MEDICINE_SYSTEMS.map(sys => (
              <button key={sys.id} onClick={() => setSelectedSystems(prev => prev.includes(sys.id) ? prev.filter(s => s !== sys.id) : [...prev, sys.id])}
                style={{ padding: '0.22rem 0.65rem', borderRadius: 20, border: `1px solid ${selectedSystems.includes(sys.id) ? 'rgba(106,191,138,0.4)' : 'rgba(255,255,255,0.07)'}`, background: selectedSystems.includes(sys.id) ? 'rgba(106,191,138,0.1)' : 'transparent', color: selectedSystems.includes(sys.id) ? '#6abf8a' : 'rgba(200,200,200,0.35)', fontSize: '0.7rem', cursor: 'pointer' }}>
                {sys.label}
              </button>
            ))}
            {!incognito && messages.length > 1 && <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'rgba(200,200,200,0.25)', alignSelf: 'center' }}>💾 auto-saved</span>}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1rem 0.5rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '0.5rem' }}>
                {msg.role === 'assistant' && <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #2d5a1b, #4a9e6a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🌿</div>}
                <div style={{ maxWidth: '82%' }}>
                  <div style={{ padding: msg.role === 'user' ? '0.75rem 1rem' : '1rem 1.25rem', borderRadius: msg.role === 'user' ? '20px 20px 6px 20px' : '6px 20px 20px 20px', background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(45,90,27,0.7), rgba(60,110,35,0.6))' : 'rgba(255,255,255,0.04)', border: msg.role === 'user' ? '1px solid rgba(106,191,138,0.25)' : '1px solid rgba(106,191,138,0.1)', fontSize: '0.9rem', lineHeight: 1.7, color: msg.role === 'user' ? '#f0e6c8' : 'rgba(232,223,200,0.85)', backdropFilter: 'blur(10px)' }}>
                    {msg.role === 'assistant' ? <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content, doshaColor) }} /> : msg.content}
                  </div>
                  {msg.role === 'assistant' && voiceSupported && <button onClick={() => speakText(msg.content)} style={{ marginTop: '0.4rem', background: 'none', border: 'none', color: isSpeaking ? '#6abf8a' : 'rgba(200,200,200,0.25)', fontSize: '0.75rem', cursor: 'pointer', padding: '0 0.25rem' }}>{isSpeaking ? '🔊 speaking...' : '🔈 listen'}</button>}
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
                <div style={{ padding: '0.6rem 1rem', borderRadius: '6px 16px 16px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(106,191,138,0.1)', color: 'rgba(200,200,200,0.4)', fontSize: '0.85rem' }}>Vaidya is consulting{thinkingDots}</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{ padding: '1rem', background: 'rgba(5,16,10,0.85)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(106,191,138,0.08)' }}>

            {/* Attachment previews */}
            {attachments.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem', padding: '0.5rem 0' }}>
                {attachments.map(att => (
                  <div key={att.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${attachmentColorMap[att.type]}30`, borderRadius: 10, padding: '0.3rem 0.5rem', maxWidth: 200 }}>
                    {att.type === 'image' && att.preview ? (
                      <img src={att.preview} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{attachmentIconMap[att.type]}</span>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: `${attachmentColorMap[att.type]}`, fontSize: '0.7rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{att.name}</div>
                      {att.size && <div style={{ color: 'rgba(200,200,200,0.35)', fontSize: '0.6rem' }}>{att.size}</div>}
                    </div>
                    <button onClick={() => removeAttachment(att.id)} style={{ background: 'none', border: 'none', color: 'rgba(200,200,200,0.3)', fontSize: '0.9rem', cursor: 'pointer', flexShrink: 0, lineHeight: 1, padding: '0 2px' }}>×</button>
                  </div>
                ))}
                {attachLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0.3rem 0.75rem', color: 'rgba(200,200,200,0.4)', fontSize: '0.75rem' }}>
                    ⏳ Processing...
                  </div>
                )}
              </div>
            )}

            {/* Link input */}
            {showLinkInput && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <input ref={linkInputRef} type="url" value={linkInput} onChange={e => setLinkInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddLink(); if (e.key === 'Escape') { setShowLinkInput(false); setLinkInput('') } }}
                  placeholder="Paste a health article URL..."
                  style={{ flex: 1, padding: '0.6rem 0.9rem', borderRadius: 12, border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(255,255,255,0.04)', color: '#e8dfc8', fontSize: '0.85rem', outline: 'none', fontFamily: '"DM Sans", system-ui, sans-serif' }}
                  autoFocus
                />
                <button onClick={handleAddLink} disabled={!isValidUrl(linkInput)} style={{ padding: '0.6rem 1rem', background: isValidUrl(linkInput) ? 'rgba(201,168,76,0.15)' : 'transparent', border: `1px solid ${isValidUrl(linkInput) ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, color: isValidUrl(linkInput) ? '#c9a84c' : 'rgba(200,200,200,0.3)', fontSize: '0.85rem', cursor: isValidUrl(linkInput) ? 'pointer' : 'not-allowed', fontWeight: 600, whiteSpace: 'nowrap' }}>Add →</button>
                <button onClick={() => { setShowLinkInput(false); setLinkInput('') }} style={{ padding: '0.6rem 0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(200,200,200,0.35)', fontSize: '0.85rem', cursor: 'pointer' }}>✕</button>
              </div>
            )}

            {/* Main input row */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-end', maxWidth: 700, margin: '0 auto' }}>
              {/* Hidden file input */}
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple onChange={handleFileSelect} style={{ display: 'none' }} />

              {/* Attach button */}
              <button onClick={() => fileInputRef.current?.click()} disabled={attachments.length >= 4} title="Attach image or PDF" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: attachments.length > 0 ? 'rgba(122,175,212,0.12)' : 'rgba(106,191,138,0.06)', border: `1px solid ${attachments.length > 0 ? 'rgba(122,175,212,0.4)' : 'rgba(106,191,138,0.15)'}`, color: attachments.length > 0 ? '#7aafd4' : 'rgba(200,200,200,0.4)', cursor: attachments.length >= 4 ? 'not-allowed' : 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                📎
              </button>

              {/* Link button */}
              <button onClick={() => { setShowLinkInput(!showLinkInput); setTimeout(() => linkInputRef.current?.focus(), 50) }} title="Add a link" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: showLinkInput ? 'rgba(201,168,76,0.12)' : 'rgba(106,191,138,0.06)', border: `1px solid ${showLinkInput ? 'rgba(201,168,76,0.4)' : 'rgba(106,191,138,0.15)'}`, color: showLinkInput ? '#c9a84c' : 'rgba(200,200,200,0.4)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                🔗
              </button>

              {/* Voice button */}
              {voiceSupported && (
                <button onClick={startListening} style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: isListening ? 'rgba(232,131,90,0.2)' : 'rgba(106,191,138,0.06)', border: `1px solid ${isListening ? 'rgba(232,131,90,0.5)' : 'rgba(106,191,138,0.15)'}`, color: isListening ? '#e8835a' : 'rgba(200,200,200,0.4)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isListening ? '⏸' : '🎤'}
                </button>
              )}

              <textarea ref={textareaRef} value={input} onChange={handleTextarea} onKeyDown={handleKey}
                placeholder={attachments.length > 0 ? 'Ask Vaidya about the attached file...' : dosha ? tx.chat_placeholder_dosha.replace('{dosha}', dosha) : tx.chat_placeholder}
                rows={1} style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 22, border: '1px solid rgba(106,191,138,0.15)', background: 'rgba(255,255,255,0.04)', color: '#e8dfc8', fontSize: '0.9rem', resize: 'none', outline: 'none', lineHeight: 1.5, maxHeight: 140, overflowY: 'auto', fontFamily: '"DM Sans", system-ui, sans-serif' }} />

              <button onClick={() => sendMessage()} disabled={loading || (!input.trim() && attachments.length === 0)} style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: loading || (!input.trim() && attachments.length === 0) ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #2d5a1b, #4a9e6a)', border: 'none', color: loading || (!input.trim() && attachments.length === 0) ? 'rgba(255,255,255,0.2)' : '#fff', cursor: loading || (!input.trim() && attachments.length === 0) ? 'not-allowed' : 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
            </div>

            {/* Hint row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.35rem' }}>
              <span style={{ color: 'rgba(200,200,200,0.18)', fontSize: '0.6rem' }}>📎 reports & photos</span>
              <span style={{ color: 'rgba(200,200,200,0.18)', fontSize: '0.6rem' }}>🔗 articles & links</span>
              <span style={{ color: 'rgba(200,200,200,0.18)', fontSize: '0.6rem' }}>🎤 voice</span>
            </div>
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
        @keyframes slideDown { from { opacity: 0; transform: translateX(-50%) translateY(-12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
    </main>
  )
}
