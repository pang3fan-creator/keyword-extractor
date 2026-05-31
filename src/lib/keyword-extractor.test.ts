import { describe, expect, it } from 'vitest';
import { extractKeywords } from './keyword-extractor';

describe('extractKeywords', () => {
  it('counts repeated words, removes stop words, and computes density', () => {
    const result = extractKeywords('The HEIC image image format beats the old image format.');

    expect(result.totalWords).toBe(8);
    expect(result.uniqueKeywords).toBe(5);
    expect(result.keywords.slice(0, 2)).toEqual([
      { word: 'image', count: 3, density: 37.5 },
      { word: 'format', count: 2, density: 25 },
    ]);
  });

  it('returns bigrams and trigrams when requested', () => {
    const result = extractKeywords('heic image format heic image format', {
      includeBigrams: true,
      includeTrigrams: true,
    });

    expect(result.bigrams?.[0]).toEqual({ phrase: 'heic image', count: 2, density: 40 });
    expect(result.trigrams?.[0]).toEqual({
      phrase: 'heic image format',
      count: 2,
      density: 50,
    });
  });

  it('preserves stop words inside extracted phrases', () => {
    const result = extractKeywords('Four steps to convert HEIC to PDF', {
      includeTrigrams: true,
    });

    expect(result.trigrams?.map((item) => item.phrase)).toEqual([
      'four steps to',
      'steps to convert',
      'to convert heic',
      'convert heic to',
      'heic to pdf',
    ]);
  });

  it('returns an empty result when no valid keywords exist', () => {
    expect(extractKeywords('the and or !!!')).toEqual({
      totalWords: 0,
      uniqueKeywords: 0,
      keywords: [],
    });
  });
});
