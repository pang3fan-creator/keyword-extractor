import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-errors';
import { extractKeywords, type KeywordExtractionOptions } from '@/lib/keyword-extractor';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter';
import { checkRobotsTxt } from '@/lib/robots-checker';
import { fetchURLContent, isSafeFetchUrl } from '@/lib/url-fetcher';

interface URLExtractionBody {
  url?: unknown;
  options?: KeywordExtractionOptions;
}

export async function POST(request: Request) {
  let body: URLExtractionBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(apiError('INVALID_JSON'), { status: 400 });
  }

  if (typeof body.url !== 'string' || !isSafeFetchUrl(body.url)) {
    return NextResponse.json(apiError('INVALID_URL'), { status: 400 });
  }

  const rateLimit = await checkRateLimit(getRateLimitKey(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(apiError('RATE_LIMIT_EXCEEDED'), { status: 429 });
  }

  const parsedUrl = new URL(body.url);
  const normalizedUrl = parsedUrl.toString();
  const allowedByRobots = await checkRobotsTxt(normalizedUrl);

  if (!allowedByRobots) {
    return NextResponse.json(apiError('ROBOTS_BLOCKED'), { status: 403 });
  }

  const fetchResult = await fetchURLContent(normalizedUrl);
  if (!fetchResult.success) {
    return NextResponse.json(apiError(fetchResult.errorCode, fetchResult.error), { status: 400 });
  }

  return NextResponse.json({
    ...extractKeywords(fetchResult.content, body.options),
    sourceUrl: normalizedUrl,
    pageTitle: fetchResult.title,
  });
}
