const DEFAULT_DAILY_LIMIT = 50;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  limit?: number;
  now?: Date;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: string;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function resetRateLimitStore() {
  rateLimitStore.clear();
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {},
): RateLimitResult {
  const limit = options.limit ?? DEFAULT_DAILY_LIMIT;
  const now = options.now ?? new Date();
  const resetAt = getNextUtcMidnight(now);
  const existing = rateLimitStore.get(key);
  const entry =
    existing && existing.resetAt > now.getTime() ? existing : { count: 0, resetAt: resetAt.getTime() };

  if (entry.count >= limit) {
    rateLimitStore.set(key, entry);
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetAt: new Date(entry.resetAt).toISOString(),
    };
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: new Date(entry.resetAt).toISOString(),
  };
}

export function getRateLimitKey(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const ip = forwardedFor || realIp || 'anonymous';

  return `ip:${ip}`;
}

function getNextUtcMidnight(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0, 0),
  );
}
