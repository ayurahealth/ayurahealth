'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { ChangeEvent, KeyboardEvent } from 'react'
import type { ChatAttachment, ChatMessage as Message, ChatSource, ResponseMode } from '@/lib/chat/types'
import ChatMessagesPanel from '@/components/chat/ChatMessagesPanel'
import ChatComposer from '@/components/chat/ChatComposer'
import Logo from '@/components/Logo'
import { useTranslation } from '@/lib/i18n/LanguageContext'
import ClinicalHistory from '@/components/ui/ClinicalHistory'
import { History, ShieldCheck, Sparkles, Zap } from 'lucide-react'

interface ChatInterfaceProps {
  messages: Message[]
  streaming: string
  loading: boolean
  input: string
  attachments: ChatAttachment[]
  attachLoading: boolean
  showLinkInput: boolean
  linkInput: string
  voiceSupported: boolean
  isListening: boolean
  isSpeaking: boolean
  modelPreference: string
  responseMode: ResponseMode
  dosha: 'Vata' | 'Pitta' | 'Kapha' | null
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onInputKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  onSendMessage: () => void
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void
  onRemoveAttachment: (id: string) => void
  onToggleLinkInput: () => void
  onLinkInputChange: (v: string) => void
  onAddLink: () => void
  onCancelLinkInput: () => void
  onStartListening: () => void
  onModelPrefChange: (val: string) => void
  onResponseModeChange: (val: ResponseMode) => void
  onSpeakText: (text: string) => void
  onSelectSource: (source: ChatSource) => void
  analyser?: AnalyserNode | null
  userId?: string
}

export default function ChatInterface({
  messages,
  streaming,
  loading,
  input,
  attachments,
  attachLoading,
  showLinkInput,
  linkInput,
  voiceSupported,
  isListening,
  isSpeaking,
  modelPreference,
  responseMode,
  dosha,
  onInputChange,
  onInputKeyDown,
  onSendMessage,
  onFileSelect,
  onRemoveAttachment,
  onToggleLinkInput,
  onLinkInputChange,
  onAddLink,
  onCancelLinkInput,
  onStartListening,
  onModelPrefChange,
  onResponseModeChange,
  onSpeakText,
  onSelectSource,
  analyser,
  userId
}: ChatInterfaceProps) {
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const doshaColor = dosha === 'Vata' ? '#6abf8a' : dosha === 'Pitta' ? '#f59e0b' : '#3b82f6'
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' })
  }, [messages, streaming])

  return (
    <div
      className="chat-shell"
      style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        maxHeight: '100%',
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
        overflow: 'hidden'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-surface"
        style={{
          margin: '0.75rem',
          padding: '0.85rem 1rem',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          border: '1px solid var(--border-low)',
          background: 'linear-gradient(180deg, rgba(20,32,28,0.92), rgba(15,25,22,0.85))',
          backdropFilter: 'blur(20px)',
          flexShrink: 0,
          zIndex: 10
        }}
      >
        {/* Top Bar: Logo & Engine Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }} className="no-scrollbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexShrink: 0 }}>
            <Logo size={26} showText={true} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', background: 'hsla(var(--accent-main-hsl), 0.08)', borderRadius: '12px', border: '1px solid hsla(var(--accent-main-hsl), 0.15)' }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent-main)' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-main)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Active</span>
            </div>

            {userId && (
              <button
                onClick={() => setHistoryOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.8rem',
                  background: 'var(--surface-mid)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-low)',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  transition: 'all 0.2s'
                }}
                className="hover-lift"
              >
                <History size={14} />
                <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>History</span>
              </button>
            )}

            <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '2px', borderRadius: '10px', border: '1px solid var(--border-low)' }}>
              <select
                value={modelPreference}
                onChange={(e) => onModelPrefChange(e.target.value)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-main)',
                  border: 'none',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  outline: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="auto">Auto Intelligence</option>
                <option value="claude">Claude 3.5</option>
                <option value="gpt">GPT-4o</option>
                <option value="gemini">Gemini Pro</option>
                <option value="deepseek">DeepSeek</option>
                <option value="groq">Groq</option>
              </select>
            </div>
          </div>
        </div>

        {/* Secondary Bar: Mode & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }} className="no-scrollbar">
          <div style={{ display: 'flex', background: 'var(--bg-main)', borderRadius: '10px', padding: '2px', border: '1px solid var(--border-low)', flexShrink: 0 }}>
            {(['fast', 'deep', 'research'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onResponseModeChange(mode)}
                style={{
                  fontSize: '0.7rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  background: responseMode === mode ? 'var(--accent-main)' : 'transparent',
                  color: responseMode === mode ? 'var(--bg-main)' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  transition: 'all 0.25s var(--ease-out)',
                  whiteSpace: 'nowrap'
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            {dosha && (
              <div style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', background: `${doshaColor}14`, border: `1px solid ${doshaColor}33`, color: doshaColor, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                {dosha}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-muted)', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
              <Sparkles size={12} />
              Clinical Lab
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <ChatMessagesPanel
          messages={messages}
          streaming={streaming}
          loading={loading}
          doshaColor={doshaColor}
          voiceSupported={voiceSupported}
          isSpeaking={isSpeaking}
          onSpeakText={onSpeakText}
          onSelectSource={onSelectSource}
          oracleState="idle"
          thinkingDots=""
          messagesEndRef={messagesEndRef}
        />
      </div>

      <ChatComposer
        attachments={attachments}
        attachLoading={attachLoading}
        showLinkInput={showLinkInput}
        linkInput={linkInput}
        voiceSupported={voiceSupported}
        isListening={isListening}
        input={input}
        loading={loading}
        placeholder={dosha ? t('chat_placeholder_dosha').replace('{dosha}', dosha) : t('chat_placeholder')}
        fileInputRef={fileInputRef}
        linkInputRef={linkInputRef}
        textareaRef={textareaRef}
        onFileSelect={onFileSelect}
        onRemoveAttachment={onRemoveAttachment}
        onToggleLinkInput={onToggleLinkInput}
        onLinkInputChange={onLinkInputChange}
        onAddLink={onAddLink}
        onCancelLinkInput={onCancelLinkInput}
        onStartListening={onStartListening}
        onInputChange={onInputChange}
        onInputKeyDown={onInputKeyDown}
        onSendMessage={onSendMessage}
        analyser={analyser}
      />

      <div style={{ textAlign: 'center', padding: '0 0 calc(1.1rem + env(safe-area-inset-bottom))', opacity: 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <Zap size={12} fill="currentColor" />
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>
          Ayura Intelligence Lab — Powered by Clinical Synthesis v1.1.0
        </span>
      </div>

      {userId && (
        <ClinicalHistory 
          userId={userId} 
          isOpen={historyOpen} 
          onClose={() => setHistoryOpen(false)} 
        />
      )}
    </div>
  )
}
