import dns from 'node:dns/promises';
import type { LookupAddress } from 'node:dns';
import http from 'http';
import https from 'https';

export class SSRFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SSRFError';
  }
}

// Convert IPv4-mapped IPv6 addresses to normal IPv4
function normalizeIP(ip: string): string {
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }
  return ip;
}

// Check if an IP address is in a private or reserved range
function isPrivateIP(ip: string): boolean {
  const normalizedIP = normalizeIP(ip);

  // Basic check for IPv4 private ranges
  // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16, 0.0.0.0/8
  const ipv4Match = normalizedIP.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipv4Match) {
    const parts = ipv4Match.slice(1).map(Number);
    if (
      parts[0] === 10 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      parts[0] === 127 ||
      parts[0] === 0 ||
      (parts[0] === 169 && parts[1] === 254)
    ) {
      return true;
    }
  }

  // Basic check for IPv6 loopback/private
  if (
    normalizedIP === '::1' ||
    normalizedIP === '::' ||
    normalizedIP.toLowerCase().startsWith('fc') ||
    normalizedIP.toLowerCase().startsWith('fd') ||
    normalizedIP.toLowerCase().startsWith('fe8') ||
    normalizedIP.toLowerCase().startsWith('fe9') ||
    normalizedIP.toLowerCase().startsWith('fea') ||
    normalizedIP.toLowerCase().startsWith('feb')
  ) {
    return true;
  }

  return false;
}

async function requestWithRedirects(
  urlStr: string,
  options: { timeout: number; maxRedirects: number; headers: Record<string, string> },
  redirectCount = 0
): Promise<{ ok: boolean; status: number; text: () => Promise<string> }> {
  if (redirectCount > options.maxRedirects) {
    throw new SSRFError('Too many redirects');
  }

  const parsedUrl = new URL(urlStr);

  // Only allow HTTP/HTTPS
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new SSRFError(`Unsupported protocol: ${parsedUrl.protocol}`);
  }

  // Sanitize hostname to prevent regex bypasses
  const hostname = parsedUrl.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');

  // Resolve DNS
  let addresses: LookupAddress[];
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch (err: unknown) {
    throw new SSRFError(`DNS lookup failed: ${(err as Error).message}`);
  }

  if (!addresses || addresses.length === 0) {
    throw new SSRFError('No DNS records found');
  }

  // Check all resolved IPs against private ranges
  for (const record of addresses) {
    if (isPrivateIP(record.address)) {
      throw new SSRFError(`Resolved to forbidden IP: ${record.address}`);
    }
  }

  // Use the first resolved IP for the connection
  const targetIP = addresses[0].address;
  const isHttps = parsedUrl.protocol === 'https:';
  const client = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const req = client.request(
      {
        hostname: targetIP,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          ...options.headers,
          'Host': parsedUrl.host, // Preserve original Host header
        },
        timeout: options.timeout,
        // Preserve SNI for HTTPS
        ...(isHttps && { servername: hostname }),
      },
      (res) => {
        // Handle redirects
        if (
          (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303 || res.statusCode === 307 || res.statusCode === 308) &&
          res.headers.location
        ) {
          const redirectUrl = new URL(res.headers.location, urlStr).toString();
          resolve(requestWithRedirects(redirectUrl, options, redirectCount + 1));
          return;
        }

        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({
            ok: (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) || false,
            status: res.statusCode || 500,
            text: () => Promise.resolve(body),
          });
        });
      }
    );

    req.on('error', (err) => {
      reject(new SSRFError(`Request failed: ${err.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new SSRFError('Request timed out'));
    });

    req.end();
  });
}

export async function fetchWithSSRFProtection(
  urlStr: string,
  options: { timeout?: number; maxRedirects?: number; headers?: Record<string, string> } = {}
): Promise<{ ok: boolean; status: number; text: () => Promise<string> }> {
  return requestWithRedirects(urlStr, {
    timeout: options.timeout || 8000,
    maxRedirects: options.maxRedirects || 3,
    headers: options.headers || {},
  });
}
