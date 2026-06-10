import { getAuth } from '@clerk/nextjs/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AIExtractionFailedError,
  AITimeoutError,
  extractKeywordsWithAI,
} from '@/lib/ai-extractor';
import { refundAIUsage, reserveAIUsage } from '@/lib/ai-usage';
import { hasActiveProSubscription } from '@/lib/subscription';
import { POST } from './route';

vi.mock('@clerk/nextjs/server', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/lib/subscription', () => ({
  hasActiveProSubscription: vi.fn(),
}));

vi.mock('@/lib/ai-usage', () => ({
  reserveAIUsage: vi.fn(),
  refundAIUsage: vi.fn(),
}));

vi.mock('@/lib/ai-extractor', () => ({
  extractKeywordsWithAI: vi.fn(),
  AIConfigMissingError: class AIConfigMissingError extends Error {},
  AIExtractionFailedError: class AIExtractionFailedError extends Error {},
  AITimeoutError: class AITimeoutError extends Error {},
}));

const mockedGetAuth = vi.mocked(getAuth);
const mockedHasActiveProSubscription = vi.mocked(hasActiveProSubscription);
const mockedReserveAIUsage = vi.mocked(reserveAIUsage);
const mockedRefundAIUsage = vi.mocked(refundAIUsage);
const mockedExtractKeywordsWithAI = vi.mocked(extractKeywordsWithAI);

function jsonRequest(body: unknown) {
  return new Request('http://localhost/api/extract/ai', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/extract/ai', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DEEPSEEK_API_KEY = 'sk_test';
    mockedGetAuth.mockReturnValue({ userId: 'user_123' } as ReturnType<typeof getAuth>);
    mockedHasActiveProSubscription.mockResolvedValue(true);
    mockedReserveAIUsage.mockResolvedValue({
      remaining: 1_999,
      limit: 2_000,
      resetAt: '2026-07-01T00:00:00.000Z',
    });
    mockedRefundAIUsage.mockResolvedValue(undefined);
    mockedExtractKeywordsWithAI.mockResolvedValue({
      keywords: [{ keyword: 'SEO services', relevance: 0.95, category: 'topic' }],
    });
  });

  it('requires authentication', async () => {
    mockedGetAuth.mockReturnValue({ userId: null } as ReturnType<typeof getAuth>);

    const response = await POST(jsonRequest({ text: 'keyword research' }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'UNAUTHORIZED',
      error: 'Authentication is required.',
    });
  });

  it('requires an active Pro subscription', async () => {
    mockedHasActiveProSubscription.mockResolvedValue(false);

    const response = await POST(jsonRequest({ text: 'keyword research' }));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'PRO_REQUIRED',
      error: 'Pro subscription is required for AI extraction.',
    });
    expect(mockedReserveAIUsage).not.toHaveBeenCalled();
  });

  it('rejects invalid JSON', async () => {
    const response = await POST(
      new Request('http://localhost/api/extract/ai', {
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

  it('rejects empty text', async () => {
    const response = await POST(jsonRequest({ text: '  ' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'TEXT_REQUIRED',
      error: 'Text is required.',
    });
  });

  it('rejects AI text above 20,000 characters', async () => {
    const response = await POST(jsonRequest({ text: 'a'.repeat(20_001) }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'TEXT_TOO_LONG',
      error: 'Text exceeds the allowed character limit.',
    });
  });

  it('fails before reserving usage when DeepSeek config is missing', async () => {
    delete process.env.DEEPSEEK_API_KEY;

    const response = await POST(jsonRequest({ text: 'keyword research' }));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'AI_CONFIG_MISSING',
      error: 'AI extraction is not configured.',
    });
    expect(mockedReserveAIUsage).not.toHaveBeenCalled();
  });

  it('returns limit reached when quota cannot be reserved', async () => {
    mockedReserveAIUsage.mockResolvedValue(null);

    const response = await POST(jsonRequest({ text: 'keyword research' }));

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'AI_LIMIT_REACHED',
      error: 'AI extraction limit reached this month.',
    });
    expect(mockedExtractKeywordsWithAI).not.toHaveBeenCalled();
  });

  it('returns AI results and usage on success', async () => {
    const response = await POST(jsonRequest({ text: 'keyword research' }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      keywords: [{ keyword: 'SEO services', relevance: 0.95, category: 'topic' }],
      usage: {
        remaining: 1_999,
        limit: 2_000,
        resetAt: '2026-07-01T00:00:00.000Z',
      },
    });
    expect(mockedRefundAIUsage).not.toHaveBeenCalled();
  });

  it('refunds usage on AI timeout', async () => {
    mockedExtractKeywordsWithAI.mockRejectedValue(new AITimeoutError());

    const response = await POST(jsonRequest({ text: 'keyword research' }));

    expect(response.status).toBe(504);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'AI_TIMEOUT',
      error: 'AI extraction timed out.',
    });
    expect(mockedRefundAIUsage).toHaveBeenCalledWith('user_123');
  });

  it('refunds usage on AI failure', async () => {
    mockedExtractKeywordsWithAI.mockRejectedValue(new AIExtractionFailedError());

    const response = await POST(jsonRequest({ text: 'keyword research' }));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'AI_FAILED',
      error: 'AI extraction failed.',
    });
    expect(mockedRefundAIUsage).toHaveBeenCalledWith('user_123');
  });
});
