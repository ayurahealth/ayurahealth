import dns from 'dns';
import { promisify } from 'util';
import http from 'http';
import https from 'https';

const resolveDns = promisify(dns.lookup);

export async function fetchWithSSRFProtection(url: string, init?: RequestInit, redirectCount = 0): Promise<Response> {
  if (redirectCount > 3) throw new Error('Too many redirects');

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Invalid URL');
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Invalid protocol');
  }

  const hostname = parsedUrl.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');

  let address: string;
  try {
    const lookupResult = await resolveDns(hostname);
    address = lookupResult.address;
  } catch {
    throw new Error(`DNS lookup failed for hostname: ${hostname}`);
  }

  if (isPrivateIP(address)) {
    throw new Error('Access to private IP is not allowed');
  }

  return new Promise((resolve, reject) => {
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    // Process headers safely if a Headers object is passed
    const headersObj: Record<string, string> = {};
    if (init?.headers) {
      if (init.headers instanceof Headers) {
        init.headers.forEach((val, key) => headersObj[key] = val);
      } else {
        Object.assign(headersObj, init.headers);
      }
    }
    headersObj.Host = parsedUrl.host;

    const requestOptions = {
      method: init?.method || 'GET',
      hostname: address,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      headers: headersObj,
      servername: parsedUrl.hostname, // SNI
      timeout: 8000,
    };

    const req = protocol.request(requestOptions, (res) => {
      // Handle redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        req.destroy();
        const newUrl = new URL(res.headers.location, url).toString();
        resolve(fetchWithSSRFProtection(newUrl, init, redirectCount + 1));
        return;
      }

      // Memory limit (3MB) for DoS protection
      const MAX_SIZE = 3 * 1024 * 1024;
      let totalSize = 0;
      const chunks: Buffer[] = [];

      res.on('data', (chunk) => {
        totalSize += chunk.length;
        if (totalSize > MAX_SIZE) {
          req.destroy();
          reject(new Error('Response too large'));
        } else {
          chunks.push(chunk);
        }
      });

      res.on('end', () => {
        const bodyBuffer = Buffer.concat(chunks);
        const responseHeaders = new Headers();
        for (const [key, value] of Object.entries(res.headers)) {
            if (Array.isArray(value)) {
                value.forEach(v => responseHeaders.append(key, v));
            } else if (value) {
                responseHeaders.set(key, value);
            }
        }

        resolve({
          ok: res.statusCode ? res.statusCode >= 200 && res.statusCode < 300 : false,
          status: res.statusCode || 200,
          statusText: res.statusMessage || '',
          headers: responseHeaders,
          text: async () => bodyBuffer.toString('utf-8'),
          json: async () => JSON.parse(bodyBuffer.toString('utf-8')),
        } as unknown as Response);
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (init?.signal) {
      if (init.signal.aborted) {
        req.destroy();
        return reject(new Error('AbortError'));
      }
      init.signal.addEventListener('abort', () => {
        req.destroy();
        reject(new Error('AbortError'));
      });
    }

    if (init?.body) {
      req.write(init.body as string | Buffer);
    }
    req.end();
  });
}

function isPrivateIP(ip: string): boolean {
  if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');
  const parts = ip.split('.').map(p => parseInt(p, 10));
  if (parts.length === 4) {
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 127) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 0) return true;
  }
  if (ip === '::1' || ip === '::') return true;
  if (ip.toLowerCase().startsWith('fc') || ip.toLowerCase().startsWith('fd')) return true;
  if (ip.toLowerCase().startsWith('fe8') || ip.toLowerCase().startsWith('fe9') || ip.toLowerCase().startsWith('fea') || ip.toLowerCase().startsWith('feb')) return true;
  return false;
}
