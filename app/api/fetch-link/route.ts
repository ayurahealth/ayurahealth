import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

    // SSRF Protection: Validate URL and block internal/private IPs and non-HTTP protocols
    try {
      const parsedUrl = new URL(url)
      const hostname = parsedUrl.hostname.toLowerCase()
      const protocol = parsedUrl.protocol

      const isLocal = hostname === 'localhost' || hostname.startsWith('127.') || hostname === '[::1]' || hostname.endsWith('.local')

      // Simple regex to check if it's an IPv4 address to avoid false positives on domains starting with numbers
      const isIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
      const isPrivateIP = isIPv4 && /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|169\.254\.|0\.0\.0\.0)/.test(hostname)

      if (protocol !== 'http:' && protocol !== 'https:') {
        return NextResponse.json({ error: 'Invalid protocol. Only HTTP and HTTPS are allowed.' }, { status: 400 })
      }

      if (isLocal || isPrivateIP) {
        return NextResponse.json({ error: 'Access to local or private networks is blocked.' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 })
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
