import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/**
 * Distributed, serverless-safe rate limiting using Upstash Redis.
 * This ensures that multiple serverless instances share the same counter.
 * 
 * Required Env:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

let redis: Redis | null = null;

try {
  // Only attempt to initialize if the URL actually looks like a URL
  // This prevents build crashes when the user misconfigures environment variables in Vercel
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_URL.startsWith('http')) {
    redis = Redis.fromEnv()
  }
} catch {
  console.warn("Invalid Upstash Redis configuration detected, falling back to permissive mode.");
}

export const ratelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  analytics: true,
  prefix: "@ayuraintelligence-ratelimit",
}) : null

/**
 * Atomic rate limit check for a specific identifier (e.g., IP).
 * Returns true if allowed, false if limited.
 */
export async function checkRateLimitDistributed(identifier: string): Promise<boolean> {
  if (!ratelimit) {
    // Fail open if Redis is not configured properly to prevent locking out all users
    return true;
  }
  
  try {
    const { success } = await ratelimit.limit(identifier)
    return success
  } catch (err) {
    console.error('RATE_LIMIT_ERROR', err)
    // Fail open if Redis is down
    return true 
  }
}
