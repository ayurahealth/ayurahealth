import dns from 'dns';
import { promisify } from 'util';
import http from 'http';
import https from 'https';

const lookup = promisify(dns.lookup);

function isPrivateIP(ip: string): boolean {
  if (ip === '0.0.0.0' || ip === '::') return true;

  const parts = ip.split('.').map(Number);
  if (parts.length === 4) { // IPv4
    return (
      parts[0] === 10 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      parts[0] === 127 ||
      (parts[0] === 169 && parts[1] === 254) // Link-local
    );
  }

  if (ip.includes(':')) {
    // Map IPv4-mapped IPv6 to IPv4 for checking
    if (ip.toLowerCase().startsWith('::ffff:')) {
      const ipv4Part = ip.slice(7);
      if (ipv4Part.includes('.')) {
        return isPrivateIP(ipv4Part);
      }
    }

    return (
      ip === '::1' ||
      ip.startsWith('fc00:') ||
      ip.startsWith('fd00:') ||
      ip.startsWith('fe80:')
    );
  }

  return false;
}

export async function fetchWithSSRFProtection(
  urlStr: string,
  options: RequestInit = {},
  redirectCount = 0
): Promise<Response> {
  if (redirectCount > 3) {
    throw new Error('Too many redirects');
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlStr);
  } catch {
    throw new Error('Invalid URL');
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Invalid protocol');
  }

  const hostname = parsedUrl.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');

  let address: string;
  let family: number;
  try {
    const lookupResult = await lookup(hostname);
    address = lookupResult.address;
    family = lookupResult.family;
  } catch {
    throw new Error('DNS lookup failed');
  }

  if (isPrivateIP(address)) {
    throw new Error('Access to private network not allowed');
  }

  return new Promise((resolve, reject) => {
    const isHttps = parsedUrl.protocol === 'https:';
    const requestModule = isHttps ? https : http;

    const requestOptions: http.RequestOptions | https.RequestOptions = {
      method: options.method || 'GET',
      path: parsedUrl.pathname + parsedUrl.search,
      headers: (options.headers as http.OutgoingHttpHeaders) || {},
      lookup: (h, reqOpts, callback) => {
        // Prevent TOCTOU by strictly forcing the resolved IP
        callback(null, address, family);
      },
      // Important for SNI when forcing IP
      servername: isHttps ? hostname : undefined,
    };

    // Ensure Host header matches original hostname
    if (!requestOptions.headers) requestOptions.headers = {};
    const h = requestOptions.headers as http.OutgoingHttpHeaders; if (!h.Host && !h.host) {
      h.Host = parsedUrl.host;
    }

    const req = requestModule.request(
      isHttps ? `https://${address}${parsedUrl.port ? ':' + parsedUrl.port : ''}${requestOptions.path}` : `http://${address}${parsedUrl.port ? ':' + parsedUrl.port : ''}${requestOptions.path}`,
      requestOptions,
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Manual redirect handling
          let redirectUrl: string;
          try {
             redirectUrl = new URL(res.headers.location, urlStr).toString();
          } catch {
             reject(new Error('Invalid redirect URL'));
             return;
          }
          resolve(fetchWithSSRFProtection(redirectUrl, options, redirectCount + 1));
          return;
        }

        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const body = Buffer.concat(chunks);

          const headers = new Headers();
          for (const [key, value] of Object.entries(res.headers)) {
            if (Array.isArray(value)) {
              value.forEach(v => headers.append(key, v));
            } else if (value) {
              headers.append(key, value);
            }
          }

          resolve(new Response(body, {
            status: res.statusCode,
            statusText: res.statusMessage,
            headers
          }));
        });
      });

    req.on('error', reject);

    // Add timeout protection
    req.setTimeout(8000, () => {
        req.destroy(new Error('Request timeout'));
    });

    if (options.body) {
      if (typeof options.body === 'string' || options.body instanceof Buffer) {
        req.write(options.body);
      }
    }
    req.end();
  });
}
