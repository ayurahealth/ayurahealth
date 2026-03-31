'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '../../components/Logo'
import { motion } from 'framer-motion'

export function DashboardContent({ user, dbProfile }: { user: any; dbProfile: any }) {
  const [mounted, setMounted] = useState(false)
  
  // Real-Time Database Profile Dosha Balance
  const doshaData = {
    vata: dbProfile?.vataScore || 45, // %
    pitta: dbProfile?.pittaScore || 35, // %
    kapha: dbProfile?.kaphaScore || 20, // %
    primary: dbProfile?.primaryDosha || 'Vata-Pitta',
  }

  // Animation constants for the ring
  const circleRadius = 110
  const circumference = 2 * Math.PI * circleRadius

  // Calculate Dash Offsets
  const vataLength = (doshaData.vata / 100) * circumference
  const pittaLength = (doshaData.pitta / 100) * circumference
  const kaphaLength = (doshaData.kapha / 100) * circumference

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const firstName = user?.firstName || 'Explorer'

  return (
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #05100a; font-family: 'DM Sans', sans-serif; }
        .glass-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(106,191,138,0.1); border-radius: 20px; padding: 2rem; backdrop-filter: blur(12px); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
        .dashboard-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; max-width: 1200px; margin: 0 auto; padding: 2rem; }
        @media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 400; margin-bottom: 1.5rem; color: #e8dfc8; }
        
        /* The Ring Styles */
        .ring-container { position: relative; width: 300px; height: 300px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
        .ring-svg { transform: rotate(-90deg); width: 100%; height: 100%; position: absolute; top: 0; left: 0; filter: drop-shadow(0 0 12px rgba(255,255,255,0.05)); }
        .ring-bg { fill: none; stroke: rgba(255,255,255,0.03); stroke-width: 18; }
        .ring-path { fill: none; stroke-width: 18; stroke-linecap: round; transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .ring-center { text-align: center; z-index: 10; }
        
        /* Routine Items */
        .routine-item { display: flex; gap: 1rem; padding: 1.25rem; background: rgba(106,191,138,0.03); border: 1px solid rgba(106,191,138,0.08); border-radius: 12px; margin-bottom: 1rem; transition: transform 0.2s, background 0.2s; cursor: pointer; }
        .routine-item:hover { transform: translateY(-2px); background: rgba(106,191,138,0.08); }
        .routine-time { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: #c9a84c; font-weight: 600; min-width: 80px; }
        
        /* BioCard */
        .bio-card { background: linear-gradient(145deg, rgba(6,78,59,0.2), rgba(2,6,23,0.4)); border: 1px solid rgba(52,211,153,0.15); border-radius: 16px; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; cursor: pointer; position: relative; overflow: hidden; }
        .bio-card::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); animation: shine 6s infinite; }
        @keyframes shine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }
      `}</style>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2rem', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(3,10,6,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(106,191,138,0.1)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size={42} />
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/chat" style={{ color: 'rgba(232,223,200,0.8)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>VAIDYA Chat</Link>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #2d5a1b, #c9a84c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem', color: '#05100a' }}>
            {firstName.charAt(0)}
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', marginBottom: '2rem' }}
        >
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '3rem', fontWeight: 300, color: '#e8dfc8', marginBottom: '0.5rem' }}>
            Good morning, {firstName}
          </h1>
          <p style={{ color: 'rgba(232,223,200,0.6)', fontSize: '1.1rem' }}>Your holistic health pulse is stable. Focus on grounding today.</p>
        </motion.div>

        <div className="dashboard-grid">
          
          {/* LEFT COLUMN: Dosha Pulse Ring */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="section-title" style={{ alignSelf: 'flex-start' }}>The Vedic Pulse</h2>
            
            <div className="ring-container">
              <svg className="ring-svg" viewBox="0 0 300 300">
                {/* Background Track */}
                <circle cx="150" cy="150" r={circleRadius} className="ring-bg" />
                
                {/* Kapha (Green / Grounding) */}
                <motion.circle 
                  cx="150" cy="150" r={circleRadius} className="ring-path" 
                  stroke="#34d399" 
                  strokeDasharray={`${kaphaLength} ${circumference}`}
                  strokeDashoffset="0"
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${kaphaLength} ${circumference}` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                
                {/* Pitta (Gold / Fire) */}
                <motion.circle 
                  cx="150" cy="150" r={circleRadius} className="ring-path" 
                  stroke="#c9a84c" 
                  strokeDasharray={`${pittaLength} ${circumference}`}
                  strokeDashoffset={-kaphaLength}
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${pittaLength} ${circumference}` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                />
                
                {/* Vata (Blue/Air / Movement) */}
                <motion.circle 
                  cx="150" cy="150" r={circleRadius} className="ring-path" 
                  stroke="#60a5fa" 
                  strokeDasharray={`${vataLength - 10} ${circumference}`} /* -10 to leave a small gap */
                  strokeDashoffset={-(kaphaLength + pittaLength)}
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${vataLength - 10} ${circumference}` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                />
              </svg>

              <div className="ring-center">
                <div style={{ fontSize: '0.85rem', color: 'rgba(232,223,200,0.5)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.25rem' }}>Primary</div>
                <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.4rem', fontWeight: 600, color: '#e8dfc8', lineHeight: 1 }}>{doshaData.primary}</div>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: '#60a5fa' }}>V: {doshaData.vata}%</span>
                  <span style={{ color: '#c9a84c' }}>P: {doshaData.pitta}%</span>
                  <span style={{ color: '#34d399' }}>K: {doshaData.kapha}%</span>
                </div>
              </div>
            </div>

            <p style={{ textAlign: 'center', color: 'rgba(232,223,200,0.7)', fontSize: '0.95rem', marginTop: '2rem', lineHeight: 1.6 }}>
              Your Vata is highly elevated. The cold, dry qualities of late autumn are increasing air and ether elements in your system.
            </p>
          </motion.div>

          {/* RIGHT COLUMN: Actionable Routines & Biomarkers */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div className="glass-card" style={{ flex: 1 }}>
              <h2 className="section-title">Dinacharya (Today&apos;s Regimen)</h2>
              
              <div className="routine-item">
                <div className="routine-time">6:00 AM</div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: '#e8dfc8', marginBottom: '0.25rem' }}>Warm Sesame Oil Abhyanga</h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(232,223,200,0.6)' }}>Ground your elevated Vata with 15 minutes of warm oil self-massage before showering.</p>
                </div>
              </div>

              <div className="routine-item">
                <div className="routine-time">1:00 PM</div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: '#e8dfc8', marginBottom: '0.25rem' }}>Largest Meal (Agni Peak)</h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(232,223,200,0.6)' }}>Your digestive fire is strongest now. Consume root vegetables, ghee, and warming spices.</p>
                </div>
              </div>

              <div className="routine-item" style={{ opacity: 0.5 }}>
                <div className="routine-time">10:00 PM</div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: '#e8dfc8', marginBottom: '0.25rem' }}>Ashwagandha Milk</h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(232,223,200,0.6)' }}>Warm almond or cow's milk with 1/2 tsp Ashwagandha and nutmeg for deep sleep.</p>
                </div>
              </div>
            </div>

            {/* Biomarker Upsell/Feature Card */}
            <motion.div whileHover={{ scale: 1.02 }} className="bio-card">
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#34d399', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
                  Bio-Marker AI Translator
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(232,223,200,0.7)', maxWidth: '400px' }}>Upload your latest Western blood test results to understand your holistic tissue (Dhatu) health.</p>
              </div>
              <button style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                Upload Lab
              </button>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </main>
  )
}
