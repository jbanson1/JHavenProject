/**
 * Sliding-window rate limiter.
 *
 * IMPORTANT — this counts per serverless instance, not globally. Vercel runs
 * many instances and recycles them, so a determined attacker spreading requests
 * across cold starts will get through more than the nominal limit. It is a
 * cheap guard against a single client looping the endpoint, which is the
 * realistic abuse for a contact form; it is not a defence against a
 * distributed flood.
 *
 * Making it exact needs shared storage — Vercel Firewall rules at the edge, or
 * a Redis-backed limiter such as @upstash/ratelimit. Both add a service this
 * site does not otherwise need.
 */

type Bucket = number[]

const buckets = new Map<string, Bucket>()

/** Stops the map growing without bound if many distinct IPs are seen. */
const MAX_TRACKED_KEYS = 10_000

export type RateLimitResult = {
  allowed: boolean
  /** Seconds until the caller may retry. Zero when allowed. */
  retryAfter: number
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  now = Date.now()
): RateLimitResult {
  const cutoff = now - windowMs

  // Drop expired entries across the whole map, so instances that stay warm for
  // a long time do not accumulate keys that will never be seen again.
  for (const [entryKey, timestamps] of buckets) {
    const live = timestamps.filter((t) => t > cutoff)
    if (live.length === 0) buckets.delete(entryKey)
    else buckets.set(entryKey, live)
  }

  if (buckets.size >= MAX_TRACKED_KEYS && !buckets.has(key)) {
    // Under key-space flooding, fail open rather than evict a real client's
    // record: losing an enquiry is worse than letting one extra request through.
    return { allowed: true, retryAfter: 0 }
  }

  const timestamps = buckets.get(key) ?? []

  if (timestamps.length >= limit) {
    const oldest = timestamps[0]
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    }
  }

  // Rejected attempts are deliberately not recorded, so a legitimate visitor
  // who hits the limit is not held out by their own retries. Throughput is
  // capped either way.
  timestamps.push(now)
  buckets.set(key, timestamps)

  return { allowed: true, retryAfter: 0 }
}

/**
 * Vercel sets x-vercel-forwarded-for itself and it cannot be spoofed by the
 * client, so it is preferred. The leftmost x-forwarded-for entry is the
 * fallback for other hosts and local development.
 */
export function clientIp(headers: Headers) {
  const vercelIp = headers.get('x-vercel-forwarded-for')
  if (vercelIp) return vercelIp.split(',')[0].trim()

  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()

  return headers.get('x-real-ip')?.trim() || 'unknown'
}

/** Exposed for tests. */
export function __resetRateLimit() {
  buckets.clear()
}
