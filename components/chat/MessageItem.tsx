'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  Activity, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { traditionIcons } from '../TraditionIcons'
import ClinicalMarkdown from '../ui/ClinicalMarkdown'

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

interface MessageItemProps {
  msg: Message
  doshaColor: string
  voiceSupported: boolean
  isSpeaking: boolean
  onSpeakText: (text: string) => void
  onSelectSource: (source: ChatSource) => void
}

function MessageItem({
  msg,
  doshaColor,
  voiceSupported,
  isSpeaking,
  onSpeakText,
  onSelectSource,
}: MessageItemProps) {
  const isAssistant = msg.role === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      style={{ 
        marginBottom: '2rem', 
        display: 'flex', 
        justifyContent: !isAssistant ? 'flex-end' : 'flex-start', 
        alignItems: 'flex-start', 
        gap: '1rem' 
      }}
    >
      {isAssistant && (
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
      )}

      <div style={{ maxWidth: '85%' }}>
        <div
          className={`${!isAssistant ? 'user-bubble' : 'glass-surface assistant-bubble'}`}
          style={{
            padding: !isAssistant ? '1rem 1.5rem' : '1.5rem',
            borderRadius: !isAssistant ? '22px 22px 4px 22px' : '4px 22px 22px 22px',
            background: !isAssistant ? 'var(--accent-main)' : 'var(--surface-low)',
            color: !isAssistant ? 'var(--bg-main)' : 'var(--text-main)',
            border: !isAssistant ? 'none' : '1px solid var(--border-low)',
            boxShadow: !isAssistant ? '0 8px 24px hsla(var(--accent-main-hsl), 0.25)' : 'none',
            position: 'relative'
          }}
        >
          {!isAssistant ? (
            <div style={{ fontSize: '1rem', lineHeight: 1.6 }}>{msg.content}</div>
          ) : (
            <ClinicalMarkdown content={msg.content} doshaColor={doshaColor} />
          )}

          {isAssistant && msg.sources && msg.sources.length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-low)', paddingTop: '1.25rem' }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--accent-main)', 
                fontWeight: 700, 
                letterSpacing: '0.1em', 
                textTransform: 'uppercase', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Activity size={12} />
                Consulted Classical Texts
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {msg.sources.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectSource(src)}
                    className="flat-card"
                    style={{
                      padding: '0.75rem 1rem',
                      display: 'grid',
                      textAlign: 'left',
                      gap: '0.25rem',
                      borderRadius: '12px',
                      background: 'var(--surface-mid)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--accent-main)' }}>
                        {traditionIcons[src.tradition?.toLowerCase() || 'ayurveda']}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{src.source}</span>
                      <ExternalLink size={10} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{src.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isAssistant && msg.agentTrace && msg.agentTrace.length > 0 && (
            <div style={{ marginTop: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-low)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Agent Analysis Path
              </div>
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {msg.agentTrace.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-main)', marginTop: '0.5rem', flexShrink: 0 }} />
                    <div>
                      <div style={{ color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600 }}>{step.label}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.1rem' }}>{step.summary}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isAssistant && (msg.providerUsed || msg.modelUsed) && (
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', opacity: 0.6 }}>
              {msg.modelUsed && (
                <span style={{ fontSize: '0.65rem', background: 'var(--surface-mid)', border: '1px solid var(--border-low)', borderRadius: '6px', padding: '0.2rem 0.5rem' }}>
                  {msg.modelUsed}
                </span>
              )}
              {msg.quality && (
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: msg.quality.formatScore >= 90 ? 'var(--accent-main)' : 'var(--accent-secondary)',
                  background: 'var(--surface-mid)',
                  border: '1px solid var(--border-low)',
                  borderRadius: '6px', 
                  padding: '0.2rem 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {msg.quality.formatScore >= 90 ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                  Quality {msg.quality.formatScore}%
                </span>
              )}
            </div>
          )}
        </div>

        {isAssistant && voiceSupported && (
          <button 
            onClick={() => onSpeakText(msg.content)} 
            style={{ 
              marginTop: '0.75rem', 
              background: 'none', 
              border: 'none', 
              color: isSpeaking ? 'var(--accent-main)' : 'var(--text-muted)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              fontSize: '0.85rem'
            }}
          >
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {isSpeaking ? 'Stop Speaking' : 'Listen to VAIDYA'}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default React.memo(MessageItem)
