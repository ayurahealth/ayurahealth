/**
 * In-memory rate limiter.
 *
 * ⚠️  Limitation: This resets on every cold-start/deployment and does NOT
 * share state across multiple Vercel serverless instances. For production
 * scale, replace with an edge KV store (Vercel KV / Upstash Redis).
 *
 * For now this provides baseline protection per-instance.
 */

interface RateLimitEntry { count: number; resetAt: number }
const chatRequests = new Map<string, RateLimitEntry>()
const paymentRequests = new Map<string, RateLimitEntry>()

function check(
  store: Map<string, RateLimitEntry>,
  ip: string,
  max: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: max - 1 }
  }

  if (entry.count >= max) return { allowed: false, remaining: 0 }

  entry.count++
  return { allowed: true, remaining: max - entry.count }
}

/** Chat API: 20 requests per IP per minute */
export function checkRateLimit(ip: string) {
  return check(chatRequests, ip, 20, 60_000)
}

/** Payment APIs: 5 requests per IP per minute (stricter) */
export function checkPaymentRateLimit(ip: string) {
  return check(paymentRequests, ip, 5, 60_000)
}

// Clean up every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of chatRequests.entries()) if (now > v.resetAt) chatRequests.delete(k)
  for (const [k, v] of paymentRequests.entries()) if (now > v.resetAt) paymentRequests.delete(k)
}, 5 * 60_000)
