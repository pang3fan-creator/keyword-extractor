import type { ExtractionResult, Phrase } from '@/types';
import { ENGLISH_STOP_WORD_SET } from './stop-words';

export interface KeywordExtractionOptions {
  includeBigrams?: boolean;
  includeTrigrams?: boolean;
  minWordLength?: number;
}

const DEFAULT_MIN_WORD_LENGTH = 2;

export function extractKeywords(
  text: string,
  options: KeywordExtractionOptions = {},
): ExtractionResult {
  const phraseTokens = tokenize(text, { filterStopWords: false, minWordLength: 1 });
  const keywordTokens = tokenize(text, {
    filterStopWords: true,
    minWordLength: options.minWordLength ?? DEFAULT_MIN_WORD_LENGTH,
  });
  const keywords = countItems(keywordTokens).map(([word, count]) => ({
    word,
    count,
    density: calculateDensity(count, keywordTokens.length),
  }));

  const result: ExtractionResult = {
    totalWords: keywordTokens.length,
    uniqueKeywords: keywords.length,
    keywords,
  };

  if (options.includeBigrams) {
    result.bigrams = buildPhrases(phraseTokens, 2);
  }

  if (options.includeTrigrams) {
    result.trigrams = buildPhrases(phraseTokens, 3);
  }

  return result;
}

function tokenize(
  text: string,
  options: {
    filterStopWords: boolean;
    minWordLength: number;
  },
) {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z0-9-]/g, ''))
    .filter(
      (word) =>
        word.length >= options.minWordLength &&
        (!options.filterStopWords || !ENGLISH_STOP_WORD_SET.has(word)),
    );
}

function buildPhrases(tokens: string[], size: number): Phrase[] {
  if (tokens.length < size) {
    return [];
  }

  const phrases: string[] = [];
  for (let index = 0; index <= tokens.length - size; index += 1) {
    phrases.push(tokens.slice(index, index + size).join(' '));
  }

  return countItems(phrases).map(([phrase, count]) => ({
    phrase,
    count,
    density: calculateDensity(count, phrases.length),
  }));
}

function countItems(items: string[]): Array<[string, number]> {
  const counts = new Map<string, number>();
  const firstSeen = new Map<string, number>();

  for (const [index, item] of items.entries()) {
    if (!firstSeen.has(item)) {
      firstSeen.set(item, index);
    }

    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  return Array.from(counts.entries()).sort(
    (a, b) => b[1] - a[1] || (firstSeen.get(a[0]) ?? 0) - (firstSeen.get(b[0]) ?? 0),
  );
}

function calculateDensity(count: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((count / total) * 10000) / 100;
}
