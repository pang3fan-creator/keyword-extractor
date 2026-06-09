import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-errors';
import {
  FREE_EXTRACTION_CHARACTER_LIMIT,
  PRO_EXTRACTION_CHARACTER_LIMIT,
} from '@/lib/entitlements';
import { extractKeywords, type KeywordExtractionOptions } from '@/lib/keyword-extractor';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter';
import { hasActiveProSubscription } from '@/lib/subscription';

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

  const isPro = await hasActiveProSubscription(getOptionalUserId(request));
  const maxTextLength = isPro ? PRO_EXTRACTION_CHARACTER_LIMIT : FREE_EXTRACTION_CHARACTER_LIMIT;

  if (body.text.length > maxTextLength) {
    return NextResponse.json(apiError('TEXT_TOO_LONG'), { status: 400 });
  }

  const rateLimit = await checkRateLimit(getRateLimitKey(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(apiError('RATE_LIMIT_EXCEEDED'), { status: 429 });
  }

  return NextResponse.json(extractKeywords(body.text, body.options));
}

function getOptionalUserId(request: Request) {
  try {
    return getAuth(request as Parameters<typeof getAuth>[0]).userId;
  } catch {
    return null;
  }
}
