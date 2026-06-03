import { beforeEach, describe, expect, it } from 'vitest';
import { POST } from './route';
import { resetRateLimitStore } from '@/lib/rate-limiter';

function jsonRequest(body: unknown, headers?: HeadersInit) {
  return new Request('http://localhost/api/extract/text', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

describe('POST /api/extract/text', () => {
  beforeEach(() => {
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
    const response = await POST(jsonRequest({ text: 'a'.repeat(50001) }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'TEXT_TOO_LONG',
      error: 'Text must be 50,000 characters or fewer.',
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
