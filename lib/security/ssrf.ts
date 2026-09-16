import dns from 'dns';
import { promisify } from 'util';
import http from 'http';
import https from 'https';

const lookupAsync = promisify(dns.lookup);

export async function isPrivateIP(ip: string): Promise<boolean> {
  if (ip.startsWith('::ffff:')) ip = ip.substring(7);
  if (ip === '::1' || ip === '::') return true;
  if (ip.toLowerCase().startsWith('fe80:') || ip.toLowerCase().startsWith('fc00:') || ip.toLowerCase().startsWith('fd00:')) return true;

  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  const num = parts.map(p => parseInt(p, 10));

  if (num[0] === 10 || num[0] === 127 || num[0] === 0) return true;
  if (num[0] === 172 && num[1] >= 16 && num[1] <= 31) return true;
  if (num[0] === 192 && num[1] === 168) return true;
  if (num[0] === 169 && num[1] === 254) return true;
  return false;
}

export interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | Buffer;
}

export async function fetchWithSSRFProtection(targetUrl: string, options: FetchOptions = {}, redirectCount = 0): Promise<{text: string, ok: boolean, status: number}> {
  if (redirectCount > 3) throw new Error('Too many redirects');

  const parsedUrl = new URL(targetUrl);
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') throw new Error('Invalid protocol.');
  const hostname = parsedUrl.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');

  const lookupResult = await lookupAsync(hostname);
  if (await isPrivateIP(lookupResult.address)) throw new Error('Access to private IP addresses is forbidden');

  return new Promise((resolve, reject) => {
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    const reqOptions: http.RequestOptions = {
      hostname: lookupResult.address,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: { 'Host': parsedUrl.hostname, ...options.headers },
      timeout: 8000,
      ...(parsedUrl.protocol === 'https:' ? { servername: parsedUrl.hostname } : {})
    };

    const req = protocol.request(reqOptions, async (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.destroy(); // Fix unconsumed stream memory leak
        const newUrl = new URL(res.headers.location, parsedUrl.href).href;
        try { resolve(await fetchWithSSRFProtection(newUrl, options, redirectCount + 1)); }
        catch (err) { reject(err); }
        return;
      }
      const ok = res.statusCode ? (res.statusCode >= 200 && res.statusCode < 300) : false;
      let data = '';
      res.on('data', chunk => {
        data += chunk;
        if (data.length > 5000000) { req.destroy(); reject(new Error('Response too large')); }
      });
      res.on('end', () => resolve({ text: data, ok, status: res.statusCode || 0 }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    if (options.body) req.write(options.body);
    req.end();
  });
}
