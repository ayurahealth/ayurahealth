import * as http from 'http';
import * as https from 'https';
import * as dns from 'dns';
import { promisify } from 'util';

const lookupAsync = promisify(dns.lookup);

function isPrivateIP(ip: string): boolean {
  // Normalize IPv4-mapped IPv6 to IPv4
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  if (ip === '0.0.0.0') return true;

  // IPv4 Private blocks and Carrier-Grade NAT (100.64.0.0/10)
  if (/^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|169\.254\.|100\.(6[4-9]|[7-9][0-9]|1[01][0-9]|12[0-7])\.)/.test(ip)) {
    return true;
  }
  // IPv6 Private blocks
  if (/^(::1|fe80:|fc00:|fd00:)/i.test(ip)) {
    return true;
  }
  return false;
}

export async function fetchWithSSRFProtection(
  urlStr: string,
  options: RequestInit & { timeoutMs?: number } = {},
  redirectCount = 0
): Promise<Response> {
  const MAX_REDIRECTS = 3;
  if (redirectCount > MAX_REDIRECTS) {
    throw new Error('Too many redirects');
  }

  const parsedUrl = new URL(urlStr);
  const protocol = parsedUrl.protocol;
  if (protocol !== 'http:' && protocol !== 'https:') {
    throw new Error('Unsupported protocol');
  }

  const sanitizedHostname = parsedUrl.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');

  let addresses;
  try {
    addresses = await lookupAsync(sanitizedHostname, { all: true });
  } catch {
    throw new Error(`DNS lookup failed for ${sanitizedHostname}`);
  }

  if (!addresses || addresses.length === 0) {
    throw new Error(`No IP found for ${sanitizedHostname}`);
  }

  const resolvedIp = addresses[0].address;
  if (isPrivateIP(resolvedIp)) {
    throw new Error(`SSRF Prevention: Cannot access private IP ${resolvedIp}`);
  }

  return new Promise((resolve, reject) => {
    const isHttps = protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions: http.RequestOptions | https.RequestOptions = {
      protocol: parsedUrl.protocol,
      hostname: resolvedIp,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        ...(options.headers as Record<string, string> || {}),
        'Host': parsedUrl.host,
      } as http.OutgoingHttpHeaders,
    };

    if (isHttps) {
      (requestOptions as https.RequestOptions).servername = sanitizedHostname;
    }

    const req = client.request(requestOptions, (res: http.IncomingMessage) => {
      // Handle redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const baseUrl = new URL(urlStr);
          redirectUrl = new URL(redirectUrl, baseUrl).toString();
        }
        resolve(fetchWithSSRFProtection(redirectUrl, options, redirectCount + 1));
        return;
      }

      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const bodyBuffer = Buffer.concat(chunks);
        const headers = new Headers();
        for (const [key, value] of Object.entries(res.headers)) {
          if (Array.isArray(value)) {
             value.forEach(v => headers.append(key, v));
          } else if (value) {
             headers.set(key, value);
          }
        }

        const response = new Response(bodyBuffer, {
          status: res.statusCode || 200,
          statusText: res.statusMessage || '',
          headers: headers
        });

        resolve(response);
      });
    });

    req.on('error', (err) => reject(err));

    const timeoutMs = options.timeoutMs || 8000;
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (options.body) {
      req.write(options.body as string);
    }
    req.end();
  });
}
