'use client'

import { useState, useRef, useEffect, Suspense, useCallback } from 'react'
import { useSafeClerk as useClerk, useSafeUser as useUser } from '@/lib/clerk-client'
import { Lang, t } from '@/lib/translations'
import { useChat, ChatSource } from '@/lib/hooks/useChat'
import { useDoshaQuiz, Dosha } from '@/lib/hooks/useDoshaQuiz'
import { getApiUrl } from '@/lib/constants'
import { vaidyaVoice } from '@/lib/vaidyaVoice'

// Sub-components
import LandingScreen from './components/LandingScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import ChatInterface from './components/ChatInterface'

const QUESTIONS = (lang: Lang) => [
  { emoji: '🧍', q: t[lang].q1, opts: [{ l: t[lang].q1a, d: 'Vata' }, { l: t[lang].q1b, d: 'Pitta' }, { l: t[lang].q1c, d: 'Kapha' }] },
  { emoji: '🌿', q: t[lang].q2, opts: [{ l: t[lang].q2a, d: 'Vata' }, { l: t[lang].q2b, d: 'Pitta' }, { l: t[lang].q2c, d: 'Kapha' }] },
  { emoji: '🌙', q: t[lang].q3, opts: [{ l: t[lang].q3a, d: 'Vata' }, { l: t[lang].q3b, d: 'Pitta' }, { l: t[lang].q3c, d: 'Kapha' }] },
  { emoji: '🧠', q: t[lang].q4, opts: [{ l: t[lang].q4a, d: 'Vata' }, { l: t[lang].q4b, d: 'Pitta' }, { l: t[lang].q4c, d: 'Kapha' }] },
  { emoji: '✨', q: t[lang].q5, opts: [{ l: t[lang].q5a, d: 'Vata' }, { l: t[lang].q5b, d: 'Pitta' }, { l: t[lang].q5c, d: 'Kapha' }] },
]

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text-muted)' }}>
        <div className="animate-pulse">Initializing Ayura Intelligence...</div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  )
}

function ChatPageContent() {
  const { user, isLoaded: clerkLoaded } = useUser()
  const clerk = useClerk()
  
  // State Hooks
  const { 
    messages, input, loading, streaming, sendMessage, 
    setInput, setIsListening, setMessages, isListening, recognitionRef 
  } = useChat()
  
  const { 
    currentQ, setCurrentQ, answers, setAnswers, dosha, setDosha, calculateDosha 
  } = useDoshaQuiz()

  // Local UI State
  const [screen, setScreen] = useState<'landing' | 'quiz' | 'result' | 'chat'>('landing')
  const [lang, setLang] = useState<Lang>('en')
  const [modelPreference, setModelPreference] = useState('auto')
  const [responseMode, setResponseMode] = useState<'fast' | 'deep' | 'research'>('fast')
  const [selectedSystems, setSelectedSystems] = useState(['ayurveda'])
  const [attachments, setAttachments] = useState<any[]>([])
  const [attachLoading, setAttachLoading] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkInput, setLinkInput] = useState('')
  const [selectedSource, setSelectedSource] = useState<ChatSource | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)

  // Initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('ayura_lang') as Lang
      if (savedLang) setLang(savedLang)
      
      const qs = new URLSearchParams(window.location.search)
      if (qs.get('q')) {
        setScreen('chat')
        sendMessage({ 
          selectedSystems, dosha, modelPreference, responseMode, 
          webSearchEnabled: false, lang, attachments, vedicEnabled: true, 
          vedicContext: null, cavemanMode: false, incognito: false 
        }, qs.get('q')!)
      }
    }
  }, [])

  // Auth/CEO Bypass Logic
  const isCeo = typeof window !== 'undefined' && document.cookie.includes('ayura_ceo_token')
  const activeUser = user || (isCeo ? { firstName: 'CEO', imageUrl: '/favicon.svg' } : null)

  // Handlers
  const handleStartChat = useCallback((d?: Dosha | null) => {
    setScreen('chat')
    const activeDosha = d ?? dosha
    const tx = t[lang]
    const greeting = activeDosha 
      ? tx.greeting_dosha.replace(/{dosha}/g, activeDosha).replace('{tagline}', '').replace('{desc}', '')
      : tx.greeting
    setMessages([{ role: 'assistant', content: greeting }])
  }, [dosha, lang])

  const handleSendMessage = async () => {
    try {
      await sendMessage({
        selectedSystems,
        dosha,
        modelPreference,
        responseMode,
        webSearchEnabled: responseMode === 'research',
        lang,
        attachments,
        vedicEnabled: true,
        vedicContext: null,
        cavemanMode: false,
        incognito: false,
      })
      setAttachments([])
    } catch (err: any) {
      if (err.message === 'PAYWALL_LIMIT') setShowPaywall(true)
    }
  }

  const handleSpeak = useCallback((text: string) => {
    vaidyaVoice.speak(text, () => {})
  }, [])

  // Render Logic
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {screen === 'landing' && (
        <LandingScreen 
          lang={lang} 
          onStartQuiz={() => setScreen('quiz')} 
          onSkipToChat={() => handleStartChat(null)} 
        />
      )}

      {screen === 'quiz' && (
        <QuizScreen 
          lang={lang}
          currentQ={currentQ}
          questions={QUESTIONS(lang)}
          onAnswer={(d) => {
            const newAns = [...answers, d]
            setAnswers(newAns)
            if (currentQ < 4) setCurrentQ(currentQ + 1)
            else {
              const res = calculateDosha(newAns)
              setDosha(res)
              setScreen('result')
            }
          }}
          onPrevious={() => setCurrentQ(currentQ - 1)}
        />
      )}

      {screen === 'result' && dosha && (
        <ResultScreen 
          lang={lang}
          dosha={dosha}
          isSharing={isSharing}
          shareSuccess={shareSuccess}
          onStartChat={() => handleStartChat(dosha)}
          onShare={() => {}} // html2canvas logic can be added
          onRetake={() => { setScreen('quiz'); setCurrentQ(0); setAnswers([]) }}
        />
      )}

      {screen === 'chat' && (
        <ChatInterface 
          messages={messages}
          streaming={streaming}
          loading={loading}
          input={input}
          attachments={attachments}
          attachLoading={attachLoading}
          showLinkInput={showLinkInput}
          linkInput={linkInput}
          voiceSupported={true}
          isListening={isListening}
          modelPreference={modelPreference}
          responseMode={responseMode}
          dosha={dosha}
          activeUser={activeUser}
          onInputChange={(e) => setInput(e.target.value)}
          onInputKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }}
          onSendMessage={handleSendMessage}
          onFileSelect={() => {}} // implementation in props
          onRemoveAttachment={(id) => setAttachments(prev => prev.filter(a => a.id !== id))}
          onToggleLinkInput={() => setShowLinkInput(!showLinkInput)}
          onLinkInputChange={setLinkInput}
          onAddLink={() => {}}
          onCancelLinkInput={() => setShowLinkInput(false)}
          onStartListening={() => setIsListening(!isListening)}
          onModelPrefChange={setModelPreference}
          onResponseModeChange={setResponseMode}
          onSpeakText={handleSpeak}
          onSelectSource={setSelectedSource}
          onToggleVedicPanel={() => {}}
        />
      )}

      {/* Paywall Overlay */}
      {showPaywall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: 400 }}>
            <h2>Synthesis Limit Reached</h2>
            <p>Upgrade to Ayura Intelligence Pro for unlimited clinical analysis.</p>
            <button onClick={() => clerk.openSignUp()} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Upgrade Now</button>
            <button onClick={() => setShowPaywall(false)} style={{ marginTop: '1rem', opacity: 0.5 }}>Close</button>
          </div>
        </div>
      )}
    </main>
  )
}
