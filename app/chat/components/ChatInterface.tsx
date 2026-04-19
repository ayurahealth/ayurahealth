'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message, ChatSource } from '@/lib/hooks/useChat'
import ChatMessagesPanel from '@/components/chat/ChatMessagesPanel'
import ChatComposer from '@/components/chat/ChatComposer'
import { ShieldCheck, Zap } from 'lucide-react'
import Logo from '@/components/Logo'

interface ChatInterfaceProps {
  messages: Message[]
  streaming: string
  loading: boolean
  input: string
  attachments: any[]
  attachLoading: boolean
  showLinkInput: boolean
  linkInput: string
  voiceSupported: boolean
  isListening: boolean
  modelPreference: string
  responseMode: string
  dosha: string | null
  activeUser: any
  onInputChange: (e: any) => void
  onInputKeyDown: (e: any) => void
  onSendMessage: () => void
  onFileSelect: (e: any) => void
  onRemoveAttachment: (id: string) => void
  onToggleLinkInput: () => void
  onLinkInputChange: (v: string) => void
  onAddLink: () => void
  onCancelLinkInput: () => void
  onStartListening: () => void
  onModelPrefChange: (val: string) => void
  onResponseModeChange: (val: any) => void
  onSpeakText: (text: string) => void
  onSelectSource: (source: ChatSource) => void
  onToggleVedicPanel: () => void
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
  modelPreference,
  responseMode,
  dosha,
  activeUser,
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
}: ChatInterfaceProps) {
  
  const doshaColor = dosha === 'Vata' ? '#6abf8a' : dosha === 'Pitta' ? '#f59e0b' : '#3b82f6'

  return (
    <div className="chat-shell" style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      
      {/* Premium Top Navigation */}
      <div className="glass-surface" style={{ margin: '1rem', padding: '0.6rem 1.25rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border-low)', background: 'var(--surface-low)', backdropFilter: 'blur(16px)' }}>
        <Logo size={28} showText={true} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 1rem', background: 'hsla(var(--accent-main-hsl), 0.05)', borderRadius: '14px', border: '1px solid hsla(var(--accent-main-hsl), 0.15)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent-main)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Neural Engine Active</span>
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
                cursor: 'pointer'
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

          <div style={{ display: 'flex', background: 'var(--bg-main)', borderRadius: '12px', padding: '3px', border: '1px solid var(--border-low)' }}>
            {(['fast', 'deep', 'research']).map((mode) => (
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
                  transition: 'all 0.25s var(--ease-out)'
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <ChatMessagesPanel
          messages={messages}
          streaming={streaming}
          loading={loading}
          doshaColor={doshaColor}
          voiceSupported={voiceSupported}
          isSpeaking={false} // Will be handled by hook
          onSpeakText={onSpeakText}
          onSelectSource={onSelectSource}
        />
      </div>

      {/* Composer Area */}
      <ChatComposer
        attachments={attachments}
        attachLoading={attachLoading}
        showLinkInput={showLinkInput}
        linkInput={linkInput}
        voiceSupported={voiceSupported}
        isListening={isListening}
        input={input}
        loading={loading}
        placeholder={dosha ? `Message Vaidya (${dosha} Intelligence)...` : "Begin clinical synthesis..."}
        fileInputRef={{ current: null }} // Refs handled in parent
        linkInputRef={{ current: null }}
        textareaRef={{ current: null }}
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
      />

      {/* Institutional Footer */}
      <div style={{ textAlign: 'center', padding: '0 0 1.5rem', opacity: 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <Zap size={12} fill="currentColor" />
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>
          Ayura Intelligence Lab — Powered by Clinical Synthesis v1.1.0
        </span>
      </div>
    </div>
  )
}
准确
