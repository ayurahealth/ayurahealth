'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { RefObject } from 'react'
import VaidyaOracle from '../VaidyaOracle'
import { ChatSkeleton } from '../BoneyardLoaders'
import MessageItem from './MessageItem'
import { ShieldCheck, Activity, Info } from 'lucide-react'

interface ChatSource {
  title: string
  content: string
  tradition: string
  source: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
  agentTrace?: Array<{ id: 'planner' | 'researcher' | 'synthesizer'; label: string; summary: string }>
  modelUsed?: string
  providerUsed?: string
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

interface ChatMessagesPanelProps {
  messages: Message[]
  loading: boolean
  streaming: string
  oracleState: 'idle' | 'listening' | 'thinking' | 'responding'
  doshaColor: string
  renderMarkdown: (text: string, doshaColor?: string) => string
  voiceSupported: boolean
  isSpeaking: boolean
  thinkingDots: string
  onSpeakText: (text: string) => void
  onSelectSource: (source: ChatSource) => void
  messagesEndRef: RefObject<HTMLDivElement | null>
}

export default function ChatMessagesPanel({
  messages,
  loading,
  streaming,
  doshaColor,
  renderMarkdown,
  voiceSupported,
  isSpeaking,
  thinkingDots,
  onSpeakText,
  onSelectSource,
  messagesEndRef,
}: ChatMessagesPanelProps) {
  return (
    <div className="native-scroll" style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
      {messages.length === 0 && !loading && (
        <div style={{ textAlign: 'center', marginTop: '4rem', padding: '0 2rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ width: '100%', maxWidth: 230, margin: '0 auto' }}
          >
            <VaidyaOracle state="idle" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: '1rem' }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--accent-secondary)', fontWeight: 500 }}>VAIDYA is ready.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Describe a health observation or ask about traditional protocols.</p>
          </motion.div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <MessageItem 
              key={i}
              msg={msg}
              doshaColor={doshaColor}
              renderMarkdown={renderMarkdown}
              voiceSupported={voiceSupported}
              isSpeaking={isSpeaking}
              onSpeakText={onSpeakText}
              onSelectSource={onSelectSource}
            />
          ))}
        </AnimatePresence>

        {loading && !streaming && <ChatSkeleton />}

        {streaming && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
          >
            <div 
              className="glass-surface" 
              style={{ 
                width: 36, 
                height: 36, 
                flexShrink: 0, 
                padding: 0,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'var(--accent-main)',
                color: 'var(--bg-main)',
                border: 'none',
                borderRadius: '10px'
              }}
            >
              <ShieldCheck size={20} strokeWidth={2.5} />
            </div>
            <div className="glass-surface" style={{ flex: 1, padding: '1.5rem', borderRadius: '4px 22px 22px 22px' }}>
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(streaming, doshaColor) }} />
              <motion.span 
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ color: 'var(--accent-main)', marginLeft: '4px' }}
              >
                ▋
              </motion.span>
            </div>
          </motion.div>
        )}

        {loading && !streaming && (
          <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div 
                className="glass-surface" 
                style={{ 
                  width: 36, 
                  height: 36, 
                  flexShrink: 0, 
                  padding: 0,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: 'var(--accent-main)',
                  color: 'var(--bg-main)',
                  border: 'none',
                  borderRadius: '10px'
                }}
              >
                <ShieldCheck size={20} strokeWidth={2.5} />
              </div>
              <div className="glass-surface" style={{ padding: '1rem 1.5rem', borderRadius: '4px 18px 18px 18px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  Consulting classical texts and synthesizing logic{thinkingDots}
                </span>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ 
                marginLeft: 52, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '0.75rem 1.25rem', 
                background: 'hsla(var(--accent-main-hsl), 0.04)', 
                border: '1px solid var(--border-low)', 
                borderRadius: 16 
              }}
            >
              <Activity size={16} className="animate-pulse" style={{ color: 'var(--accent-main)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-main)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Neural Clinical Synthesis Active
              </span>
            </motion.div>
          </div>
        )}
      </div>

      <div ref={messagesEndRef} style={{ height: 1 }} />
    </div>
  )
}
