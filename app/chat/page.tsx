'use client'

import { useState, useRef, useEffect, Suspense, useCallback } from 'react'
import { useSafeClerk as useClerk, useSafeUser as useUser } from '@/lib/clerk-client'
import { useTranslation } from '@/lib/i18n/LanguageContext'
import { useChat, ChatSource } from '@/lib/hooks/useChat'
import { useDoshaQuiz, Dosha } from '@/lib/hooks/useDoshaQuiz'
import { getApiUrl } from '@/lib/constants'
import { vaidyaVoice } from '@/lib/vaidyaVoice'

// Sub-components
import LandingScreen from './components/LandingScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import ChatInterface from './components/ChatInterface'

const QUESTIONS = (t: any) => [
  { emoji: t('q1e'), q: t('q1'), opts: [{ l: t('q1a'), d: 'Vata' }, { l: t('q1b'), d: 'Pitta' }, { l: t('q1c'), d: 'Kapha' }] },
  { emoji: t('q2e'), q: t('q2'), opts: [{ l: t('q2a'), d: 'Vata' }, { l: t('q2b'), d: 'Pitta' }, { l: t('q2c'), d: 'Kapha' }] },
  { emoji: t('q3e'), q: t('q3'), opts: [{ l: t('q3a'), d: 'Vata' }, { l: t('q3b'), d: 'Pitta' }, { l: t('q3c'), d: 'Kapha' }] },
  { emoji: t('q4e'), q: t('q4'), opts: [{ l: t('q4a'), d: 'Vata' }, { l: t('q4b'), d: 'Pitta' }, { l: t('q4c'), d: 'Kapha' }] },
  { emoji: t('q5e'), q: t('q5'), opts: [{ l: t('q5a'), d: 'Vata' }, { l: t('q5b'), d: 'Pitta' }, { l: t('q5c'), d: 'Kapha' }] },
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
  const { language: lang, t } = useTranslation()
  
  // State Hooks
  const { 
    messages, input, loading, streaming, sendMessage, 
    setInput, setIsListening, setMessages, isListening,
    isSpeaking, setIsSpeaking, analyser
  } = useChat()
  
  const { 
    currentQ, setCurrentQ, answers, setAnswers, dosha, setDosha, calculateDosha 
  } = useDoshaQuiz()

  // Local UI State
  const [screen, setScreen] = useState<'landing' | 'quiz' | 'result' | 'chat'>('landing')
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
    const greeting = activeDosha 
      ? t('greeting_dosha').replace(/{dosha}/g, activeDosha).replace('{tagline}', '').replace('{desc}', '')
      : t('greeting')
    setMessages([{ role: 'assistant', content: greeting }])
  }, [dosha, t])

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setAttachLoading(true)
    const newAttachments = [...attachments]

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()

        const promise = new Promise<void>((resolve) => {
            reader.onload = (event) => {
                const content = event.target?.result as string
                const type = file.type.startsWith('image/') ? 'image' : 'pdf'
                
                newAttachments.push({
                    id: Math.random().toString(36).slice(2, 11),
                    type,
                    name: file.name,
                    content: content,
                    preview: type === 'image' ? content : undefined,
                    size: `${(file.size / 1024 / 1024).toFixed(1)}MB`
                })
                resolve()
            }
            reader.readAsDataURL(file)
        })
        await promise
    }

    setAttachments(newAttachments)
    setAttachLoading(false)
    e.target.value = '' // Clear input
  }

  const handleAddLink = () => {
    if (!linkInput.trim()) return
    const id = Math.random().toString(36).slice(2, 11)
    setAttachments(prev => [...prev, {
        id,
        type: 'link',
        name: linkInput.trim(),
        content: linkInput.trim()
    }])
    setLinkInput('')
    setShowLinkInput(false)
  }

  const handleSpeak = useCallback((text: string) => {
    if (isSpeaking) {
      vaidyaVoice.stop()
      setIsSpeaking(false)
    } else {
      setIsSpeaking(true)
      vaidyaVoice.speak(text, () => {
        setIsSpeaking(false)
      })
    }
  }, [isSpeaking, setIsSpeaking])

  const handleShare = async () => {
    if (!dosha) return
    setIsSharing(true)
    const shareText = `My Ayura Intelligence Bio-Signature: ${dosha}. Discover your constitutional blueprint at ayurahealth.com`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ayura Intelligence Bio-Signature',
          text: shareText,
          url: 'https://ayurahealth.com'
        })
        setShareSuccess(true)
      } catch (err) {
        console.error('Share failed:', err)
      }
    } else {
      await navigator.clipboard.writeText(shareText)
      setShareSuccess(true)
    }
    
    setIsSharing(false)
    setTimeout(() => setShareSuccess(false), 3000)
  }

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
          lang={lang as any}
          currentQ={currentQ}
          questions={QUESTIONS(t)}
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
          lang={lang as any}
          dosha={dosha}
          isSharing={isSharing}
          shareSuccess={shareSuccess}
          onStartChat={() => handleStartChat(dosha)}
          onShare={handleShare}
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
          isSpeaking={isSpeaking}
          modelPreference={modelPreference}
          responseMode={responseMode}
          dosha={dosha}
          activeUser={activeUser}
          onInputChange={(e) => setInput(e.target.value)}
          onInputKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }}
          onSendMessage={handleSendMessage}
          onFileSelect={handleFileSelect}
          onRemoveAttachment={(id) => setAttachments(prev => prev.filter(a => a.id !== id))}
          onToggleLinkInput={() => setShowLinkInput(!showLinkInput)}
          onLinkInputChange={setLinkInput}
          onAddLink={handleAddLink}
          onCancelLinkInput={() => setShowLinkInput(false)}
          onStartListening={() => setIsListening(!isListening)}
          onModelPrefChange={setModelPreference}
          onResponseModeChange={setResponseMode}
          onSpeakText={handleSpeak}
          onSelectSource={setSelectedSource}
          onToggleVedicPanel={() => {}}
          analyser={analyser}
        />
      )}

      {/* Paywall Overlay */}
      {showPaywall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: 400 }}>
            <h2>{t('msg_limit')}</h2>
            <p>{t('msg_upgrade')}</p>
            <button onClick={() => clerk.openSignUp()} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>{t('btn_upgrade')}</button>
            <button onClick={() => setShowPaywall(false)} style={{ marginTop: '1rem', opacity: 0.5 }}>{t('btn_close')}</button>
          </div>
        </div>
      )}
    </main>
  )
}
