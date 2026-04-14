'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Nav from '../../components/Nav'
import { motion } from 'framer-motion'

export function DashboardContent({ user, dbProfile }: { user: { firstName?: string | null } | null; dbProfile: { vataScore?: number; pittaScore?: number; kaphaScore?: number; primaryDosha?: string; healthGoal?: string; conditions?: string[]; chatSessions?: { id: string; topic: string; createdAt: string; summary?: string }[] } | null }) {
  const [mounted, setMounted] = useState(false)
  
  const doshaData = {
    vata: dbProfile?.vataScore || 45,
    pitta: dbProfile?.pittaScore || 35,
    kapha: dbProfile?.kaphaScore || 20,
    primary: dbProfile?.primaryDosha || 'Vata-Pitta',
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
    <main style={{ background: 'var(--bg-main)', height: '100dvh', color: 'var(--text-main)', overflowY: 'auto', paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
      <style jsx>{`
        .dashboard-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; max-width: 1200px; margin: 0 auto; padding: 2rem; }
        @media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }
        .section-title { font-family: var(--font-display); font-size: 1.8rem; font-weight: 500; margin-bottom: 1.5rem; color: var(--text-main); }
        
        .ring-container { position: relative; width: 300px; height: 300px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
        .ring-svg { transform: rotate(-90deg); width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        .ring-bg { fill: none; stroke: var(--border-low); stroke-width: 18; }
        .ring-path { fill: none; stroke-width: 18; stroke-linecap: round; transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .ring-center { text-align: center; z-index: 10; }
        
        .routine-item { display: flex; gap: 1rem; padding: 1.25rem; background: var(--surface-low); border: 1px solid var(--border-low); border-radius: 12px; margin-bottom: 1rem; transition: border-color 0.2s; cursor: pointer; }
        .routine-item:hover { border-color: var(--border-mid); }
        .routine-time { font-family: var(--font-display); font-size: 1.2rem; color: var(--accent-secondary); font-weight: 600; min-width: 80px; }
        
        .bio-card { background: var(--surface-low); border: 1px solid var(--border-low); border-radius: 12px; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; cursor: pointer; }
        
        .timeline-container { margin-top: 3rem; border-top: 1px solid var(--border-low); padding-top: 2rem; }
        .timeline-card { background: var(--surface-low); border: 1px solid var(--border-low); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; transition: border-color 0.2s; }
        .timeline-card:hover { border-color: var(--border-mid); }
        .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent-main); margin-right: 15px; flex-shrink: 0; }
      `}</style>

      <Nav showLangPicker={false} />

      <div style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', marginBottom: '2rem' }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 500, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Welcome, {firstName}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Your health assessment is stable. Focus on grounding today.</p>
        </motion.div>

        <div className="dashboard-grid">
          {/* LEFT COLUMN: Health Profile Assessment */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="section-title" style={{ alignSelf: 'flex-start' }}>Health Assessment</h2>
            
            <div className="ring-container">
              <svg className="ring-svg" viewBox="0 0 300 300">
                <circle cx="150" cy="150" r={circleRadius} className="ring-bg" />
                <motion.circle 
                  cx="150" cy="150" r={circleRadius} className="ring-path" 
                  stroke="var(--accent-main)" 
                  strokeDasharray={`${kaphaLength} ${circumference}`}
                  strokeDashoffset="0"
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${kaphaLength} ${circumference}` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <motion.circle 
                  cx="150" cy="150" r={circleRadius} className="ring-path" 
                  stroke="var(--accent-secondary)" 
                  strokeDasharray={`${pittaLength} ${circumference}`}
                  strokeDashoffset={-kaphaLength}
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${pittaLength} ${circumference}` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                />
                <motion.circle 
                  cx="150" cy="150" r={circleRadius} className="ring-path" 
                  stroke="#60a5fa" 
                  strokeDasharray={`${vataLength - 10} ${circumference}`}
                  strokeDashoffset={-(kaphaLength + pittaLength)}
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${vataLength - 10} ${circumference}` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                />
              </svg>

              <div className="ring-center">
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.25rem' }}>Primary</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1 }}>{doshaData.primary}</div>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: '#60a5fa' }}>V: {doshaData.vata}%</span>
                  <span style={{ color: 'var(--accent-secondary)' }}>P: {doshaData.pitta}%</span>
                  <span style={{ color: 'var(--accent-main)' }}>K: {doshaData.kapha}%</span>
                </div>
              </div>
            </div>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '2rem', lineHeight: 1.6 }}>
              Air and ether elements are currently dominant in your health profile.
            </p>
          </motion.div>

          {/* RIGHT COLUMN: Actionable Routines & Biomarkers */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="flat-card" style={{ flex: 1 }}>
              <h2 className="section-title">Daily Regimen</h2>
              <div className="routine-item">
                <div className="routine-time">6:00 AM</div>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Warm Sesame Oil Abhyanga</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Apply warm oil self-massage before showering.</p>
                </div>
              </div>
              <div className="routine-item">
                <div className="routine-time">1:00 PM</div>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Main Meal</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Consume cooked grains and warming spices for optimal digestion.</p>
                </div>
              </div>
            </div>

            <div className="bio-card">
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-main)', marginBottom: '0.4rem' }}>Diagnostic Marker Analysis</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Cross-reference blood reports with traditional indices.</p>
              </div>
              <Link href="/translator" style={{ background: 'var(--accent-main)', color: 'var(--bg-main)', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
                Upload Lab
              </Link>
            </div>

            <div className="timeline-container">
              <h2 className="section-title">Consultation History</h2>
              {dbProfile?.chatSessions && dbProfile.chatSessions.length > 0 ? (
                dbProfile.chatSessions.map((session) => (
                  <Link href={`/chat?sessionId=${session.id}`} key={session.id} style={{ textDecoration: 'none' }}>
                    <div className="timeline-card">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="timeline-dot" />
                        <div>
                          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>{session.topic || 'General Health Consultation'}</h3>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div style={{ color: 'var(--accent-main)', fontSize: '0.85rem' }}>View Transcript →</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface-low)', borderRadius: 12, border: '1px dashed var(--border-low)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No history found. Start a consultation to begin.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
