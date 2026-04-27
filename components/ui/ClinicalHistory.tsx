'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, FileText, Activity, Calendar, ChevronRight, ShieldCheck } from 'lucide-react'
import Surface from './Surface'
import { getApiUrl } from '@/lib/constants'

interface HistorySession {
  id: string
  topic: string
  summary: string
  createdAt: string
}

interface ClinicalHistoryProps {
  userId: string
  isOpen: boolean
  onClose: () => void
}

export default function ClinicalHistory({ userId, isOpen, onClose }: ClinicalHistoryProps) {
  const [sessions, setSessions] = useState<HistorySession[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<HistorySession | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const res = await fetch(getApiUrl(`/api/chat/history?userId=${userId}`))
        const data = await res.json()
        setSessions(data.sessions || [])
      } catch (err) {
        console.error('Failed to fetch clinical history:', err)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchHistory()
    }
  }, [isOpen, userId])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.4)', 
              backdropFilter: 'blur(8px)',
              zIndex: 1000 
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '450px',
              background: 'var(--bg-main)',
              borderLeft: '1px solid var(--border-mid)',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.3)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              padding: '2rem'
            }}
          >
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <History size={24} style={{ color: 'var(--accent-main)' }} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: 0 }}>Clinical History</h2>
              </div>
              <button 
                onClick={onClose}
                style={{ 
                  background: 'var(--surface-mid)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                ✕
              </button>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse" style={{ height: '80px', background: 'var(--surface-low)', borderRadius: '12px' }} />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', opacity: 0.5 }}>
                  <FileText size={48} style={{ marginBottom: '1rem', margin: '0 auto' }} />
                  <p>No medical records found yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {sessions.map((session) => (
                    <Surface
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      style={{ 
                        padding: '1.25rem', 
                        cursor: 'pointer', 
                        border: selectedSession?.id === session.id ? '1px solid var(--accent-main)' : '1px solid var(--border-low)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Calendar size={12} />
                          {new Date(session.createdAt).toLocaleDateString()}
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                      </div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--text-main)' }}>
                        {session.topic || 'General Consultation'}
                      </h3>
                      {session.summary && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                          {session.summary}
                        </p>
                      )}
                    </Surface>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Session Detail View */}
            <AnimatePresence>
              {selectedSession && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--bg-main)',
                    zIndex: 10,
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <button 
                    onClick={() => setSelectedSession(null)}
                    style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--accent-main)', cursor: 'pointer', fontWeight: 600 }}
                  >
                    ← Back to List
                  </button>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--accent-low)', borderRadius: '12px', color: 'var(--accent-main)' }}>
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Clinical Record</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{new Date(selectedSession.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Surface variant="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--accent-main)' }}>Consultation Topic</h4>
                    <p style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>{selectedSession.topic}</p>
                  </Surface>

                  <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--text-muted)' }}>Clinical Summary</h4>
                    <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                      {selectedSession.summary || 'Summary pending clinical processing...'}
                    </p>
                  </div>

                  <footer style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-low)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Activity size={14} />
                      Verified by Ayura Neural Engine
                    </div>
                  </footer>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
