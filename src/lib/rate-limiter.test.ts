import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit, resetRateLimitStore } from './rate-limiter';

describe('checkRateLimit', () => {
  beforeEach(() => {
    resetRateLimitStore();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('allows requests within the daily limit and blocks the next one', async () => {
    const now = new Date('2026-06-03T08:00:00.000Z');

    await expect(checkRateLimit('ip:203.0.113.10', { limit: 2, now })).resolves.toEqual({
      allowed: true,
      limit: 2,
      remaining: 1,
      resetAt: '2026-06-04T00:00:00.000Z',
    });
    await expect(checkRateLimit('ip:203.0.113.10', { limit: 2, now })).resolves.toMatchObject({
      allowed: true,
      remaining: 0,
    });
    await expect(checkRateLimit('ip:203.0.113.10', { limit: 2, now })).resolves.toMatchObject({
      allowed: false,
      remaining: 0,
    });
  });

  it('resets the counter in a new UTC day window', async () => {
    await expect(
      checkRateLimit('ip:203.0.113.10', {
        limit: 1,
        now: new Date('2026-06-03T23:59:00.000Z'),
      }),
    ).resolves.toMatchObject({ allowed: true, remaining: 0 });

    await expect(
      checkRateLimit('ip:203.0.113.10', {
        limit: 1,
        now: new Date('2026-06-04T00:01:00.000Z'),
      }),
    ).resolves.toMatchObject({ allowed: true, remaining: 0 });
  });

  it('uses Upstash Redis when REST credentials are configured', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ result: 2 }, { result: 1 }],
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://example-upstash.upstash.io/');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token');

    await expect(
      checkRateLimit('ip:203.0.113.11', {
        limit: 3,
        now: new Date('2026-06-03T08:00:00.000Z'),
      }),
    ).resolves.toEqual({
      allowed: true,
      limit: 3,
      remaining: 1,
      resetAt: '2026-06-04T00:00:00.000Z',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example-upstash.upstash.io/pipeline',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', 'rate-limit:2026-06-03:ip:203.0.113.11'],
          ['EXPIRE', 'rate-limit:2026-06-03:ip:203.0.113.11', 57600],
        ]),
      }),
    );
  });

  it('falls back to memory when Upstash Redis is unavailable', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://example-upstash.upstash.io');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token');

    await expect(
      checkRateLimit('ip:203.0.113.12', {
        limit: 1,
        now: new Date('2026-06-03T08:00:00.000Z'),
      }),
    ).resolves.toMatchObject({ allowed: true, remaining: 0 });
    await expect(
      checkRateLimit('ip:203.0.113.12', {
        limit: 1,
        now: new Date('2026-06-03T08:00:00.000Z'),
      }),
    ).resolves.toMatchObject({ allowed: false, remaining: 0 });
  });
});
