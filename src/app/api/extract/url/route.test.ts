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

vi.mock('@/lib/robots-checker', () => ({
  checkRobotsTxt: vi.fn(),
}));

vi.mock('@/lib/url-fetcher', () => ({
  fetchURLContent: vi.fn(),
  isSafeFetchUrl: vi.fn((url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname !== 'localhost';
    } catch {
      return false;
    }
  }),
}));

import { checkRobotsTxt } from '@/lib/robots-checker';
import { fetchURLContent } from '@/lib/url-fetcher';

const mockedCheckRobotsTxt = vi.mocked(checkRobotsTxt);
const mockedFetchURLContent = vi.mocked(fetchURLContent);
const mockedGetAuth = vi.mocked(getAuth);
const mockedHasActiveProSubscription = vi.mocked(hasActiveProSubscription);

function jsonRequest(body: unknown, headers?: HeadersInit) {
  return new Request('http://localhost/api/extract/url', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

describe('POST /api/extract/url', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetAuth.mockReturnValue({ userId: null } as ReturnType<typeof getAuth>);
    mockedHasActiveProSubscription.mockResolvedValue(false);
    resetRateLimitStore();
  });

  it('returns extraction-shaped data for fetched article content', async () => {
    mockedCheckRobotsTxt.mockResolvedValue(true);
    mockedFetchURLContent.mockResolvedValue({
      success: true,
      title: 'HEIC vs JPEG',
      content: 'HEIC JPEG JPEG image format quality compatibility',
    });

    const response = await POST(
      jsonRequest({
        url: 'https://heicpdf.to/blog/heic-vs-jpeg',
        options: { includeBigrams: true, includeTrigrams: true },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.sourceUrl).toBe('https://heicpdf.to/blog/heic-vs-jpeg');
    expect(body.pageTitle).toBe('HEIC vs JPEG');
    expect(body.keywords[0]).toEqual({ word: 'jpeg', count: 2, density: 28.57 });
    expect(body.bigrams).toEqual(expect.any(Array));
    expect(body.trigrams).toEqual(expect.any(Array));
  });

  it('rejects unsafe URLs before robots or fetch checks', async () => {
    const response = await POST(jsonRequest({ url: 'http://localhost/page' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'INVALID_URL',
      error: 'A valid URL is required.',
    });
    expect(mockedCheckRobotsTxt).not.toHaveBeenCalled();
    expect(mockedFetchURLContent).not.toHaveBeenCalled();
  });

  it('returns 403 when robots.txt blocks the URL', async () => {
    mockedCheckRobotsTxt.mockResolvedValue(false);

    const response = await POST(jsonRequest({ url: 'https://example.com/private' }));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'ROBOTS_BLOCKED',
      error: 'This URL is blocked by robots.txt.',
    });
  });

  it('rejects invalid JSON with a stable error code', async () => {
    const response = await POST(
      new Request('http://localhost/api/extract/url', {
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

  it('returns fetcher error codes when URL fetching fails', async () => {
    mockedCheckRobotsTxt.mockResolvedValue(true);
    mockedFetchURLContent.mockResolvedValue({
      success: false,
      errorCode: 'NON_HTML_CONTENT',
      error: 'Only HTML pages can be extracted.',
    });

    const response = await POST(jsonRequest({ url: 'https://example.com/file.pdf' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'NON_HTML_CONTENT',
      error: 'Only HTML pages can be extracted.',
    });
  });

  it('returns empty content error when fetched HTML has no readable text', async () => {
    mockedCheckRobotsTxt.mockResolvedValue(true);
    mockedFetchURLContent.mockResolvedValue({
      success: false,
      errorCode: 'EMPTY_CONTENT',
      error: 'No readable page content found.',
    });

    const response = await POST(jsonRequest({ url: 'https://example.com/empty' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'EMPTY_CONTENT',
      error: 'No readable page content found.',
    });
  });

  it('rejects fetched content above the free character limit', async () => {
    mockedCheckRobotsTxt.mockResolvedValue(true);
    mockedFetchURLContent.mockResolvedValue({
      success: true,
      title: 'Long article',
      content: 'keyword '.repeat(1500),
    });

    const response = await POST(jsonRequest({ url: 'https://example.com/long' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'TEXT_TOO_LONG',
      error: 'Text exceeds the allowed character limit.',
    });
  });

  it('allows Pro users to extract fetched content above the free limit', async () => {
    mockedGetAuth.mockReturnValue({ userId: 'user_123' } as ReturnType<typeof getAuth>);
    mockedHasActiveProSubscription.mockResolvedValue(true);
    mockedCheckRobotsTxt.mockResolvedValue(true);
    mockedFetchURLContent.mockResolvedValue({
      success: true,
      title: 'Long article',
      content: 'keyword '.repeat(1500),
    });

    const response = await POST(jsonRequest({ url: 'https://example.com/long' }));

    expect(response.status).toBe(200);
    expect(mockedHasActiveProSubscription).toHaveBeenCalledWith('user_123');
  });

  it('rejects Pro URL content above the Pro character limit', async () => {
    mockedGetAuth.mockReturnValue({ userId: 'user_123' } as ReturnType<typeof getAuth>);
    mockedHasActiveProSubscription.mockResolvedValue(true);
    mockedCheckRobotsTxt.mockResolvedValue(true);
    mockedFetchURLContent.mockResolvedValue({
      success: true,
      title: 'Very long article',
      content: 'a'.repeat(50_001),
    });

    const response = await POST(jsonRequest({ url: 'https://example.com/very-long' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'TEXT_TOO_LONG',
      error: 'Text exceeds the allowed character limit.',
    });
  });

  it('rate limits repeated URL extraction requests from the same IP', async () => {
    mockedCheckRobotsTxt.mockResolvedValue(true);
    mockedFetchURLContent.mockResolvedValue({
      success: true,
      title: 'Example',
      content: 'keyword extraction example content',
    });

    let response: Response | undefined;
    for (let index = 0; index < 51; index += 1) {
      response = await POST(
        jsonRequest(
          { url: 'https://example.com/article' },
          { 'x-forwarded-for': '203.0.113.20' },
        ),
      );
    }

    expect(response?.status).toBe(429);
    await expect(response?.json()).resolves.toEqual({
      errorCode: 'RATE_LIMIT_EXCEEDED',
      error: 'Daily free extraction limit reached.',
    });
  });
});
