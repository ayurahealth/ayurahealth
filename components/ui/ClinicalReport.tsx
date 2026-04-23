'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Activity, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import Surface from './Surface'

interface ClinicalReportProps {
  title?: string
  date?: string
  summary: string
  biomarkers?: { name: string; value: string; status: 'normal' | 'alert' | 'critical' }[]
  traditionalInsight: string
  recommendations: string[]
  systemsAffected?: string[]
}

export default function ClinicalReport({
  title = 'Systemic Health Evaluation',
  date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  summary,
  biomarkers = [],
  traditionalInsight,
  recommendations,
  systemsAffected = []
}: ClinicalReportProps) {
  return (
    <Surface variant="glass" className="clinical-report" style={{ padding: '3rem', maxWidth: '900px', margin: '2rem auto', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.03, pointerEvents: 'none' }}>
        <Shield size={400} />
      </div>

      <header style={{ borderBottom: '1px solid var(--border-mid)', paddingBottom: '2rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-main)', marginBottom: '0.5rem' }}>
            <Activity size={20} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Ayura Clinical Lab</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 500, margin: 0 }}>{title}</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Evaluation Date</div>
          <div style={{ fontWeight: 600 }}>{date}</div>
        </div>
      </header>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-main)', marginBottom: '1rem' }}>Clinical Summary</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-main)' }}>{summary}</p>
      </section>

      {biomarkers.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-main)', marginBottom: '1.5rem' }}>Western Biomarkers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {biomarkers.map((bm, i) => (
              <div key={i} style={{ background: 'var(--surface-low)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-low)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{bm.name}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{bm.value}</div>
                </div>
                {bm.status === 'normal' ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color={bm.status === 'critical' ? '#ef4444' : '#f59e0b'} />}
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
        <section>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-main)', marginBottom: '1rem' }}>Traditional Synthesis</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text-main)' }}>{traditionalInsight}</p>
          {systemsAffected.length > 0 && (
            <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {systemsAffected.map(s => (
                <span key={s} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.7rem', borderRadius: '6px', background: 'var(--surface-mid)', border: '1px solid var(--border-mid)', color: 'var(--text-muted)' }}>{s}</span>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-secondary)', marginBottom: '1rem' }}>Recommendations</h2>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {recommendations.map((r, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--accent-secondary)' }}>•</span>
                {r}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer style={{ borderTop: '1px solid var(--border-low)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-main), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Shield size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Ayura Vaidya Intelligence</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Digital Clinician #001</div>
          </div>
        </div>
        <div style={{ opacity: 0.4 }}>
          <FileText size={40} />
        </div>
      </footer>
    </Surface>
  )
}
