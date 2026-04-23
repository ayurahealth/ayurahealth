'use client'

import React, { useState } from 'react'
import Nav from '../../components/Nav'
import Surface from '../../components/ui/Surface'
import IOSButton from '../../components/ui/IOSButton'
import { motion, AnimatePresence } from 'framer-motion'
import { getApiUrl } from '@/lib/constants'

interface BiomarkerAnalysis {
  western_summary: string;
  flagged_markers: string[];
  ayurvedic_root_cause: string;
  affected_systems: string[];
  recommendations: string[];
}

import ClinicalReport from '../../components/ui/ClinicalReport'

export default function TranslatorPage() {
  const [labText, setLabText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<BiomarkerAnalysis | null>(null)

  const handleAnalyze = async () => {
    if (!labText.trim()) return
    setAnalyzing(true)
    setResult(null)

    try {
      const res = await fetch(getApiUrl('/api/translate'), {
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
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)', position: 'relative', overflowX: 'hidden' }}>
      <Nav />

      <div style={{ padding: 'max(15vh, 10rem) 1.5rem 4rem', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
            >
              <ClinicalReport 
                summary={result.western_summary}
                traditionalInsight={result.ayurvedic_root_cause}
                recommendations={result.recommendations}
                systemsAffected={result.affected_systems}
                biomarkers={result.flagged_markers?.map(m => ({
                  name: m.split(':')[0] || m,
                  value: m.split(':')[1] || 'Elevated',
                  status: 'alert'
                }))}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
