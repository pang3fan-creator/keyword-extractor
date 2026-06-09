const DEFAULT_DAILY_LIMIT = 50;
const UPSTASH_REQUEST_TIMEOUT_MS = 1500;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  limit?: number;
  now?: Date;
  forceMemory?: boolean;
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

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions = {},
): Promise<RateLimitResult> {
  const limit = options.limit ?? DEFAULT_DAILY_LIMIT;
  const now = options.now ?? new Date();
  const redisConfig = options.forceMemory ? null : getUpstashRedisConfig();

  if (redisConfig) {
    try {
      return await checkRedisRateLimit(key, limit, now, redisConfig);
    } catch (error) {
      console.warn('Falling back to in-memory rate limiting after Upstash Redis error.', error);
    }
  }

  return checkMemoryRateLimit(key, limit, now);
}

export function getRateLimitKey(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const ip = forwardedFor || realIp || 'anonymous';

  return `ip:${ip}`;
}

function checkMemoryRateLimit(key: string, limit: number, now: Date): RateLimitResult {
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

async function checkRedisRateLimit(
  key: string,
  limit: number,
  now: Date,
  config: { url: string; token: string },
): Promise<RateLimitResult> {
  const resetAt = getNextUtcMidnight(now);
  const ttlSeconds = Math.max(1, Math.ceil((resetAt.getTime() - now.getTime()) / 1000));
  const redisKey = `rate-limit:${getUtcDateKey(now)}:${key}`;
  const response = await fetch(`${config.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', redisKey],
      ['EXPIRE', redisKey, ttlSeconds],
    ]),
    signal: AbortSignal.timeout(UPSTASH_REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Upstash Redis returned ${response.status}`);
  }

  const results = (await response.json()) as Array<{ result?: unknown; error?: string }>;
  const increment = results[0];

  if (!increment || increment.error) {
    throw new Error(increment?.error ?? 'Missing Upstash Redis increment result');
  }

  const count = Number(increment.result);
  if (!Number.isFinite(count)) {
    throw new Error('Invalid Upstash Redis increment result');
  }

  return {
    allowed: count <= limit,
    limit,
    remaining: Math.max(0, limit - count),
    resetAt: resetAt.toISOString(),
  };
}

function getNextUtcMidnight(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0, 0),
  );
}

function getUtcDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getUpstashRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  return { url, token };
}
