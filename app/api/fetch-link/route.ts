import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns'
import { promisify } from 'util'
import http from 'http'
import https from 'https'

const lookupAsync = promisify(dns.lookup)

function isPrivateIP(ip: string): boolean {
  if (ip.startsWith('::ffff:')) ip = ip.substring(7)
  if (ip === '::1' || ip.toLowerCase().startsWith('fd')) return true
  const p = ip.split('.')
  if (p.length !== 4) return false
  return p[0] === '10' || p[0] === '127' || p[0] === '0' ||
         (p[0] === '172' && parseInt(p[1]) >= 16 && parseInt(p[1]) <= 31) ||
         (p[0] === '192' && p[1] === '168') ||
         (p[0] === '169' && p[1] === '254')
}

// 🛡️ SECURITY: Prevent SSRF & DNS Rebinding by connecting to resolved IP
async function safeFetch(urlStr: string, hops = 0): Promise<string> {
  if (hops > 3) throw new Error('Too many redirects')
  const u = new URL(urlStr)
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('Invalid protocol')

  const hostname = u.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1')
  const { address } = await lookupAsync(hostname)
  if (isPrivateIP(address)) throw new Error('SSRF blocked')

  return new Promise((resolve, reject) => {
    const isHttps = u.protocol === 'https:'
    const req = (isHttps ? https : http).request({
      hostname: address,
      port: u.port || (isHttps ? 443 : 80),
      path: u.pathname + u.search,
      method: 'GET',
      headers: { Host: u.hostname, 'User-Agent': 'Mozilla/5.0 AyuraIntelligence/1.0' },
      servername: isHttps ? u.hostname : undefined,
      timeout: 8000
    }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode || 200) && res.headers.location) {
        resolve(safeFetch(new URL(res.headers.location, urlStr).toString(), hops + 1))
        return
      }
      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error('Could not fetch URL'))
        return
      }
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => resolve(body))
    })
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
    req.on('error', reject)
    req.end()
  })
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

    const html = await safeFetch(url)

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
