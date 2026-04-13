import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { checkRateLimit, checkPaymentRateLimit } from '../../../../lib/rateLimit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Server-side pricing — NEVER trust client-sent amounts
const PRICES: Record<string, { amount: number; name: string }> = {
  premium: { amount: 39900, name: 'Premium Monthly' },           // ₹399 in paise
  'premium-plus': { amount: 79900, name: 'Premium Plus Monthly' }, // ₹799 in paise
  'premium-annual': { amount: 319200, name: 'Premium Annual' },   // ₹3,192 in paise
  'premium-plus-annual': { amount: 639200, name: 'Premium Plus Annual' }, // ₹6,392 in paise
}
interface RazorpayErrorResponse {
  error?: {
    description?: string
    reason?: string
    code?: string
  }
}

function getRazorpayConfig() {
  // Support both canonical keys and existing custom legacy names in Vercel.
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.razorpay_Live_API_Key
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.razorpay_Live_Key_Secret
  
  if (!keyId || !keySecret) {
    console.error('RAZORPAY_CONFIG_ERROR: Missing keys.', {
      hasKeyId: !!keyId,
      hasKeySecret: !!keySecret,
      envKeyId: process.env.RAZORPAY_KEY_ID ? 'set' : 'missing',
      legacyKeyId: process.env.razorpay_Live_API_Key ? 'set' : 'missing'
    })
  }
  
  return { keyId, keySecret }
}

async function razorpayApi<T>(path: string, init?: RequestInit): Promise<T> {
  const { keyId, keySecret } = getRazorpayConfig()
  if (!keyId || !keySecret) throw new Error('Payment service not configured')

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  const data = (await response.json().catch(() => ({}))) as RazorpayErrorResponse
  if (!response.ok) {
    const errorMessage =
      data.error?.description ||
      data.error?.reason ||
      data.error?.code ||
      `Razorpay API failed (${response.status})`
    throw new Error(errorMessage)
  }
  return data as T
}

export async function POST(request: NextRequest) {
  // ── CSRF: verify request origin ────────────────────────────────────────────
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'https://ayurahealth.com',
    'https://www.ayurahealth.com',
  ].filter(Boolean)

  const isAllowed = origin && (
    allowedOrigins.includes(origin) || 
    origin.endsWith('.vercel.app') || 
    (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost:'))
  )

  if (origin && !isAllowed) {
    console.error('CORS blocked origin:', origin)
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  }

  // ── Rate limiting (payment-specific: 5/min) ──────────────────────────────
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  const { allowed } = await checkPaymentRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 })
  }

  // ── General rate limit ───────────────────────────────────────────────────
  const generalCheck = await checkRateLimit(ip)
  if (!generalCheck.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }

  try {
    const { keyId, keySecret } = getRazorpayConfig()
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
    }

    const body = await request.json()

    // ── Input validation ─────────────────────────────────────────────────────
    const { tier, email, currency = 'INR' } = body

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
    const order = await razorpayApi<{ id: string; amount: number; currency: string }>(
      '/orders',
      {
        method: 'POST',
        body: JSON.stringify({
          amount: priceInfo.amount, // Always from server, never from client
          currency,
          receipt: `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          notes: {
            tier,
            email,
            productName: priceInfo.name,
          },
        }),
      }
    )

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    })
  } catch (err: unknown) {
    // Improved error handling with logging
    console.error('Razorpay order creation error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Failed to create order'
    const errorCode = (err as { statusCode?: number })?.statusCode || 500
    
    return NextResponse.json(
      { error: errorMessage, debug: process.env.NODE_ENV === 'development' ? String(err) : undefined },
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

    const { keySecret: secret } = getRazorpayConfig()

    if (!secret) {
      return NextResponse.json({ success: false, error: 'Configuration missing' }, { status: 500 })
    }

    // ── Verify signature ─────────────────────────────────────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature === razorpay_signature) {
      // ── Signature is valid. Now persist the payment state ────────────────
      // Fetch the order to get the tier and user email stored in notes
      const order = await razorpayApi<{ notes?: { tier?: string; email?: string } }>(`/orders/${razorpay_order_id}`)
      const { tier, email } = (order.notes || {}) as { tier?: string; email?: string }

      if (email) {
        const { prisma } = await import('../../../../lib/prisma')
        // Record subscription if profile exists; do not fail payment on missing profile.
        await prisma.userProfile.updateMany({
          where: { email },
          data: {
            subscriptionTier: tier,
            subscriptionStatus: 'active',
            subscriptionId: razorpay_payment_id,
            // Simple logic for 30 days from now for monthly
            subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        })
      }

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }
  } catch (err: unknown) {
    console.error('Razorpay verification error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Verification failed' },
      { status: 500 }
    )
  }
}
