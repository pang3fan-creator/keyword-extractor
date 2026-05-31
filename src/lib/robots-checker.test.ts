import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkRobotsTxt, clearRobotsCache } from './robots-checker';

describe('checkRobotsTxt', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    clearRobotsCache();
  });

  it('allows blog paths when robots allows the site root', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('User-Agent: *\nAllow: /\nDisallow: /auth/', { status: 200 }),
      ),
    );

    await expect(checkRobotsTxt('https://heicpdf.to/blog/heic-vs-jpeg')).resolves.toBe(true);
  });

  it('blocks paths matched by disallow', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('User-agent: *\nDisallow: /private', { status: 200 })),
    );

    await expect(checkRobotsTxt('https://example.com/private/article')).resolves.toBe(false);
  });

  it('treats missing robots.txt as allowed', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Not found', { status: 404 })));

    await expect(checkRobotsTxt('https://example.com/blog/article')).resolves.toBe(true);
  });
});
