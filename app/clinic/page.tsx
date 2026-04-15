'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Nav from '../../components/Nav'
import { motion } from 'framer-motion'
import { Zap, Shield, Globe, Activity, Terminal, Database, ArrowRight } from 'lucide-react'

export default function ClinicPage() {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ clinicName: '', contactName: '', email: '', phone: '', tradition: '', patientCount: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/clinic-lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to submit')
      }
      setSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--bg-main)', color: 'var(--text-main)', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .feature-card { background: var(--surface-low); border: 1px solid var(--border-low); border-radius: 20px; padding: 2rem; transition: all 0.3s var(--ease-out); }
        .feature-card:hover { border-color: var(--accent-main); background: hsla(var(--bg-main-hsl), 0.8); transform: translateY(-4px); }
        .cta-btn { display: inline-flex; align-items: center; justify-content: center; padding: 1rem 2.5rem; background: var(--accent-main); color: var(--bg-main); border-radius: 14px; font-size: 1rem; font-weight: 600; text-decoration: none; transition: all 0.25s; border: none; cursor: pointer; }
        .cta-btn:hover { background: hsla(var(--accent-main-hsl), 0.9); transform: scale(1.02); }
        .outline-btn { display: inline-flex; align-items: center; justify-content: center; padding: 1rem 2.5rem; border: 1px solid var(--border-mid); color: var(--text-main); background: transparent; border-radius: 14px; font-size: 1rem; font-weight: 500; text-decoration: none; transition: all 0.2s; cursor: pointer; }
        .outline-btn:hover { background: var(--surface-low); border-color: var(--text-main); }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal { background: var(--bg-main); border: 1px solid var(--border-high); border-radius: 24px; padding: 3rem; width: 100%; max-width: 540px; position: relative; box-shadow: 0 40px 100px rgba(0,0,0,0.8); }
        .form-input { width: 100%; background: var(--surface-low); border: 1px solid var(--border-mid); border-radius: 12px; padding: 1rem; color: var(--text-main); outline: none; transition: all 0.2s; margin-bottom: 1.25rem; font-size: 1rem; }
        .form-input:focus { border-color: var(--accent-main); background: var(--bg-main); }
        .form-label { display: block; fontSize: 0.85rem; color: var(--text-muted); marginBottom: 0.5rem; font-weight: 500; }
      `}</style>

      <Nav showLangPicker={false} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '10rem 1.5rem 6rem', position: 'relative', zIndex: 1 }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1rem', background: 'var(--surface-low)', border: '1px solid var(--border-low)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-main)', letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Institutional & Clinical Intelligence Console
          </motion.div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: '2rem', letterSpacing: '-0.03em' }}>
            Empower Your Institution with<br/>
            <span style={{ color: 'var(--accent-main)' }}>Neural Health Synthesis.</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: 640, margin: '0 auto 3.5rem' }}>
            Ayura Intelligence Console provides organizations with private, high-fidelity AI processing rooted in verified classical medical traditions.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setShowModal(true)} className="cta-btn">Initialize Institutional Partnership</button>
            <button onClick={() => setShowModal(true)} className="outline-btn">System Overview</button>
          </div>
        </div>

        {/* Intelligence Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
          {[
            { icon: Terminal, title: 'Neural Reasoning', desc: 'Full access to 14,000+ classical citations synthesized via deep-reasoning neural networks.' },
            { icon: Database, title: 'Private Datasets', desc: 'Secure institutional environments ensuring zero health data leaks and full HIPAA/GDPR integrity.' },
            { icon: Globe, title: 'Global Localization', desc: 'Serve patients in 50+ languages with synchronized traditional medical logic in every dialect.' },
            { icon: Activity, title: 'Clinical Integration', desc: 'Seamless API and Webhook integration for existing hospital management systems and EHRs.' },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="feature-card"
            >
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-main)', marginBottom: '1.5rem', border: '1px solid var(--border-low)' }}>
                <item.icon size={22} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Capabilities Breakdown */}
        <div style={{ marginBottom: '8rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 700, textAlign: 'center', marginBottom: '4rem', letterSpacing: '-0.02em' }}>Organization-Level Intelligence</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            {[
              ['Neural Assessment Engine', 'Autonomous profile generation across 8 traditions with 99.4% citation accuracy.'],
              ['Real-time Synthesis', 'Simultaneous cross-analysis between modern lab results and ancient biological texts.'],
              ['Institutional Dashboard', 'Comprehensive analytics on patient wellness trends and intelligence utilization.'],
              ['White-label Deployment', 'Custom branded intelligence interfaces deployed locally or in private clouds.'],
            ].map(([title, desc], i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-low)', paddingBottom: '2rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-main)', opacity: 0.5 }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Architecture */}
        <div style={{ marginBottom: '8rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>Scalable Infrastructure</h2>
            <p style={{ color: 'var(--text-muted)' }}>Engineered for clinics of all scales.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Research Lab', price: '$0', desc: 'For testing and evaluation.', features: ['Up to 100 Neural Sessions', '8 Primary Traditions', 'Basic Reasoning Trace', 'Email Support'] },
              { name: 'Intelligence Console', price: '$99', desc: 'For professional institutions.', features: ['Unlimited Neural Sessions', 'Advanced Reasoning Tracing', 'Full API Access', 'Custom Branding', 'Institutional Analytics', '24/7 Priority Neural Pipeline'] },
              { name: 'Global Hospital', price: 'Custom', desc: 'For healthcare networks.', features: ['Multi-Region Setup', 'On-Premise Deployment', 'Custom Model Training', 'Dedicated Intelligence Manager', 'SLA Integrity Agreement'] },
            ].map((p, i) => (
              <div key={i} className="feature-card" style={{ display: 'flex', flexDirection: 'column', border: i === 1 ? '2px solid var(--accent-main)' : '1px solid var(--border-low)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>{p.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>{p.desc}</p>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                   {p.price} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>/mo</span>
                </div>
                <div style={{ flex: 1, marginBottom: '2.5rem' }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                      <Zap size={14} fill="var(--accent-main)" color="var(--accent-main)" /> {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowModal(true)} className="cta-btn" style={{ background: i === 1 ? 'var(--accent-main)' : 'var(--surface-mid)', color: i === 1 ? 'var(--bg-main)' : 'var(--text-main)', border: i === 1 ? 'none' : '1px solid var(--border-mid)' }}>
                  Initialize Pipeline <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div style={{ textAlign: 'center', background: 'var(--surface-low)', border: '1px solid var(--border-high)', borderRadius: '32px', padding: '5rem 2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, hsla(144, 20%, 60%, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '2rem', letterSpacing: '-0.03em' }}>Ready to synthesize.</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: 600, margin: '0 auto 3.5rem' }}>
            Ayura Intelligence success team is ready to assist your institutional deployment within 24 hours.
          </p>
          <button onClick={() => setShowModal(true)} className="cta-btn" style={{ padding: '1.25rem 4rem', fontSize: '1.1rem' }}>Initialize Interaction</button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-low)', padding: '5rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>© 2026 Ayura Intelligence Lab · Tokyo Headquarters</p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          {['Research', 'Compliance', 'Intelligence Integrity', 'Platform API'].map((l) => (
            <Link key={l} href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem', opacity: 0.5 }}>{l}</Link>
          ))}
        </div>
      </footer>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
            <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Partner with Ayura Intel</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Initialize your institutional reasoning environment. Our team will contact you shortly.</p>
            
            {success ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ color: 'var(--accent-main)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Initialization Request Received</div>
                <p style={{ color: 'var(--text-muted)' }}>The intelligence success team will be in touch within 24 neural hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div style={{ background: 'rgba(232,90,90,0.1)', color: '#e85a5a', padding: '1rem', borderRadius: 12, marginBottom: '1.5rem' }}>{error}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                  <div>
                    <label className="form-label">Organization Name</label>
                    <input required value={formData.clinicName} onChange={e => setFormData(p => ({ ...p, clinicName: e.target.value }))} className="form-input" placeholder="Global Health Lab" />
                  </div>
                  <div>
                    <label className="form-label">Lead Contact</label>
                    <input required value={formData.contactName} onChange={e => setFormData(p => ({ ...p, contactName: e.target.value }))} className="form-input" placeholder="Dr. S. Chen" />
                  </div>
                </div>
                <label className="form-label">Institutional Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="form-input" placeholder="intel@organization.com" />
                
                <button type="submit" disabled={loading} className="cta-btn" style={{ width: '100%', marginTop: '1rem' }}>
                  {loading ? 'Initializing...' : 'Initialize Pipeline'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
