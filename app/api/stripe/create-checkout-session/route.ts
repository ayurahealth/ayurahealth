import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkPaymentRateLimit } from '../../../../lib/rateLimit'

export const dynamic = 'force-dynamic'

// Server-side pricing — NEVER trust client prices
const PRICES: Record<string, { amount: number; name: string; interval: 'month' | 'year' }> = {
  premium:              { amount: 499,   name: 'Premium Monthly',     interval: 'month' }, // $4.99
  'premium-plus':       { amount: 999,   name: 'Premium Plus Monthly', interval: 'month' }, // $9.99
  'premium-annual':     { amount: 4790,  name: 'Premium Annual',       interval: 'year'  }, // $47.90 (20% off)
  'premium-plus-annual':{ amount: 9590,  name: 'Premium Plus Annual',  interval: 'year'  }, // $95.90 (20% off)
}

let stripe: Stripe | null = null

function getStripe() {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27.acacia' as Parameters<typeof Stripe>[1]['apiVersion'],
    })
  }
  return stripe
}

export async function POST(request: NextRequest) {
  // ── CSRF: verify request origin ─────────────────────────────────────────
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'https://ayurahealth.com',
    'https://www.ayurahealth.com',
  ].filter(Boolean)

  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ── Rate limiting (payment-specific: 5/min) ──────────────────────────────
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  const { allowed } = checkPaymentRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 })
  }

  try {
    const stripeInstance = getStripe()
    if (!stripeInstance) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
    }

    const body = await request.json()

    // ── Input validation ─────────────────────────────────────────────────────
    const { tier, email, userId, successUrl, cancelUrl } = body

    if (!tier || typeof tier !== 'string' || tier.length > 50) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || email.length > 254 || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // ── Server-side price lookup ─────────────────────────────────────────────
    const priceInfo = PRICES[tier]
    if (!priceInfo) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ayurahealth.com'

    const session = await stripeInstance.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `AyuraHealth ${priceInfo.name}`,
              description: 'AI-powered holistic health guidance from 8 ancient traditions',
              images: [`${appUrl}/opengraph-image`],
            },
            unit_amount: priceInfo.amount, // Always server-side
            recurring: {
              interval: priceInfo.interval,
              interval_count: 1,
              trial_period_days: 7,
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${appUrl}/pricing`,
      metadata: {
        tier,
        email,
        userId: userId || '',  // ← FIXED: was missing from old code, needed for webhook
      },
      subscription_data: {
        metadata: {
          tier,
          userId: userId || '',
        },
        trial_period_days: 7,
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch {
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
