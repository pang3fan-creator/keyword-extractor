import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

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

function jsonRequest(body: unknown) {
  return new Request('http://localhost/api/extract/url', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/extract/url', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    await expect(response.json()).resolves.toEqual({ error: 'A valid URL is required.' });
    expect(mockedCheckRobotsTxt).not.toHaveBeenCalled();
    expect(mockedFetchURLContent).not.toHaveBeenCalled();
  });

  it('returns 403 when robots.txt blocks the URL', async () => {
    mockedCheckRobotsTxt.mockResolvedValue(false);

    const response = await POST(jsonRequest({ url: 'https://example.com/private' }));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: 'This URL is blocked by robots.txt.',
    });
  });
});
