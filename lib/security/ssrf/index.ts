import * as dns from 'dns'
import { URL } from 'url'
import { promisify } from 'util'

const lookup = promisify(dns.lookup)

export function isPrivateIP(ip: string): boolean {
  // IPv4 mapping check
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7)
  }

  const ipv4Match = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4Match) {
    const parts = ipv4Match.slice(1).map(Number)

    // Check 0.0.0.0
    if (parts[0] === 0) return true

    // Check loopback (127.0.0.0/8)
    if (parts[0] === 127) return true

    // Check private ranges (RFC 1918)
    if (parts[0] === 10) return true
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true
    if (parts[0] === 192 && parts[1] === 168) return true

    // Check link-local (169.254.0.0/16)
    if (parts[0] === 169 && parts[1] === 254) return true

    return false
  }

  // Basic IPv6 private checks
  if (ip === '::1' || ip === '::') return true
  const lowerIp = ip.toLowerCase()
  if (lowerIp.startsWith('fc') || lowerIp.startsWith('fd')) return true
  if (lowerIp.startsWith('fe8') || lowerIp.startsWith('fe9') || lowerIp.startsWith('fea') || lowerIp.startsWith('feb')) return true

  return false
}

export async function fetchWithSSRFProtection(
  urlStr: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = new URL(urlStr)
  const hostname = url.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1')

  const resolved = await lookup(hostname)
  if (!resolved || !resolved.address) {
    throw new Error('Could not resolve hostname')
  }

  if (isPrivateIP(resolved.address)) {
    throw new Error('Access to private IPs is blocked')
  }

  // Ensure only HTTP(S) is allowed
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Invalid protocol')
  }

  // Using native fetch after checking IP
  // This is a tradeoff: we protect against basic SSRF (hostname resolving to private IP)
  // but remain slightly vulnerable to DNS rebinding attacks (TOCTOU)
  // Implementing a fully SNI-preserving custom fetch client is complex and error-prone for Next.js environments
  return fetch(urlStr, options)
}
