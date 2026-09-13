import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns/promises'
import http from 'http'
import https from 'https'

function isPrivateIP(ip: string) {
  // Security fix: SSRF prevention - Check if IP is in private ranges
  if (ip.startsWith('::ffff:')) ip = ip.substring(7)
  if (ip === '::1' || ip.startsWith('127.')) return true
  const parts = ip.split('.').map(Number)
  if (parts.length === 4) {
    const [a, b] = parts
    return a === 10 || a === 0 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254)
  }
  return /^(fc|fd|fe80)/i.test(ip)
}

function fetchSafe(url: string, signal: AbortSignal): Promise<{ status: number, headers: http.IncomingHttpHeaders, text: () => Promise<string> }> {
  return new Promise(async (resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Invalid protocol');

      const isHttps = parsedUrl.protocol === 'https:';
      const cleanHostname = parsedUrl.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');
      const { address } = await dns.lookup(cleanHostname);
      if (isPrivateIP(address)) throw new Error('SSRF blocked');

      const options = {
        hostname: address,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'Host': parsedUrl.host,
          'User-Agent': 'Mozilla/5.0 AyuraIntelligence/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        servername: parsedUrl.hostname, // Crucial for HTTPS SNI and cert validation
        signal
      };

      const req = (isHttps ? https : http).request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            status: res.statusCode || 500,
            headers: res.headers,
            text: async () => data
          });
        });
      });

      req.on('error', reject);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

    let currentUrl = url;
    let res: { status: number, headers: http.IncomingHttpHeaders, text: () => Promise<string> } | null = null;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      for (let i = 0; i < 3; i++) {
        res = await fetchSafe(currentUrl, controller.signal);

        if (res.status >= 300 && res.status < 400 && res.headers.location) {
          currentUrl = new URL(res.headers.location, currentUrl).toString();
          continue;
        }
        break;
      }
    } finally {
      clearTimeout(timeoutId);
    }

    if (!res || res.status >= 400) return NextResponse.json({ error: 'Could not fetch URL' }, { status: 400 })

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
