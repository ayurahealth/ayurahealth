import { NextRequest, NextResponse } from 'next/server'
import { fetchWithSSRFProtection } from '@/lib/security/ssrf'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

    const res = await fetchWithSSRFProtection(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 AyuraIntelligence/1.0' },
    })
    if (!res.ok) return NextResponse.json({ error: 'Could not fetch URL' }, { status: 400 })

    const html = res.text

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : url

    // Strip HTML tags and extract clean text (first 3000 chars)
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 3000)

    return NextResponse.json({ title, text, url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch link';
    // Do not leak internal error details (e.g. private IP access) in production
    const isClientError = message === 'Invalid URL' || message === 'Invalid protocol. Only HTTP and HTTPS are allowed.' || message === 'Access to private IP addresses is forbidden';

    return NextResponse.json(
      { error: isClientError ? message : 'Failed to fetch link' },
      { status: isClientError ? 400 : 500 }
    )
  }
}
