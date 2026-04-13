'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Logo from '../../components/Logo'
import { motion, AnimatePresence } from 'framer-motion'

interface BiomarkerAnalysis {
  western_summary: string;
  flagged_markers: string[];
  ayurvedic_root_cause: string;
  affected_systems: string[];
  recommendations: string[];
}

export default function TranslatorPage() {
  const [labText, setLabText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<BiomarkerAnalysis | null>(null)

  const handleAnalyze = async () => {
    if (!labText.trim()) return
    setAnalyzing(true)
    setResult(null)

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labs: labText })
      })
      const data = await res.json()
      if (data.analysis) {
        setResult(data.analysis)
      } else {
        alert("Failed to analyze biomarkers.")
      }
    } catch {
      alert("Error reaching VAIDYA.")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #05100a; font-family: 'DM Sans', sans-serif; }
        .glass-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(106,191,138,0.1); border-radius: 20px; padding: 2rem; backdrop-filter: blur(12px); }
        .grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        @media (max-width: 900px) { .grid-container { grid-template-columns: 1fr; } }
        .western-card { border: 1px solid rgba(96,165,250,0.2); background: linear-gradient(135deg, rgba(96,165,250,0.05), rgba(0,0,0,0)); }
        .ayurvedic-card { border: 1px solid rgba(201,168,76,0.2); background: linear-gradient(135deg, rgba(201,168,76,0.05), rgba(0,0,0,0)); }
        .card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; margin-bottom: 1rem; color: #e8dfc8; }
        .btn-analyze { background: linear-gradient(135deg, #2d5a1b, #3d7a28); color: #e8dfc8; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 980px; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(45,90,27,0.4); display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .btn-analyze:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(45,90,27,0.6); }
        .btn-analyze:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
        .textarea-lab { width: 100%; height: 150px; background: rgba(0,0,0,0.4); border: 1px solid rgba(106,191,138,0.2); border-radius: 12px; color: #e8dfc8; padding: 1rem; font-family: inherit; font-size: 1rem; resize: vertical; outline: none; transition: border-color 0.2s; }
        .textarea-lab:focus { border-color: #6abf8a; }
        .pulse-loader { width: 20px; height: 20px; border-radius: 50%; background: #c9a84c; animation: pulse 1s infinite alternate; }
        @keyframes pulse { 0% { opacity: 0.4; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1.2); } }
      `}</style>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2rem', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(3,10,6,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(106,191,138,0.1)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size={42} />
        </Link>
        <Link href="/dashboard" style={{ color: 'rgba(232,223,200,0.8)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>← Back to Dashboard</Link>
      </nav>

      <div style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: 1200, margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '3.5rem', fontWeight: 300, color: '#e8dfc8', marginBottom: '0.5rem' }}>
            Biomarker Translation
          </h1>
          <p style={{ color: 'rgba(232,223,200,0.6)', fontSize: '1.2rem', maxWidth: 600, margin: '0 auto' }}>
            Decode your Western blood test results into deep Ayurvedic insights. Paste your lab results below to reveal the holistic root-cause.
          </p>
        </motion.div>

        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} style={{ marginBottom: '3rem' }}>
          <h2 className="card-title" style={{ fontSize: '1.4rem' }}>Input Medical Data</h2>
          <textarea 
            className="textarea-lab" 
            placeholder="E.g. Fasting Glucose 105 mg/dL, TSH 4.2, Vitamin D 20 ng/mL, Feeling tired."
            value={labText}
            onChange={(e) => setLabText(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="btn-analyze" onClick={handleAnalyze} disabled={analyzing || !labText.trim()}>
              {analyzing ? <><div className="pulse-loader" /> Decoding via VAIDYA...</> : 'Translate Biomarkers →'}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }} 
              animate={{ opacity: 1, height: 'auto', overflow: 'visible' }} 
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="grid-container"
            >
              {/* Western Analysis Card */}
              <div className="glass-card western-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(96,165,250,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontSize: '1.5rem' }}>🔬</div>
                  <h2 className="card-title" style={{ margin: 0, color: '#60a5fa' }}>Western Pathology</h2>
                </div>
                <div style={{ color: 'rgba(232,223,200,0.85)', lineHeight: 1.7 }}>
                  <p style={{ marginBottom: '1rem' }}>{result.western_summary}</p>
                  
                  <h4 style={{ color: '#fff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Flagged Biomarkers:</h4>
                  <ul style={{ paddingLeft: '1.5rem', color: 'rgba(96,165,250,0.8)' }}>
                    {result.flagged_markers?.map((m: string, i: number) => <li key={i} style={{ marginBottom: '0.25rem' }}>{m}</li>)}
                  </ul>
                </div>
              </div>

              {/* Ayurvedic Translation Card */}
              <div className="glass-card ayurvedic-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: '1.5rem' }}>🌿</div>
                  <h2 className="card-title" style={{ margin: 0, color: '#c9a84c' }}>Ayurvedic Translation</h2>
                </div>
                <div style={{ color: 'rgba(232,223,200,0.85)', lineHeight: 1.7 }}>
                  <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#e8dfc8' }}>{result.ayurvedic_root_cause}</p>
                  
                  <h4 style={{ color: '#fff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Affected Systems (Dhatus/Srotas):</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {result.affected_systems?.map((s: string, i: number) => (
                      <span key={i} style={{ padding: '0.2rem 0.8rem', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 980, fontSize: '0.85rem', color: '#c9a84c' }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Classical Action Plan:</h4>
                  <ul style={{ paddingLeft: '1.5rem', color: 'rgba(232,223,200,0.7)' }}>
                    {result.recommendations?.map((r: string, i: number) => <li key={i} style={{ marginBottom: '0.5rem' }}>{r}</li>)}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
