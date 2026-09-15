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
  if (ip.toLowerCase().startsWith('fc00:') || ip.toLowerCase().startsWith('fd00:')) return true;
  if (ip.toLowerCase().startsWith('fe80:')) return true;

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 });
    }

    const hostname = parsedUrl.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');
    const { address } = await lookup(hostname);

    if (isPrivateIP(address)) {
      return NextResponse.json({ error: 'Access to private IP is forbidden' }, { status: 400 });
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
