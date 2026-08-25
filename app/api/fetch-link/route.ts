import { NextRequest, NextResponse } from 'next/server'

function isAllowedUrl(urlString: string): boolean {
  try {
    const parsedUrl = new URL(urlString);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') return false;
    const cleanHostname = parsedUrl.hostname.replace(/^\[|\]$/g, '');
    if (
      cleanHostname === 'localhost' ||
      cleanHostname.endsWith('.local') ||
      cleanHostname.endsWith('.internal') ||
      /^127\.\d+\.\d+\.\d+$/.test(cleanHostname) || // 127.0.0.0/8
      /^10\.\d+\.\d+\.\d+$/.test(cleanHostname) ||  // 10.0.0.0/8
      /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(cleanHostname) || // 172.16.0.0/12
      /^192\.168\.\d+\.\d+$/.test(cleanHostname) || // 192.168.0.0/16
      /^169\.254\.\d+\.\d+$/.test(cleanHostname) || // 169.254.0.0/16
      /^0\.\d+\.\d+\.\d+$/.test(cleanHostname) ||   // 0.0.0.0/8
      cleanHostname === '::1' ||                    // IPv6 loopback
      /^fd[0-9a-f]{2}:/i.test(cleanHostname) ||     // IPv6 Unique Local Address
      /^fe80:/i.test(cleanHostname)                 // IPv6 Link Local
    ) return false;
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    if (!isAllowedUrl(url)) return NextResponse.json({ error: 'URL not allowed' }, { status: 403 })

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
