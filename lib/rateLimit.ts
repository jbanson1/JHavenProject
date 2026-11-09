/**
 * Best-effort, in-memory rate limit: a few enquiries per IP per window.
 * Each serverless instance keeps its own memory, so this slows down a noisy
 * bot rather than guaranteeing a hard cap. That is fine for a small site.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function rateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    // Keep memory bounded: drop the oldest entries.
    for (const k of [...hits.keys()].slice(0, 1000)) hits.delete(k);
  }
  return false;
}

export function resetRateLimit() {
  hits.clear();
}
