'use client'
import React, { useState } from 'react'

import Nav from '../../components/Nav'

import { Mail, MessageCircle, Globe, Terminal, Loader2, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Institutional Request', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Simulate/Trigger contact API
      await new Promise(r => setTimeout(r, 1500))
      setSuccess(true)
    } catch {
      setError('System interaction failed. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--bg-main)', color: 'var(--text-main)', position: 'relative' }}>
      <Nav showLangPicker={false} />

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '10rem 1.5rem 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', background: 'var(--surface-low)', border: '1px solid var(--border-low)', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--accent-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            <Terminal size={14} /> Intelligence Support Node
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 4rem)', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>Initialize Communication</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: 640, margin: '0 auto' }}>
            Professional inquiries for institutional partnerships and technical synthesis support.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {/* Methods */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: Mail, label: 'Email Interaction', value: 'hello@ayura.ai' },
              { icon: MessageCircle, label: 'Direct Intelligence', value: 'intel@ayura.ai' },
              { icon: Globe, label: 'Global Headquarters', value: 'Tokyo, Japan' },
            ].map((m, i) => (
              <div key={i} style={{ padding: '2rem', border: '1px solid var(--border-low)', borderRadius: '24px', background: 'var(--surface-low)' }}>
                <div style={{ color: 'var(--accent-main)', marginBottom: '1rem' }}><m.icon size={24} /></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{m.label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ background: 'var(--surface-low)', border: '1px solid var(--border-high)', borderRadius: '32px', padding: '3rem' }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ color: 'var(--accent-main)', fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Message Transmitted</div>
                <p style={{ color: 'var(--text-muted)' }}>The intelligence team will process your request within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Name</label>
                <input required className="form-input" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} style={{ width: '100%', padding: '1rem', background: 'var(--bg-main)', border: '1px solid var(--border-mid)', borderRadius: '12px', color: 'var(--text-main)', marginBottom: '1.5rem', outline: 'none' }} placeholder="Dr. Sarah Chen" />
                
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Electronic Identity (Email)</label>
                <input required type="email" className="form-input" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} style={{ width: '100%', padding: '1rem', background: 'var(--bg-main)', border: '1px solid var(--border-mid)', borderRadius: '12px', color: 'var(--text-main)', marginBottom: '1.5rem', outline: 'none' }} placeholder="sarah@institution.org" />
                
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Message Payload</label>
                <textarea required rows={4} className="form-input" value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} style={{ width: '100%', padding: '1rem', background: 'var(--bg-main)', border: '1px solid var(--border-mid)', borderRadius: '12px', color: 'var(--text-main)', marginBottom: '2rem', outline: 'none', resize: 'none' }} placeholder="Describe your institutional requirement..." />
                
                <button type="submit" disabled={loading} className="cta-btn" style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', background: 'var(--accent-main)', color: 'var(--bg-main)', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Transmit Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <footer style={{ padding: '5rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-low)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 Ayura Intelligence Lab · Global Interaction Node active.</p>
      </footer>
    </main>
  )
}
