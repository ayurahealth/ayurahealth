import { NextRequest, NextResponse } from 'next/server'
import { getDeepChecks, getVaidyaCheck } from '@/lib/healthChecks'

export const dynamic = 'force-static'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const wantsDeep = searchParams.get('deep') === '1'
    const auth = req.headers.get('authorization')
    const token = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : ''
    const secret = process.env.HEALTH_CHECK_SECRET

    const base = {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      service: 'ayurahealth-api',
    }

    const vaidya = getVaidyaCheck()
    const summary = vaidya.ready ? ('ok' as const) : ('degraded' as const)

    if (!wantsDeep) {
      return NextResponse.json(
        { ...base, checks: { vaidya, summary } },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    // Timing-safe verification (Finding #5)
    let isAuthorized = false
    if (secret && token) {
      try {
        const crypto = await import('crypto')
        const tokenBuffer = Buffer.from(token)
        const secretBuffer = Buffer.from(secret)
        if (tokenBuffer.length === secretBuffer.length) {
          isAuthorized = crypto.timingSafeEqual(tokenBuffer, secretBuffer)
        }
      } catch (err) {
        isAuthorized = false
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized', hint: 'Check HEALTH_CHECK_SECRET connectivity' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const deep = await getDeepChecks()
    const deepSummary =
      deep.vaidya.ready &&
      deep.database !== 'error' &&
      deep.clerk.secretConfigured &&
      deep.clerk.publishableConfigured
        ? ('ok' as const)
        : ('degraded' as const)

    return NextResponse.json(
      { ...base, checks: { ...deep, summary: deepSummary } },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
