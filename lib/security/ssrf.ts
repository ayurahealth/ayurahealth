import * as http from 'http'
import * as https from 'https'
import dns from 'dns'
import { promisify } from 'util'

const lookup = promisify(dns.lookup)

function isPrivateIP(ip: string): boolean {
  if (ip === '::1') return true
  const v4 = ip.startsWith('::ffff:') ? ip.slice(7) : ip
  if (v4.includes(':')) return v4.startsWith('fd') || v4.startsWith('fc') || v4.startsWith('fe80')
  const parts = v4.split('.').map(Number)
  return (
    parts[0] === 10 ||
    parts[0] === 127 ||
    parts[0] === 0 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    (parts[0] === 169 && parts[1] === 254)
  )
}

export interface FetchOptions {
  method?: string
  headers?: Record<string, string>
  body?: string | Buffer
  signal?: AbortSignal
}

export interface FetchResponse {
  ok: boolean
  status: number
  text: () => Promise<string>
  json: () => Promise<unknown>
  arrayBuffer: () => Promise<ArrayBuffer | SharedArrayBuffer>
  headers: { get: (name: string) => string | null }
  body: ReadableStream<Uint8Array> | null
}

const MAX_BODY_SIZE = 5 * 1024 * 1024 // 5 MB

export async function fetchWithSSRFProtection(
  urlStr: string,
  options: FetchOptions = {},
  redirectCount = 0
): Promise<FetchResponse> {
  if (redirectCount > 3) throw new Error('Too many redirects')
  const parsedUrl = new URL(urlStr)
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Invalid protocol')

  const hostname = parsedUrl.hostname.replace(/\.$/, '').replace(/^\[(.*)\]$/, '$1')
  const { address } = await lookup(hostname)
  if (isPrivateIP(address)) throw new Error('SSRF Blocked')

  return new Promise((resolve, reject) => {
    const isHttps = parsedUrl.protocol === 'https:'
    const h = { ...options.headers, Host: parsedUrl.host } as http.OutgoingHttpHeaders
    const reqOptions: http.RequestOptions | https.RequestOptions = {
      hostname: address,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: h,
    }
    if (isHttps) (reqOptions as https.RequestOptions).servername = hostname

    const req = (isHttps ? https : http).request(reqOptions, (res: http.IncomingMessage) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = new URL(res.headers.location, urlStr).toString()
        resolve(fetchWithSSRFProtection(nextUrl, options, redirectCount + 1))
        return
      }

      let bodyPromise: Promise<Buffer> | null = null
      const readBody = async (): Promise<Buffer> => {
        if (!bodyPromise) {
          bodyPromise = new Promise((resolveBody, rejectBody) => {
            const chunks: Buffer[] = []
            let length = 0
            res.on('data', (d: Buffer) => {
              length += d.length
              if (length > MAX_BODY_SIZE) {
                res.destroy()
                rejectBody(new Error('Response body too large'))
                return
              }
              chunks.push(d)
            })
            res.on('end', () => resolveBody(Buffer.concat(chunks)))
            res.on('error', rejectBody)
          })
        }
        return bodyPromise
      }

      let _bodyStream: ReadableStream<Uint8Array> | null = null

      const headers: http.IncomingHttpHeaders = res.headers
      resolve({
        ok: !!(res.statusCode && res.statusCode >= 200 && res.statusCode < 300),
        status: res.statusCode || 200,
        text: async () => (await readBody()).toString('utf8'),
        json: async () => JSON.parse((await readBody()).toString('utf8')),
        arrayBuffer: async () => {
          const b = await readBody()
          return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)
        },
        headers: { get: (name: string) => (headers[name.toLowerCase()] as string) ?? null },
        get body() {
          if (!_bodyStream) {
            _bodyStream = new ReadableStream<Uint8Array>({
              start(controller) {
                res.on('data', (chunk) => controller.enqueue(new Uint8Array(chunk)))
                res.on('end', () => controller.close())
                res.on('error', (err) => controller.error(err))
              },
              cancel() {
                res.destroy()
              }
            })
          }
          return _bodyStream
        }
      })
    })

    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        req.destroy(new Error('AbortError'))
        reject(new Error('AbortError'))
      })
    }

    req.on('error', reject)
    if (options.body) req.write(options.body)
    req.end()
  })
}
