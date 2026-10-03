import dns from 'dns';
import http from 'http';
import https from 'https';
import { URL } from 'url';
import net from 'net';

export async function fetchWithSSRFProtection(urlStr: string, options: RequestInit = {}): Promise<Response> {
  const MAX_REDIRECTS = 3;

  async function performRequest(currentUrlStr: string, redirectsRemaining: number): Promise<Response> {
    if (redirectsRemaining < 0) {
      throw new Error('Too many redirects');
    }

    const parsedUrl = new URL(currentUrlStr);
    const hostname = parsedUrl.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');

    // Reject non-http(s) protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Unsupported protocol');
    }

    // Resolve IP address to check for private/loopback IPs
    let ip: string;
    try {
      ip = await new Promise<string>((resolve, reject) => {
        dns.lookup(hostname, (err, address) => {
          if (err) reject(err);
          else resolve(address);
        });
      });
    } catch {
      throw new Error(`DNS resolution failed for ${hostname}`);
    }

    // Check if IP is a private/loopback IP
    if (isPrivateIP(ip)) {
      throw new Error('SSRF attempt blocked: Private or loopback IP address detected');
    }

    return new Promise((resolve, reject) => {
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const reqOptions: http.RequestOptions | https.RequestOptions = {
        hostname: ip, // Connect to resolved IP to prevent DNS rebinding
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: options.method || 'GET',
        headers: {
          ...(options.headers as Record<string, string>),
          'Host': hostname, // Preserve original hostname in Host header
        } as http.OutgoingHttpHeaders,
      };

      if (parsedUrl.protocol === 'https:') {
        (reqOptions as https.RequestOptions).servername = hostname; // Preserve SNI
      }

      const req = client.request(reqOptions, (res) => {
        // Handle redirects
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, currentUrlStr).toString();
          res.destroy(); // Prevent socket leak
          resolve(performRequest(redirectUrl, redirectsRemaining - 1));
          return;
        }

        // Buffer response body (with size limit to prevent memory exhaustion)
        const MAX_BODY_SIZE = 5 * 1024 * 1024; // 5MB
        let bodyBuffer = Buffer.from([]);

        res.on('data', (chunk) => {
          if (bodyBuffer.length + chunk.length > MAX_BODY_SIZE) {
            req.destroy(new Error('Response body too large'));
            return;
          }
          bodyBuffer = Buffer.concat([bodyBuffer, chunk]);
        });

        res.on('end', () => {
          const headers = new Headers();
          for (const [key, value] of Object.entries(res.headers)) {
            if (Array.isArray(value)) {
              value.forEach(v => headers.append(key, v));
            } else if (value) {
              headers.append(key, value);
            }
          }

          resolve(new Response(bodyBuffer, {
            status: res.statusCode || 200,
            statusText: res.statusMessage || 'OK',
            headers: headers,
          }));
        });
      });

      req.on('error', (err) => reject(err));
      req.on('timeout', () => req.destroy(new Error('Request timeout')));

      req.setTimeout(options.signal instanceof AbortSignal ? 0 : 8000);

      if (options.signal) {
        options.signal.addEventListener('abort', () => {
          req.destroy(new Error('AbortError'));
        });
      }

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  }

  return performRequest(urlStr, MAX_REDIRECTS);
}

function isPrivateIP(ip: string): boolean {
  // Convert IPv4-mapped IPv6 addresses to IPv4
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  // IPv4 Private/Loopback/Link-local/etc.
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    return (
      parts[0] === 10 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      parts[0] === 127 || // Loopback
      parts[0] === 0 || // Current network
      parts[0] === 169 && parts[1] === 254 // Link-local
    );
  }

  // IPv6 Private/Loopback/etc.
  if (net.isIPv6(ip)) {
    return (
      ip === '::1' || // Loopback
      ip.toLowerCase().startsWith('fc') || // Unique Local Address (ULA)
      ip.toLowerCase().startsWith('fd') || // Unique Local Address (ULA)
      ip.toLowerCase().startsWith('fe80') // Link-local
    );
  }

  return true; // Unknown format, block it
}
