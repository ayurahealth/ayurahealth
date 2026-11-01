import { NextRequest, NextResponse } from 'next/server'

import dns from 'dns/promises'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 })
    }

    try {
      const lookup = await dns.lookup(parsedUrl.hostname);
      const ip = lookup.address;

      if (
        ip.startsWith('127.') ||
        ip === '::1' ||
        ip.startsWith('10.') ||
        ip.startsWith('192.168.') ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
        ip === '0.0.0.0' ||
        ip.startsWith('169.254.')
      ) {
        return NextResponse.json({ error: 'Access to internal network is not allowed' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Could not resolve hostname' }, { status: 400 })
    }

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 AyuraIntelligence/1.0' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return NextResponse.json({ error: 'Could not fetch URL' }, { status: 400 })

    const html = await res.text()

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
  } catch {
    return NextResponse.json({ error: 'Failed to fetch link' }, { status: 500 })
  }
}
