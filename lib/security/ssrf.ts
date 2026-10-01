import dns from 'dns';
import { promisify } from 'util';
import http from 'http';
import https from 'https';
import { URL } from 'url';

const lookupAsync = promisify(dns.lookup);

/**
 * Validates if an IP address is a private or reserved IP.
 */
function isPrivateIP(ip: string): boolean {
  // Extract IPv4 from IPv4-mapped IPv6 if present (e.g. ::ffff:192.168.1.1)
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  // IPv4 Private Blocks
  if (
    ip.startsWith('127.') ||
    ip === '0.0.0.0' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.')
  ) {
    return true;
  }

  if (ip.startsWith('172.')) {
    const secondOctet = parseInt(ip.split('.')[1], 10);
    if (secondOctet >= 16 && secondOctet <= 31) return true;
  }

  if (ip.startsWith('169.254.')) return true;

  // IPv6 Loopback, Unique Local Addresses, Link Local Addresses
  if (
    ip === '::1' ||
    ip === '::' ||
    ip.toLowerCase().startsWith('fc') ||
    ip.toLowerCase().startsWith('fd') ||
    ip.toLowerCase().startsWith('fe80') ||
    ip.toLowerCase().startsWith('fec0') // deprecated site-local but safe to block
  ) {
    return true;
  }

  return false;
}

/**
 * Sanitizes hostname to prevent SSRF regex bypasses
 */
function sanitizeHostname(hostname: string): string {
  return hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');
}

/**
 * An SSRF-protected fetch implementation using native http/https modules
 * to prevent DNS rebinding and access to internal network resources.
 */
export async function fetchWithSSRFProtection(
  urlStr: string,
  options: RequestInit = {},
  redirectCount = 0
): Promise<Response> {
  if (redirectCount > 3) {
    throw new Error('Too many redirects');
  }

  const parsedUrl = new URL(urlStr);

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Unsupported protocol');
  }

  const hostname = sanitizeHostname(parsedUrl.hostname);

  // Resolve hostname
  const { address } = await lookupAsync(hostname);

  if (isPrivateIP(address)) {
    throw new Error('Access to private IP addresses is forbidden');
  }

  return new Promise((resolve, reject) => {
    const requestModule = parsedUrl.protocol === 'https:' ? https : http;

    const clonedHeaders = options.headers ? { ...(options.headers as http.OutgoingHttpHeaders) } : {};

    // Explicitly define https.RequestOptions (which extends http.RequestOptions) for proper typing
    const requestOptions: https.RequestOptions = {
      hostname: address,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: clonedHeaders,
      // IMPORTANT: Set original hostname for SNI and Host header
      servername: hostname, // SNI for https
    };

    // Override Host header to original hostname
    (requestOptions.headers as http.OutgoingHttpHeaders)['Host'] = hostname;

    // Add abort signal handling if provided
    if (options.signal) {
       requestOptions.signal = options.signal;
    }

    const req = requestModule.request(requestOptions, (res) => {
      // Handle redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
           redirectUrl = new URL(redirectUrl, urlStr).toString();
        }

        req.destroy();

        fetchWithSSRFProtection(redirectUrl, options, redirectCount + 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      // We implement a rudimentary Response mock to satisfy current API usages
      // (which expects .text(), .json(), .arrayBuffer(), and .ok)

      // Security: enforce byte limit to prevent DoS
      const MAX_BODY_SIZE = 10 * 1024 * 1024; // 10MB

      const readBody = async (): Promise<Buffer> => {
        return new Promise((resolveBody, rejectBody) => {
           const chunks: Buffer[] = [];
           let totalLength = 0;

           res.on('data', (chunk) => {
             totalLength += chunk.length;
             if (totalLength > MAX_BODY_SIZE) {
                res.destroy();
                rejectBody(new Error('Response body too large'));
                return;
             }
             chunks.push(chunk);
           });

           res.on('end', () => {
             resolveBody(Buffer.concat(chunks));
           });

           res.on('error', rejectBody);
        });
      };

      let bodyPromise: Promise<Buffer> | null = null;
      const getBody = () => {
         if (!bodyPromise) bodyPromise = readBody();
         return bodyPromise;
      };

      const responseMock = {
        ok: res.statusCode ? res.statusCode >= 200 && res.statusCode < 300 : false,
        status: res.statusCode || 200,
        statusText: res.statusMessage || '',
        headers: new Headers(res.headers as unknown as Record<string, string>),
        url: urlStr,
        text: async () => (await getBody()).toString('utf-8'),
        json: async () => JSON.parse((await getBody()).toString('utf-8')),
        arrayBuffer: async () => {
            const buf = await getBody();
            return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
        },
        // We aren't implementing the full ReadableStream for `.body` here, but
        // returning null satisfies basic checks if it isn't used explicitly.
        body: null as unknown as ReadableStream<Uint8Array>,
        blob: async () => { throw new Error("blob() not implemented in mock"); },
        formData: async () => { throw new Error("formData() not implemented in mock"); },
        clone: () => { throw new Error("clone() not implemented in mock"); }
      } as unknown as Response;

      resolve(responseMock);
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}
