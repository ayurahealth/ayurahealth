import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { checkRateLimit, checkPaymentRateLimit } from '../../../../lib/rateLimit'

export const dynamic = 'force-dynamic'

// Server-side pricing — NEVER trust client-sent amounts
const PRICES: Record<string, { amount: number; name: string }> = {
  premium: { amount: 39900, name: 'Premium Monthly' },           // ₹399 in paise
  'premium-plus': { amount: 79900, name: 'Premium Plus Monthly' }, // ₹799 in paise
  'premium-annual': { amount: 319200, name: 'Premium Annual' },   // ₹3,192 in paise
  'premium-plus-annual': { amount: 639200, name: 'Premium Plus Annual' }, // ₹6,392 in paise
}

let razorpay: Razorpay | null = null

function getRazorpay() {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  return razorpay
}

export async function POST(request: NextRequest) {
  // ── CSRF: verify request origin ────────────────────────────────────────────
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'https://ayurahealth.com',
    'https://www.ayurahealth.com',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
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

  // ── General rate limit ───────────────────────────────────────────────────
  const generalCheck = checkRateLimit(ip)
  if (!generalCheck.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }

  try {
    const razorpayInstance = getRazorpay()
    if (!razorpayInstance) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
    }

    const body = await request.json()

    // ── Input validation ─────────────────────────────────────────────────────
    const { tier, email, currency = 'INR', userId } = body

    if (!tier || typeof tier !== 'string' || tier.length > 50) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || email.length > 254 || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // ── Server-side price lookup — NEVER use client amount ───────────────────
    const priceInfo = PRICES[tier]
    if (!priceInfo) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    // ── Create Razorpay order ────────────────────────────────────────────────
    const order = await razorpayInstance.orders.create({
      amount: priceInfo.amount, // Always from server, never from client
      currency,
      receipt: `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      notes: {
        tier,
        email,
        userId: userId || '',
        productName: priceInfo.name,
      },
    } as Parameters<typeof razorpayInstance.orders.create>[0])

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err: any) {
    // Improved error handling
    const errorMessage = err?.message || 'Failed to create order'
    const errorCode = err?.statusCode || 500
    
    return NextResponse.json(
      { error: errorMessage },
      { status: errorCode >= 400 && errorCode < 600 ? errorCode : 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET

    if (!secret) {
      return NextResponse.json({ success: false, error: 'Configuration missing' }, { status: 500 })
    }

    // ── Verify signature ─────────────────────────────────────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature === razorpay_signature) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }
  } catch (err: any) {
    // Improved error handling
    return NextResponse.json(
      { success: false, error: err?.message || 'Verification failed' },
      { status: 500 }
    )
  }
}
