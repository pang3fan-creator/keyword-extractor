// 关键词提取相关共享类型

export interface Keyword {
  word: string;
  count: number;
  density: number;
}

export interface Phrase {
  phrase: string;
  count: number;
  density: number;
}

export interface ExtractionResult {
  totalWords: number;
  uniqueKeywords: number;
  keywords: Keyword[];
  bigrams?: Phrase[];
  trigrams?: Phrase[];
}

export interface URLExtractionResult extends ExtractionResult {
  sourceUrl: string;
  pageTitle: string;
}

export interface AIKeyword {
  keyword: string;
  relevance: number;
  category: 'topic' | 'service' | 'industry' | 'entity';
}

export interface AIExtractionResult {
  keywords: AIKeyword[];
  usage: {
    remaining: number;
    limit: number;
    resetAt: string;
  };
}
