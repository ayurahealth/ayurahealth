import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

    // 🛡️ Sentinel: Mitigate SSRF by resolving DNS and manually following redirects
    let currentUrl = url;
    let res: Response | null = null;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const dns = await import('dns/promises');

    let html = '';
    try {
      for (let i = 0; i < 3; i++) {
        let parsedUrl: URL;
        try {
          parsedUrl = new URL(currentUrl);
        } catch {
          return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        const originalHost = parsedUrl.hostname;
        const host = originalHost.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');

        let address, family;
        try {
          const lookup = await dns.lookup(host);
          address = lookup.address;
          family = lookup.family;
        } catch {
          return NextResponse.json({ error: 'DNS resolution failed' }, { status: 400 });
        }

        let checkAddress = address;
        let checkFamily = family;
        if (family === 6 && address.startsWith('::ffff:')) {
          checkAddress = address.substring(7);
          checkFamily = 4;
        }

        let isPrivate = false;
        if (checkFamily === 4) {
          const parts = checkAddress.split('.').map(Number);
          isPrivate = parts[0] === 127 || parts[0] === 10 ||
            (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
            (parts[0] === 192 && parts[1] === 168) ||
            (parts[0] === 169 && parts[1] === 254) ||
            parts[0] === 0;
        } else if (checkFamily === 6) {
          isPrivate = checkAddress === '::1' || checkAddress === '::' ||
            checkAddress.startsWith('fe80:') || checkAddress.startsWith('fc00:') || checkAddress.startsWith('fd00:');
        }

        if (isPrivate) {
          return NextResponse.json({ error: 'Fetching private IP addresses is blocked' }, { status: 403 });
        }

        const fetchUrl = new URL(currentUrl);
        fetchUrl.hostname = checkFamily === 6 ? `[${address}]` : address;

        res = await fetch(fetchUrl.toString(), {
          headers: {
            'User-Agent': 'Mozilla/5.0 AyuraIntelligence/1.0',
            'Host': parsedUrl.host
          },
          signal: controller.signal,
          redirect: 'manual'
        });

        if (res.status >= 300 && res.status < 400 && res.headers.has('location')) {
          currentUrl = new URL(res.headers.get('location')!, currentUrl).toString();
          continue;
        }

        break;
      }

      if (!res || !res.ok) return NextResponse.json({ error: 'Could not fetch URL' }, { status: 400 })

      html = await res.text()
    } finally {
      clearTimeout(timeoutId);
    }

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
