'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Surface from '../../components/ui/Surface'
import IOSButton from '../../components/ui/IOSButton'
import IOSSegmentedControl from '../../components/ui/IOSSegmentedControl'

const PRICING_TIERS = [
  {
    name: 'Free',
    priceUSD: 0,
    priceINR: 0,
    period: 'Forever',
    description: 'Basic health assessment and guidance',
    features: [
      '3 AI-assisted consultations',
      'Body type (Dosha) assessment',
      'Guidance across 8 traditions',
      'Basic report analysis',
      'Dietary suggestions',
      'Multi-language support',
      'No credit card required',
    ],
    cta: 'Start Free Consultations',
    ctaHref: '/chat',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Clinical',
    priceUSD: 4.99,
    priceINR: 399,
    period: 'month',
    description: 'For consistent health tracking',
    features: [
      'Everything in Free +',
      'Detailed report analysis',
      'Structured weekly meal plans',
      'Health progress tracking',
      'Complete consultation history',
      'PDF report exports',
      'Priority assistance',
    ],
    cta: 'Start 7-Day Free Trial',
    ctaHref: '/pricing/checkout?tier=premium',
    highlighted: true,
    badge: 'Recommended',
  },
  {
    name: 'Clinical Plus',
    priceUSD: 9.99,
    priceINR: 799,
    period: 'month',
    description: 'For professional-grade wellness',
    features: [
      'Everything in Clinical +',
      'Unlimited consultations',
      'Monthly practitioner reviews',
      'Supplement planning',
      'Biometric device integration',
      'Advanced health analytics',
      'One-on-one support',
    ],
    cta: 'Start 7-Day Free Trial',
    ctaHref: '/pricing/checkout?tier=premium-plus',
    highlighted: false,
    badge: 'Enterprise',
  },
]

type Currency = 'usd' | 'inr'

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [currency, setCurrency] = useState<Currency>('usd')

  const getPrice = (tier: typeof PRICING_TIERS[0]) => {
    if (tier.priceUSD === 0) return 'Free'
    const base = currency === 'usd' ? tier.priceUSD : tier.priceINR
    if (billing === 'annual') {
      const annual = base * 12 * 0.8
      return currency === 'usd' ? `$${annual.toFixed(2)}` : `₹${Math.round(annual)}`
    }
    return currency === 'usd' ? `$${base.toFixed(2)}` : `₹${base}`
  }

  const getPeriod = (priceUSD: number) => {
    if (priceUSD === 0) return 'Forever'
    return billing === 'annual' ? '/year' : '/month'
  }

  const getSavings = (tier: typeof PRICING_TIERS[0]) => {
    if (tier.priceUSD === 0) return null
    const base = currency === 'usd' ? tier.priceUSD : tier.priceINR
    const saved = base * 12 * 0.2
    return currency === 'usd' ? `Save $${saved.toFixed(2)}/year` : `Save ₹${Math.round(saved)}/year`
  }

  return (
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)', overflowX: 'hidden' }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: '8rem 2rem 4rem', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 500, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text-main)' }}>
          Direct, Professional Pricing
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto 3rem', lineHeight: 1.6 }}>
          Select the level of support required for your health journey. Standardized rates for individuals and practitioners.
        </p>

        {/* Toggles */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <IOSSegmentedControl
            value={billing}
            onChange={(id) => setBilling(id as 'monthly' | 'annual')}
            options={[
              { id: 'monthly', label: 'Monthly' },
              { id: 'annual', label: 'Annual (-20%)' },
            ]}
          />
          <IOSSegmentedControl
            value={currency}
            onChange={(id) => setCurrency(id as Currency)}
            options={[
              { id: 'usd', label: '$ USD' },
              { id: 'inr', label: '₹ INR' },
            ]}
          />
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '2rem 2rem 6rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {PRICING_TIERS.map((tier) => (
            <Surface
              key={tier.name}
              className="flat-card"
              variant={tier.highlighted ? 'strong' : 'default'}
              style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}
            >
              {tier.badge && (
                <div style={{ display: 'inline-block', background: 'var(--surface-high)', border: '1px solid var(--border-mid)', color: 'var(--accent-main)', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1.5rem', alignSelf: 'flex-start' }}>
                  {tier.badge}
                </div>
              )}

              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{tier.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>{tier.description}</p>

              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: 500, color: 'var(--text-main)', lineHeight: 1 }}>{getPrice(tier)}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{getPeriod(tier.priceUSD)}</p>
                {billing === 'annual' && tier.priceUSD > 0 && (
                  <div style={{ color: 'var(--accent-main)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 500 }}>{getSavings(tier)}</div>
                )}
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                {tier.highlighted ? (
                  <IOSButton onClick={() => window.location.href = `${tier.ctaHref}&billing=${billing}&currency=${currency}`}>
                    {tier.cta}
                  </IOSButton>
                ) : (
                  <IOSButton href={tier.ctaHref} variant="secondary">{tier.cta}</IOSButton>
                )}
              </div>

              <ul style={{ listStyle: 'none', flex: 1 }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', fontSize: '0.88rem', padding: '0.5rem 0', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--accent-main)', fontWeight: 'bold' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </Surface>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '3rem', maxWidth: 600, margin: '3rem auto 0' }}>
          Educational wellness guidance only. Clinical subscriptions include 7-day trials. All transactions are securely processed via Razorpay.
        </p>
      </section>

      {/* FAQ */}
      <section style={{ padding: '6rem 2rem', maxWidth: 800, margin: '0 auto', borderTop: '1px solid var(--border-low)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 500, textAlign: 'center', color: 'var(--text-main)', marginBottom: '4rem' }}>Questions</h2>
        {[
          { q: 'Can I switch plans anytime?', a: 'Clinical plans can be updated or terminated at any point. Changes apply at the start of the next billing cycle.' },
          { q: 'Is there a trial period?', a: 'Yes. All paid Clinical plans initiate with a 7-day validation period. Access is immediate.' },
          { q: 'How is health data protected?', a: 'Primary assessments are browser-local. Subscribed accounts utilize industry-standard clinical storage protocols.' },
        ].map((faq, i) => (
          <div key={i} style={{ padding: '2rem 0', borderBottom: '1px solid var(--border-low)' }}>
            <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>{faq.q}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border-low)', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {['Safety', 'Privacy', 'Contact'].map((label) => (
            <Link key={label} href={`/${label.toLowerCase()}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>{label}</Link>
          ))}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', opacity: 0.5 }}>© 2026 AyuraHealth · Verified Professional Pricing</p>
      </footer>
    </main>
  )
}
