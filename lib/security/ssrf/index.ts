import dns from 'dns';
import { promisify } from 'util';
import http from 'http';
import https from 'https';
import { URL } from 'url';

const lookupAsync = promisify(dns.lookup);

function isPrivateIP(ip: string): boolean {
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  if (ip === '::' || ip === '0.0.0.0') {
      return true;
  }

  const parts = ip.split('.');
  if (parts.length === 4) {
    const num1 = parseInt(parts[0], 10);
    const num2 = parseInt(parts[1], 10);

    return (
      num1 === 10 ||
      (num1 === 172 && num2 >= 16 && num2 <= 31) ||
      (num1 === 192 && num2 === 168) ||
      num1 === 127 ||
      num1 === 0 ||
      num1 === 169
    );
  }

  const lowerIp = ip.toLowerCase();

  return (
      lowerIp.startsWith('fc') ||
      lowerIp.startsWith('fd') ||
      lowerIp.startsWith('fe8') ||
      lowerIp.startsWith('fe9') ||
      lowerIp.startsWith('fea') ||
      lowerIp.startsWith('feb') ||
      lowerIp === '::1'
  );
}

export async function fetchWithSSRFProtection(
  url: string,
  options: RequestInit = {},
  redirectCount = 0
): Promise<Response> {
  if (redirectCount > 3) {
    throw new Error('Too many redirects');
  }

  const parsedUrl = new URL(url);

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Unsupported protocol');
  }

  const hostname = parsedUrl.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');
  let ipAddress: string;

  try {
    const lookupResult = await lookupAsync(hostname);
    ipAddress = lookupResult.address;
  } catch (error) {
    throw new Error('DNS resolution failed');
  }

  if (isPrivateIP(ipAddress)) {
    throw new Error('Access to private IP is not allowed');
  }

  const port = parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80);

  return new Promise((resolve, reject) => {
    const requestModule = parsedUrl.protocol === 'https:' ? https : http;
    const requestOptions = {
      method: options.method || 'GET',
      hostname: ipAddress,
      port: Number(port),
      path: parsedUrl.pathname + parsedUrl.search,
      ...(parsedUrl.protocol === 'https:' ? { servername: hostname } : {}),
      headers: {
        ...options.headers,
        Host: hostname,
      }
    };

    const req = requestModule.request(requestOptions as https.RequestOptions, (res) => {
      // Handle redirects up to 3 hops
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).toString();
        }
        resolve(fetchWithSSRFProtection(redirectUrl, options, redirectCount + 1));
        return;
      }

      // Format Node.js IncomingHttpHeaders for the standard Response API
      const safeHeaders = new Headers();
      for (const [key, value] of Object.entries(res.headers)) {
        if (Array.isArray(value)) {
            for (const v of value) {
                safeHeaders.append(key, v);
            }
        } else if (value !== undefined) {
            safeHeaders.set(key, value);
        }
      }

      // Stream the response to avoid buffering entirely in memory
      const readable = new ReadableStream({
        start(controller) {
          res.on('data', (chunk) => controller.enqueue(chunk));
          res.on('end', () => controller.close());
          res.on('error', (err) => controller.error(err));
        },
        cancel() {
          res.destroy();
        }
      });

      resolve(new Response(readable, {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: safeHeaders,
      }));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    // Default timeout to prevent DoS via hung connections
    req.setTimeout(8000);

    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        req.destroy();
        reject(new Error('AbortError'));
      });
    }

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}
