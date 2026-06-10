import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAuth } from '@clerk/nextjs/server';
import { POST } from './route';
import { resetRateLimitStore } from '@/lib/rate-limiter';
import { hasActiveProSubscription } from '@/lib/subscription';

vi.mock('@clerk/nextjs/server', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/lib/subscription', () => ({
  hasActiveProSubscription: vi.fn(),
}));

const mockedGetAuth = vi.mocked(getAuth);
const mockedHasActiveProSubscription = vi.mocked(hasActiveProSubscription);

function jsonRequest(body: unknown, headers?: HeadersInit) {
  return new Request('http://localhost/api/extract/text', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

describe('POST /api/extract/text', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetAuth.mockReturnValue({ userId: null } as ReturnType<typeof getAuth>);
    mockedHasActiveProSubscription.mockResolvedValue(false);
    resetRateLimitStore();
  });

  it('returns extraction results for valid text', async () => {
    const response = await POST(
      jsonRequest({
        text: 'HEIC JPEG JPEG image format',
        options: { includeBigrams: true },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.keywords[0]).toEqual({ word: 'jpeg', count: 2, density: 40 });
    expect(body.bigrams[0]).toEqual({ phrase: 'heic jpeg', count: 1, density: 25 });
  });

  it('rejects empty text', async () => {
    const response = await POST(jsonRequest({ text: '   ' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'TEXT_REQUIRED',
      error: 'Text is required.',
    });
  });

  it('rejects oversized text', async () => {
    const response = await POST(jsonRequest({ text: 'a'.repeat(10001) }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'TEXT_TOO_LONG',
      error: 'Text exceeds the allowed character limit.',
    });
  });

  it('allows Pro users to submit text above the free limit', async () => {
    mockedGetAuth.mockReturnValue({ userId: 'user_123' } as ReturnType<typeof getAuth>);
    mockedHasActiveProSubscription.mockResolvedValue(true);

    const response = await POST(jsonRequest({ text: `keyword ${'a'.repeat(10000)}` }));

    expect(response.status).toBe(200);
    expect(mockedHasActiveProSubscription).toHaveBeenCalledWith('user_123');
  });

  it('rejects Pro text above the Pro character limit', async () => {
    mockedGetAuth.mockReturnValue({ userId: 'user_123' } as ReturnType<typeof getAuth>);
    mockedHasActiveProSubscription.mockResolvedValue(true);

    const response = await POST(jsonRequest({ text: 'a'.repeat(50_001) }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'TEXT_TOO_LONG',
      error: 'Text exceeds the allowed character limit.',
    });
  });

  it('rejects invalid JSON with a stable error code', async () => {
    const response = await POST(
      new Request('http://localhost/api/extract/text', {
        method: 'POST',
        body: '{',
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'INVALID_JSON',
      error: 'Invalid JSON body.',
    });
  });

  it('rate limits repeated requests from the same IP', async () => {
    let response: Response | undefined;

    for (let index = 0; index < 51; index += 1) {
      response = await POST(
        jsonRequest({ text: 'HEIC JPEG image format' }, { 'x-forwarded-for': '203.0.113.10' }),
      );
    }

    expect(response?.status).toBe(429);
    await expect(response?.json()).resolves.toEqual({
      errorCode: 'RATE_LIMIT_EXCEEDED',
      error: 'Daily free extraction limit reached.',
    });
  });
});
