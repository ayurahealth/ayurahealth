import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

let razorpay: Razorpay | null = null

function getRazorpay() {
  if (!razorpay && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  return razorpay
}

export async function POST(request: NextRequest) {
  try {
    const razorpayInstance = getRazorpay()
    if (!razorpayInstance) {
      return NextResponse.json(
        { error: 'Razorpay is not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { tier, email, amount, currency = 'INR' } = body

    if (!tier || !email || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: tier, email, amount' },
        { status: 400 }
      )
    }

    // Define pricing for each tier in INR (Indian Rupees)
    const prices: Record<string, { amount: number; name: string }> = {
      premium: {
        amount: 399, // ₹399/month
        name: 'Premium Monthly',
      },
      'premium-plus': {
        amount: 799, // ₹799/month
        name: 'Premium Plus Monthly',
      },
      'premium-annual': {
        amount: 3192, // ₹3,192/year (20% discount)
        name: 'Premium Annual',
      },
      'premium-plus-annual': {
        amount: 6392, // ₹6,392/year (20% discount)
        name: 'Premium Plus Annual',
      },
    }

    const priceInfo = prices[tier]
    if (!priceInfo) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const orderParams: any = {
      amount: priceInfo.amount * 100, // Convert to paise
      currency,
      receipt: `order_${Date.now()}`,
      notes: {
        tier,
        email,
      },
    }

    const order = await razorpayInstance.orders.create(orderParams)

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    console.error('Razorpay error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
