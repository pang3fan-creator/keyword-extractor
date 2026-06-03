import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchURLContent, isSafeFetchUrl } from './url-fetcher';

const heicArticleHtml = `
<!DOCTYPE html>
<html>
  <head><title>HEIC vs JPEG: Which Image Format Should You Use?</title></head>
  <body>
    <nav>Home Blog Privacy</nav>
    <main>
      <article>
        <h1>HEIC vs JPEG: Which Image Format Should You Use in 2026?</h1>
        <p>HEIC and JPEG are two common image formats for photos.</p>
        <p>HEIC offers smaller file size and strong image quality, while JPEG has broader compatibility.</p>
        <p>Choose JPEG for compatibility and HEIC for efficient storage.</p>
      </article>
    </main>
    <footer>Terms Contact</footer>
    <script>window.noise = true</script>
  </body>
</html>`;

describe('isSafeFetchUrl', () => {
  it('accepts normal http and https URLs', () => {
    expect(isSafeFetchUrl('https://heicpdf.to/blog/heic-vs-jpeg')).toBe(true);
    expect(isSafeFetchUrl('http://example.com/page')).toBe(true);
  });

  it('rejects invalid, local, loopback, and private URLs', () => {
    expect(isSafeFetchUrl('not a url')).toBe(false);
    expect(isSafeFetchUrl('ftp://example.com/file')).toBe(false);
    expect(isSafeFetchUrl('http://localhost/page')).toBe(false);
    expect(isSafeFetchUrl('http://127.0.0.1/page')).toBe(false);
    expect(isSafeFetchUrl('http://10.0.0.1/page')).toBe(false);
    expect(isSafeFetchUrl('http://192.168.1.10/page')).toBe(false);
    expect(isSafeFetchUrl('http://172.16.0.1/page')).toBe(false);
    expect(isSafeFetchUrl('http://[::1]/page')).toBe(false);
  });
});

describe('fetchURLContent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('extracts article text and removes page chrome from HEIC article-shaped HTML', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(heicArticleHtml, {
          headers: { 'content-type': 'text/html; charset=utf-8' },
          status: 200,
        }),
      ),
    );

    const result = await fetchURLContent('https://heicpdf.to/blog/heic-vs-jpeg');

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.title).toBe('HEIC vs JPEG: Which Image Format Should You Use?');
    expect(result.content).toContain('HEIC and JPEG are two common image formats');
    expect(result.content).toContain('broader compatibility');
    expect(result.content).not.toContain('Privacy');
    expect(result.content).not.toContain('window.noise');
  });

  it('includes article deck text that appears in main outside the article element', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          `
          <!DOCTYPE html>
          <html>
            <head><title>HEIC vs JPEG</title></head>
            <body>
              <header>Site header HEIC and JPEG noise</header>
              <main>
                <div class="blog-article-page">
                  <header class="blog-article-header">
                    <p class="blog-article-deck">A practical guide comparing HEIC and JPEG across file size and compatibility.</p>
                  </header>
                  <article class="blog-article-body">
                    <h2>What Is the Difference Between HEIC and JPEG?</h2>
                    <p>HEIC and JPEG are two very different ways of storing photographs.</p>
                    <p>HEIC and JPEG are different generations of image technology.</p>
                  </article>
                </div>
              </main>
              <footer>Footer HEIC and JPEG noise</footer>
            </body>
          </html>
        `,
          {
            headers: { 'content-type': 'text/html; charset=utf-8' },
            status: 200,
          },
        ),
      ),
    );

    const result = await fetchURLContent('https://heicpdf.to/blog/heic-vs-jpeg');

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.content.match(/HEIC and JPEG/g)).toHaveLength(4);
    expect(result.content).not.toContain('Site header HEIC and JPEG noise');
    expect(result.content).not.toContain('Footer HEIC and JPEG noise');
  });

  it('rejects non-html responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('PDF', { headers: { 'content-type': 'application/pdf' }, status: 200 }),
      ),
    );

    await expect(fetchURLContent('https://example.com/file.pdf')).resolves.toEqual({
      success: false,
      errorCode: 'NON_HTML_CONTENT',
      error: 'Only HTML pages can be extracted.',
    });
  });

  it('rejects HTML pages with no readable content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('<html><head><title>Empty</title></head><body><script>noise</script></body></html>', {
          headers: { 'content-type': 'text/html' },
          status: 200,
        }),
      ),
    );

    await expect(fetchURLContent('https://example.com/empty')).resolves.toEqual({
      success: false,
      errorCode: 'EMPTY_CONTENT',
      error: 'No readable page content found.',
    });
  });

  it('returns a timeout error code when fetching takes too long', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            const error = new Error('The operation was aborted');
            error.name = 'AbortError';
            reject(error);
          });
        });
      }),
    );

    const promise = fetchURLContent('https://example.com/slow', { timeoutMs: 10 });
    await vi.advanceTimersByTimeAsync(10);

    await expect(promise).resolves.toEqual({
      success: false,
      errorCode: 'FETCH_TIMEOUT',
      error: 'URL fetch timed out.',
    });
    vi.useRealTimers();
  });
});
