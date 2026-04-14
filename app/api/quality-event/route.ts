import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-static'
export const runtime = 'nodejs'

const qualityEventSchema = z.object({
  ts: z.number().int().positive(),
  formatScore: z.number().min(0).max(100),
  completeness: z.number().min(0).max(100),
  latencyMs: z.number().min(0).max(120000),
  repaired: z.boolean(),
  modelUsed: z.string().max(120).optional(),
  providerUsed: z.string().max(50).optional(),
  responseMode: z.enum(['fast', 'deep', 'research']).optional(),
  policyApplied: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = qualityEventSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid quality event payload.' }, { status: 400 })
    }

    // Optional lightweight analytics endpoint.
    // It stays safe by default: no DB writes, just structured server logs.
    console.info('QUALITY_EVENT', {
      ...parsed.data,
      receivedAt: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to process quality event.' }, { status: 500 })
  }
}
