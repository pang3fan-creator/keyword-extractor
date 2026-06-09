import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-errors';
import { extractKeywords, type KeywordExtractionOptions } from '@/lib/keyword-extractor';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter';

const MAX_TEXT_LENGTH = 10_000;

interface TextExtractionBody {
  text?: unknown;
  options?: KeywordExtractionOptions;
}

export async function POST(request: Request) {
  let body: TextExtractionBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(apiError('INVALID_JSON'), { status: 400 });
  }

  if (typeof body.text !== 'string' || body.text.trim().length === 0) {
    return NextResponse.json(apiError('TEXT_REQUIRED'), { status: 400 });
  }

  if (body.text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(apiError('TEXT_TOO_LONG'), { status: 400 });
  }

  const rateLimit = await checkRateLimit(getRateLimitKey(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(apiError('RATE_LIMIT_EXCEEDED'), { status: 429 });
  }

  return NextResponse.json(extractKeywords(body.text, body.options));
}
