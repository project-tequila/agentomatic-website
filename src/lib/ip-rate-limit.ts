export type RateLimiterOptions = {
  limit: number;
  windowMs: number;
};

/**
 * In-memory sliding-window limiter keyed by client IP (or any string).
 */
export class SlidingWindowRateLimiter {
  private readonly hits = new Map<string, number[]>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(options: RateLimiterOptions) {
    this.limit = options.limit;
    this.windowMs = options.windowMs;
  }

  tryConsume(key: string, now = Date.now()): boolean {
    const cutoff = now - this.windowMs;
    const previous = this.hits.get(key) ?? [];
    const recent = previous.filter((ts) => ts > cutoff);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}

export function clientIpFromHeaders(headers: Headers, fallback = "unknown"): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return fallback;
}

export const demoWebVoiceLimiter = new SlidingWindowRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000,
});
