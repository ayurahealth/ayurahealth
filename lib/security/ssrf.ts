import dns from 'dns';
import http from 'http';
import https from 'https';

/**
 * Validates a URL against SSRF attacks.
 * Resolves the hostname and checks if it points to a private/local IP.
 */
function isPrivateIP(ip: string): boolean {
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  const ipv4Private = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.|169\.254\.|100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\.|0\.)/;
  const ipv6Private = /^(fc00:|fd00:|fe80:|::1$|::$)/i;

  return ipv4Private.test(ip) || ipv6Private.test(ip);
}

export async function fetchWithSSRFProtection(urlStr: string, options: RequestInit = {}, maxRedirects: number = 3): Promise<Response> {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(urlStr);

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return reject(new Error('Invalid protocol. Only HTTP and HTTPS are allowed.'));
      }

      const cleanHostname = parsedUrl.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1');

      dns.lookup(cleanHostname, (err, address) => {
        if (err) {
          return reject(new Error(`DNS resolution failed for hostname: ${cleanHostname}`));
        }

        if (isPrivateIP(address)) {
          return reject(new Error('Access to private or local IP is denied.'));
        }

        const client = parsedUrl.protocol === 'https:' ? https : http;

        // Use an abort controller to enforce an absolute timeout
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => {
          abortController.abort(new Error('Request timed out (absolute timeout)'));
        }, 8000);

        // Allow options to provide an abort signal, but wrap it
        if (options.signal) {
          options.signal.addEventListener('abort', () => {
             abortController.abort(options.signal?.reason);
          });
        }

        const requestOptions = {
          hostname: address,
          port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
          path: parsedUrl.pathname + parsedUrl.search,
          method: options.method || 'GET',
          headers: {
             ...options.headers,
             'Host': parsedUrl.hostname
          } as http.OutgoingHttpHeaders,
          servername: parsedUrl.hostname,
          signal: abortController.signal,
        };

        const req = client.request(requestOptions, (res) => {
          // Handle redirects
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
             clearTimeout(timeoutId);

             if (maxRedirects <= 0) {
                 return reject(new Error('Maximum redirects exceeded'));
             }

             try {
                const redirectUrl = new URL(res.headers.location, urlStr);
                return resolve(fetchWithSSRFProtection(redirectUrl.toString(), options, maxRedirects - 1));
             } catch {
                return reject(new Error('Invalid redirect URL'));
             }
          }

          let data = '';
          let dataSize = 0;
          const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit

          res.on('data', (chunk) => {
             dataSize += chunk.length;
             if (dataSize > MAX_SIZE) {
                 res.destroy(new Error('Response size limit exceeded'));
                 return;
             }
             data += chunk;
          });

          res.on('end', () => {
             clearTimeout(timeoutId);

             // Convert headers safely
             const safeHeaders = new Headers();
             for (const [key, value] of Object.entries(res.headers)) {
                 if (Array.isArray(value)) {
                     value.forEach(v => safeHeaders.append(key, v));
                 } else if (value) {
                     safeHeaders.set(key, value);
                 }
             }

             const response = new Response(data, {
                status: res.statusCode || 200,
                statusText: res.statusMessage || 'OK',
                headers: safeHeaders
             });

             // Mock methods
             response.text = async () => data;
             response.json = async () => JSON.parse(data);
             // ArrayBuffer is technically needed for a full mock, but text/json is enough for fetch-link
             response.arrayBuffer = async () => new TextEncoder().encode(data).buffer as ArrayBuffer;

             // Make sure response.ok reflects statusCode
             Object.defineProperty(response, 'ok', {
                get: () => res.statusCode ? res.statusCode >= 200 && res.statusCode < 300 : false
             });

             resolve(response);
          });
        });

        req.on('error', (e) => {
           clearTimeout(timeoutId);
           reject(e);
        });

        if (options.body) {
           req.write(options.body as string);
        }

        req.end();
      });

    } catch {
      reject(new Error('Invalid URL'));
    }
  });
}
