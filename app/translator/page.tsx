'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Surface from '../../components/ui/Surface'
import IOSButton from '../../components/ui/IOSButton'
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
      alert("Error reaching Vaidya AI.")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)' }}>
      <Nav />

      <div style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: 1200, margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 500, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Clinical Marker Analysis
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
            Consolidate Western pathology data with traditional systemic analysis. Reveal underlying triggers and physiological imbalances.
          </p>
        </motion.div>

        <Surface style={{ padding: '2.5rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Laboratory Data Input</h2>
          <textarea 
            style={{ 
                width: '100%', 
                height: '180px', 
                background: 'var(--surface-high)', 
                border: '1px solid var(--border-low)', 
                borderRadius: '12px', 
                color: 'var(--text-main)', 
                padding: '1.2rem', 
                fontFamily: 'inherit', 
                fontSize: '1rem', 
                resize: 'vertical', 
                outline: 'none' 
            }}
            placeholder="E.g. Fasting Glucose 105 mg/dL, TSH 4.2, Vitamin D 20 ng/mL..."
            value={labText}
            onChange={(e) => setLabText(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <IOSButton onClick={handleAnalyze} disabled={analyzing || !labText.trim()} style={{ width: 'auto', minWidth: '220px' }}>
              {analyzing ? 'Analyzing Clinical Values...' : 'Execute Analysis →'}
            </IOSButton>
          </div>
        </Surface>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}
            >
              {/* Pathological Summary */}
              <Surface style={{ padding: '2rem', border: '1px solid var(--border-mid)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🔬</span>
                  <h2 style={{ fontSize: '1.4rem', color: '#60a5fa', margin: 0 }}>Pathological Summary</h2>
                </div>
                <div style={{ color: 'var(--text-main)', lineHeight: 1.7 }}>
                  <p style={{ marginBottom: '1.5rem' }}>{result.western_summary}</p>
                  
                  <h4 style={{ color: 'var(--text-main)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Flagged Markers:</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {result.flagged_markers?.map((m: string, i: number) => (
                      <span key={i} style={{ padding: '0.3rem 0.8rem', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '6px', fontSize: '0.85rem', color: '#60a5fa' }}>{m}</span>
                    ))}
                  </div>
                </div>
              </Surface>

              {/* Traditional Integration */}
              <Surface style={{ padding: '2rem', border: '1px solid var(--accent-main)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🌿</span>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-main)', margin: 0 }}>Traditional Integration</h2>
                </div>
                <div style={{ color: 'var(--text-main)', lineHeight: 1.7 }}>
                  <p style={{ marginBottom: '1.5rem', fontWeight: 500 }}>{result.ayurvedic_root_cause}</p>
                  
                  <h4 style={{ color: 'var(--text-main)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Systemic Impact:</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {result.affected_systems?.map((s: string, i: number) => (
                      <span key={i} style={{ padding: '0.3rem 0.8rem', background: 'var(--surface-high)', border: '1px solid var(--border-mid)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--accent-main)' }}>{s}</span>
                    ))}
                  </div>

                  <h4 style={{ color: 'var(--text-main)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Clinical Recommendations:</h4>
                  <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
                    {result.recommendations?.map((r: string, i: number) => <li key={i} style={{ marginBottom: '0.5rem' }}>{r}</li>)}
                  </ul>
                </div>
              </Surface>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
