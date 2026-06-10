'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { ExtractionResult, Phrase } from '@/types';
import { AIInput } from './AIInput';
import { AIGatedPanel } from './AIGatedPanel';
import { AIResultTable } from './AIResultTable';
import { AIResultCard } from './AIResultCard';
import { AIQuotaDisplay } from './AIQuotaDisplay';
import { AILoadingState } from './AILoadingState';
import { AIErrorDisplay } from './AIErrorDisplay';
import { usePro } from '@/hooks/usePro';
import type { AIKeyword } from '@/types';

interface KeywordItem {
  word: string;
  count: number;
  density: number;
}

const PAGE_SIZE = 20;
type ResultFilter = 'all' | '1word' | '2word' | '3word';
type TabId = 'text' | 'url' | 'ai';
type APIErrorCode =
  | 'INVALID_JSON'
  | 'TEXT_REQUIRED'
  | 'TEXT_TOO_LONG'
  | 'INVALID_URL'
  | 'ROBOTS_BLOCKED'
  | 'FETCH_TIMEOUT'
  | 'FETCH_FAILED'
  | 'NON_HTML_CONTENT'
  | 'EMPTY_CONTENT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'PRO_REQUIRED'
  | 'AI_LIMIT_REACHED'
  | 'AI_TIMEOUT'
  | 'AI_FAILED'
  | 'AI_CONFIG_MISSING';

const ERROR_TRANSLATION_KEYS: Record<APIErrorCode, string> = {
  INVALID_JSON: 'errors.invalidJson',
  TEXT_REQUIRED: 'errors.textRequired',
  TEXT_TOO_LONG: 'errors.textTooLong',
  INVALID_URL: 'errors.invalidUrl',
  ROBOTS_BLOCKED: 'errors.robotsBlocked',
  FETCH_TIMEOUT: 'errors.fetchTimeout',
  FETCH_FAILED: 'errors.fetchFailed',
  NON_HTML_CONTENT: 'errors.nonHtmlContent',
  EMPTY_CONTENT: 'errors.emptyContent',
  RATE_LIMIT_EXCEEDED: 'errors.rateLimitExceeded',
  PRO_REQUIRED: 'errors.proRequired',
  AI_LIMIT_REACHED: 'errors.aiLimitReached',
  AI_TIMEOUT: 'errors.aiTimeout',
  AI_FAILED: 'errors.aiFailed',
  AI_CONFIG_MISSING: 'errors.aiConfigMissing',
};

function TextIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 4h12M2 8h12M2 12h8" />
    </svg>
  );
}

function UrlIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 5.5a3.5 3.5 0 0 1 5 0l1 1a3.5 3.5 0 0 1 0 5" />
      <path d="M8 10.5a3.5 3.5 0 0 1-5 0l-1-1a3.5 3.5 0 0 1 0-5" />
      <circle cx="8" cy="8" r="1.5" />
    </svg>
  );
}

function AiIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 1v2M8 13v2M2.5 2.5l1.5 1.5M12 12l1.5 1.5M1 8h2M13 8h2M3.5 12.5l1-1M11.5 4.5l1-1" />
      <circle cx="8" cy="8" r="3" />
    </svg>
  );
}

function CsvIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 1v8M4 7l3 3 3-3M2 11v2h10v-2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="1" width="9" height="11" rx="1.5" />
      <path d="M2 4v8.5A1.5 1.5 0 0 0 3.5 14h6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 7l3 3 7-7" />
    </svg>
  );
}

export function ToolSection() {
  const t = useTranslations('home');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [results, setResults] = useState<KeywordItem[] | null>(null);
  const [bigrams, setBigrams] = useState<KeywordItem[]>([]);
  const [trigrams, setTrigrams] = useState<KeywordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [resultFilter, setResultFilter] = useState<ResultFilter>('all');
  const [sortField, setSortField] = useState('count');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [resultSource, setResultSource] = useState<TabId | null>(null);

  // AI extraction state
  const [aiResults, setAiResults] = useState<AIKeyword[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiUsage, setAiUsage] = useState<{ remaining: number; limit: number } | null>(null);

  const { isPro, isSignedIn, isLoading: proLoading } = usePro();
  const AI_MAX_LENGTH = 20000;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [results, resultFilter, sortField, sortDir]);

  const charCount = textInput.length;

  const normalizeUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  const validateUrl = (value: string) => {
    if (!value.trim()) {
      setUrlError('');
      return false;
    }
    try {
      const parsed = new URL(normalizeUrl(value));
      const isValid = parsed.protocol === 'http:' || parsed.protocol === 'https:';
      setUrlError(isValid ? '' : t('invalidUrl'));
      return isValid;
    } catch {
      setUrlError(t('invalidUrl'));
      return false;
    }
  };

  const phraseToItem = (phrase: Phrase): KeywordItem => ({
    word: phrase.phrase,
    count: phrase.count,
    density: phrase.density,
  });

  const applyExtractionResult = (result: ExtractionResult) => {
    setResults(result.keywords);
    setBigrams((result.bigrams ?? []).map(phraseToItem));
    setTrigrams((result.trigrams ?? []).map(phraseToItem));
    setResultFilter('all');
    setUrlError('');
    setResultSource(activeTab as TabId);
  };

  const getTranslatedError = (payload: unknown) => {
    if (
      payload &&
      typeof payload === 'object' &&
      'errorCode' in payload &&
      typeof payload.errorCode === 'string' &&
      payload.errorCode in ERROR_TRANSLATION_KEYS
    ) {
      return t(ERROR_TRANSLATION_KEYS[payload.errorCode as APIErrorCode] as never);
    }

    return t('extractFailed');
  };

  const handleExtract = async () => {
    if (activeTab === 'ai') return;
    if (activeTab === 'url') {
      if (!validateUrl(urlInput)) return;
    }
    if (activeTab === 'text' && !textInput.trim()) return;

    setLoading(true);
    setUrlError('');

    try {
      const endpoint = activeTab === 'url' ? '/api/extract/url' : '/api/extract/text';
      const body =
        activeTab === 'url'
          ? {
              url: normalizeUrl(urlInput),
              options: { includeBigrams: true, includeTrigrams: true },
            }
          : { text: textInput, options: { includeBigrams: true, includeTrigrams: true } };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json();

      if (!response.ok) {
        setUrlError(getTranslatedError(payload));
        setResults([]);
        return;
      }

      applyExtractionResult(payload as ExtractionResult);
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      );
    } catch {
      setUrlError(t('extractFailed'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAIExtract = async (text: string) => {
    if (aiLoading) return;
    setAiLoading(true);
    setAiError(null);
    setAiResults(null);
    setAiUsage(null);

    try {
      const res = await fetch('/api/extract/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAiError(data.errorCode ?? 'AI_FAILED');
        return;
      }

      setAiResults(data.keywords ?? []);
      setAiUsage(data.usage ?? null);
    } catch {
      setAiError('AI_FAILED');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIErrorRetry = () => {
    setAiError(null);
  };

  const handleSwitchToBasic = () => {
    setActiveTab('text');
    setAiError(null);
  };

  const handleAICopy = async () => {
    if (!aiResults) return;
    const rows = [`${t('tableKeyword')}\t${t('ai.relevance')}\t${t('ai.category')}`];
    aiResults.forEach((k) => rows.push(`${k.keyword}\t${k.relevance.toFixed(2)}\t${k.category}`));
    await navigator.clipboard.writeText(rows.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAIDownloadCsv = () => {
    if (!aiResults) return;
    const rows = [[t('tableKeyword'), t('ai.relevance'), t('ai.category')]];
    aiResults.forEach((k) => rows.push([k.keyword, String(k.relevance), k.category]));
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ai-keywords.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const allResults = [...(results ?? []), ...bigrams, ...trigrams];

  const handleCopy = async () => {
    if (!results) return;
    const rows = [`${t('tableKeyword')}\t${t('tableCount')}\t${t('tableDensity')}`];
    allResults.forEach((item) =>
      rows.push(`${item.word}\t${item.count}\t${item.density.toFixed(1)}%`),
    );
    await navigator.clipboard.writeText(rows.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    if (!results) return;
    const rows = [[t('tableKeyword'), t('tableCount'), t('tableDensity')]];
    allResults.forEach((item) =>
      rows.push([item.word, String(item.count), `${item.density.toFixed(1)}%`]),
    );
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'keywords.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const filteredResults = (() => {
    if (!results) return [];
    if (resultFilter === 'all') return allResults;
    if (resultFilter === '1word') return results;
    if (resultFilter === '2word') return bigrams;
    if (resultFilter === '3word') return trigrams;
    return results;
  })();

  const sortedResults = [...filteredResults].sort((a, b) => {
    let va: string | number, vb: string | number;
    if (sortField === 'word') {
      va = a.word;
      vb = b.word;
    } else if (sortField === 'density') {
      va = a.density;
      vb = b.density;
    } else {
      va = a.count;
      vb = b.count;
    }
    if (typeof va === 'string' && typeof vb === 'string') {
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });

  const totalPages = Math.max(1, Math.ceil(sortedResults.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedResults = sortedResults.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSortHeader = (field: string, defaultDir: 'asc' | 'desc') => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortDir(defaultDir);
    }
  };

  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div ref={resultsRef}>
      {/* Tabs */}
      <div className="tabs" role="tablist">
        <button
          className={cn('tab-btn', activeTab === 'text' && 'active')}
          role="tab"
          aria-selected={activeTab === 'text'}
          onClick={() => handleTabSwitch('text')}
          type="button"
        >
          <TextIcon />
          {t('tabText')}
        </button>
        <button
          className={cn('tab-btn', activeTab === 'url' && 'active')}
          role="tab"
          aria-selected={activeTab === 'url'}
          onClick={() => handleTabSwitch('url')}
          type="button"
        >
          <UrlIcon />
          {t('tabUrl')}
        </button>
        <button
          className={cn('tab-btn', activeTab === 'ai' && 'active')}
          role="tab"
          aria-selected={activeTab === 'ai'}
          onClick={() => handleTabSwitch('ai')}
          type="button"
        >
          <AiIcon />
          {t('tabAi')} <span className="pro-badge">{t('proBadge')}</span>
        </button>
      </div>

      {/* Tab Content: Text */}
      <div className={cn('tab-content', activeTab === 'text' && 'active')}>
        <div className="input-group">
          <textarea
            id="textInput"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t('placeholderText')}
            spellCheck={false}
            aria-label={t('textInputLabel')}
          />
          <div className="char-count">{t('characters', { count: charCount.toLocaleString() })}</div>
        </div>
      </div>

      {/* Tab Content: URL */}
      <div className={cn('tab-content', activeTab === 'url' && 'active')}>
        <div className="input-group">
          <div className={cn('url-input-wrap', urlError && 'error')}>
            <span className="url-scheme">https://</span>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value.replace(/^https?:\/\//i, ''));
                if (urlError) setUrlError('');
              }}
              onBlur={(e) => validateUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExtract();
              }}
              placeholder={t('placeholderUrl')}
              aria-label={t('urlInputLabel')}
            />
          </div>
          <div className={cn('url-error', urlError && 'visible')}>
            {urlError || t('invalidUrl')}
          </div>
        </div>
      </div>

      {/* Tab Content: AI (gated) */}
      <div className={cn('tab-content', activeTab === 'ai' && 'active')}>
        {proLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div
              style={{
                width: 24,
                height: 24,
                border: '2px solid var(--border)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'extract-spin 0.8s linear infinite',
              }}
            />
          </div>
        ) : !isSignedIn ? (
          <AIGatedPanel variant="sign-in" />
        ) : !isPro ? (
          <AIGatedPanel variant="upgrade" />
        ) : (
          <AIInput onExtract={handleAIExtract} disabled={aiLoading} maxLength={AI_MAX_LENGTH} />
        )}
      </div>

      {/* Extract Button — shared for Text/URL tabs; AI tab has its own button in AIInput */}
      {activeTab !== 'ai' && (
        <button
          className={cn('btn-extract', loading && 'loading')}
          disabled={
            loading ||
            (activeTab === 'text' && !textInput.trim()) ||
            (activeTab === 'url' && !urlInput.trim())
          }
          onClick={handleExtract}
          type="button"
        >
          <span className="btn-text">{t('extract')}</span>
          <span className="spinner" />
        </button>
      )}

      {activeTab !== 'url' && (
        <div className={cn('url-error', urlError && 'visible')}>
          {urlError || t('extractFailed')}
        </div>
      )}

      {activeTab !== 'ai' && (
        <>
          {/* Results */}
          <div
            className={cn(
              'results',
              results && results.length > 0 && activeTab === resultSource && 'visible',
            )}
          >
            <div className="results-header">
              <h2>{t('resultsTitle', { count: sortedResults.length })}</h2>
            </div>

            <div className="filter-chips">
              {(['all', '1word', '2word', '3word'] as const).map((f) => (
                <button
                  key={f}
                  className={cn('filter-chip', resultFilter === f && 'active')}
                  onClick={() => setResultFilter(f)}
                  type="button"
                >
                  {t(
                    f === 'all'
                      ? 'filterAll'
                      : f === '1word'
                        ? 'filterOneWord'
                        : f === '2word'
                          ? 'filterTwoWord'
                          : 'filterThreeWord',
                  )}
                </button>
              ))}
            </div>

            <div className="results-actions">
              <button onClick={handleDownloadCsv} aria-label={t('downloadCsvLabel')} type="button">
                <CsvIcon />
                {t('downloadCsv')}
              </button>
              <button onClick={handleCopy} aria-label={t('copyClipboardLabel')} type="button">
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? t('copied') : t('copyClipboard')}
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th
                      data-sort="word"
                      className={sortField === 'word' ? 'sorted' : ''}
                      onClick={() => handleSortHeader('word', 'asc')}
                    >
                      {t('tableKeyword')}{' '}
                      <span className="sort-arrow">
                        {sortField === 'word'
                          ? sortDir === 'asc'
                            ? '\u2191'
                            : '\u2193'
                          : '\u2191'}
                      </span>
                    </th>
                    <th
                      data-sort="count"
                      className={sortField === 'count' ? 'sorted' : ''}
                      onClick={() => handleSortHeader('count', 'desc')}
                    >
                      {t('tableCount')}{' '}
                      <span className="sort-arrow">
                        {sortField === 'count'
                          ? sortDir === 'asc'
                            ? '\u2191'
                            : '\u2193'
                          : '\u2191'}
                      </span>
                    </th>
                    <th
                      data-sort="density"
                      className={sortField === 'density' ? 'sorted' : ''}
                      onClick={() => handleSortHeader('density', 'desc')}
                    >
                      {t('tableDensity')}{' '}
                      <span className="sort-arrow">
                        {sortField === 'density'
                          ? sortDir === 'asc'
                            ? '\u2191'
                            : '\u2193'
                          : '\u2191'}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedResults.map((item) => (
                    <tr key={item.word}>
                      <td>{item.word}</td>
                      <td>{item.count}</td>
                      <td>{item.density.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                type="button"
                aria-label={t('pageFirst')}
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(1)}
              >
                &laquo;
              </button>
              <button
                type="button"
                aria-label={t('pagePrevious')}
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                &lsaquo;
              </button>
              <span className="page-info">
                {t('pageOf', { current: safePage, total: totalPages })}
              </span>
              <button
                type="button"
                aria-label={t('pageNext')}
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                &rsaquo;
              </button>
              <button
                type="button"
                aria-label={t('pageLast')}
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                &raquo;
              </button>
            </div>

            <p
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: 'var(--muted-foreground)',
                marginTop: 16,
              }}
            >
              {t('tableCaption')}
            </p>
          </div>

          {/* Empty results */}
          {results && results.length === 0 && activeTab === resultSource && (
            <div className="results visible">
              <div className="results-header">
                <h2 style={{ color: 'var(--muted-foreground)' }}>{t('noKeywordsFound')}</h2>
              </div>
            </div>
          )}
        </>
      )}

      {/* AI Results */}
      {activeTab === 'ai' && aiLoading && <AILoadingState />}

      {activeTab === 'ai' && aiError && (
        <AIErrorDisplay
          errorCode={aiError}
          onRetry={handleAIErrorRetry}
          onSwitchToBasic={handleSwitchToBasic}
        />
      )}

      {activeTab === 'ai' && aiResults && aiResults.length > 0 && (
        <div className="results visible">
          <div className="results-header">
            <h2>{t('resultsTitle', { count: aiResults.length })}</h2>
          </div>
          <div className="results-actions">
            <button onClick={handleAIDownloadCsv} aria-label={t('downloadCsvLabel')} type="button">
              <CsvIcon />
              {t('downloadCsv')}
            </button>
            <button onClick={handleAICopy} aria-label={t('copyClipboardLabel')} type="button">
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? t('copied') : t('copyClipboard')}
            </button>
          </div>
          <AIResultTable keywords={aiResults} />
          <AIResultCard keywords={aiResults} />
          {aiUsage && <AIQuotaDisplay remaining={aiUsage.remaining} />}
        </div>
      )}

      {activeTab === 'ai' && aiResults && aiResults.length === 0 && (
        <div className="results visible">
          <div className="results-header">
            <h2>{t('noKeywordsFound')}</h2>
          </div>
        </div>
      )}
    </div>
  );
}
