/**
 * Global Rate Limiter — Upstash Redis + In-Memory Fallback.
 * 
 * Provides production-grade, cross-instance consensus via Redis.
 * Falls back to local in-memory limiting if Upstash credentials are missing.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { log } from './logger'

// --- In-Memory Store (Fallback) ---
interface RateLimitEntry { count: number; resetAt: number }
const chatStore = new Map<string, RateLimitEntry>()
const paymentStore = new Map<string, RateLimitEntry>()

function inMemoryLimit(
  store: Map<string, RateLimitEntry>,
  ip: string,
  max: number,
  windowMs: number
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

// --- Upstash Redis Client (Production) ---
let redis: Redis | null = null
let chatRatelimit: Ratelimit | null = null
let paymentRatelimit: Ratelimit | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    chatRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '60 s'), // Modernized: 30 req/min
      analytics: true,
      prefix: 'ayura:ratelimit:chat',
    })

    paymentRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '60 s'), // Strict: 5 req/min
      analytics: true,
      prefix: 'ayura:ratelimit:pay',
    })
  } catch (err) {
    log.error('REDIS_INIT_FAILED', { error: String(err) })
  }
}

/**
 * Universal Rate Limit Check
 */
export async function checkRateLimit(ip: string, isCeo: boolean = false): Promise<{ allowed: boolean; remaining: number }> {
  if (isCeo) return { allowed: true, remaining: 9999 }
  
  if (chatRatelimit) {
    try {
      const { success, remaining } = await chatRatelimit.limit(ip)
      return { allowed: success, remaining }
    } catch (err) {
      log.warn('REDIS_LIMIT_FALLBACK', { error: String(err), ip })
    }
  }
  return inMemoryLimit(chatStore, ip, 20, 60_000)
}

export async function checkPaymentRateLimit(ip: string, isCeo: boolean = false): Promise<{ allowed: boolean; remaining: number }> {
  if (isCeo) return { allowed: true, remaining: 9999 }
  
  if (paymentRatelimit) {
    try {
      const { success, remaining } = await paymentRatelimit.limit(ip)
      return { allowed: success, remaining }
    } catch (err) {
      log.warn('REDIS_LIMIT_FALLBACK', { error: String(err), ip })
    }
  }
  return inMemoryLimit(paymentStore, ip, 5, 60_000)
}

// Clean up memory store every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [k, v] of chatStore.entries()) if (now > v.resetAt) chatStore.delete(k)
    for (const [k, v] of paymentStore.entries()) if (now > v.resetAt) paymentStore.delete(k)
  }, 5 * 60_000)
}
