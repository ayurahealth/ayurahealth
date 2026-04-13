'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { t, type Lang } from '../../lib/translations'
import { motion } from 'framer-motion'
import VaidyaOracle from '../../components/VaidyaOracle'
import EngagementStory from '../../components/EngagementStory'
import Logo from '../../components/Logo'
import ChatSidebar from '../../components/chat/ChatSidebar'
import ChatComposer from '../../components/chat/ChatComposer'
import ChatMessagesPanel from '../../components/chat/ChatMessagesPanel'
import VedicOraclePanel from '../../components/vedic/VedicOraclePanel'
import { vaidyaVoice } from '../../lib/vaidyaVoice'
import { getApiUrl } from '../../lib/constants'
import { calculateHealthScores, loadProfile } from '../../lib/healthProfile'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
  agentTrace?: AgentTrace[]
  modelUsed?: string
  providerUsed?: ProviderUsed
  quality?: {
    formatScore: number
    completeness: number
    latencyMs: number
    repaired: boolean
  }
  policy?: {
    applied: boolean
    reasons: string[]
    webSearchSuppressed: boolean
    forceDeepThink: boolean
  }
}
interface AgentTrace { id: 'planner' | 'researcher' | 'synthesizer'; label: string; summary: string }
type ResponseMode = 'fast' | 'deep' | 'research'
type ProviderUsed = 'HuggingFace' | 'OpenRouter' | 'Groq' | ''
interface Attachment {
  id: string; type: 'image' | 'pdf' | 'link'
  name: string; content: string
  preview?: string; mimeType?: string; url?: string; size?: string
}
type Dosha = 'Vata' | 'Pitta' | 'Kapha'
type Screen = 'landing' | 'welcome' | 'quiz' | 'result' | 'chat'
type ModelPreference = 'auto' | 'claude' | 'gpt' | 'gemini' | 'deepseek' | 'mistral' | 'llama' | 'groq'
type ThemeName = 'green' | 'gold' | 'forest' | 'ocean' | 'plum' | 'sunset' | 'slate' | 'rose'
interface ChatSource {
  title: string
  content: string
  tradition: string
  source: string
}
interface ModelTrace {
  modelUsed?: string
  providerUsed?: ProviderUsed
  quality?: {
    formatScore: number
    completeness: number
    latencyMs: number
    repaired: boolean
  }
  policy?: {
    applied: boolean
    reasons: string[]
    webSearchSuppressed: boolean
    forceDeepThink: boolean
  }
}

interface AugmentedWindow extends Window {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  SpeechRecognition?: any; 
  webkitSpeechRecognition?: any;
  pdfjsLib?: any;
  html2canvas?: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  onresult: (event: any) => void;
  onend: () => void;
  onerror: (event: any) => void;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  start: () => void;
  stop: () => void;
  abort: () => void;
}

const STORAGE_KEY = 'ayurahealth_v1'
const VEDIC_PREF_KEY = 'ayura_vedic_pref_v1'
const OBSIDIAN_PREF_KEY = 'ayura_obsidian_pref_v1'
const THEME_PREF_KEY = 'ayura_theme_pref_v1'
const AI_PREF_KEY = 'ayura_ai_pref_v1'
const OBSIDIAN_CATEGORIES = ['Health', 'Business', 'Research', 'Ideas', 'Personal'] as const
const THEME_OPTIONS: Array<{ id: ThemeName; label: string }> = [
  { id: 'green', label: 'Original Green' },
  { id: 'gold', label: 'Light Gold' },
  { id: 'forest', label: 'Forest' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'plum', label: 'Plum' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'slate', label: 'Slate' },
  { id: 'rose', label: 'Rose' },
]
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
  { id: 'ayurveda', label: 'Ayurveda', icon: 'ayurveda', origin: 'India · 5,000 BCE' }, 
  { id: 'tcm', label: 'TCM', icon: 'tcm', origin: 'China · 2,500 BCE' },
  { id: 'western', label: 'Western', icon: 'western', origin: 'Greece/Global · 2,400 Years' }, 
  { id: 'homeopathy', label: 'Homeopathy', icon: 'homeopathy', origin: 'Germany · 1796' },
  { id: 'naturopathy', label: 'Naturo', icon: 'naturopathy', origin: 'Europe · 19th Century' }, 
  { id: 'unani', label: 'Unani', icon: 'unani', origin: 'Persia/Greece · 1025 CE' },
  { id: 'siddha', label: 'Siddha', icon: 'siddha', origin: 'India · 10,000 BCE' }, 
  { id: 'tibetan', label: 'Tibetan', icon: 'tibetan', origin: 'Tibet · 7th Century' },
]

const SYSTEM_DETAIL: Record<string, string> = {
  ayurveda: 'Dosha, agni, dinacharya and herbs only.',
  tcm: 'Qi, meridians, yin-yang and organ clocks only.',
  western: 'Evidence-based biomedical guidance only.',
  homeopathy: 'Homeopathic remedy framework only.',
  naturopathy: 'Lifestyle and natural therapeutics only.',
  unani: 'Mizaj and humoral balancing only.',
  siddha: 'Siddha principles and elemental balance only.',
  tibetan: 'Sowa Rigpa principles only.',
}

const QUESTIONS = (lang: Lang) => [
  { emoji: '🧍', q: t[lang].q1, opts: [{ l: t[lang].q1a, d: 'Vata' }, { l: t[lang].q1b, d: 'Pitta' }, { l: t[lang].q1c, d: 'Kapha' }] },
  { emoji: '🌿', q: t[lang].q2, opts: [{ l: t[lang].q2a, d: 'Vata' }, { l: t[lang].q2b, d: 'Pitta' }, { l: t[lang].q2c, d: 'Kapha' }] },
  { emoji: '🌙', q: t[lang].q3, opts: [{ l: t[lang].q3a, d: 'Vata' }, { l: t[lang].q3b, d: 'Pitta' }, { l: t[lang].q3c, d: 'Kapha' }] },
  { emoji: '🧠', q: t[lang].q4, opts: [{ l: t[lang].q4a, d: 'Vata' }, { l: t[lang].q4b, d: 'Pitta' }, { l: t[lang].q4c, d: 'Kapha' }] },
  { emoji: '✨', q: t[lang].q5, opts: [{ l: t[lang].q5a, d: 'Vata' }, { l: t[lang].q5b, d: 'Pitta' }, { l: t[lang].q5c, d: 'Kapha' }] },
]

function renderMarkdown(text: string, doshaColor = '#6abf8a'): string {
  return text
    .replace(/\*\*✦ VAIDYA'S NEURAL SYNTHESIS\*\*/g, `<div class="synthesis-header">✦ VAIDYA'S NEURAL SYNTHESIS</div>`)
    .replace(/\*\*🧪 Mathematical Precision Log\*\*/g, `<div class="section-header" style="color:${doshaColor}">🧪 Mathematical Precision Log</div>`)
    .replace(/\*\*🌿 The Path of Multi-Tradition Balance\*\*/g, `<div class="section-header" style="color:${doshaColor}">🌿 The Path of Multi-Tradition Balance</div>`)
    .replace(/\*\*📊 Clinical & Biomarker Correlation\*\*/g, `<div class="section-header" style="color:${doshaColor}">📊 Clinical Correlation</div>`)
    .replace(/\*\*⚡ Integrated Regimen \(Priority Actions\)\*\*/g, `<div class="section-header" style="color:${doshaColor}">⚡ Your Integrated Regimen</div>`)
    .replace(/\*\*📚 Verified Lineage\*\*/g, `<div class="section-header" style="color:${doshaColor}">📚 Lineage & Proof</div>`)
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

function sanitizeFilePart(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'chat'
}

function toWikiName(input: string): string {
  return input.replace(/[^a-zA-Z0-9\s/-]+/g, '').trim() || 'AyuraHealth Note'
}

export default function ChatPage() {
  const { user, isLoaded: clerkLoaded } = useUser()
  const clerk = useClerk()
  
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

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
  const [selectedSystems, setSelectedSystems] = useState(['ayurveda'])
  const [incognito] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [thinkingDots, setThinkingDots] = useState('.')
  const [savedState, setSavedState] = useState<SavedState | null>(null)
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [selectedSource, setSelectedSource] = useState<ChatSource | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [labResults, setLabResults] = useState<Array<{ id: string; value: string; status: 'optimal' | 'low' | 'high' }>>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [attachLoading, setAttachLoading] = useState(false)

  const [linkInput, setLinkInput] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [showObsidianModal, setShowObsidianModal] = useState(false)
  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof window === 'undefined') return 'green'
    try {
      const saved = localStorage.getItem(THEME_PREF_KEY)
      const allowed: ThemeName[] = ['green', 'gold', 'forest', 'ocean', 'plum', 'sunset', 'slate', 'rose']
      if (saved === 'dark') return 'green'
      if (saved === 'light') return 'gold'
      return saved && allowed.includes(saved as ThemeName) ? (saved as ThemeName) : 'green'
    } catch {
      return 'green'
    }
  })
  const [modelPreference, setModelPreference] = useState<ModelPreference>(() => {
    if (typeof window === 'undefined') return 'auto'
    try {
      const raw = localStorage.getItem(AI_PREF_KEY)
      if (!raw) return 'auto'
      const parsed = JSON.parse(raw) as { model?: ModelPreference }
      const allowed: ModelPreference[] = ['auto', 'claude', 'gpt', 'gemini', 'deepseek', 'mistral', 'llama', 'groq']
      return parsed.model && allowed.includes(parsed.model) ? parsed.model : 'auto'
    } catch {
      return 'auto'
    }
  })
  const [webSearchEnabled, setWebSearchEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      const raw = localStorage.getItem(AI_PREF_KEY)
      if (!raw) return false
      const parsed = JSON.parse(raw) as { webSearch?: boolean }
      return Boolean(parsed.webSearch)
    } catch {
      return false
    }
  })
  const [responseMode, setResponseMode] = useState<ResponseMode>(() => {
    if (typeof window === 'undefined') return 'fast'
    try {
      const raw = localStorage.getItem(AI_PREF_KEY)
      if (!raw) return 'fast'
      const parsed = JSON.parse(raw) as { responseMode?: ResponseMode }
      return parsed.responseMode ?? 'fast'
    } catch {
      return 'fast'
    }
  })
  const [vedicContext, setVedicContext] = useState<string | null>(null)
  const [healthScores, setHealthScores] = useState<{ healthScore: number; doshaBalance: number; dashaInfluence: number; sentimentScore: number }>({
    healthScore: 72,
    doshaBalance: 80,
    dashaInfluence: 65,
    sentimentScore: 70
  })
  const [vedicEnabled, setVedicEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    try {
      const raw = localStorage.getItem(VEDIC_PREF_KEY)
      if (!raw) return true
      const parsed = JSON.parse(raw) as { enabled?: boolean }
      return typeof parsed.enabled === 'boolean' ? parsed.enabled : true
    } catch {
      return true
    }
  })
  const [vedicPanelOpen, setVedicPanelOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      const raw = localStorage.getItem(VEDIC_PREF_KEY)
      if (!raw) return false
      const parsed = JSON.parse(raw) as { open?: boolean }
      return typeof parsed.open === 'boolean' ? parsed.open : false
    } catch {
      return false
    }
  })
  const [obsidianVault, setObsidianVault] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    try {
      const raw = localStorage.getItem(OBSIDIAN_PREF_KEY)
      if (!raw) return ''
      const parsed = JSON.parse(raw) as { vault?: string }
      return typeof parsed.vault === 'string' ? parsed.vault : ''
    } catch {
      return ''
    }
  })
  const [obsidianIncludeSources, setObsidianIncludeSources] = useState(true)
  const [obsidianSelectedOnly, setObsidianSelectedOnly] = useState(false)
  const [obsidianSelectedCount, setObsidianSelectedCount] = useState(10)
  const [obsidianCategory, setObsidianCategory] = useState<(typeof OBSIDIAN_CATEGORIES)[number]>('Health')
  const [obsidianRelatedNotes, setObsidianRelatedNotes] = useState('')
  const [obsidianSetupNote, setObsidianSetupNote] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance>(null)
  const shareCardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)

  // Save language preference whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ayura_lang', lang)
    }
  }, [lang])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(THEME_PREF_KEY, theme)
    } catch {}
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(AI_PREF_KEY, JSON.stringify({
        model: modelPreference,
        webSearch: webSearchEnabled,
        responseMode,
      }))
    } catch {}
  }, [modelPreference, webSearchEnabled, responseMode])


  // Persist Vedic preferences
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(VEDIC_PREF_KEY, JSON.stringify({ enabled: vedicEnabled, open: vedicPanelOpen }))
    } catch {}
  }, [vedicEnabled, vedicPanelOpen])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(OBSIDIAN_PREF_KEY, JSON.stringify({
        vault: obsidianVault,
        category: obsidianCategory,
        relatedNotes: obsidianRelatedNotes,
      }))
    } catch {}
  }, [obsidianVault, obsidianCategory, obsidianRelatedNotes])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(OBSIDIAN_PREF_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as { category?: string; relatedNotes?: string }
      if (parsed.category && OBSIDIAN_CATEGORIES.includes(parsed.category as (typeof OBSIDIAN_CATEGORIES)[number])) {
        setObsidianCategory(parsed.category as (typeof OBSIDIAN_CATEGORIES)[number])
      }
      if (typeof parsed.relatedNotes === 'string') {
        setObsidianRelatedNotes(parsed.relatedNotes)
      }
    } catch {}
  }, [])

  const doshaColor = dosha ? DOSHA_META[dosha].color : '#6abf8a'
  const tx = t[lang]

  // Intercept the /chat?q=... parameter from the landing page growth hack
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const qs = new URLSearchParams(window.location.search)
      const q = qs.get('q')
      if (q && screen === 'landing' && messages.length === 0) {
        setScreen('chat')
        setInput(q)
        // Optional: clear the URL so reloading doesn't reset it
        const url = new URL(window.location.href)
        url.searchParams.delete('q')
        window.history.replaceState({}, '', url.toString())
      }
    }
  }, [screen, messages.length])

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
      const w = window as unknown as AugmentedWindow
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

  // Calculate health scores from conversation messages
  useEffect(() => {
    if (messages.length === 0) return
    const profile = loadProfile()
    const scores = calculateHealthScores(messages, profile)
    setHealthScores(scores)
  }, [messages])


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
              const w = window as unknown as AugmentedWindow
              if (w.pdfjsLib) {
                w.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
                const pdf = await w.pdfjsLib.getDocument({ data: reader.result }).promise
                let text = ''
                for (let p = 1; p <= Math.min(pdf.numPages, 10); p++) {
                  const page = await pdf.getPage(p)
                  const content = await page.getTextContent()
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  text += content.items.map((item: any) => item.str).join(' ') + '\n'
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
      const res = await fetch(getApiUrl('/api/fetch-link'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const id = Math.random().toString(36).slice(2)
      setAttachments(prev => [...prev, { id, type: 'link', name: data.title || url, content: data.text, url }])
    } catch { alert('Could not fetch that link. Try a different URL.') }
    setAttachLoading(false)
  }

  const removeAttachment = (id: string) => setAttachments(prev => prev.filter(a => a.id !== id))



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
      const w = window as unknown as AugmentedWindow
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
    } catch { /* Error silently handled */ }
    finally { setIsSharing(false) }
  }



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
      const res = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          systems: selectedSystems,
          incognito,
          dosha,
          modelPreference,
          deepThink: responseMode === 'deep' || responseMode === 'research',
          webSearch: responseMode === 'research' ? true : webSearchEnabled,
          lang: (typeof window !== 'undefined' ? localStorage.getItem('ayura_lang') || lang : lang),
          attachments: currentAttachments,
          vedicContext: vedicEnabled ? (vedicContext || undefined) : undefined,
        }),
      })
      if (!res.ok) {
        let apiError = 'API error'
        try {
          const errBody = await res.json()
          apiError = errBody?.error || errBody?.message || apiError
        } catch {}
        if (res.status === 402) {
          setShowPaywall(true)
          setLoading(false)
          return
        }
        throw new Error(apiError)
      }
      const reader = res.body?.getReader(); const decoder = new TextDecoder(); let full = ''; let currentSources: ChatSource[] = []; let currentAgentTrace: AgentTrace[] = []; let currentModelTrace: ModelTrace = {}; let buffer = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read(); if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          // Keep the last partial line in the buffer
          buffer = lines.pop() || ''
          
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || !trimmed.startsWith('data: ')) continue
            
            try { 
              const d = JSON.parse(trimmed.slice(6))
              if (d.sources) { 
                currentSources = d.sources 
              } else if (d.agentTrace) {
                currentAgentTrace = d.agentTrace
              } else if (d.modelUsed || d.providerUsed) {
                currentModelTrace = { modelUsed: d.modelUsed, providerUsed: d.providerUsed, quality: d.quality, policy: d.policy }
              } else if (d.content) { 
                full += d.content; setStreaming(full) 
              } 
            } catch (e) {
              console.warn('SSE_PARSE_ERROR:', e, 'Line:', trimmed)
            }
          }
        }
      }
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: full,
        sources: currentSources,
        agentTrace: currentAgentTrace,
        ...currentModelTrace,
      }]); 
      setStreaming('');
      // Reactive Diagnostic Feed: Extract biomarkers from AI analysis
      if (full.includes('BIO_MARKER:')) {
        const matches = [...full.matchAll(/BIO_MARKER: ([\w\- ]+) \| VALUE: ([\w\- \/\.>]+) \| STATUS: (\w+)/g)];
        const extracted = matches.map(m => ({ id: m[1].toLowerCase().slice(0,3), value: m[2], status: m[3].toLowerCase() as 'optimal' | 'low' | 'high' }));
        if (extracted.length > 0) setLabResults(extracted);
      }
      setIsSpeaking(false);


      if (currentModelTrace.quality) {
        fetch(getApiUrl('/api/quality-event'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ts: Date.now(),
            formatScore: currentModelTrace.quality.formatScore,
            completeness: currentModelTrace.quality.completeness,
            latencyMs: currentModelTrace.quality.latencyMs,
            repaired: currentModelTrace.quality.repaired,
            modelUsed: currentModelTrace.modelUsed || '',
            providerUsed: currentModelTrace.providerUsed || '',
            responseMode,
            policyApplied: Boolean(currentModelTrace.policy?.applied),
          }),
        }).catch(() => {})
      }
      
      if (newMessages.length <= 2 && activeUser && !incognito) {
        fetch(getApiUrl('/api/chat-session'), {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ 
             topic: content.slice(0, 50) + (content.length > 50 ? '...' : ''), 
             summary: content 
           })
        }).catch(err => console.error('Failed to save chat session:', err));
      }
    } catch (err) { 
      console.error('CHAT_FETCH_FAILURE:', err)
      let displayError = 'Connection interrupted. Please try again.'
      if (err instanceof Error) {
        if (err.message.includes('VAIDYA is not configured') || err.message.includes('provider key missing')) {
          displayError = 'VAIDYA setup issue on server. Please contact support while we update deployment keys.'
        } else if (err.message.includes('API error')) {
          displayError = 'VAIDYA is slightly overwhelmed (API error). Please refresh and try one more time.'
        }
      }
      setMessages(prev => [...prev, { role: 'assistant', content: displayError }]); 
      setStreaming('') 
    }
    finally { setLoading(false) }
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }
  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value); e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
  }
  const questions = QUESTIONS(lang)
  const toggleSystem = (id: string) => {
    setSelectedSystems((prev) => {
      if (prev.includes(id)) {
        // Always keep at least one active system.
        return prev.length === 1 ? prev : prev.filter((s) => s !== id)
      }
      // Allow up to 3 concurrent systems.
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const calcDosha = useCallback((ans: string[]): Dosha => {
    const counts: Record<string, number> = { Vata: 0, Pitta: 0, Kapha: 0 }
    ans.forEach(a => { counts[a] = (counts[a] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Dosha
  }, [])

  const handleAnswer = useCallback((d: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev, d]
      if (currentQ < QUESTIONS(lang).length - 1) {
        setCurrentQ(prevQ => prevQ + 1)
      } else { 
        const resultDosha = calcDosha(newAnswers)
        setDosha(resultDosha)
        setScreen('result')

        // Save to Database if user is signed in
        if (user) {
          fetch(getApiUrl('/api/user-profile'), {
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
      return newAnswers
    })
  }, [currentQ, lang, user, calcDosha])

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
    if (typeof window === 'undefined') return
    vaidyaVoice.speak(text, () => setIsSpeaking(false))
    setIsSpeaking(true)
  }, [])

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return
    const w = window as unknown as AugmentedWindow
    const SRClass = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SRClass) return
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return }
    const recognition = new SRClass()
    recognition.lang = lang === 'ja' ? 'ja-JP' : lang === 'hi' ? 'hi-IN' : 'en-US'
    recognition.continuous = false; recognition.interimResults = true
    recognition.onstart = () => setIsListening(true)
    /* eslint-disable @typescript-eslint/no-explicit-any */
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('')
      /* eslint-enable @typescript-eslint/no-explicit-any */
      setInput(transcript)
      if (event.results[event.results.length - 1].isFinal) setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false); recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition; recognition.start()
  }, [lang, isListening])

  const exportChatToObsidian = useCallback((options?: {
    includeSources?: boolean
    selectedOnly?: boolean
    method?: 'download' | 'uri'
    category?: (typeof OBSIDIAN_CATEGORIES)[number]
    relatedNotes?: string
  }) => {
    if (messages.length === 0) return

    const includeSources = Boolean(options?.includeSources)
    const method = options?.method || 'download'
    let exportMessages = messages

    if (options?.selectedOnly) {
      const safeCount = Math.min(messages.length, Math.max(1, obsidianSelectedCount))
      exportMessages = messages.slice(-safeCount)
    }

    const now = new Date()
    const iso = now.toISOString()
    const datePart = iso.slice(0, 10)
    const timePart = iso.slice(11, 16).replace(':', '-')
    const doshaPart = dosha ? sanitizeFilePart(dosha) : 'general'
    const chosenCategory = options?.category ?? obsidianCategory
    const categorySlug = sanitizeFilePart(chosenCategory)
    const relatedNotes = (options?.relatedNotes ?? obsidianRelatedNotes)
      .split(',')
      .map((n) => toWikiName(n.trim()))
      .filter(Boolean)
      .slice(0, 20)
    const fileName = `Brain/${categorySlug}/AyuraHealth/ayurahealth-${datePart}-${timePart}-${doshaPart}${includeSources ? '-sources' : ''}.md`
    const sessionWiki = toWikiName(`AyuraHealth ${datePart} ${timePart} ${dosha ?? 'General'}`)
    const brainHome = 'Brain Home'
    const categoryHub = `${chosenCategory} Hub`

    const frontmatter = [
      '---',
      `title: "${sessionWiki}"`,
      `created: "${iso}"`,
      `source: "AyuraHealth"`,
      `dosha: "${dosha ?? 'unknown'}"`,
      `category: "${chosenCategory}"`,
      `systems: [${selectedSystems.map(s => `"${s}"`).join(', ')}]`,
      `language: "${lang}"`,
      `vedic_context_used: ${Boolean(vedicEnabled && vedicContext)}`,
      `message_count: ${exportMessages.length}`,
      `related_notes: [${relatedNotes.map((n) => `"${n}"`).join(', ')}]`,
      'tags: ["ayurahealth","consultation","wellness-ai"]',
      '---',
      '',
      `[[${brainHome}]]`,
      '',
      `[[${categoryHub}]]`,
      '',
      `Related: [[Dosha/${dosha ?? 'General'}]]`,
      '',
    ].join('\n')

    const body = exportMessages.map((m, idx) => {
      const role = m.role === 'assistant' ? 'VAIDYA' : 'User'
      const content = m.content.replace(/\r\n/g, '\n')
      return `## ${idx + 1}. ${role}\n\n${content}\n`
    }).join('\n')

    const sourcesBlock = includeSources
      ? exportMessages
          .map((m, idx) => {
            if (!m.sources || m.sources.length === 0) return ''
            const list = m.sources.map((s, i) =>
              `- ${i + 1}. **${s.tradition}** — ${s.title} (${s.source})\n  - ${s.content.slice(0, 260).replace(/\n/g, ' ')}${s.content.length > 260 ? '...' : ''}`
            ).join('\n')
            return `### Sources for message ${idx + 1}\n${list}\n`
          })
          .filter(Boolean)
          .join('\n')
      : ''

    const footer = [
      '',
      '## Brain Links',
      '',
      `- Category hub: [[${categoryHub}]]`,
      `- Master hub: [[${brainHome}]]`,
      ...relatedNotes.map((n) => `- Existing note: [[${n}]]`),
      '',
      sourcesBlock ? '## Sources & Citations\n' : '',
      sourcesBlock,
      sourcesBlock ? '' : '',
      '---',
      '',
      '_Educational guidance only. Not medical advice._',
      '',
      `Exported from https://ayurahealth.com at ${iso}`,
      '',
    ].join('\n')

    const markdown = `${frontmatter}${body}${footer}`
    const indexNote = [
      '# AyuraHealth Index',
      '',
      `- Latest consultation: [[${sessionWiki}]]`,
      `- Dosha: [[Dosha/${dosha ?? 'General'}]]`,
      `- Systems: ${selectedSystems.map(s => `[[System/${s}]]`).join(', ')}`,
      `- Category: [[${categoryHub}]]`,
      '',
      `Updated: ${iso}`,
      '',
    ].join('\n')

    const brainHomeNote = [
      '# Brain Home',
      '',
      '- Health: [[Health Hub]]',
      '- Business: [[Business Hub]]',
      '- Research: [[Research Hub]]',
      '- Ideas: [[Ideas Hub]]',
      '- Personal: [[Personal Hub]]',
      '',
      `Latest imported: [[${sessionWiki}]]`,
      '',
      `Updated: ${iso}`,
      '',
    ].join('\n')

    const categoryHubNote = [
      `# ${categoryHub}`,
      '',
      `- Latest imported session: [[${sessionWiki}]]`,
      '- Source app: AyuraHealth',
      `- Related notes: ${relatedNotes.length ? relatedNotes.map((n) => `[[${n}]]`).join(', ') : 'None added yet'}`,
      '',
      `Updated: ${iso}`,
      '',
    ].join('\n')

    if (method === 'uri') {
      if (markdown.length > 7000) {
        // Obsidian URI payloads can fail if too large. Fall back to file download.
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        return
      }
      const vaultParam = obsidianVault.trim() ? `&vault=${encodeURIComponent(obsidianVault.trim())}` : ''
      const brainHomeUrl = `obsidian://new?name=${encodeURIComponent(brainHome)}${vaultParam}&content=${encodeURIComponent(brainHomeNote)}`
      const categoryHubUrl = `obsidian://new?name=${encodeURIComponent(categoryHub)}${vaultParam}&content=${encodeURIComponent(categoryHubNote)}`
      const indexUrl = `obsidian://new?name=${encodeURIComponent('AyuraHealth Index')}${vaultParam}&content=${encodeURIComponent(indexNote)}`
      const sessionUrl = `obsidian://new?name=${encodeURIComponent(sessionWiki)}${vaultParam}&content=${encodeURIComponent(markdown)}`
      window.location.href = brainHomeUrl
      setTimeout(() => {
        window.location.href = categoryHubUrl
      }, 300)
      setTimeout(() => {
        window.location.href = indexUrl
      }, 650)
      setTimeout(() => {
        window.location.href = sessionUrl
      }, 980)
      return
    }

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [messages, dosha, selectedSystems, lang, vedicEnabled, vedicContext, obsidianSelectedCount, obsidianVault, obsidianCategory, obsidianRelatedNotes])

  const testObsidianConnection = useCallback(() => {
    const vaultParam = obsidianVault.trim() ? `&vault=${encodeURIComponent(obsidianVault.trim())}` : ''
    const testContent = [
      '# AyuraHealth x Obsidian Connected',
      '',
      `Connected at: ${new Date().toISOString()}`,
      '',
      'If you can see this note, direct Obsidian linking is working.',
      '',
      'Next: return to AyuraHealth chat and use "Send to Obsidian".',
      '',
      'Next: return to AyuraHealth chat and use "Send to Obsidian".',
      '',
    ].join('\n')
    const testUrl = `obsidian://new?name=${encodeURIComponent('AyuraHealth Connection Test')}${vaultParam}&content=${encodeURIComponent(testContent)}`
    window.location.href = testUrl
    setObsidianSetupNote('Connection attempt sent to Obsidian. If no note appears, use "Download Markdown" and drag the file into your vault.')
  }, [obsidianVault])

  // ── CEO Bypass Check ────────────────────────────────────────────────────────
  const isCeo = typeof window !== 'undefined' && document.cookie.includes('ayura_ceo_token')
  const activeUser = user || (isCeo ? { firstName: 'CEO', lastName: 'Owner', imageUrl: '/favicon.svg' } : null)

  // ── Lifecycle Guard ─────────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <main style={{ minHeight: '100vh', background: '#05100a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#c9a84c', fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', letterSpacing: '0.25em', textAlign: 'center' }}>
          Initializing VAIDYA Healing Wisdom...
          <div style={{ color: 'rgba(106,191,138,0.4)', fontSize: '0.7rem', marginTop: '1rem', letterSpacing: '0.1em' }}>NEURAL SYNTHESIS IN PROGRESS</div>
        </div>
      </main>
    )
  }

  const oracleState = isListening ? 'listening' : (loading && !streaming) ? 'thinking' : streaming ? 'responding' : 'idle';

  return (
    <main style={{ minHeight: '100vh', background: 'var(--ios-bg)', fontFamily: '"DM Sans", system-ui, sans-serif', color: 'var(--ios-text)', position: 'relative', overflow: 'hidden' }}>

      {/* Source Detail Modal */}
      {selectedSource && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card" 
            style={{ padding: '2.5rem 2rem', maxWidth: 500, width: '100%', border: '1px solid rgba(201,168,76,0.3)', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ color: '#6abf8a', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{selectedSource.tradition} Clinical Snippet</div>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#c9a84c', fontSize: '1.6rem', fontWeight: 700 }}>{selectedSource.source}</h3>
              </div>
              <button 
                onClick={() => setSelectedSource(null)}
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ×
              </button>
            </div>
            
            <div className="native-scroll" style={{ maxHeight: '40vh', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(232,223,200,0.8)', fontSize: '0.95rem', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '2rem' }}>
              &quot;{selectedSource.content}&quot;
            </div>

            <button 
              onClick={() => setSelectedSource(null)}
              style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #2d7a45, #1a4d2e)', color: '#fff', border: 'none', borderRadius: 980, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Continue Consultation
            </button>
          </motion.div>
        </div>
      )}

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

      {/* Paywall Modal */}
      {showPaywall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
          <div style={{ background: 'linear-gradient(145deg, #0a1a0f, #081510)', border: '1px solid rgba(106,191,138,0.25)', borderRadius: 28, padding: '2.5rem 2rem', maxWidth: 440, width: '100%', textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(106,191,138,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 24px rgba(201,168,76,0.5))' }}>🌿</div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.9rem', fontWeight: 700, color: '#c9a84c', marginBottom: '0.5rem' }}>Free Consultations Used</div>
            <p style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              You have experienced what VAIDYA can do. Thousands of years of healing wisdom — now unlock it fully.
            </p>
            
            {!!activeUser ? (
              <>
                <div style={{ background: 'rgba(106,191,138,0.06)', border: '1px solid rgba(106,191,138,0.15)', borderRadius: 16, padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                  {['Unlimited AI consultations', 'Advanced blood report analysis', 'Personalized weekly meal plans', 'Consultation history & export', '7-day free trial — cancel anytime'].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0', fontSize: '0.85rem', color: 'rgba(232,223,200,0.75)' }}>
                      <span style={{ color: '#6abf8a', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.4rem', fontWeight: 300, color: '#e8dfc8', lineHeight: 1 }}>$4.99</div>
                  <div style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.8rem' }}>/month · 7-day free trial</div>
                </div>
                <a
                  href={`/pricing/checkout?tier=premium&billing=monthly&currency=usd`}
                  style={{ display: 'block', width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #1a4d2e, #2d7a45, #3a9455)', color: '#e8dfc8', border: '1px solid rgba(106,191,138,0.4)', borderRadius: 980, fontSize: '1rem', fontWeight: 700, textDecoration: 'none', marginBottom: '0.75rem', boxShadow: '0 8px 32px rgba(45,122,69,0.5)', cursor: 'pointer' }}
                >
                  Start 7-Day Free Trial →
                </a>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: 'rgba(232,223,200,0.8)', fontSize: '0.95rem', marginBottom: '1rem' }}>Create a free account to continue your journey and unlock more free consultations.</div>
                </div>
                <button
                  onClick={() => { if (clerkLoaded && !activeUser) clerk.openSignIn({ fallbackRedirectUrl: window.location.href }) }}
                  style={{ display: 'block', width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #1a4d2e, #2d7a45, #3a9455)', color: '#e8dfc8', border: '1px solid rgba(106,191,138,0.4)', borderRadius: 980, fontSize: '1rem', fontWeight: 700, textDecoration: 'none', marginBottom: '0.75rem', boxShadow: '0 8px 32px rgba(45,122,69,0.5)', cursor: 'pointer' }}
                >
                  Sign Up for Free
                </button>
              </>
            )}
            <button
              onClick={() => setShowPaywall(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(200,200,200,0.35)', fontSize: '0.82rem', cursor: 'pointer', padding: '0.5rem' }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {showObsidianModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="ios-surface" style={{ width: '100%', maxWidth: 560, borderRadius: 20, padding: '1rem 1rem 0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <div>
                <div style={{ color: '#c9a84c', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>Obsidian Brain Export</div>
                <div style={{ color: 'rgba(232,223,200,0.55)', fontSize: '0.78rem' }}>Premium export for graph-ready notes and vault linking</div>
              </div>
              <button type="button" onClick={() => setShowObsidianModal(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(232,223,200,0.7)', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'grid', gap: '0.65rem' }}>
              <label style={{ display: 'grid', gap: '0.25rem' }}>
                <span style={{ color: 'rgba(232,223,200,0.75)', fontSize: '0.76rem' }}>Vault name (for direct open, optional)</span>
                <input
                  value={obsidianVault}
                  onChange={(e) => {
                    setObsidianVault(e.target.value)
                    setObsidianSetupNote('')
                  }}
                  placeholder="e.g. tech-brain"
                  style={{ background: 'rgba(255,255,255,0.03)', color: '#e8dfc8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0.55rem 0.65rem' }}
                />
              </label>

              <label style={{ display: 'grid', gap: '0.25rem' }}>
                <span style={{ color: 'rgba(232,223,200,0.75)', fontSize: '0.76rem' }}>Brain category</span>
                <select
                  value={obsidianCategory}
                  onChange={(e) => setObsidianCategory(e.target.value as (typeof OBSIDIAN_CATEGORIES)[number])}
                  style={{ background: 'rgba(255,255,255,0.03)', color: '#e8dfc8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0.55rem 0.65rem' }}
                >
                  {OBSIDIAN_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} style={{ background: '#0b1a11', color: '#e8dfc8' }}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'grid', gap: '0.25rem' }}>
                <span style={{ color: 'rgba(232,223,200,0.75)', fontSize: '0.76rem' }}>Link existing notes (comma separated)</span>
                <input
                  value={obsidianRelatedNotes}
                  onChange={(e) => setObsidianRelatedNotes(e.target.value)}
                  placeholder="e.g. Founder OS, Product Roadmap, Daily Journal"
                  style={{ background: 'rgba(255,255,255,0.03)', color: '#e8dfc8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0.55rem 0.65rem' }}
                />
              </label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={testObsidianConnection}
                  className="ios-chip active"
                  style={{ border: 'none', padding: '0.46rem 0.7rem', borderRadius: 11, color: '#6abf8a', cursor: 'pointer', fontSize: '0.74rem' }}
                >
                  🔗 Test Obsidian Connection
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('1) Keep Obsidian app open\n2) In AyuraHealth click "Obsidian Export"\n3) Enter vault name exactly\n4) Click "Send to Obsidian"\n5) If blocked, click "Download Markdown" and drag file into vault')
                    setObsidianSetupNote('Setup steps copied to clipboard.')
                  }}
                  className="ios-chip"
                  style={{ border: 'none', padding: '0.46rem 0.7rem', borderRadius: 11, color: '#c9a84c', cursor: 'pointer', fontSize: '0.74rem' }}
                >
                  📋 Copy Setup Steps
                </button>
              </div>

              {obsidianSetupNote && (
                <div style={{ fontSize: '0.74rem', color: 'rgba(232,223,200,0.72)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.5rem 0.65rem' }}>
                  {obsidianSetupNote}
                </div>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'rgba(232,223,200,0.75)', fontSize: '0.78rem' }}>
                <input type="checkbox" checked={obsidianIncludeSources} onChange={(e) => setObsidianIncludeSources(e.target.checked)} />
                Include sources & citations section
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'rgba(232,223,200,0.75)', fontSize: '0.78rem' }}>
                <input type="checkbox" checked={obsidianSelectedOnly} onChange={(e) => setObsidianSelectedOnly(e.target.checked)} />
                Export only recent messages
              </label>
              {obsidianSelectedOnly && (
                <label style={{ display: 'grid', gap: '0.25rem' }}>
                  <span style={{ color: 'rgba(232,223,200,0.75)', fontSize: '0.76rem' }}>Recent message count</span>
                  <input
                    type="number"
                    min={1}
                    max={messages.length}
                    value={obsidianSelectedCount}
                    onChange={(e) => setObsidianSelectedCount(Math.max(1, Math.min(messages.length, Number.parseInt(e.target.value || '1', 10))))}
                    style={{ background: 'rgba(255,255,255,0.03)', color: '#e8dfc8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0.55rem 0.65rem', width: 140 }}
                  />
                </label>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', marginTop: '0.95rem' }}>
              <button
                type="button"
                onClick={() => {
                  exportChatToObsidian({
                    includeSources: obsidianIncludeSources,
                    selectedOnly: obsidianSelectedOnly,
                    method: 'download',
                    category: obsidianCategory,
                    relatedNotes: obsidianRelatedNotes,
                  })
                  setShowObsidianModal(false)
                }}
                className="ios-chip active"
                style={{ border: 'none', padding: '0.5rem 0.75rem', borderRadius: 12, color: '#c9a84c', cursor: 'pointer' }}
              >
                ⬇ Download Markdown
              </button>
              <button
                type="button"
                onClick={() => {
                  exportChatToObsidian({
                    includeSources: obsidianIncludeSources,
                    selectedOnly: obsidianSelectedOnly,
                    method: 'uri',
                    category: obsidianCategory,
                    relatedNotes: obsidianRelatedNotes,
                  })
                  setShowObsidianModal(false)
                }}
                className="ios-chip active"
                style={{ border: 'none', padding: '0.5rem 0.75rem', borderRadius: 12, color: '#6abf8a', cursor: 'pointer' }}
              >
                🧠 Send to Obsidian
              </button>
            </div>
          </div>
        </div>
      )}

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
            &quot;{savedState.messages.filter(m => m.role === 'user').slice(-1)[0]?.content?.substring(0, 80) || 'Your consultation'}&quot;...
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

      {/* Header (hidden on chat where dedicated topbar is used) */}
      {screen !== 'chat' && (
        <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,16,10,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(106,191,138,0.12)', padding: '0.7rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo size={30} showText={true} href="/" />
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }} />
        </header>
      )}

      {/* ── LANDING SCREEN ─────────────────────────────────────────────────── */}
      {screen === 'landing' && (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '2rem 1rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <VaidyaOracle />
          </motion.div>

          <header style={{ marginBottom: '3.5rem', marginTop: '-1rem' }}>
            <h1 style={{ 
              fontFamily: '"Cormorant Garamond", serif', 
              fontSize: '3.8rem', 
              color: '#c9a84c', 
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              {t[lang].title}
            </h1>
            <p style={{ 
              fontSize: '1.2rem', 
              opacity: 0.6, 
              color: '#e8dfc8', 
              maxWidth: 500, 
              margin: '0 auto',
              lineHeight: 1.5,
              fontWeight: 400
            }}>
              {t[lang].subtitle}
            </p>
          </header>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(106,191,138,0.2)', borderRadius: 20, padding: '2rem', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
            <EngagementStory />
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

      {screen === 'chat' && (
        <div className="chat-shell" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100dvh' }}>
          <div className="liquid-glass ios-surface chat-topbar" style={{ padding: '0.42rem 0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Logo size={24} showText={true} href="/" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.38rem' }}>
              <div className="ios-chip active chat-disclaimer-chip" style={{ padding: '0.2rem 0.5rem', borderRadius: 11, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.65rem', filter: 'grayscale(1)' }}>🛡️</span>
                <span style={{ color: '#c9a84c', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Educational Only — Not Medical Advice</span>
              </div>
              <select
                value={modelPreference}
                onChange={(e) => setModelPreference(e.target.value as ModelPreference)}
                className="ios-chip"
                title="Choose intelligence model"
                style={{
                  padding: '0.22rem 0.5rem',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.64rem',
                  color: 'rgba(232,223,200,0.85)',
                  background: 'rgba(255,255,255,0.06)'
                }}
              >
                <option value="auto">Auto AI</option>
                <option value="claude">Claude</option>
                <option value="gpt">ChatGPT</option>
                <option value="gemini">Gemini</option>
                <option value="deepseek">DeepSeek</option>
                <option value="mistral">Mistral</option>
                <option value="llama">Llama</option>
                <option value="groq">Groq Fast</option>
              </select>
              <div className="ios-segmented" style={{ padding: '0.18rem', borderRadius: 11 }}>
                {(['fast', 'deep', 'research'] as ResponseMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setResponseMode(mode)}
                    className={`ios-segmented-item ${responseMode === mode ? 'active' : ''}`}
                    style={{ fontSize: '0.64rem', padding: '0.2rem 0.44rem' }}
                    title={mode === 'fast' ? 'Fast response' : mode === 'deep' ? 'Deeper reasoning' : 'Deep + web research'}
                  >
                    {mode === 'fast' ? 'Fast' : mode === 'deep' ? 'Deep' : 'Research'}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setWebSearchEnabled((v) => !v)}
                className={`ios-chip ${webSearchEnabled ? 'active' : ''}`}
                style={{
                  padding: '0.22rem 0.5rem',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.64rem',
                  color: webSearchEnabled ? '#6abf8a' : 'rgba(232,223,200,0.8)'
                }}
                title="Include live web sources"
              >
                🌐 Web {responseMode === 'research' ? 'Auto' : webSearchEnabled ? 'On' : 'Off'}
              </button>
              <button
                type="button"
                onClick={() => setShowObsidianModal(true)}
                disabled={messages.length === 0}
                className={`ios-chip ${messages.length > 0 ? 'active' : ''}`}
                style={{
                  padding: '0.22rem 0.5rem',
                  borderRadius: 12,
                  border: 'none',
                  cursor: messages.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: messages.length > 0 ? 1 : 0.45,
                  fontSize: '0.64rem',
                  color: '#c9a84c'
                }}
                title="Open premium Obsidian export options"
              >
                🧠 Obsidian Export
              </button>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemeName)}
                className="ios-chip"
                style={{
                  padding: '0.22rem 0.5rem',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.64rem',
                  color: 'rgba(232,223,200,0.8)'
                }}
                title="Choose app theme"
              >
                {THEME_OPTIONS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <button onClick={() => setScreen('landing')} style={{ background: 'transparent', border: 'none', color: 'rgba(200,200,200,0.56)', fontSize: '0.7rem', cursor: 'pointer' }}>Exit</button>
            </div>
          </div>
          <div className="chat-desktop-layout">
            {/* Left rail */}
            <ChatSidebar
              systems={MEDICINE_SYSTEMS}
              selectedSystems={selectedSystems}
              onToggleSystem={toggleSystem}
              systemDetail={SYSTEM_DETAIL}
              messagesCount={messages.length}
              incognito={incognito}
              healthScore={healthScores.healthScore}
              doshaBalance={healthScores.doshaBalance}
              dashaInfluence={healthScores.dashaInfluence}
              sentimentScore={healthScores.sentimentScore}
            />

            {/* Right conversation area */}
            <section className="chat-main">
              <div className="ios-surface" style={{ padding: '0.6rem 0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setVedicPanelOpen(v => !v)}
                      className={`ios-chip ${vedicPanelOpen ? 'active' : ''}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.6rem', borderRadius: 12 }}
                    >
                      <span style={{ opacity: 0.9 }}>🔭</span>
                      <span style={{ fontSize: '0.75rem', color: vedicPanelOpen ? '#c9a84c' : 'rgba(232,223,200,0.7)' }}>
                        {vedicPanelOpen ? 'Hide Vedic Oracle' : 'Open Vedic Oracle'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVedicEnabled(v => !v)}
                      className={`ios-chip ${vedicEnabled ? 'active' : ''}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.6rem', borderRadius: 12 }}
                      title="When off, VAIDYA will ignore Vedic personalization even if calculated."
                    >
                      <span style={{ opacity: 0.9 }}>{vedicEnabled ? '✅' : '⛔️'}</span>
                      <span style={{ fontSize: '0.75rem', color: vedicEnabled ? '#c9a84c' : 'rgba(232,223,200,0.7)' }}>
                        Use Vedic context
                      </span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {vedicContext ? (
                      <div className="chat-meta-text" style={{ color: vedicEnabled ? 'rgba(106,191,138,0.9)' : 'rgba(232,223,200,0.4)' }}>
                        {vedicEnabled ? 'Vedic context ready' : 'Vedic context disabled'}
                      </div>
                    ) : (
                      <div className="chat-meta-text" style={{ color: 'rgba(232,223,200,0.35)' }}>
                        Optional personalization
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {vedicPanelOpen && (
                <VedicOraclePanel
                  initialDosha={dosha ?? 'Vata'}
                  labResults={labResults}
                  onContextReady={(context) => setVedicContext(context)}
                />
              )}

              {/* Messages */}
              <ChatMessagesPanel
                messages={messages}
                loading={loading}
                streaming={streaming}
                oracleState={oracleState}
                doshaColor={doshaColor}
                renderMarkdown={renderMarkdown}
                voiceSupported={voiceSupported}
                isSpeaking={isSpeaking}
                thinkingDots={thinkingDots}
                onSpeakText={speakText}
                onSelectSource={setSelectedSource}
                messagesEndRef={messagesEndRef}
              />

          {/* Input area */}
          <ChatComposer
            attachments={attachments}
            attachLoading={attachLoading}
            showLinkInput={showLinkInput}
            linkInput={linkInput}
            voiceSupported={voiceSupported}
            isListening={isListening}
            input={input}
            loading={loading}
            placeholder={attachments.length > 0 ? 'Ask Vaidya about the attached file...' : dosha ? tx.chat_placeholder_dosha.replace('{dosha}', dosha) : tx.chat_placeholder}
            fileInputRef={fileInputRef}
            linkInputRef={linkInputRef}
            textareaRef={textareaRef}
            onFileSelect={handleFileSelect}
            onRemoveAttachment={removeAttachment}
            onToggleLinkInput={() => { setShowLinkInput(!showLinkInput); setTimeout(() => linkInputRef.current?.focus(), 50) }}
            onLinkInputChange={setLinkInput}
            onAddLink={handleAddLink}
            onCancelLinkInput={() => { setShowLinkInput(false); setLinkInput('') }}
            onStartListening={startListening}
            onInputChange={handleTextarea}
            onInputKeyDown={handleKey}
            onSendMessage={() => sendMessage()}
          />
            </section>
          </div>
        </div>
      )}

    </main>
  )
}
