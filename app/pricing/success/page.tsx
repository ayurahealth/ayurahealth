'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface OrderDetails {
  orderId: string
  amount: string
  tier: string
  email: string
  date: string
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const paymentId = searchParams.get('payment_id')
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  useEffect(() => {
    // Simulate fetching order details
    setTimeout(() => {
      setOrderDetails({
        orderId: sessionId || paymentId || 'ORD-' + Date.now(),
        amount: '$4.99',
        tier: 'Premium',
        email: 'user@example.com',
        date: new Date().toLocaleDateString(),
      })
      setLoading(false)
    }, 1000)
  }, [sessionId, paymentId])

  return (
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #05100a; }
        .success-container { max-width: 600px; margin: 0 auto; padding: 2rem; text-align: center; }
        .success-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(106,191,138,0.1); border-radius: 16px; padding: 3rem 2rem; }
        .success-icon { font-size: 4rem; margin-bottom: 1rem; animation: bounce 0.6s ease-in-out; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .success-title { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 300; margin-bottom: 1rem; background: linear-gradient(160deg, #e8dfc8 0%, #c9a84c 50%, #6abf8a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .success-message { color: rgba(232,223,200,0.7); margin-bottom: 2rem; font-size: 1.1rem; }
        .order-details { background: rgba(106,191,138,0.08); border: 1px solid rgba(106,191,138,0.2); border-radius: 12px; padding: 1.5rem; margin: 2rem 0; text-align: left; }
        .detail-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(106,191,138,0.1); }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: rgba(232,223,200,0.6); }
        .detail-value { color: #e8dfc8; font-weight: 600; }
        .btn-primary { display: inline-block; background: linear-gradient(135deg, #2d5a1b, #3d7a28); color: #e8dfc8; padding: 1rem 2.4rem; border-radius: 980px; font-size: 1rem; font-weight: 600; text-decoration: none; transition: all 0.25s; box-shadow: 0 4px 24px rgba(45,90,27,0.4); border: none; cursor: pointer; margin-top: 1.5rem; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(45,90,27,0.55); }
        .btn-secondary { display: inline-block; color: rgba(232,223,200,0.75); padding: 0.75rem 1.5rem; border-radius: 980px; font-size: 0.95rem; font-weight: 500; text-decoration: none; transition: all 0.2s; border: 1px solid rgba(106,191,138,0.3); margin-left: 1rem; }
        .btn-secondary:hover { background: rgba(106,191,138,0.08); border-color: rgba(106,191,138,0.6); }
        .next-steps { background: rgba(106,191,138,0.05); border: 1px solid rgba(106,191,138,0.15); border-radius: 12px; padding: 1.5rem; margin-top: 2rem; text-align: left; }
        .next-steps h3 { margin-bottom: 1rem; color: #e8dfc8; }
        .next-steps ol { margin-left: 1.5rem; color: rgba(232,223,200,0.7); }
        .next-steps li { margin-bottom: 0.75rem; }
      `}</style>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,16,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(106,191,138,0.15)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663443572913/nQYKCbsnkVANj8fjMcN4AQ/ayurahealth-logo-modern-ai-ancient-Masdabix7xfaPSuHh7ULd8.webp" alt="AyuraHealth" style={{ height: 48, width: 48, borderRadius: '8px' }} />
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.35rem', fontWeight: 600, color: '#e8dfc8' }}>AyuraHealth</span>
        </Link>
      </nav>

      {/* Success Content */}
      <div style={{ paddingTop: '7rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="success-container">
          {loading ? (
            <div className="success-card">
              <p style={{ color: 'rgba(232,223,200,0.6)' }}>Processing your payment...</p>
            </div>
          ) : (
            <div className="success-card">
              <div className="success-icon">✅</div>
              <h1 className="success-title">Payment Successful!</h1>
              <p className="success-message">
                Welcome to AyuraHealth Premium! Your subscription is now active.
              </p>

              {orderDetails && (
                <div className="order-details">
                  <div className="detail-row">
                    <span className="detail-label">Order ID</span>
                    <span className="detail-value">{orderDetails.orderId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Plan</span>
                    <span className="detail-value">{orderDetails.tier}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Amount</span>
                    <span className="detail-value">{orderDetails.amount}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">{orderDetails.date}</span>
                  </div>
                </div>
              )}

              <div className="next-steps">
                <h3>🎉 What&apos;s Next?</h3>
                <ol>
                  <li>Check your email for a confirmation receipt and invoice</li>
                  <li>Your premium features are now available in the app</li>
                  <li>Start tracking your health progress with advanced analytics</li>
                  <li>Access personalized meal plans and recommendations</li>
                  <li>Book consultations with Ayurvedic practitioners (Premium Plus)</li>
                </ol>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <Link href="/chat" className="btn-primary">
                  Start Using Premium Features →
                </Link>
                <Link href="/pricing" className="btn-secondary">
                  View Plans
                </Link>
              </div>

              {/* Support Info */}
              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(106,191,138,0.1)', fontSize: '0.85rem', color: 'rgba(232,223,200,0.5)' }}>
                <p>Need help? Contact our support team at <strong>support@ayurahealth.com</strong></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
