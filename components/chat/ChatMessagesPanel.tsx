'use client'

import React, { type RefObject } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VaidyaOracle from '../VaidyaOracle'
import { ChatSkeleton } from '../BoneyardLoaders'
import MessageItem from './MessageItem'
import ClinicalMarkdown from '../ui/ClinicalMarkdown'
import { ShieldCheck, Activity, Printer } from 'lucide-react'

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
  voiceSupported: boolean
  isSpeaking: boolean
  thinkingDots: string
  onSpeakText: (text: string) => void
  onSelectSource: (source: ChatSource) => void
  messagesEndRef: RefObject<HTMLDivElement | null>
  userName?: string
  primaryDosha?: string
  conditions?: string[]
}

function ChatMessagesPanel({
  messages,
  loading,
  streaming,
  doshaColor,
  voiceSupported,
  isSpeaking,
  thinkingDots,
  onSpeakText,
  onSelectSource,
  messagesEndRef,
  userName = 'Explorer',
  primaryDosha = 'General',
  conditions = [],
}: ChatMessagesPanelProps) {
  const handlePrint = () => {
    window.print()
  }

  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', day: 'numeric', year: 'numeric' 
  })
  return (
    <div className="native-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'clamp(1rem, 3vw, 2rem)', position: 'relative' }}>
      {/* Print-only Clinical Header */}
      <div className="clinical-report-header" style={{ display: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#1a4d2e', margin: 0 }}>Ayura Intelligence — Synthesis Report</h1>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>Artificial Intelligence x Integrative Health Synthesis Lab</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 600, margin: 0 }}>Date: {currentDate}</p>
            <p style={{ fontSize: '0.75rem', color: '#666' }}>Ref: AH-{Math.random().toString(36).substring(7).toUpperCase()}</p>
          </div>
        </div>
        
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', marginBottom: '0.25rem' }}>Patient Name</p>
            <p style={{ fontWeight: 600 }}>{userName}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', marginBottom: '0.25rem' }}>Bio-Energetic Constitution</p>
            <p style={{ fontWeight: 600 }}>{primaryDosha}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', marginBottom: '0.25rem' }}>Identified Conditions</p>
            <p style={{ fontSize: '0.85rem' }}>{conditions.length > 0 ? conditions.join(', ') : 'None Reported'}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', marginBottom: '0.25rem' }}>Synthesis Mode</p>
            <p style={{ fontSize: '0.85rem' }}>Ayura Intelligence Neural Synthesis</p>
          </div>
        </div>
      </div>

      <div className="no-print" style={{ position: 'absolute', top: '1.5rem', right: '2rem', zIndex: 10, display: 'flex', gap: '0.75rem' }}>
        {messages.length > 0 && (
          <button 
            onClick={handlePrint}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'hsla(var(--accent-main-hsl), 0.1)', 
              border: '1px solid var(--border-mid)', 
              borderRadius: '12px', 
              padding: '0.6rem 1rem', 
              color: 'var(--accent-main)', 
              fontSize: '0.85rem', 
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Printer size={16} />
            Export Report
          </button>
        )}
      </div>

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
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--accent-secondary)', fontWeight: 500 }}>Neural Link Active.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Initialize a new clinical observation or synthesis request.</p>
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
              <ClinicalMarkdown content={streaming} doshaColor={doshaColor} />
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
      
      {/* Print-only Clinical Footer */}
      <div className="clinical-footer" style={{ display: 'none' }}>
        <p>© 2026 Ayura Intelligence Lab. This synthesis report was generated autonomously by Vaidya Intelligence. Information provided is for educational and research purposes only and does not constitute medical advice or substitute for professional clinical judgment. Verified by Ayura Neural Integrity Framework.</p>
      </div>
    </div>
  )
}

export default React.memo(ChatMessagesPanel)
