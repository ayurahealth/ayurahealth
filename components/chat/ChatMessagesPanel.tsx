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
  agentTrace?: Array<{ id: 'planner' | 'researcher' | 'synthesizer'; label: string; summary: string }>
  modelUsed?: string
  providerUsed?: 'OpenRouter' | 'Groq' | ''
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

interface StructuredResponse {
  answer?: string
  keyPoints: string[]
  sources: string[]
  followUps: string[]
}

function parseStructuredResponse(raw: string): StructuredResponse {
  const text = raw.replace(/\r\n/g, '\n').trim()
  const lines = text.split('\n')
  let section: 'answer' | 'keyPoints' | 'sources' | 'followUps' | '' = ''
  const out: StructuredResponse = { keyPoints: [], sources: [], followUps: [] }

  const sectionMap: Array<{ pattern: RegExp; key: 'answer' | 'keyPoints' | 'sources' | 'followUps' }> = [
    { pattern: /^#{1,3}\s*answer\b/i, key: 'answer' },
    { pattern: /^#{1,3}\s*key\s*points?\b/i, key: 'keyPoints' },
    { pattern: /^#{1,3}\s*sources?\b/i, key: 'sources' },
    { pattern: /^#{1,3}\s*follow-?\s*ups?\b/i, key: 'followUps' },
    { pattern: /^\*\*answer\*\*/i, key: 'answer' },
    { pattern: /^\*\*key\s*points?\*\*/i, key: 'keyPoints' },
    { pattern: /^\*\*sources?\*\*/i, key: 'sources' },
    { pattern: /^\*\*follow-?\s*ups?\*\*/i, key: 'followUps' },
  ]

  const pushBullet = (value: string) => {
    const cleaned = value.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim()
    if (!cleaned) return
    if (section === 'keyPoints') out.keyPoints.push(cleaned)
    if (section === 'sources') out.sources.push(cleaned)
    if (section === 'followUps') out.followUps.push(cleaned)
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const hit = sectionMap.find(({ pattern }) => pattern.test(trimmed))
    if (hit) {
      section = hit.key
      continue
    }

    if (section === 'answer') {
      out.answer = out.answer ? `${out.answer}\n${trimmed}` : trimmed
      continue
    }

    if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      pushBullet(trimmed)
      continue
    }

    if (section === 'keyPoints' || section === 'sources' || section === 'followUps') {
      pushBullet(trimmed)
    } else if (!out.answer) {
      out.answer = trimmed
    } else {
      out.answer = `${out.answer}\n${trimmed}`
    }
  }

  return out
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
        <div style={{ textAlign: 'center', marginTop: '1.2rem', padding: '0 2rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            style={{ width: '100%', maxWidth: 230, margin: '0 auto' }}
          >
            <VaidyaOracle state="idle" />
          </motion.div>
          <div style={{ marginTop: '-1.25rem', opacity: 0.56 }}>
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
            {(() => {
              const structured = msg.role === 'assistant' ? parseStructuredResponse(msg.content) : null
              const hasStructuredSections = Boolean(
                structured &&
                (structured.keyPoints.length > 0 || structured.sources.length > 0 || structured.followUps.length > 0)
              )

              return (
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
              {msg.role === 'assistant' && hasStructuredSections && structured ? (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '0.75rem 0.85rem' }}>
                    <div style={{ fontSize: '0.64rem', color: '#c9a84c', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Answer
                    </div>
                    <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(structured.answer || msg.content, doshaColor) }} />
                  </div>

                  {structured.keyPoints.length > 0 && (
                    <div style={{ background: 'rgba(106,191,138,0.04)', border: '1px solid rgba(106,191,138,0.18)', borderRadius: 12, padding: '0.7rem 0.85rem' }}>
                      <div style={{ fontSize: '0.64rem', color: '#6abf8a', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Key Points
                      </div>
                      <div style={{ display: 'grid', gap: '0.28rem' }}>
                        {structured.keyPoints.map((point, idx) => (
                          <div key={idx} style={{ color: 'rgba(232,223,200,0.88)', fontSize: '0.82rem' }}>• {point}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {structured.followUps.length > 0 && (
                    <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 12, padding: '0.7rem 0.85rem' }}>
                      <div style={{ fontSize: '0.64rem', color: '#c9a84c', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Follow-ups
                      </div>
                      <div style={{ display: 'grid', gap: '0.28rem' }}>
                        {structured.followUps.map((followUp, idx) => (
                          <div key={idx} style={{ color: 'rgba(232,223,200,0.82)', fontSize: '0.8rem' }}>- {followUp}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                msg.role === 'assistant'
                  ? <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content, doshaColor) }} />
                  : msg.content
              )}

              {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(106,191,138,0.12)', paddingTop: '0.9rem' }}>
                  <div style={{ fontSize: '0.68rem', color: '#c9a84c', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.65rem', opacity: 0.8 }}>Consulted Classical Texts:</div>
                  <div style={{ display: 'grid', gap: '0.45rem' }}>
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
                          display: 'grid',
                          textAlign: 'left',
                          gap: '0.45rem',
                          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span style={{ width: 14, height: 14, color: '#6abf8a' }}>{traditionIcons[src.tradition?.toLowerCase() || 'ayurveda']}</span>
                          <span style={{ fontWeight: 600 }}>{src.source}</span>
                          <span style={{ marginLeft: 'auto', fontSize: '0.62rem', color: 'rgba(232,223,200,0.4)' }}>{src.tradition}</span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'rgba(232,223,200,0.55)' }}>{src.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {msg.role === 'assistant' && msg.agentTrace && msg.agentTrace.length > 0 && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(201,168,76,0.14)', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.66rem', color: '#c9a84c', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                    Agent Trace
                  </div>
                  <div style={{ display: 'grid', gap: '0.45rem' }}>
                    {msg.agentTrace.map((step) => (
                      <div key={`${step.id}-${step.label}`} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '0.45rem 0.6rem' }}>
                        <div style={{ color: '#6abf8a', fontSize: '0.7rem', fontWeight: 600 }}>{step.label}</div>
                        <div style={{ color: 'rgba(232,223,200,0.58)', fontSize: '0.72rem', marginTop: '0.15rem' }}>{step.summary}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {msg.role === 'assistant' && (msg.providerUsed || msg.modelUsed) && (
                <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {msg.providerUsed && (
                    <span className="tradition-badge" style={{ fontSize: '0.6rem' }}>
                      {msg.providerUsed === 'OpenRouter' ? '🧠 OpenRouter' : '⚡ Groq'}
                    </span>
                  )}
                  {msg.modelUsed && (
                    <span style={{ fontSize: '0.64rem', color: 'rgba(232,223,200,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, padding: '0.12rem 0.48rem' }}>
                      {msg.modelUsed}
                    </span>
                  )}
                </div>
              )}
            </div>
              )
            })()}
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
