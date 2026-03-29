'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

declare global {
  interface Window {
    Razorpay: RazorpayType
  }
}

interface RazorpayType {
  open(): void
  close(): void
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const tier = searchParams.get('tier') || 'premium'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay' | null>(null)
  // Country detection for payment method selection

  useEffect(() => {
    // Detect user country based on timezone or IP
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
      setCountry('IN')
      setPaymentMethod('razorpay')
    }
  }, [])

  const tierInfo: Record<string, { name: string; price: number; currency: string }> = {
    premium: { name: 'Premium', price: 4.99, currency: 'USD' },
    'premium-plus': { name: 'Premium Plus', price: 9.99, currency: 'USD' },
  }

  const info = tierInfo[tier] || tierInfo.premium

  const handleStripePayment = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          email,
          successUrl: `${window.location.origin}/pricing/success`,
          cancelUrl: `${window.location.origin}/pricing/cancel`,
        }),
      })

      const data = await response.json()

      if (data.sessionId) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to create checkout session')
      }
    } catch {
      setError('Payment processing failed. Please try again.')
      // Error logged server-side, not exposed to client
    } finally {
      setLoading(false)
    }
  }

  const handleRazorpayPayment = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)

      script.onload = async () => {
        // Create order
        const orderResponse = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier,
            email,
            amount: tier === 'premium-plus' ? 799 : 399,
            currency: 'INR',
          }),
        })

        const orderData = await orderResponse.json()

        if (orderData.orderId) {
          const options = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'AyuraHealth',
            description: `${info.name} Subscription`,
            image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663443572913/nQYKCbsnkVANj8fjMcN4AQ/ayurahealth-logo-modern-ai-ancient-Masdabix7xfaPSuHh7ULd8.webp',
            order_id: orderData.orderId,
            handler: async (response: RazorpayResponse) => {
              // Verify payment
              const verifyResponse = await fetch('/api/razorpay/create-order', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              })

              const verifyData = await verifyResponse.json()

              if (verifyData.success) {
                window.location.href = `/pricing/success?payment_id=${response.razorpay_payment_id}`
              } else {
                setError('Payment verification failed')
              }
            },
            prefill: {
              email,
            },
            theme: {
              color: '#1a4d2e',
            },
          }

          const rzp = new window.Razorpay(options)
          rzp.open()
        } else {
          setError(orderData.error || 'Failed to create order')
        }

        setLoading(false)
      }
    } catch {
      setError('Payment processing failed. Please try again.')
      // Error logged server-side, not exposed to client
      setLoading(false)
    }
  }

  return (
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #05100a; }
        .checkout-container { max-width: 500px; margin: 0 auto; padding: 2rem; }
        .checkout-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(106,191,138,0.1); border-radius: 16px; padding: 2rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #e8dfc8; font-weight: 500; }
        .form-input { width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(106,191,138,0.2); border-radius: 8px; color: #e8dfc8; font-size: 0.95rem; }
        .form-input:focus { outline: none; border-color: rgba(106,191,138,0.5); background: rgba(106,191,138,0.05); }
        .payment-methods { display: grid; gap: 1rem; margin: 2rem 0; }
        .payment-option { background: rgba(255,255,255,0.025); border: 2px solid rgba(106,191,138,0.1); border-radius: 12px; padding: 1.5rem; cursor: pointer; transition: all 0.2s; }
        .payment-option:hover { border-color: rgba(106,191,138,0.3); background: rgba(106,191,138,0.05); }
        .payment-option.selected { border-color: rgba(106,191,138,0.5); background: rgba(106,191,138,0.1); }
        .btn-primary { display: block; width: 100%; background: linear-gradient(135deg, #2d5a1b, #3d7a28); color: #e8dfc8; padding: 1rem; border-radius: 8px; font-size: 1rem; font-weight: 600; text-decoration: none; transition: all 0.25s; box-shadow: 0 4px 24px rgba(45,90,27,0.4); border: none; cursor: pointer; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(45,90,27,0.55); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .error-message { background: rgba(255, 0, 0, 0.1); border: 1px solid rgba(255, 0, 0, 0.3); color: #ff6b6b; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem; }
        .price-summary { background: rgba(106,191,138,0.08); border: 1px solid rgba(106,191,138,0.2); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; }
        .price-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .price-row.total { border-top: 1px solid rgba(106,191,138,0.2); padding-top: 0.5rem; font-weight: 600; }
      `}</style>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,16,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(106,191,138,0.15)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663443572913/nQYKCbsnkVANj8fjMcN4AQ/ayurahealth-logo-modern-ai-ancient-Masdabix7xfaPSuHh7ULd8.webp" alt="AyuraHealth" style={{ height: 48, width: 48, borderRadius: '8px' }} />
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.35rem', fontWeight: 600, color: '#e8dfc8' }}>AyuraHealth</span>
        </Link>
        <Link href="/pricing" style={{ color: 'rgba(232,223,200,0.75)', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Pricing</Link>
      </nav>

      {/* Checkout Form */}
      <div style={{ paddingTop: '7rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="checkout-container">
          <div className="checkout-card">
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: '"Cormorant Garamond", serif', fontWeight: 300 }}>Complete Your Purchase</h1>
            <p style={{ color: 'rgba(232,223,200,0.6)', marginBottom: '2rem' }}>You&apos;re one step away from unlocking premium features</p>

            {error && <div className="error-message">{error}</div>}

            {/* Price Summary */}
            <div className="price-summary">
              <div className="price-row">
                <span>{info.name} Subscription</span>
                <span>${info.price.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>7-day free trial</span>
                <span>$0.00</span>
              </div>
              <div className="price-row total">
                <span>First charge after trial</span>
                <span>${info.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Payment Method Selection */}
            <div className="form-group">
              <label className="form-label">Select Payment Method</label>
              <div className="payment-methods">
                <div
                  className={`payment-option ${paymentMethod === 'stripe' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('stripe')}
                >
                  <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>💳 Credit/Debit Card (Stripe)</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(232,223,200,0.6)' }}>Visa, Mastercard, American Express</div>
                </div>

                <div
                  className={`payment-option ${paymentMethod === 'razorpay' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>🇮🇳 UPI & Local Methods (Razorpay)</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(232,223,200,0.6)' }}>UPI, NetBanking, Wallets (India)</div>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              className="btn-primary"
              onClick={() => {
                if (paymentMethod === 'stripe') {
                  handleStripePayment()
                } else if (paymentMethod === 'razorpay') {
                  handleRazorpayPayment()
                }
              }}
              disabled={loading || !paymentMethod}
            >
              {loading ? 'Processing...' : `Pay with ${paymentMethod === 'stripe' ? 'Stripe' : 'Razorpay'}`}
            </button>

            {/* Trust Badges */}
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(106,191,138,0.1)', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(232,223,200,0.5)' }}>
              <p style={{ marginBottom: '0.5rem' }}>🔒 Secure payment processing</p>
              <p>Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
