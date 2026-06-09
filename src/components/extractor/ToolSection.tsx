'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { ExtractionResult, Phrase } from '@/types';

interface KeywordItem {
  word: string;
  count: number;
  density: number;
}

const PAGE_SIZE = 20;
type ResultFilter = 'all' | '1word' | '2word' | '3word';
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
  | 'RATE_LIMIT_EXCEEDED';

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

  return (
    <div ref={resultsRef}>
      {/* Tabs */}
      <div className="tabs" role="tablist">
        <button
          className={cn('tab-btn', activeTab === 'text' && 'active')}
          role="tab"
          aria-selected={activeTab === 'text'}
          onClick={() => setActiveTab('text')}
          type="button"
        >
          <TextIcon />
          {t('tabText')}
        </button>
        <button
          className={cn('tab-btn', activeTab === 'url' && 'active')}
          role="tab"
          aria-selected={activeTab === 'url'}
          onClick={() => setActiveTab('url')}
          type="button"
        >
          <UrlIcon />
          {t('tabUrl')}
        </button>
        <button className="tab-btn" role="tab" aria-selected={false} disabled type="button">
          <AiIcon />
          {t('tabAi')} <span className="lock-icon">&#x1F512;</span>{' '}
          <span className="pro-badge">{t('proBadge')}</span>
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
          <div className="char-count">
            {t('characters', { count: charCount.toLocaleString() })}
          </div>
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

      {/* Tab Content: AI (locked) */}
      <div className={cn('tab-content', activeTab === 'ai' && 'active')}>
        <div className="ai-locked-banner">
          &#x1F512; {t('aiLockedBanner')}
          <span style={{ fontWeight: 700, color: 'var(--pro)', marginLeft: 'auto' }}>
            {t('proBadge')}
          </span>
        </div>
        <div className="ai-overlay">
          <textarea
            placeholder={t('placeholderText')}
            spellCheck={false}
            disabled
            value={t('aiSampleText')}
            aria-label={t('aiInputLabel')}
            style={{ opacity: 0.5 }}
          />
          <div className="ai-lock">
            <div className="lock-icon-big">&#x1F512;</div>
            <p>{t('aiLockedDesc')}</p>
            <Link href="/pricing" className="btn-upgrade">
              {t('upgradeToPro')}
            </Link>
          </div>
        </div>
      </div>

      {/* Extract Button */}
      <button
        className={cn('btn-extract', loading && 'loading')}
        disabled={
          loading ||
          activeTab === 'ai' ||
          (activeTab === 'text' && !textInput.trim()) ||
          (activeTab === 'url' && !urlInput.trim())
        }
        onClick={handleExtract}
        type="button"
      >
        <span className="btn-text">{t('extract')}</span>
        <span className="spinner" />
      </button>

      {activeTab !== 'url' && (
        <div className={cn('url-error', urlError && 'visible')}>
          {urlError || t('extractFailed')}
        </div>
      )}

      {/* Results */}
      <div className={cn('results', results && results.length > 0 && 'visible')}>
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
            <caption
              style={{
                captionSide: 'bottom',
                marginTop: 8,
                fontSize: 12,
                color: 'var(--muted-foreground)',
                textAlign: 'left',
              }}
            >
              {t('tableCaption')}
            </caption>
            <thead>
              <tr>
                <th
                  data-sort="word"
                  className={sortField === 'word' ? 'sorted' : ''}
                  onClick={() => handleSortHeader('word', 'asc')}
                >
                  {t('tableKeyword')}{' '}
                  <span className="sort-arrow">
                    {sortField === 'word' ? (sortDir === 'asc' ? '\u2191' : '\u2193') : '\u2191'}
                  </span>
                </th>
                <th
                  data-sort="count"
                  className={sortField === 'count' ? 'sorted' : ''}
                  onClick={() => handleSortHeader('count', 'desc')}
                >
                  {t('tableCount')}{' '}
                  <span className="sort-arrow">
                    {sortField === 'count' ? (sortDir === 'asc' ? '\u2191' : '\u2193') : '\u2191'}
                  </span>
                </th>
                <th
                  data-sort="density"
                  className={sortField === 'density' ? 'sorted' : ''}
                  onClick={() => handleSortHeader('density', 'desc')}
                >
                  {t('tableDensity')}{' '}
                  <span className="sort-arrow">
                    {sortField === 'density' ? (sortDir === 'asc' ? '\u2191' : '\u2193') : '\u2191'}
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
          <span className="page-info">{t('pageOf', { current: safePage, total: totalPages })}</span>
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
      </div>

      {/* Empty results */}
      {results && results.length === 0 && (
        <div className="results visible">
          <div className="results-header">
            <h2 style={{ color: 'var(--muted-foreground)' }}>{t('noKeywordsFound')}</h2>
          </div>
        </div>
      )}
    </div>
  );
}
