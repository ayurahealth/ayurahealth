'use client'

import React from 'react'
import Link from 'next/link'
import Logo from '../../../components/Logo'

export default function CancelPage() {
  return (
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #05100a; }
        .cancel-container { max-width: 600px; margin: 0 auto; padding: 2rem; text-align: center; }
        .cancel-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(106,191,138,0.1); border-radius: 16px; padding: 3rem 2rem; }
        .cancel-icon { font-size: 4rem; margin-bottom: 1rem; }
        .cancel-title { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 300; margin-bottom: 1rem; color: #e8dfc8; }
        .cancel-message { color: rgba(232,223,200,0.7); margin-bottom: 2rem; font-size: 1.1rem; }
        .btn-primary { display: inline-block; background: linear-gradient(135deg, #2d5a1b, #3d7a28); color: #e8dfc8; padding: 1rem 2.4rem; border-radius: 980px; font-size: 1rem; font-weight: 600; text-decoration: none; transition: all 0.25s; box-shadow: 0 4px 24px rgba(45,90,27,0.4); border: none; cursor: pointer; margin-top: 1.5rem; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(45,90,27,0.55); }
        .btn-secondary { display: inline-block; color: rgba(232,223,200,0.75); padding: 0.75rem 1.5rem; border-radius: 980px; font-size: 0.95rem; font-weight: 500; text-decoration: none; transition: all 0.2s; border: 1px solid rgba(106,191,138,0.3); margin-left: 1rem; }
        .btn-secondary:hover { background: rgba(106,191,138,0.08); border-color: rgba(106,191,138,0.6); }
        .faq-section { background: rgba(106,191,138,0.05); border: 1px solid rgba(106,191,138,0.15); border-radius: 12px; padding: 1.5rem; margin-top: 2rem; text-align: left; }
        .faq-section h3 { margin-bottom: 1rem; color: #e8dfc8; }
        .faq-item { margin-bottom: 1rem; }
        .faq-item strong { color: #e8dfc8; }
        .faq-item p { color: rgba(232,223,200,0.7); font-size: 0.9rem; margin-top: 0.25rem; }
      `}</style>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,16,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(106,191,138,0.15)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <Logo size={48} showText={false} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ayura Intelligence</span>
        </Link>
      </nav>

      {/* Cancel Content */}
      <div style={{ paddingTop: '7rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="cancel-container">
          <div className="cancel-card">
            <div className="cancel-icon">⏸️</div>
            <h1 className="cancel-title">Payment Cancelled</h1>
            <p className="cancel-message">
              Your payment has been cancelled. No charges have been made to your account.
            </p>

            <div className="faq-section">
              <h3>Why did you cancel?</h3>
              <div className="faq-item">
                <strong>Not ready yet?</strong>
                <p>No problem! You can try our free plan anytime. Upgrade whenever you&apos;re ready.</p>
              </div>
              <div className="faq-item">
                <strong>Have questions?</strong>
                <p>Our support team is here to help. Email us at support@ayura.ai</p>
              </div>
              <div className="faq-item">
                <strong>Want a different plan?</strong>
                <p>Check out all our pricing options and find the perfect fit for you.</p>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <Link href="/pricing" className="btn-primary">
                View Pricing Plans →
              </Link>
              <Link href="/chat" className="btn-secondary">
                Try Free Plan
              </Link>
            </div>

            {/* Support Info */}
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(106,191,138,0.1)', fontSize: '0.85rem', color: 'rgba(232,223,200,0.5)' }}>
              <p>Questions? Contact us at <strong>support@ayura.ai</strong></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
