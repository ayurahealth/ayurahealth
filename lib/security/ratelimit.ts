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
const redis = Redis.fromEnv()

export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  analytics: true,
  prefix: "@ayuraintelligence-ratelimit",
})

/**
 * Atomic rate limit check for a specific identifier (e.g., IP).
 * Returns true if allowed, false if limited.
 */
export async function checkRateLimitDistributed(identifier: string): Promise<boolean> {
  try {
    const { success } = await ratelimit.limit(identifier)
    return success
  } catch (err) {
    console.error('RATE_LIMIT_ERROR', err)
    // Fail open if Redis is down? Or fail closed? 
    // Usually better to fail open in critical user paths if Redis is purely for protection.
    return true 
  }
}
