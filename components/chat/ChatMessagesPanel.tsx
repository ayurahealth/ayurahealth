'use client'

import { motion } from 'framer-motion'
import type { RefObject } from 'react'
import VaidyaOracle from '../VaidyaOracle'
import { ChatSkeleton } from '../BoneyardLoaders'
import { traditionIcons } from '../TraditionIcons'

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
  oracleState,
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
    <div className="native-scroll chat-message-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem clamp(1rem, 2.5vw, 2.25rem) 0.5rem' }}>
      {messages.length === 0 && !loading && (
        <div style={{ textAlign: 'center', marginTop: '2rem', padding: '0 2rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            style={{ width: '100%', maxWidth: 200, margin: '0 auto' }}
          >
            <VaidyaOracle state="idle" />
          </motion.div>
          <div style={{ marginTop: '-2rem', opacity: 0.5 }}>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: '#c9a84c' }}>VAIDYA is ready.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Ask your first health question below...</p>
          </div>
        </div>
      )}

      {loading && !streaming && (
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(5,16,10,0.8)', backdropFilter: 'blur(8px)', margin: '0 -1rem 1.5rem', padding: '1rem' }}>
          <div style={{ width: 120, height: 120, margin: '0 auto' }}>
            <VaidyaOracle state={oracleState} />
          </div>
        </div>
      )}

      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '0.75rem' }}
        >
          {msg.role === 'assistant' && (
            <div className="glass-card" style={{ width: 32, height: 32, flexShrink: 0, background: 'linear-gradient(135deg, #1a4d2e, #2d7a45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', border: '1px solid rgba(106,191,138,0.2)' }}>
              🌿
            </div>
          )}
          <div style={{ maxWidth: '85%' }}>
            <div
              className={`${msg.role === 'user' ? 'chat-user-bubble' : 'glass-card chat-assistant-bubble'}`}
              style={{
                padding: msg.role === 'user' ? '0.85rem 1.25rem' : '1.25rem 1.5rem',
                borderRadius: msg.role === 'user' ? '24px 24px 4px 24px' : '4px 24px 24px 24px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #1a4d2e, #2d7a45)' : undefined,
                border: msg.role === 'user' ? '1px solid rgba(106,191,138,0.3)' : undefined,
                color: msg.role === 'user' ? '#f0e6c8' : 'rgba(232,223,200,0.9)',
                boxShadow: msg.role === 'user' ? '0 8px 24px rgba(0,0,0,0.2)' : undefined,
              }}
            >
              {msg.role === 'assistant' ? <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content, doshaColor) }} /> : msg.content}

              {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(106,191,138,0.12)', paddingTop: '0.9rem' }}>
                  <div style={{ fontSize: '0.68rem', color: '#c9a84c', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.65rem', opacity: 0.8 }}>Consulted Classical Texts:</div>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {msg.sources.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectSource(src)}
                        className="glass-card"
                        style={{
                          padding: '0.45rem 0.85rem',
                          border: '1px solid rgba(201, 168, 76, 0.25)',
                          borderRadius: 12,
                          fontSize: '0.78rem',
                          color: '#e8dfc8',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <span style={{ width: 14, height: 14, color: '#6abf8a' }}>{traditionIcons[src.tradition?.toLowerCase() || 'ayurveda']}</span>
                        <span style={{ fontWeight: 500 }}>{src.source}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {msg.role === 'assistant' && voiceSupported && (
              <button onClick={() => onSpeakText(msg.content)} style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: isSpeaking ? '#6abf8a' : 'rgba(200,200,200,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="chat-meta-text">
                {isSpeaking ? '🔊 Speaking...' : '🔈 Listen'}
              </button>
            )}
          </div>
        </motion.div>
      ))}
      {loading && !streaming && <ChatSkeleton />}

      {streaming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}
        >
          <div className="glass-card" style={{ width: 32, height: 32, flexShrink: 0, background: 'linear-gradient(135deg, #1a4d2e, #2d7a45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🌿</div>
          <div className="glass-card chat-assistant-bubble" style={{ maxWidth: '85%', padding: '1.25rem 1.5rem', borderRadius: '4px 24px 24px 24px', color: 'rgba(232,223,200,0.9)' }}>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(streaming, doshaColor) }} />
            <span style={{ color: '#6abf8a', animation: 'blink 1s infinite' }}>▋</span>
          </div>
        </motion.div>
      )}
      {loading && !streaming && (
        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="glass-card" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #1a4d2e, #2d7a45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🌿</div>
            <div className="glass-card" style={{ padding: '0.75rem 1.25rem', borderRadius: '4px 20px 20px 20px', color: 'rgba(232,223,200,0.5)', fontSize: '0.9rem' }}>
              Vaidya is consulting the Council{thinkingDots}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ marginLeft: 44, display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 1.25rem', background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.1)', borderRadius: 16 }}
          >
            <div className="knowledge-pulse-core">
              <div className="knowledge-pulse-ring" />
              <div className="knowledge-pulse-ring" style={{ animationDelay: '0.5s' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Accessing AI Brain Wisdom...
            </span>
          </motion.div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
