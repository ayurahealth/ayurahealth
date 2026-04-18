'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/navigation'
import Logo from '../../../components/Logo'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Zap, Globe, Shield } from 'lucide-react'

interface OrderDetails {
  orderId: string
  amount: string
  tier: string
  email: string
  date: string
}

export function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const paymentId = searchParams.get('payment_id')
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setOrderDetails({
        orderId: sessionId || paymentId || 'ORD-' + Date.now(),
        amount: '$99.00',
        tier: 'Intelligence Console',
        email: 'intel@organization.com',
        date: new Date().toLocaleDateString(),
      })
      setLoading(false)
    }, 1200)
  }, [sessionId, paymentId])

  return (
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)', overflowX: 'hidden' }}>
      <style>{`
        .success-card { background: var(--surface-low); border: 1px solid var(--border-high); border-radius: 32px; padding: 4rem 3rem; }
        .detail-row { display: flex; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid var(--border-low); }
        .detail-row:last-child { border-bottom: none; }
        .cta-btn { display: inline-flex; align-items: center; justify-content: center; padding: 1.25rem 3.5rem; background: var(--accent-main); color: var(--bg-main); border-radius: 16px; font-size: 1.1rem; font-weight: 700; text-decoration: none; transition: all 0.25s; border: none; cursor: pointer; }
        .cta-btn:hover { background: hsla(var(--accent-main-hsl), 0.9); transform: scale(1.02); }
      `}</style>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-low)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
          <Logo size={40} showText={false} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ayura Intelligence</span>
        </Link>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '10rem 1.5rem 6rem', textAlign: 'center' }}>
        {loading ? (
          <div style={{ padding: '4rem 0' }}>
            <div style={{ color: 'var(--accent-main)', fontSize: '1.2rem', fontWeight: 600 }}>Initializing Neural Access...</div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="success-card">
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'hsla(var(--accent-main-hsl), 0.1)', border: '1px solid var(--accent-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: 'var(--accent-main)' }}>
              <Check size={40} />
            </div>
            
            <h1 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Pipeline Initialized.</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 4rem' }}>
              Welcome to the Intelligence Network. Your institutional synthesis pipeline is now active and ready for research orchestration.
            </p>

            {orderDetails && (
              <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-mid)', borderRadius: '24px', padding: '2rem', textAlign: 'left', marginBottom: '4rem' }}>
                <div className="detail-row">
                  <span style={{ color: 'var(--text-muted)' }}>Organization Pipeline</span>
                  <span style={{ fontWeight: 600 }}>{orderDetails.orderId}</span>
                </div>
                <div className="detail-row">
                  <span style={{ color: 'var(--text-muted)' }}>Intelligence Tier</span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-main)' }}>{orderDetails.tier}</span>
                </div>
                <div className="detail-row">
                  <span style={{ color: 'var(--text-muted)' }}>Activation Date</span>
                  <span style={{ fontWeight: 600 }}>{orderDetails.date}</span>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'left', marginBottom: '4rem' }}>
              {[
                { icon: Zap, title: 'Neural Access', desc: 'Unlimited high-fidelity synthesis sessions.' },
                { icon: Shield, title: 'Data Sovereignty', desc: 'Secure, private research environment active.' },
                { icon: Globe, title: 'Global Sync', desc: '50+ language localization enabled.' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '1.5rem', border: '1px solid var(--border-low)', borderRadius: '20px' }}>
                  <item.icon size={20} color="var(--accent-main)" style={{ marginBottom: '1rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <button className="cta-btn" onClick={() => window.location.href='/chat'}>
                Initialize Console <ArrowRight size={20} style={{ marginLeft: '0.75rem' }} />
              </button>
            </div>

            <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-low)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <p>For protocol support, contact our intelligence team at <strong>intel@ayura.ai</strong></p>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
