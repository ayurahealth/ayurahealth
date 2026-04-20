'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Surface from '../../components/ui/Surface'
import IOSButton from '../../components/ui/IOSButton'
import IOSSegmentedControl from '../../components/ui/IOSSegmentedControl'
import { Check, ShieldCheck, Sparkles, Zap, ArrowRight, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/LanguageContext'

const PRICING_TIERS = (t: any) => [
  {
    name: t('pricing_free'),
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
    cta: t('pricing_start_free'),
    ctaHref: '/chat',
    highlighted: false,
    badge: null,
    icon: Sparkles
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
    cta: t('pricing_start_trial'),
    ctaHref: '/pricing/checkout?tier=premium',
    highlighted: true,
    badge: 'Recommended',
    icon: ShieldCheck
  },
  {
    name: t('pricing_enterprise'),
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
    cta: t('pricing_start_trial'),
    ctaHref: '/pricing/checkout?tier=premium-plus',
    highlighted: false,
    badge: 'Enterprise',
    icon: Zap
  },
]

type Currency = 'usd' | 'inr'

export default function PricingPage() {
  const { t } = useTranslation()
  const pricingTiers = PRICING_TIERS(t)
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [currency, setCurrency] = useState<Currency>('usd')

  const getPrice = (tier: typeof pricingTiers[0]) => {
    if (tier.priceUSD === 0) return t('pricing_free')
    const base = currency === 'usd' ? tier.priceUSD : tier.priceINR
    if (billing === 'annual') {
      const annual = base * 12 * 0.8
      return currency === 'usd' ? `$${annual.toFixed(2)}` : `₹${Math.round(annual)}`
    }
    return currency === 'usd' ? `$${base.toFixed(2)}` : `₹${base}`
  }

  const getPeriod = (priceUSD: number) => {
    if (priceUSD === 0) return ''
    return billing === 'annual' ? '/year' : '/month'
  }

  const getSavings = (tier: typeof pricingTiers[0]) => {
    if (tier.priceUSD === 0) return null
    const base = currency === 'usd' ? tier.priceUSD : tier.priceINR
    const saved = base * 12 * 0.2
    return currency === 'usd' ? `Save $${saved.toFixed(2)}/year` : `Save ₹${Math.round(saved)}/year`
  }

  return (
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)', overflowX: 'hidden', paddingBottom: 'calc(100px + env(safe-area-inset-bottom))', position: 'relative' }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: 'max(15vh, 10rem) 1.5rem 4rem', textAlign: 'center', maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', color: 'var(--accent-main)', marginBottom: '1.25rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Professional Licensing</span>
          </div>
          <h1 className="hero-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, lineHeight: 1.1, marginBottom: '2rem', color: 'var(--text-main)' }}>
            {t('heading_pricing')}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto 4rem', lineHeight: 1.6 }}>
            {t('pricing_sub')}
          </p>

          {/* Toggles */}
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <IOSSegmentedControl
              value={billing}
              onChange={(id) => setBilling(id as 'monthly' | 'annual')}
              options={[
                { id: 'monthly', label: t('pricing_monthly') },
                { id: 'annual', label: t('pricing_annual') },
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
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '2rem 1.5rem 6rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {pricingTiers.map((tier, idx) => {
            const Icon = tier.icon
            return (
              <Surface
                key={tier.name}
                variant={tier.highlighted ? 'glass' : 'default'}
                delay={idx * 0.1}
                style={{ 
                  padding: '3rem', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderColor: tier.highlighted ? 'var(--accent-main)' : 'var(--border-low)',
                  background: tier.highlighted ? 'hsla(var(--accent-main-hsl), 0.03)' : undefined
                }}
              >
                {tier.badge && (
                  <div style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'hsla(var(--accent-main-hsl), 0.1)', 
                    border: '1px solid var(--border-mid)', 
                    color: 'var(--accent-main)', 
                    padding: '0.35rem 0.85rem', 
                    borderRadius: '8px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px',
                    marginBottom: '2rem', 
                    alignSelf: 'flex-start' 
                  }}>
                    <Check size={14} />
                    {tier.badge}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'var(--surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-main)' }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-main)' }}>{tier.name}</h3>
                </div>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>{tier.description}</p>

                <div style={{ marginBottom: '3rem' }}>
                  <div style={{ fontSize: '3.5rem', fontWeight: 500, color: 'var(--text-main)', lineHeight: 0.9 }}>{getPrice(tier)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{getPeriod(tier.priceUSD)}</span>
                    {billing === 'annual' && tier.priceUSD > 0 && (
                      <span style={{ color: 'var(--accent-main)', fontSize: '0.85rem', fontWeight: 600, background: 'hsla(var(--accent-main-hsl), 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{getSavings(tier)}</span>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '3rem' }}>
                  <IOSButton 
                    href={tier.ctaHref} 
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    style={{ fontSize: '1rem', padding: '1rem' }}
                  >
                    {tier.cta}
                    <ArrowRight size={18} />
                  </IOSButton>
                </div>

                <ul style={{ listStyle: 'none', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ color: 'var(--text-muted)', display: 'flex', gap: '0.85rem', fontSize: '0.95rem', lineHeight: 1.4 }}>
                      <Check size={18} style={{ color: 'var(--accent-main)', flexShrink: 0, marginTop: '0.1rem' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </Surface>
            )
          })}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5rem', maxWidth: 600, margin: '5rem auto 0', opacity: 0.6 }}>
          Clinical subscriptions include standardized 7-day validation periods. All transactions are securely managed via encrypted gateways.
        </p>
      </section>

      {/* FAQ */}
      <section style={{ padding: '8rem 1.5rem', maxWidth: 900, margin: '0 auto', borderTop: '1px solid var(--border-low)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem', justifyContent: 'center' }}>
          <HelpCircle size={32} style={{ color: 'var(--accent-main)' }} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 500, color: 'var(--text-main)' }}>{t('heading_faq')}</h2>
        </div>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[
            { q: 'Can I switch plans anytime?', a: 'Clinical plans can be updated or terminated at any point. Changes apply at the start of the next billing cycle.' },
            { q: 'Is there a trial period?', a: 'Yes. All paid Clinical plans initiate with a standard 7-day clinical validation period. Access is immediate.' },
            { q: 'How is clinical data protected?', a: 'Primary assessments are browser-local. Subscribed accounts utilize industry-standard clinical storage protocols and encryption.' },
          ].map((faq, i) => (
            <Surface key={i} style={{ padding: '2rem 2.5rem' }}>
              <p style={{ color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>{faq.q}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>{faq.a}</p>
            </Surface>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '6rem 1.5rem', borderTop: '1px solid var(--border-low)', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {[
            {label: t('footer_compliance'), href: '/compliance'},
            {label: t('footer_privacy'), href: '/data-privacy'},
            {label: t('footer_support'), href: '/clinical-support'}
          ].map((item) => (
            <Link key={item.label} href={item.href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '1rem', fontWeight: 500 }}>{item.label}</Link>
          ))}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', opacity: 0.4 }}>{t('footer_copy')}</p>
      </footer>
    </main>
  )
}
