import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'


/**
 * Ayura Intelligence CEO Frictionless Access
 * Securely sets a cookie to bypass Clerk login for the owner/CEO.
 * USAGE: /api/auth/ceo-pass?key=YOUR_SECRET_KEY
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  
  const CEO_BYPASS_KEY = process.env.CEO_BYPASS_KEY
  
  if (!CEO_BYPASS_KEY || key !== CEO_BYPASS_KEY) {
    return NextResponse.json({ error: 'Unauthorized. Please check your CEO_BYPASS_KEY.' }, { status: 401 })
  }

  const response = NextResponse.redirect(new URL('/chat', req.url))
  
  // Hash the secret to prevent exposing it to the client
  const hashedKey = crypto.createHash('sha256').update(CEO_BYPASS_KEY).digest('hex')

  // Set a permanent, secure, HttpOnly cookie for the bypass
  response.cookies.set('ayura_ceo_token', hashedKey, {
    path: '/',
    maxAge: 365 * 24 * 60 * 60, // 1 year
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return response
}
