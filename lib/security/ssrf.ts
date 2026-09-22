import dns from 'dns';
import { promisify } from 'util';
import https from 'https';
import http from 'http';

const lookup = promisify(dns.lookup);

function isPrivateIP(ip: string): boolean {
  if (ip.startsWith('::ffff:')) ip = ip.slice(7);
  const p = ip.split('.').map(Number);
  if (p.length === 4) {
    return p[0] === 10 || p[0] === 127 || p[0] === 0 || (p[0] === 169 && p[1] === 254) ||
           (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168);
  }
  return ip === '::1' || ip.toLowerCase().startsWith('fc') || ip.toLowerCase().startsWith('fd') || ip.toLowerCase().startsWith('fe8');
}

export async function fetchWithSSRFProtection(urlStr: string, options: { headers?: Record<string, string>, signal?: AbortSignal } = {}, hops = 0): Promise<{ok: boolean, text: () => Promise<string>}> {
  if (hops > 3) throw new Error('Too many redirects');
  const u = new URL(urlStr);
  const hostname = u.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');
  const { address } = await lookup(hostname);
  if (isPrivateIP(address)) throw new Error('Blocked private IP');

  return new Promise((resolve, reject) => {
    const req = (u.protocol === 'https:' ? https : http).request({
      hostname: address,
      port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname + u.search,
      headers: { ...options.headers, Host: hostname },
      servername: u.protocol === 'https:' ? hostname : undefined,
      signal: options.signal,
      timeout: 8000
    }, (res) => {
      if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        return resolve(fetchWithSSRFProtection(new URL(res.headers.location, urlStr).toString(), options, hops + 1));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({
        ok: res.statusCode! >= 200 && res.statusCode! < 300,
        text: async () => body
      }));
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('Timeout')));
    req.end();
  });
}
