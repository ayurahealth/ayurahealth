import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-static'


/**
 * Ayura Intelligence CEO Frictionless Access
 * Securely sets a cookie to bypass Clerk login for the owner/CEO.
 * USAGE: /api/auth/ceo-pass?key=YOUR_SECRET_KEY
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  
  const CEO_BYPASS_KEY = process.env.CEO_BYPASS_KEY
  

  let isAuthorized = false;
  if (CEO_BYPASS_KEY && key) {
    try {
      const keyBuffer = Buffer.from(key);
      const secretBuffer = Buffer.from(CEO_BYPASS_KEY);
      if (keyBuffer.length === secretBuffer.length) {
        isAuthorized = crypto.timingSafeEqual(keyBuffer, secretBuffer);
      }
    } catch {
      isAuthorized = false;
    }
  }

  if (!isAuthorized) {

    return NextResponse.json({ error: 'Unauthorized. Please check your CEO_BYPASS_KEY.' }, { status: 401 })
  }

  const response = NextResponse.redirect(new URL('/chat', req.url))
  
  // Set a permanent, secure, HttpOnly cookie for the bypass
  response.cookies.set('ayura_ceo_token', CEO_BYPASS_KEY, {
    path: '/',
    maxAge: 365 * 24 * 60 * 60, // 1 year
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return response
}
