'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Logo from '../../components/Logo'

// Server-verified pricing (must match server-side PRICES in API routes)
const PRICING_TIERS = [
  {
    name: 'Free',
    priceUSD: 0,
    priceINR: 0,
    period: 'Forever',
    description: '3 AI consultations to experience VAIDYA',
    features: [
      '3 AI consultations with VAIDYA',
      'Dosha Quiz (5-minute assessment)',
      'Basic Health Guidance from 8 Traditions',
      'Basic Blood Report Analysis',
      'Diet Chart Generation',
      '50+ Language Support',
      'No Credit Card Required',
      'Ad-Free Experience',
    ],
    cta: 'Try 3 Free Consultations',
    ctaHref: '/chat',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Premium',
    priceUSD: 4.99,
    priceINR: 399,
    period: 'month',
    description: 'For serious health tracking',
    features: [
      'Everything in Free +',
      'Advanced Blood Report Analysis',
      'Personalized Weekly Meal Plans',
      'Health Progress Tracking',
      'Consultation History',
      'Export Reports (PDF)',
      'Priority Support',
      'Offline Access',
    ],
    cta: 'Start 7-Day Free Trial',
    ctaHref: '/pricing/checkout?tier=premium',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Premium Plus',
    priceUSD: 9.99,
    priceINR: 799,
    period: 'month',
    description: 'For comprehensive wellness',
    features: [
      'Everything in Premium +',
      'Unlimited AI Consultations',
      'Monthly Doctor Consultations',
      'Personalized Supplement Plans',
      'Wearable Device Integration',
      'Advanced Health Analytics',
      'Priority Customer Support',
      'Custom Meal Plans (Unlimited)',
    ],
    cta: 'Start 7-Day Free Trial',
    ctaHref: '/pricing/checkout?tier=premium-plus',
    highlighted: false,
    badge: 'Best Value',
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
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #05100a !important; }

        .pricing-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem, 5vw, 3.6rem); font-weight: 300; line-height: 1.1; letter-spacing: -0.02em; background: linear-gradient(160deg, #e8dfc8 0%, #c9a84c 50%, #6abf8a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .toggle-group { display: flex; gap: 0.5rem; align-items: center; }
        .toggle-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(106,191,138,0.15); color: rgba(232,223,200,0.6); padding: 0.45rem 1.1rem; border-radius: 980px; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; font-family: inherit; }
        .toggle-btn:hover { border-color: rgba(106,191,138,0.35); color: rgba(232,223,200,0.85); }
        .toggle-btn.active { background: rgba(106,191,138,0.12); border-color: rgba(106,191,138,0.4); color: #e8dfc8; }

        .pricing-card { background: linear-gradient(145deg, rgba(255,255,255,0.025), rgba(106,191,138,0.02)); border: 1px solid rgba(106,191,138,0.1); border-radius: 22px; padding: 2.2rem; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); position: relative; overflow: hidden; }
        .pricing-card.highlighted { background: linear-gradient(145deg, rgba(106,191,138,0.07), rgba(45,90,27,0.05)); border-color: rgba(106,191,138,0.28); transform: scale(1.03); box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(106,191,138,0.15); }
        .pricing-card:not(.highlighted):hover { border-color: rgba(106,191,138,0.2); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.35); }

        .btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; background: linear-gradient(135deg, #1a4d2e, #2d7a45); color: #e8dfc8; padding: 0.9rem 2rem; border-radius: 980px; font-size: 0.95rem; font-weight: 600; text-decoration: none; transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 4px 24px rgba(45,122,69,0.4); border: 1px solid rgba(106,191,138,0.3); cursor: pointer; width: 100%; font-family: inherit; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(45,122,69,0.6); }

        .btn-outline { display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; color: rgba(232,223,200,0.75); padding: 0.9rem 2rem; border-radius: 980px; font-size: 0.95rem; font-weight: 500; text-decoration: none; transition: all 0.2s; border: 1px solid rgba(232,223,200,0.14); cursor: pointer; width: 100%; font-family: inherit; background: transparent; }
        .btn-outline:hover { background: rgba(232,223,200,0.05); border-color: rgba(232,223,200,0.35); color: #e8dfc8; }

        .feature-li { padding: 0.6rem 0; color: rgba(232,223,200,0.65); display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.88rem; font-family: -apple-system, sans-serif; line-height: 1.5; }
        .feature-li::before { content: '✓'; color: #6abf8a; font-weight: bold; font-size: 0.95rem; flex-shrink: 0; margin-top: 0.05rem; }

        .price-num { font-family: 'Cormorant Garamond', serif; font-size: 3.2rem; font-weight: 300; color: #e8dfc8; line-height: 1; }
        .price-period { color: rgba(232,223,200,0.4); font-size: 0.85rem; }
        .savings-pill { display: inline-block; background: rgba(106,191,138,0.12); border: 1px solid rgba(106,191,138,0.28); color: #6abf8a; padding: 0.3rem 0.85rem; border-radius: 980px; font-size: 0.75rem; margin-top: 0.6rem; font-family: -apple-system, sans-serif; }
        .badge-pill { display: inline-block; background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.3); color: #c9a84c; padding: 0.25rem 0.85rem; border-radius: 980px; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 1.2rem; font-family: -apple-system, sans-serif; }

        .faq-item { padding: 1.5rem 0; border-bottom: 1px solid rgba(106,191,138,0.07); }
        .faq-item:last-child { border-bottom: none; }
        .faq-q { color: #e8dfc8; font-size: 1rem; font-weight: 500; margin-bottom: 0.6rem; font-family: -apple-system, sans-serif; }
        .faq-a { color: rgba(232,223,200,0.5); font-size: 0.88rem; line-height: 1.75; font-family: -apple-system, sans-serif; }

        @media(max-width:768px) { .pricing-card.highlighted { transform: scale(1); } }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,16,10,0.94)', backdropFilter: 'blur(22px)', borderBottom: '1px solid rgba(106,191,138,0.1)' }}>
        <Logo size={34} showText={true} href="/" />
        <Link href="/" style={{ color: 'rgba(232,223,200,0.6)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s', fontFamily: '-apple-system, sans-serif' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#e8dfc8')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,223,200,0.6)')}>
          ← Back
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ padding: '6rem 2rem 3rem', textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
        <h1 className="pricing-title" style={{ marginBottom: '1rem' }}>Simple, Transparent Pricing</h1>
        <p style={{ fontSize: 'clamp(0.88rem, 2vw, 1rem)', color: 'rgba(232,223,200,0.5)', maxWidth: 500, lineHeight: 1.75, marginBottom: '2.5rem', fontFamily: '-apple-system, sans-serif', margin: '0 auto 2.5rem' }}>
          Choose the plan that fits your wellness journey. All plans are verified server-side — no price tampering possible.
        </p>

        {/* Billing + Currency toggles */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="toggle-group">
            <button className={`toggle-btn${billing === 'monthly' ? ' active' : ''}`} onClick={() => setBilling('monthly')}>Monthly</button>
            <button className={`toggle-btn${billing === 'annual' ? ' active' : ''}`} onClick={() => setBilling('annual')}>
              Annual <span style={{ color: '#6abf8a', marginLeft: '0.3rem' }}>-20%</span>
            </button>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(106,191,138,0.12)' }} />
          <div className="toggle-group">
            <button className={`toggle-btn${currency === 'usd' ? ' active' : ''}`} onClick={() => setCurrency('usd')}>$ USD</button>
            <button className={`toggle-btn${currency === 'inr' ? ' active' : ''}`} onClick={() => setCurrency('inr')}>₹ INR</button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '2rem 2rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {PRICING_TIERS.map((tier) => (
            <div key={tier.name} className={`pricing-card${tier.highlighted ? ' highlighted' : ''}`}>
              {tier.badge && <div className="badge-pill">{tier.badge}</div>}

              <h3 style={{ fontSize: '1.4rem', fontFamily: '"Cormorant Garamond", serif', fontWeight: 400, color: '#e8dfc8', marginBottom: '0.4rem' }}>{tier.name}</h3>
              <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.85rem', marginBottom: '1.8rem', fontFamily: '-apple-system, sans-serif' }}>{tier.description}</p>

              <div style={{ marginBottom: '2rem' }}>
                <div className="price-num">{getPrice(tier)}</div>
                <p className="price-period">{getPeriod(tier.priceUSD)}</p>
                {billing === 'annual' && tier.priceUSD > 0 && (
                  <div className="savings-pill">{getSavings(tier)}</div>
                )}
              </div>

              {tier.highlighted ? (
                <button className="btn-primary" onClick={() => window.location.href = `${tier.ctaHref}&billing=${billing}&currency=${currency}`} style={{ marginBottom: '2rem' }}>
                  {tier.cta}
                </button>
              ) : tier.priceUSD === 0 ? (
                <a href={tier.ctaHref} className="btn-outline" style={{ marginBottom: '2rem' }}>{tier.cta}</a>
              ) : (
                <button className="btn-outline" onClick={() => window.location.href = `${tier.ctaHref}&billing=${billing}&currency=${currency}`} style={{ marginBottom: '2rem' }}>
                  {tier.cta}
                </button>
              )}

              <ul style={{ listStyle: 'none' }}>
                {tier.features.map((f) => (
                  <li key={f} className="feature-li">{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Note */}
        <p style={{ textAlign: 'center', color: 'rgba(232,223,200,0.25)', fontSize: '0.75rem', marginTop: '2rem', fontFamily: '-apple-system, sans-serif' }}>
          🏷️ 3 free consultations on Free plan · USD: Stripe · ₹ INR: Razorpay (UPI, NetBanking, Cards) · 7-day free trial on paid plans · 30-day money-back guarantee
        </p>
      </section>

      {/* FAQ */}
      <section style={{ padding: '5rem 2rem', maxWidth: 740, margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 300, textAlign: 'center', color: '#e8dfc8', marginBottom: '3rem' }}>Frequently Asked Questions</h2>
        {[
          { q: 'Can I switch plans anytime?', a: 'Yes! You can upgrade, downgrade, or cancel anytime. Changes take effect at the end of your billing cycle.' },
          { q: 'Is there a free trial?', a: 'Yes! Premium and Premium Plus plans include a 7-day free trial. No credit card required to explore free features.' },
          { q: 'What payment methods do you accept?', a: 'USD payments via Stripe (all major cards). INR payments via Razorpay (UPI, NetBanking, Debit/Credit cards, Wallets).' },
          { q: 'Is my health data private?', a: 'Absolutely. Free tier conversations are stored in your browser only — never on our servers. Premium features use end-to-end encrypted storage.' },
          { q: 'Do you offer refunds?', a: 'Yes. We offer a 30-day money-back guarantee if you\'re not satisfied. Contact support@ayurahealth.com.' },
          { q: 'Are the prices really verified server-side?', a: 'Yes — pricing is enforced on our servers only. It\'s not possible to manipulate the charged amount from the browser. Your payment always matches the displayed price.' },
        ].map((faq, i) => (
          <div key={i} className="faq-item">
            <p className="faq-q">{faq.q}</p>
            <p className="faq-a">{faq.a}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(106,191,138,0.08)' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 300, color: '#e8dfc8', marginBottom: '1.2rem' }}>Ready to Transform Your Health?</h2>
        <p style={{ fontSize: '0.95rem', color: 'rgba(232,223,200,0.45)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem', fontFamily: '-apple-system, sans-serif' }}>
          Start free, upgrade anytime. Ancient wisdom meets modern AI.
        </p>
        <Link href="/chat" className="btn-primary" style={{ maxWidth: 280, margin: '0 auto' }}>Start Free Assessment →</Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2.5rem 2rem', borderTop: '1px solid rgba(106,191,138,0.07)', textAlign: 'center' }}>
        <p style={{ color: 'rgba(232,223,200,0.2)', fontSize: '0.72rem', marginBottom: '1rem', fontFamily: '-apple-system, sans-serif' }}>© 2026 AyuraHealth · Tokyo, Japan · All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Contact', '/contact']].map(([label, href]) => (
            <Link key={href} href={href} style={{ color: 'rgba(232,223,200,0.3)', textDecoration: 'none', fontSize: '0.72rem', fontFamily: '-apple-system, sans-serif', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,223,200,0.65)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,223,200,0.3)')}>
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </main>
  )
}
