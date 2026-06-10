import type { AIKeyword } from '@/types';

export type AIExtractionPayload = {
  keywords: AIKeyword[];
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

const DEFAULT_DEEPSEEK_BASE_URL = 'https://api.deepseek.com';
const DEFAULT_DEEPSEEK_MODEL = 'deepseek-v4-flash';
const DEFAULT_AI_REQUEST_TIMEOUT_MS = 15_000;
const VALID_CATEGORIES = new Set<AIKeyword['category']>([
  'topic',
  'service',
  'industry',
  'entity',
]);

export class AIConfigMissingError extends Error {
  constructor() {
    super('DEEPSEEK_API_KEY is not configured.');
  }
}

export class AITimeoutError extends Error {
  constructor() {
    super('AI extraction timed out.');
  }
}

export class AIExtractionFailedError extends Error {
  constructor(message = 'AI extraction failed.') {
    super(message);
  }
}

export async function extractKeywordsWithAI(text: string): Promise<AIExtractionPayload> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new AIConfigMissingError();

  const timeoutMs = getAIRequestTimeoutMs();
  let response: Response;

  try {
    response = await fetch(`${getDeepSeekBaseUrl()}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You extract semantic SEO keywords. Return only valid JSON matching the requested schema.',
          },
          {
            role: 'user',
            content: buildPrompt(text),
          },
        ],
        response_format: { type: 'json_object' },
        stream: false,
        thinking: { type: 'disabled' },
        max_tokens: 1_200,
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (isAbortError(error)) throw new AITimeoutError();
    throw new AIExtractionFailedError();
  }

  if (!response.ok) {
    throw new AIExtractionFailedError(`DeepSeek returned ${response.status}.`);
  }

  const payload = (await response.json()) as DeepSeekResponse;
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new AIExtractionFailedError('DeepSeek response was empty.');

  return normalizeAIExtractionPayload(content);
}

export function normalizeAIExtractionPayload(content: string): AIExtractionPayload {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new AIExtractionFailedError('DeepSeek response was not valid JSON.');
  }

  if (!isRecord(parsed) || !Array.isArray(parsed.keywords)) {
    throw new AIExtractionFailedError('DeepSeek response did not include keywords.');
  }

  const seen = new Set<string>();
  const keywords: AIKeyword[] = [];

  for (const item of parsed.keywords) {
    if (!isRecord(item)) continue;

    const keyword = typeof item.keyword === 'string' ? item.keyword.trim() : '';
    if (!keyword || keyword.length > 100) continue;

    const normalizedKey = keyword.toLowerCase();
    if (seen.has(normalizedKey)) continue;
    seen.add(normalizedKey);

    keywords.push({
      keyword,
      relevance: clampRelevance(item.relevance),
      category: normalizeCategory(item.category),
    });

    if (keywords.length >= 20) break;
  }

  if (keywords.length === 0) {
    throw new AIExtractionFailedError('DeepSeek response did not include valid keywords.');
  }

  return { keywords };
}

function buildPrompt(text: string) {
  return `Extract the most important semantic keywords and phrases from this text.

Return a JSON object with this exact shape:
{
  "keywords": [
    {"keyword": "keyword phrase", "relevance": 0.95, "category": "topic"}
  ]
}

Rules:
- Return at most 20 keywords.
- "relevance" must be a number between 0 and 1.
- "category" must be one of: topic, service, industry, entity.
- Do not include explanations or markdown.

Text:
${text}`;
}

function getDeepSeekBaseUrl() {
  return (process.env.DEEPSEEK_API_BASE_URL || DEFAULT_DEEPSEEK_BASE_URL).replace(/\/$/, '');
}

function getAIRequestTimeoutMs() {
  const timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS);
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) return DEFAULT_AI_REQUEST_TIMEOUT_MS;
  return timeoutMs;
}

function clampRelevance(value: unknown) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.min(1, Math.max(0, numericValue));
}

function normalizeCategory(value: unknown): AIKeyword['category'] {
  return typeof value === 'string' && VALID_CATEGORIES.has(value as AIKeyword['category'])
    ? (value as AIKeyword['category'])
    : 'topic';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && (error.name === 'TimeoutError' || error.name === 'AbortError');
}
