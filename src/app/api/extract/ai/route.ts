import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {
  AIConfigMissingError,
  AIExtractionFailedError,
  AITimeoutError,
  extractKeywordsWithAI,
} from '@/lib/ai-extractor';
import { refundAIUsage, reserveAIUsage } from '@/lib/ai-usage';
import { apiError } from '@/lib/api-errors';
import { AI_EXTRACTION_CHARACTER_LIMIT } from '@/lib/entitlements';
import { hasActiveProSubscription } from '@/lib/subscription';

type AIExtractionBody = {
  text?: unknown;
};

export async function POST(request: Request) {
  const { userId } = getAuth(request as Parameters<typeof getAuth>[0]);
  if (!userId) {
    return NextResponse.json(apiError('UNAUTHORIZED'), { status: 401 });
  }

  let body: AIExtractionBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(apiError('INVALID_JSON'), { status: 400 });
  }

  if (typeof body.text !== 'string' || body.text.trim().length === 0) {
    return NextResponse.json(apiError('TEXT_REQUIRED'), { status: 400 });
  }

  if (body.text.length > AI_EXTRACTION_CHARACTER_LIMIT) {
    return NextResponse.json(apiError('TEXT_TOO_LONG'), { status: 400 });
  }

  if (!(await hasActiveProSubscription(userId))) {
    return NextResponse.json(apiError('PRO_REQUIRED'), { status: 403 });
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json(apiError('AI_CONFIG_MISSING'), { status: 500 });
  }

  let usage;
  try {
    usage = await reserveAIUsage(userId);
  } catch (error) {
    console.error('Unable to reserve AI usage.', error);
    return NextResponse.json(apiError('AI_FAILED'), { status: 502 });
  }

  if (!usage) {
    return NextResponse.json(apiError('AI_LIMIT_REACHED'), { status: 429 });
  }

  try {
    const result = await extractKeywordsWithAI(body.text);
    return NextResponse.json({ ...result, usage });
  } catch (error) {
    await refundReservedUsage(userId);

    if (error instanceof AITimeoutError) {
      return NextResponse.json(apiError('AI_TIMEOUT'), { status: 504 });
    }

    if (error instanceof AIConfigMissingError) {
      return NextResponse.json(apiError('AI_CONFIG_MISSING'), { status: 500 });
    }

    if (error instanceof AIExtractionFailedError) {
      return NextResponse.json(apiError('AI_FAILED'), { status: 502 });
    }

    console.error('AI extraction failed.', error);
    return NextResponse.json(apiError('AI_FAILED'), { status: 502 });
  }
}

async function refundReservedUsage(userId: string) {
  try {
    await refundAIUsage(userId);
  } catch (error) {
    console.error('Unable to refund AI usage.', error);
  }
}
