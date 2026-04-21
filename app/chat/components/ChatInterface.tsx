'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { ChangeEvent, KeyboardEvent } from 'react'
import type { ChatAttachment, ChatMessage as Message, ChatSource, ResponseMode } from '@/lib/chat/types'
import ChatMessagesPanel from '@/components/chat/ChatMessagesPanel'
import ChatComposer from '@/components/chat/ChatComposer'
import { ShieldCheck, Sparkles, Zap } from 'lucide-react'
import Logo from '@/components/Logo'
import { useTranslation } from '@/lib/i18n/LanguageContext'

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
}: ChatInterfaceProps) {
  const doshaColor = dosha === 'Vata' ? '#6abf8a' : dosha === 'Pitta' ? '#f59e0b' : '#3b82f6'
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
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
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-surface"
        style={{
          margin: '1rem',
          padding: '0.85rem 1rem',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.9rem',
          border: '1px solid var(--border-low)',
          background: 'linear-gradient(180deg, rgba(10,19,15,0.88), rgba(9,15,13,0.72))',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <Logo size={28} showText={true} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>Premium health companion</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Built to feel calm, clear, and native on iPhone.</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 1rem', background: 'hsla(var(--accent-main-hsl), 0.05)', borderRadius: '14px', border: '1px solid hsla(var(--accent-main-hsl), 0.15)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--accent-main)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Engine Active</span>
            </div>

            <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-main)', padding: '3px', borderRadius: '12px', border: '1px solid var(--border-low)' }}>
              <select
                value={modelPreference}
                onChange={(e) => onModelPrefChange(e.target.value)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-main)',
                  border: 'none',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  outline: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="auto">Auto Intelligence</option>
                <option value="claude">Claude 3.5 Sonnet</option>
                <option value="gpt">GPT-4 Omni</option>
                <option value="gemini">Gemini 1.5 Pro</option>
                <option value="deepseek">DeepSeek R1</option>
                <option value="groq">Groq Llama 3</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.9rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'var(--bg-main)', borderRadius: '12px', padding: '3px', border: '1px solid var(--border-low)' }}>
            {(['fast', 'deep', 'research'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onResponseModeChange(mode)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  background: responseMode === mode ? 'var(--accent-main)' : 'transparent',
                  color: responseMode === mode ? 'var(--bg-main)' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  transition: 'all 0.25s var(--ease-out)',
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {dosha && (
              <div style={{ padding: '0.45rem 0.85rem', borderRadius: '999px', background: `${doshaColor}14`, border: `1px solid ${doshaColor}33`, color: doshaColor, fontSize: '0.78rem', fontWeight: 700 }}>
                {dosha} profile
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              <Sparkles size={14} />
              Ask symptoms, upload reports, or request a simple care plan.
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
    </div>
  )
}
