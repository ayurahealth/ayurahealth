import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

let stripe: Stripe | null = null

function getStripe() {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-03-25.dahlia' as any,
    })
  }
  return stripe
}

export async function POST(request: NextRequest) {
  try {
    const stripeInstance = getStripe()
    if (!stripeInstance) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { tier, email, successUrl, cancelUrl } = body

    if (!tier || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: tier, email' },
        { status: 400 }
      )
    }

    // Define pricing for each tier
    const prices: Record<string, { amount: number; name: string; interval: string }> = {
      premium: {
        amount: 499, // $4.99 in cents
        name: 'Premium Monthly',
        interval: 'month',
      },
      'premium-plus': {
        amount: 999, // $9.99 in cents
        name: 'Premium Plus Monthly',
        interval: 'month',
      },
      'premium-annual': {
        amount: 47920, // $479.20 (20% discount) in cents
        name: 'Premium Annual',
        interval: 'year',
      },
      'premium-plus-annual': {
        amount: 95920, // $959.20 (20% discount) in cents
        name: 'Premium Plus Annual',
        interval: 'year',
      },
    }

    const priceInfo = prices[tier]
    if (!priceInfo) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const sessionParams: any = {
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: priceInfo.name,
              description: `AyuraHealth ${tier.replace('-', ' ').toUpperCase()} Subscription`,
            },
            unit_amount: priceInfo.amount,
            recurring: {
              interval: priceInfo.interval as 'month' | 'year',
              interval_count: 1,
              trial_period_days: 7,
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing/cancel`,
      metadata: {
        tier,
        email,
      },
    }
    const session = await stripeInstance.checkout.sessions.create(sessionParams)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
