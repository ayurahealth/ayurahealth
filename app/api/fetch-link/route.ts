import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns/promises'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

    const parsed = new URL(url)
    const addresses = await dns.lookup(parsed.hostname, { all: true })

    let safeAddress = null;
    for (const { address } of addresses) {
      if (
        address.startsWith('127.') ||
        address.startsWith('10.') ||
        address.startsWith('192.168.') ||
        address.startsWith('169.254.') ||
        address.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
        address === '0.0.0.0' ||
        address === '::1' ||
        address.toLowerCase().startsWith('::ffff:127.') ||
        address.toLowerCase().match(/^(fc|fd|fe[89ab]).*:/)
      ) {
        return NextResponse.json({ error: 'Access to internal IP is not allowed' }, { status: 403 })
      }
      safeAddress = address; // Use the last safe address checked
    }

    if (!safeAddress) return NextResponse.json({ error: 'Could not resolve hostname' }, { status: 400 })

    // Mitigate DNS Rebinding by connecting directly to the validated IP
    const targetUrl = new URL(url)
    targetUrl.hostname = safeAddress.includes(':') ? `[${safeAddress}]` : safeAddress;

    // Use http if connecting directly to an IP to avoid SNI/certificate mismatches
    // while keeping the original Host header intact for virtual hosting
    targetUrl.protocol = 'http:';

    const res = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 AyuraIntelligence/1.0',
        'Host': parsed.hostname
      },
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
