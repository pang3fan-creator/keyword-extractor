import * as cheerio from 'cheerio';
import { API_ERROR_MESSAGES, type APIErrorCode } from './api-errors';

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_REDIRECTS = 3;
const DEFAULT_MAX_BYTES = 1_000_000;

export interface FetchURLContentOptions {
  timeoutMs?: number;
  maxRedirects?: number;
  maxBytes?: number;
}

export type FetchURLContentResult =
  | {
      success: true;
      title: string;
      content: string;
    }
  | {
      success: false;
      errorCode: APIErrorCode;
      error: string;
    };

export function isSafeFetchUrl(url: string): boolean {
  try {
    validateUrl(url);
    return true;
  } catch {
    return false;
  }
}

export async function fetchURLContent(
  url: string,
  options: FetchURLContentOptions = {},
): Promise<FetchURLContentResult> {
  try {
    const parsedUrl = validateUrl(url);
    const responseInfo = await fetchWithRedirects(parsedUrl, {
      timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      maxRedirects: options.maxRedirects ?? DEFAULT_MAX_REDIRECTS,
    });

    const contentType = responseInfo.response.headers.get('content-type') ?? '';
    if (!isHtmlContentType(contentType)) {
      return fetchError('NON_HTML_CONTENT');
    }

    const html = await readResponseText(responseInfo.response, options.maxBytes ?? DEFAULT_MAX_BYTES);
    const { title, content } = extractHtmlContent(html);
    if (!content) {
      return fetchError('EMPTY_CONTENT');
    }

    return { success: true, title, content };
  } catch (error) {
    if (error instanceof URLFetchError) {
      return fetchError(error.errorCode, error.message);
    }

    return {
      success: false,
      errorCode: 'FETCH_FAILED',
      error: error instanceof Error ? error.message : API_ERROR_MESSAGES.FETCH_FAILED,
    };
  }
}

function validateUrl(url: string): URL {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new URLFetchError('INVALID_URL');
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new URLFetchError('INVALID_URL');
  }

  if (isPrivateOrLocalHost(parsedUrl.hostname)) {
    throw new URLFetchError('INVALID_URL');
  }

  return parsedUrl;
}

async function fetchWithRedirects(
  url: URL,
  options: { timeoutMs: number; maxRedirects: number },
): Promise<{ response: Response; url: URL }> {
  let currentUrl = url;

  for (let redirectCount = 0; redirectCount <= options.maxRedirects; redirectCount += 1) {
    const response = await fetchOnce(currentUrl, options.timeoutMs);

    if (!isRedirectResponse(response)) {
      if (!response.ok) {
        throw new URLFetchError('FETCH_FAILED', `URL returned HTTP ${response.status}.`);
      }

      return { response, url: currentUrl };
    }

    const location = response.headers.get('location');
    if (!location) {
      throw new URLFetchError('FETCH_FAILED', 'Redirect response is missing a Location header.');
    }

    currentUrl = validateUrl(new URL(location, currentUrl).href);
  }

  throw new URLFetchError('FETCH_FAILED', 'Too many redirects.');
}

async function fetchOnce(url: URL, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url.href, {
      redirect: 'manual',
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new URLFetchError('FETCH_TIMEOUT');
    }

    throw new URLFetchError('FETCH_FAILED');
  } finally {
    clearTimeout(timeout);
  }
}

function isRedirectResponse(response: Response) {
  return response.status >= 300 && response.status < 400;
}

function isHtmlContentType(contentType: string) {
  const normalized = contentType.toLowerCase();
  return normalized.includes('text/html') || normalized.includes('application/xhtml+xml');
}

async function readResponseText(response: Response, maxBytes: number) {
  const contentLength = response.headers.get('content-length');
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new URLFetchError('FETCH_FAILED', 'URL content is too large.');
  }

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > maxBytes) {
    throw new URLFetchError('FETCH_FAILED', 'URL content is too large.');
  }

  return new TextDecoder().decode(bytes);
}

function extractHtmlContent(html: string) {
  const $ = cheerio.load(html);

  $('script, style, noscript, nav, footer, aside, iframe, svg').remove();

  const title = normalizeText($('title').first().text());
  const contentRoot = findContentRoot($);

  contentRoot.find('br, p, div, section, article, li, h1, h2, h3, h4, h5, h6').append(' ');

  return {
    title,
    content: normalizeText(contentRoot.text()),
  };
}

function findContentRoot($: cheerio.CheerioAPI) {
  const mainRoot = $('main').first();
  const articleRoot =
    mainRoot.length > 0 && mainRoot.find('article').first().length > 0
      ? mainRoot.find('article').first()
      : $('article').first();

  if (mainRoot.length > 0 && articleRoot.length > 0) {
    let candidate = articleRoot;

    while (candidate.parent().length > 0 && candidate.parent()[0] !== mainRoot[0]) {
      candidate = candidate.parent();
    }

    return candidate.parent()[0] === mainRoot[0] ? candidate : mainRoot;
  }

  if (articleRoot.length > 0) {
    return articleRoot;
  }

  if (mainRoot.length > 0) {
    return mainRoot;
  }

  const bodyRoot = $('body');
  bodyRoot.children('header').remove();
  return bodyRoot;
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function fetchError(errorCode: APIErrorCode, error = API_ERROR_MESSAGES[errorCode]) {
  return { success: false as const, errorCode, error };
}

class URLFetchError extends Error {
  constructor(
    public readonly errorCode: APIErrorCode,
    message = API_ERROR_MESSAGES[errorCode],
  ) {
    super(message);
  }
}

function isPrivateOrLocalHost(hostname: string) {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');

  if (normalized === 'localhost' || normalized.endsWith('.localhost')) {
    return true;
  }

  if (normalized === '::1') {
    return true;
  }

  const ipv4Parts = normalized.split('.');
  if (ipv4Parts.length !== 4 || ipv4Parts.some((part) => !/^\d+$/.test(part))) {
    return false;
  }

  const octets = ipv4Parts.map(Number);
  if (octets.some((octet) => octet < 0 || octet > 255)) {
    return false;
  }

  const [first, second] = octets;

  return (
    first === 10 ||
    first === 127 ||
    (first === 192 && second === 168) ||
    (first === 172 && second >= 16 && second <= 31)
  );
}
