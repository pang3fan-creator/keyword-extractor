import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AIConfigMissingError,
  AIExtractionFailedError,
  AITimeoutError,
  extractKeywordsWithAI,
  normalizeAIExtractionPayload,
} from './ai-extractor';

describe('normalizeAIExtractionPayload', () => {
  it('normalizes categories, relevance values, duplicates, and result count', () => {
    const result = normalizeAIExtractionPayload(
      JSON.stringify({
        keywords: [
          { keyword: ' SEO services ', relevance: 1.2, category: 'service' },
          { keyword: 'SEO services', relevance: 0.8, category: 'topic' },
          { keyword: 'Digital Marketing', relevance: -1, category: 'unknown' },
          ...Array.from({ length: 25 }, (_, index) => ({
            keyword: `keyword ${index}`,
            relevance: 0.5,
            category: 'topic',
          })),
        ],
      }),
    );

    expect(result.keywords).toHaveLength(20);
    expect(result.keywords[0]).toEqual({
      keyword: 'SEO services',
      relevance: 1,
      category: 'service',
    });
    expect(result.keywords[1]).toEqual({
      keyword: 'Digital Marketing',
      relevance: 0,
      category: 'topic',
    });
  });

  it('throws when no valid keywords are returned', () => {
    expect(() => normalizeAIExtractionPayload('{"keywords":[]}')).toThrow(AIExtractionFailedError);
  });
});

describe('extractKeywordsWithAI', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.DEEPSEEK_API_KEY = 'sk_test';
    process.env.DEEPSEEK_API_BASE_URL = 'https://api.deepseek.com';
    process.env.DEEPSEEK_MODEL = 'deepseek-v4-flash';
    process.env.AI_REQUEST_TIMEOUT_MS = '15000';
    global.fetch = originalFetch;
  });

  it('requires DeepSeek config', async () => {
    delete process.env.DEEPSEEK_API_KEY;

    await expect(extractKeywordsWithAI('keyword research')).rejects.toThrow(AIConfigMissingError);
  });

  it('calls DeepSeek and returns normalized keywords', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                keywords: [{ keyword: 'SEO services', relevance: 0.95, category: 'service' }],
              }),
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as typeof fetch;

    await expect(extractKeywordsWithAI('keyword research')).resolves.toEqual({
      keywords: [{ keyword: 'SEO services', relevance: 0.95, category: 'service' }],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.deepseek.com/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer sk_test',
        }),
      }),
    );
  });

  it('maps abort errors to timeout errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new DOMException('timeout', 'TimeoutError')) as typeof fetch;

    await expect(extractKeywordsWithAI('keyword research')).rejects.toThrow(AITimeoutError);
  });
});
