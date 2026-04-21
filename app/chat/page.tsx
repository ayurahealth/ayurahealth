'use client'

import { useState, useEffect, Suspense, useCallback, useRef } from 'react'
import { useSafeClerk as useClerk } from '@/lib/clerk-client'
import { useTranslation } from '@/lib/i18n/LanguageContext'
import { useChat } from '@/lib/hooks/useChat'
import { useDoshaQuiz, Dosha } from '@/lib/hooks/useDoshaQuiz'
import type { SupportedLang } from '@/lib/i18n/translations'
import type { ChatAttachment, ResponseMode } from '@/lib/chat/types'
import { vaidyaVoice } from '@/lib/vaidyaVoice'

import LandingScreen from './components/LandingScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import ChatInterface from './components/ChatInterface'

type TranslationFn = (key: string) => string

const QUESTIONS = (t: TranslationFn) => [
  { emoji: t('q1e'), q: t('q1'), opts: [{ l: t('q1a'), d: 'Vata' }, { l: t('q1b'), d: 'Pitta' }, { l: t('q1c'), d: 'Kapha' }] },
  { emoji: t('q2e'), q: t('q2'), opts: [{ l: t('q2a'), d: 'Vata' }, { l: t('q2b'), d: 'Pitta' }, { l: t('q2c'), d: 'Kapha' }] },
  { emoji: t('q3e'), q: t('q3'), opts: [{ l: t('q3a'), d: 'Vata' }, { l: t('q3b'), d: 'Pitta' }, { l: t('q3c'), d: 'Kapha' }] },
  { emoji: t('q4e'), q: t('q4'), opts: [{ l: t('q4a'), d: 'Vata' }, { l: t('q4b'), d: 'Pitta' }, { l: t('q4c'), d: 'Kapha' }] },
  { emoji: t('q5e'), q: t('q5'), opts: [{ l: t('q5a'), d: 'Vata' }, { l: t('q5b'), d: 'Pitta' }, { l: t('q5c'), d: 'Kapha' }] },
]

const DEFAULT_SYSTEMS = ['ayurveda']

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text-muted)' }}>
          <div className="animate-pulse">Initializing Ayura Intelligence...</div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  )
}

function ChatPageContent() {
  const clerk = useClerk()
  const { language: lang, t } = useTranslation()
  const initialQueryHandledRef = useRef(false)

  const {
    messages,
    input,
    loading,
    streaming,
    sendMessage,
    setInput,
    setIsListening,
    setMessages,
    isListening,
    isSpeaking,
    setIsSpeaking,
    analyser,
  } = useChat()

  const { currentQ, setCurrentQ, answers, setAnswers, dosha, setDosha, calculateDosha } = useDoshaQuiz()

  const [screen, setScreen] = useState<'landing' | 'quiz' | 'result' | 'chat'>('landing')
  const [modelPreference, setModelPreference] = useState('auto')
  const [responseMode, setResponseMode] = useState<ResponseMode>('fast')
  const [attachments, setAttachments] = useState<ChatAttachment[]>([])
  const [attachLoading, setAttachLoading] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkInput, setLinkInput] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || initialQueryHandledRef.current) return

    const query = new URLSearchParams(window.location.search).get('q')
    if (!query) return

    initialQueryHandledRef.current = true
    setScreen('chat')
    void sendMessage({
      selectedSystems: DEFAULT_SYSTEMS,
      dosha,
      modelPreference,
      responseMode,
      webSearchEnabled: false,
      lang,
      attachments,
      vedicEnabled: true,
      vedicContext: null,
      cavemanMode: false,
      incognito: false,
    }, query)
  }, [attachments, dosha, lang, modelPreference, responseMode, sendMessage])

  const handleStartChat = useCallback((nextDosha?: Dosha | null) => {
    setScreen('chat')
    const activeDosha = nextDosha ?? dosha
    const greeting = activeDosha
      ? t('greeting_dosha').replace(/{dosha}/g, activeDosha).replace('{tagline}', '').replace('{desc}', '')
      : t('greeting')
    setMessages([{ role: 'assistant', content: greeting }])
  }, [dosha, setMessages, t])

  const handleSendMessage = async () => {
    try {
      await sendMessage({
        selectedSystems: DEFAULT_SYSTEMS,
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
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'PAYWALL_LIMIT') {
        setShowPaywall(true)
      }
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
            content,
            preview: type === 'image' ? content : undefined,
            size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
          })
          resolve()
        }
        reader.readAsDataURL(file)
      })

      await promise
    }

    setAttachments(newAttachments)
    setAttachLoading(false)
    e.target.value = ''
  }

  const handleAddLink = useCallback(() => {
    if (!linkInput.trim()) return

    setAttachments((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2, 11),
        type: 'link',
        name: linkInput.trim(),
        content: linkInput.trim(),
      },
    ])
    setLinkInput('')
    setShowLinkInput(false)
  }, [linkInput])

  const handleSpeak = useCallback((text: string) => {
    if (isSpeaking) {
      vaidyaVoice.stop()
      setIsSpeaking(false)
      return
    }

    setIsSpeaking(true)
    vaidyaVoice.speak(text, () => {
      setIsSpeaking(false)
    })
  }, [isSpeaking, setIsSpeaking, vaidyaVoice])

  const handleSelectSource = useCallback(() => {}, [])
  const handleCancelLinkInput = useCallback(() => setShowLinkInput(false), [])

  const handleShare = async () => {
    if (!dosha) return

    setIsSharing(true)
    const shareText = `My Ayura Intelligence Bio-Signature: ${dosha}. Discover your constitutional blueprint at ayurahealth.com`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ayura Intelligence Bio-Signature',
          text: shareText,
          url: 'https://ayurahealth.com',
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

  const resultLang = (lang === 'en' || lang === 'ja' || lang === 'hi' ? lang : 'en') as SupportedLang & ('en' | 'ja' | 'hi')

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {screen === 'landing' && (
        <LandingScreen onStartQuiz={() => setScreen('quiz')} onSkipToChat={() => handleStartChat(null)} />
      )}

      {screen === 'quiz' && (
        <QuizScreen
          currentQ={currentQ}
          questions={QUESTIONS(t)}
          onAnswer={(d) => {
            const newAnswers = [...answers, d]
            setAnswers(newAnswers)
            if (currentQ < 4) {
              setCurrentQ(currentQ + 1)
              return
            }

            const result = calculateDosha(newAnswers)
            setDosha(result)
            setScreen('result')
          }}
          onPrevious={() => setCurrentQ(currentQ - 1)}
        />
      )}

      {screen === 'result' && dosha && (
        <ResultScreen
          lang={resultLang}
          dosha={dosha}
          isSharing={isSharing}
          shareSuccess={shareSuccess}
          onStartChat={() => handleStartChat(dosha)}
          onShare={handleShare}
          onRetake={() => {
            setScreen('quiz')
            setCurrentQ(0)
            setAnswers([])
          }}
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
          onInputChange={(e) => setInput(e.target.value)}
          onInputKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void handleSendMessage()
            }
          }}
          onSendMessage={handleSendMessage}
          onFileSelect={handleFileSelect}
          onRemoveAttachment={(id) => setAttachments((prev) => prev.filter((attachment) => attachment.id !== id))}
          onToggleLinkInput={() => setShowLinkInput((prev) => !prev)}
          onLinkInputChange={setLinkInput}
          onAddLink={handleAddLink}
          onCancelLinkInput={handleCancelLinkInput}
          onStartListening={() => setIsListening(!isListening)}
          onModelPrefChange={setModelPreference}
          onResponseModeChange={setResponseMode}
          onSpeakText={handleSpeak}
          onSelectSource={handleSelectSource}
          analyser={analyser}
        />
      )}

      {showPaywall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: 400 }}>
            <h2>{t('msg_limit')}</h2>
            <p>{t('msg_upgrade')}</p>
            <button
              onClick={() => clerk.openSignUp?.()}
              className="btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {t('btn_upgrade')}
            </button>
            <button onClick={() => setShowPaywall(false)} style={{ marginTop: '1rem', opacity: 0.5 }}>{t('btn_close')}</button>
          </div>
        </div>
      )}
    </main>
  )
}
