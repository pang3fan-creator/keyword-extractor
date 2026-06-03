import { beforeEach, describe, expect, it } from 'vitest';
import { checkRateLimit, resetRateLimitStore } from './rate-limiter';

describe('checkRateLimit', () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it('allows requests within the daily limit and blocks the next one', () => {
    const now = new Date('2026-06-03T08:00:00.000Z');

    expect(checkRateLimit('ip:203.0.113.10', { limit: 2, now })).toEqual({
      allowed: true,
      limit: 2,
      remaining: 1,
      resetAt: '2026-06-04T00:00:00.000Z',
    });
    expect(checkRateLimit('ip:203.0.113.10', { limit: 2, now })).toMatchObject({
      allowed: true,
      remaining: 0,
    });
    expect(checkRateLimit('ip:203.0.113.10', { limit: 2, now })).toMatchObject({
      allowed: false,
      remaining: 0,
    });
  });

  it('resets the counter in a new UTC day window', () => {
    expect(
      checkRateLimit('ip:203.0.113.10', {
        limit: 1,
        now: new Date('2026-06-03T23:59:00.000Z'),
      }),
    ).toMatchObject({ allowed: true, remaining: 0 });

    expect(
      checkRateLimit('ip:203.0.113.10', {
        limit: 1,
        now: new Date('2026-06-04T00:01:00.000Z'),
      }),
    ).toMatchObject({ allowed: true, remaining: 0 });
  });
});
