'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Nav from '../../components/Nav'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, FileText, History, ArrowRight, Activity, Edit3, X, Check } from 'lucide-react'
import Surface from '../../components/ui/Surface'
import IOSButton from '../../components/ui/IOSButton'

export function DashboardContent({ user, dbProfile }: { user: { firstName?: string | null } | null; dbProfile: { vataScore?: number; pittaScore?: number; kaphaScore?: number; primaryDosha?: string; healthGoal?: string; conditions?: string[]; chatSessions?: { id: string; topic: string; createdAt: string; summary?: string }[] } | null }) {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    healthGoal: dbProfile?.healthGoal || '',
    conditions: dbProfile?.conditions || [],
  })
  const [isSaving, setIsSaving] = useState(false)
  
  const doshaData = {
    vata: dbProfile?.vataScore || 33,
    pitta: dbProfile?.pittaScore || 33,
    kapha: dbProfile?.kaphaScore || 33,
    primary: dbProfile?.primaryDosha || 'Calculating...',
  }

  const circleRadius = 110
  const circumference = 2 * Math.PI * circleRadius

  const vataLength = (doshaData.vata / 100) * circumference
  const pittaLength = (doshaData.pitta / 100) * circumference
  const kaphaLength = (doshaData.kapha / 100) * circumference

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const firstName = user?.firstName || 'Explorer'

  return (
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)', overflowX: 'hidden', paddingBottom: 'calc(100px + env(safe-area-inset-bottom))', position: 'relative' }}>
      <style jsx>{`
        .dashboard-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 2rem; max-width: 1200px; margin: 0 auto; padding: 2rem; }
        @media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; padding: 1.5rem; } }
        
        .section-title { font-family: var(--font-display); font-size: 1.8rem; font-weight: 500; margin-bottom: 2rem; color: var(--text-main); display: flex; align-items: center; gap: 0.75rem; }
        
        .ring-container { position: relative; width: 320px; height: 320px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
        .ring-svg { transform: rotate(-90deg); width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        .ring-bg { fill: none; stroke: hsla(var(--text-main-hsl), 0.04); stroke-width: 22; }
        .ring-path { fill: none; stroke-width: 22; stroke-linecap: round; filter: drop-shadow(0 0 8px hsla(var(--accent-main-hsl), 0.2)); }
        .ring-center { text-align: center; z-index: 10; padding: 1rem; border-radius: 50%; }
        
        .routine-card { display: flex; gap: 1.25rem; padding: 1.25rem; background: var(--surface-low); border: 1px solid var(--border-low); border-radius: var(--radius-md); margin-bottom: 1rem; transition: all 0.3s var(--ease-out); }
        .routine-card:hover { border-color: var(--border-mid); background: var(--surface-mid); }
        .routine-icon-box { width: 44px; height: 44px; border-radius: 10px; background: hsla(var(--accent-main-hsl), 0.1); color: var(--accent-main); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        
        .bio-marker-card { background: linear-gradient(135deg, hsla(144, 18%, 60%, 0.1), transparent); border: 1px solid var(--border-mid); border-radius: var(--radius-lg); padding: 1.75rem; display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; }
        
        .timeline-card { background: var(--surface-low); border: 1px solid var(--border-low); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s; cursor: pointer; }
        .timeline-card:hover { border-color: var(--border-mid); transform: scale(1.01); }
        .status-pill { padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
      `}</style>
      <Nav showLangPicker={false} />

      <div style={{ padding: 'max(15vh, 10rem) 1.5rem 4rem', position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', marginBottom: '3rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--accent-main)', marginBottom: '1rem' }}>
            <Activity size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Clinical Status: Optimal</span>
          </div>
          <h1 className="hero-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Welcome, {firstName}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: 600 }}>
            {dbProfile?.healthGoal ? `Focus: ${dbProfile.healthGoal}` : 'Initialize your clinical profile to receive targeted recommendations.'}
          </p>
        </motion.div>

        <div className="dashboard-grid">
          {/* LEFT COLUMN: Health Profile Assessment */}
          <Surface variant="glass" className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>
                <History size={24} style={{ color: 'var(--accent-main)' }} />
                Assessment
              </h2>
              <button 
                onClick={() => setIsEditing(true)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--accent-main)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  opacity: 0.8
                }}
              >
                <Edit3 size={14} />
                Refine
              </button>
            </div>
            
            <div className="ring-container">
              <svg className="ring-svg" viewBox="0 0 300 300">
                <defs>
                  <linearGradient id="sage-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-main)" />
                    <stop offset="100%" stopColor="hsl(144, 18%, 45%)" />
                  </linearGradient>
                  <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-secondary)" />
                    <stop offset="100%" stopColor="hsl(44, 54%, 40%)" />
                  </linearGradient>
                </defs>
                <circle cx="150" cy="150" r={circleRadius} className="ring-bg" />
                <motion.circle 
                  cx="150" cy="150" r={circleRadius} className="ring-path" 
                  stroke="url(#sage-grad)" 
                  strokeDasharray={`${kaphaLength} ${circumference}`}
                  strokeDashoffset="0"
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${kaphaLength} ${circumference}` }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.circle 
                  cx="150" cy="150" r={circleRadius} className="ring-path" 
                  stroke="url(#gold-grad)" 
                  strokeDasharray={`${pittaLength} ${circumference}`}
                  strokeDashoffset={-kaphaLength}
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${pittaLength} ${circumference}` }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                />
                <motion.circle 
                  cx="150" cy="150" r={circleRadius} className="ring-path" 
                  stroke="#60a5fa" 
                  strokeDasharray={`${vataLength - 10} ${circumference}`}
                  strokeDashoffset={-(kaphaLength + pittaLength)}
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${vataLength - 10} ${circumference}` }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                />
              </svg>

              <div className="ring-center">
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '0.5rem' }}>Primary</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 0.9 }}>{doshaData.primary}</div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                  <span style={{ color: '#60a5fa' }}>V: {doshaData.vata}%</span>
                  <span style={{ color: 'var(--accent-secondary)' }}>P: {doshaData.pitta}%</span>
                  <span style={{ color: 'var(--accent-main)' }}>K: {doshaData.kapha}%</span>
                </div>
              </div>
            </div>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1rem', marginTop: '2.5rem', lineHeight: 1.6, maxWidth: 280 }}>
              {doshaData.primary === 'Vata' ? 'Air and Ether are dominant. Maintain grounding protocols.' : 
               doshaData.primary === 'Pitta' ? 'Fire and Water are elevated. Prioritize cooling protocols.' :
               doshaData.primary === 'Kapha' ? 'Earth and Water are prominent. Focus on stimulating protocols.' :
               'Assessment complete. View your specialized clinical analysis below.'}
            </p>

            <div style={{ marginTop: '2rem', width: '100%', borderTop: '1px solid var(--border-low)', paddingTop: '2rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Identified Conditions</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {dbProfile?.conditions && dbProfile.conditions.length > 0 ? (
                  dbProfile.conditions.map(c => (
                    <span key={c} style={{ background: 'hsla(var(--accent-main-hsl), 0.1)', color: 'var(--accent-main)', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                      {c}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No conditions identified.</span>
                )}
              </div>
            </div>
          </Surface>

          {/* RIGHT COLUMN: Actionable Routines & Biomarkers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Surface style={{ flex: 1 }}>
              <h2 className="section-title">
                <Sun size={24} style={{ color: 'var(--accent-secondary)' }} />
                Daily Regimen
              </h2>
              <div className="routine-card">
                <div className="routine-icon-box">
                  <Sun size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Warm Sesame Oil Abhyanga</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Required pre-shower grounding ritual.</p>
                </div>
                <div style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--accent-secondary)' }}>6:00 AM</div>
              </div>
              <div className="routine-card">
                <div className="routine-icon-box" style={{ background: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa' }}>
                  <Moon size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Primary Meal</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>High protein, warm spices for metabolic stability.</p>
                </div>
                <div style={{ marginLeft: 'auto', fontWeight: 600, color: '#60a5fa' }}>1:00 PM</div>
              </div>
            </Surface>

            <div className="bio-marker-card">
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '12px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-low)' }}>
                  <FileText size={28} style={{ color: 'var(--accent-main)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>Biomarker Analysis</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Evaluate clinical lab reports with traditional indices.</p>
                </div>
              </div>
              <IOSButton href="/translator" variant="primary" style={{ width: 'auto', padding: '0.8rem 1.5rem' }}>
                Upload Lab Report
              </IOSButton>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Consultation History</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Latest updates</span>
              </div>
              
              <AnimatePresence>
                {dbProfile?.chatSessions && dbProfile.chatSessions.length > 0 ? (
                  dbProfile.chatSessions.map((session, idx) => (
                    <motion.div 
                      key={session.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link href={`/chat?sessionId=${session.id}`} style={{ textDecoration: 'none' }}>
                        <div className="timeline-card">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: 12, height: 12, borderRadius: 50, background: 'var(--accent-main)', border: '3px solid hsla(var(--accent-main-hsl), 0.2)' }} />
                            <div>
                              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 500 }}>{session.topic || 'Systemic Health Evaluation'}</h3>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-main)', fontSize: '0.9rem', fontWeight: 500 }}>
                            Review
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface-low)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-low)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No clinical history found. Initiate a consultation to begin.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Profile Editor Modal */}
      <AnimatePresence>
        {isEditing && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(5, 16, 10, 0.85)', backdropFilter: 'blur(10px)' }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '500px', 
                background: 'var(--surface-mid)', 
                border: '1px solid var(--border-mid)', 
                borderRadius: '28px', 
                padding: '2rem',
                boxShadow: '0 24px 48px rgba(0,0,0,0.4)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-main)' }}>Refine Health Profile</h3>
                <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-main)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Primary Health Focus</label>
                <textarea 
                  value={editData.healthGoal}
                  onChange={e => setEditData({ ...editData, healthGoal: e.target.value })}
                  style={{ width: '100%', height: '100px', background: 'var(--bg-main)', border: '1px solid var(--border-low)', borderRadius: '12px', padding: '1rem', color: 'var(--text-main)', fontSize: '0.95rem', resize: 'none', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-main)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Identified Conditions</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {[
                    'PCOS / PCOD', 'Insomnia', 'Type 2 Diabetes', 'Hypertension', 
                    'Hypo/Hyperthyroid', 'Digestive Issues', 'Chronic Fatigue', 'None / Preventative'
                  ].map(c => {
                    const isSelected = editData.conditions.includes(c)
                    return (
                      <button 
                        key={c}
                        onClick={() => {
                          if (c === 'None / Preventative') {
                            setEditData({ ...editData, conditions: ['None / Preventative'] })
                          } else {
                            const next = isSelected 
                              ? editData.conditions.filter(item => item !== c)
                              : [...editData.conditions.filter(item => item !== 'None / Preventative'), c]
                            setEditData({ ...editData, conditions: next })
                          }
                        }}
                        style={{ 
                          padding: '0.5rem 0.9rem', borderRadius: '8px', fontSize: '0.85rem', 
                          background: isSelected ? 'hsla(var(--accent-main-hsl), 0.15)' : 'var(--bg-main)',
                          border: `1px solid ${isSelected ? 'var(--accent-main)' : 'var(--border-low)'}`,
                          color: isSelected ? 'var(--accent-main)' : 'var(--text-main)',
                          cursor: 'pointer'
                        }}
                      >
                        {c}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button 
                className="btn-primary" 
                disabled={isSaving}
                onClick={async () => {
                  setIsSaving(true)
                  try {
                    const res = await fetch('/api/user-profile', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editData),
                    })
                    if (res.ok) {
                      window.location.reload()
                    }
                  } catch (err) {
                    console.error('Failed to save profile:', err)
                  } finally {
                    setIsSaving(false)
                  }
                }}
                style={{ width: '100%', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {isSaving ? 'Syncing...' : <><Check size={18} /> Update Clinical Profile</>}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
