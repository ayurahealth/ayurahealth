import { NextRequest, NextResponse } from 'next/server'
import dns from 'node:dns/promises'

async function isSafeUrl(urlString: string) {
  try {
    const parsed = new URL(urlString)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false
    }

    const ips = await dns.resolve4(parsed.hostname)
    for (const ip of ips) {
      if (
        ip === '0.0.0.0' ||
        ip === '::1' ||
        ip.startsWith('127.') ||
        ip.startsWith('10.') ||
        ip.startsWith('169.254.') ||
        ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
        ip.startsWith('192.168.')
      ) {
        return false
      }
    }
    return true
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

    if (!(await isSafeUrl(url))) {
      return NextResponse.json({ error: 'Invalid or forbidden URL' }, { status: 400 })
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
