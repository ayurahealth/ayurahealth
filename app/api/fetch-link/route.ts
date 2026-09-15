import { IncomingMessage } from 'http';
import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

function isPrivateIP(ip: string): boolean {
  // Map IPv4-mapped IPv6 to IPv4
  const mappedIpv4Match = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mappedIpv4Match) {
    ip = mappedIpv4Match[1];
  }

  const parts = ip.split('.');
  if (parts.length === 4) {
    const num = (parseInt(parts[0], 10) << 24) |
                (parseInt(parts[1], 10) << 16) |
                (parseInt(parts[2], 10) << 8) |
                parseInt(parts[3], 10);
    // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16
    return (num >>> 24) === 10 ||
           (num >>> 20) === 172 * 16 + 1 ||
           (num >>> 16) === 192 * 256 + 168 ||
           (num >>> 24) === 127 ||
           (num >>> 16) === 169 * 256 + 254;
  }

  if (ip === '::1') return true;

  let expanded = ip;
  if (ip.includes('::')) {
     const split = ip.split('::');
     const left = split[0] ? split[0].split(':') : [];
     const right = split[1] ? split[1].split(':') : [];
     const missing = 8 - (left.length + right.length);
     expanded = [...left, ...Array(missing).fill('0'), ...right].join(':');
  }
  const partsV6 = expanded.split(':').map(p => parseInt(p || '0', 16));

  // Unique Local Addresses (fc00::/7)
  if ((partsV6[0] & 0xfe00) === 0xfc00) return true;

  // Link-Local Addresses (fe80::/10)
  if ((partsV6[0] & 0xffc0) === 0xfe80) return true;

  return false;
}

async function safeFetchWithNative(urlStr: string, maxRedirects = 3): Promise<string> {
    let currentUrl = urlStr;
    let attempts = 0;

    while(attempts < maxRedirects) {
        attempts++;
        const parsedUrl = new URL(currentUrl);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            throw new Error('Invalid protocol');
        }

        const hostname = parsedUrl.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');
        const { address } = await lookup(hostname);

        if (isPrivateIP(address)) {
            throw new Error('Access to private IP is forbidden');
        }

        const isHttps = parsedUrl.protocol === 'https:';
        // Need to dynamic import http/https to work properly in edge/server runtimes where applicable,
        // but NextJS App Router Server functions support node APIs natively.
        const client = isHttps ? await import('https') : await import('http');

        const options = {
            hostname: address,
            port: parsedUrl.port || (isHttps ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            headers: {
                'Host': parsedUrl.hostname,
                'User-Agent': 'Mozilla/5.0 AyuraIntelligence/1.0'
            },
            servername: parsedUrl.hostname, // Required for TLS SNI
            timeout: 5000
        };

        const result: { redirect?: string, data?: string } = await new Promise((resolve, reject) => {
            const req = client.request(options, (res: IncomingMessage) => {
                if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    const nextUrl = new URL(res.headers.location, currentUrl).toString();
                    resolve({ redirect: nextUrl });
                    return;
                }

                if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
                    reject(new Error(`Could not fetch URL, status: ${res.statusCode}`));
                    return;
                }

                let data = '';
                res.on('data', (chunk: Buffer) => data += chunk);
                res.on('end', () => resolve({ data }));
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timed out'));
            });
            req.end();
        });

        if (result.redirect) {
            currentUrl = result.redirect;
            continue;
        }

        return result.data || '';
    }

    throw new Error('Too many redirects');
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

    const html = await safeFetchWithNative(url);

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
