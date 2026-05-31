'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Tabs } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Table, TableHead, Th, TableBody, Tr, Td } from '@/components/ui/Table';

interface KeywordItem {
  word: string;
  count: number;
  density: number;
}

interface PhraseItem {
  phrase: string;
  count: number;
  density: number;
}

interface ExtractionResponse {
  keywords: KeywordItem[];
  bigrams?: PhraseItem[];
  trigrams?: PhraseItem[];
  error?: string;
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
  const [resultFilter, setResultFilter] = useState('1word');
  const [sortField, setSortField] = useState('count');
  const [sortDir, setSortDir] = useState('desc');
  const PAGE_SIZE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filter, sort, or results change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [results, resultFilter, sortField, sortDir]);

  const charCount = textInput.length;

  const validateUrl = (value: string) => {
    if (!value) {
      setUrlError('');
      return;
    }
    try {
      new URL(value);
      setUrlError('');
    } catch {
      setUrlError(t('invalidUrl'));
    }
  };

  const handleExtract = async () => {
    if (activeTab === 'url') {
      validateUrl(urlInput);
      try {
        new URL(urlInput);
      } catch {
        return;
      }
    }

    setLoading(true);
    setUrlError('');

    try {
      const endpoint = activeTab === 'url' ? '/api/extract/url' : '/api/extract/text';
      const payload =
        activeTab === 'url'
          ? { url: urlInput, options: { includeBigrams: true, includeTrigrams: true } }
          : { text: textInput, options: { includeBigrams: true, includeTrigrams: true } };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as ExtractionResponse;

      if (!response.ok || data.error) {
        throw new Error(data.error || t('extractFailed'));
      }

      setResults(data.keywords);
      setBigrams((data.bigrams ?? []).map((item) => ({ ...item, word: item.phrase })));
      setTrigrams((data.trigrams ?? []).map((item) => ({ ...item, word: item.phrase })));
      setResultFilter('1word');
    } catch (error) {
      const message = error instanceof Error ? error.message : t('extractFailed');
      setUrlError(message);
      setResults([]);
      setBigrams([]);
      setTrigrams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!results) return;
    const csv = 'Keyword,Count,Density\n' + results.map((r) => `${r.word},${r.count},${r.density}%`).join('\n');
    await navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    if (!results) return;
    const csv = 'Keyword,Count,Density\n' + results.map((r) => `${r.word},${r.count},${r.density}%`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keywords.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAiClick = () => {
    alert('AI extraction requires a Pro subscription. Please sign up and upgrade to access this feature.');
  };

  const filteredResults = (() => {
    if (!results) return [];
    if (resultFilter === '1word') return results;
    if (resultFilter === '2word') return bigrams;
    if (resultFilter === '3word') return trigrams;
    return results;
  })();

  const sortedResults = [...filteredResults].sort((a, b) => {
    let va: string | number, vb: string | number;
    if (sortField === 'word') { va = a.word; vb = b.word; }
    else if (sortField === 'density') { va = a.density; vb = b.density; }
    else { va = a.count; vb = b.count; }

    if (typeof va === 'string' && typeof vb === 'string') {
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedResults.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedResults = sortedResults.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const tabs = [
    {
      id: 'text',
      label: t('tabText'),
      content: (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              className="h-64 w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              placeholder={t('placeholderText')}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <span className="pointer-events-none absolute right-3 bottom-3 text-xs text-muted">
              {t('characters', { count: charCount.toLocaleString() })}
            </span>
          </div>
          <Button
            onClick={handleExtract}
            disabled={loading || !textInput.trim()}
            className="w-full"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-fg/30 border-t-primary-fg" />
                {t('extracting')}
              </span>
            ) : (
              t('extract')
            )}
          </Button>
        </div>
      ),
    },
    {
      id: 'url',
      label: t('tabUrl'),
      content: (
        <div className="space-y-4">
          <Input
            type="url"
            placeholder={t('placeholderUrl')}
            value={urlInput}
            error={urlError ? urlError : undefined}
            onChange={(e) => {
              setUrlInput(e.target.value);
              validateUrl(e.target.value);
            }}
          />
          {urlError && (
            <p className="text-sm text-red-600 dark:text-red-400">{urlError}</p>
          )}
          <Button onClick={handleExtract} disabled={loading || !urlInput.trim()} className="w-full">
            {loading ? t('extracting') : t('extract')}
          </Button>
        </div>
      ),
    },
    {
      id: 'ai',
      label: t('tabAi'),
      badge: t('proBadge'),
      disabled: true,
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
            AI-powered semantic extraction uses DeepSeek to understand context and meaning, not just word frequency. Available with Pro subscription.
          </div>
          <textarea
            className="h-64 w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted opacity-50 focus-visible:outline-none"
            placeholder={t('placeholderText')}
            disabled
          />
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleAiClick}>
              {t('extract')}
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Tabs tabs={tabs} defaultTab="text" onTabChange={setActiveTab} />

      {results && results.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {t('results', { count: sortedResults.length })}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? t('copied') : t('copyClipboard')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadCsv}>
                {t('downloadCsv')}
              </Button>
            </div>
          </div>

          {/* Sub-tabs for filtering: 1-word / 2-word / 3-word */}
          <div className="flex gap-1 rounded-lg bg-surface p-1">
            {(['1word', '2word', '3word'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setResultFilter(f)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  resultFilter === f
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                )}
              >
                {t(f === '1word' ? 'filterOneWord' : f === '2word' ? 'filterTwoWord' : 'filterThreeWord')}
              </button>
            ))}
          </div>

          <Table>
            <TableHead>
              <Th
                className="cursor-pointer select-none"
                onClick={() => {
                  if (sortField === 'word') setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                  else { setSortField('word'); setSortDir('asc'); }
                }}
              >
                {t('tableKeyword')} {sortField === 'word' && (sortDir === 'asc' ? '\u2191' : '\u2193')}
              </Th>
              <Th
                className="cursor-pointer select-none text-right"
                onClick={() => {
                  if (sortField === 'count') setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                  else { setSortField('count'); setSortDir('desc'); }
                }}
              >
                {t('tableCount')} {sortField === 'count' && (sortDir === 'asc' ? '\u2191' : '\u2193')}
              </Th>
              <Th
                className="cursor-pointer select-none text-right"
                onClick={() => {
                  if (sortField === 'density') setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                  else { setSortField('density'); setSortDir('desc'); }
                }}
              >
                {t('tableDensity')} {sortField === 'density' && (sortDir === 'asc' ? '\u2191' : '\u2193')}
              </Th>
            </TableHead>
            <TableBody>
              {paginatedResults.map((item) => (
                <Tr key={item.word}>
                  <Td className="font-medium">{item.word}</Td>
                  <Td className="text-right tabular-nums">{item.count}</Td>
                  <Td className="text-right tabular-nums">{item.density}%</Td>
                </Tr>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={safePage <= 1}
                  aria-label={t('pageFirst')}
                >
                  {'\u00AB'} {t('pageFirst')}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                >
                  {t('pagePrevious')}
                </Button>

                <div className="flex items-center gap-1">
                  {(() => {
                    const pages: (number | 'e')[] = [];
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      if (safePage > 3) pages.push('e');
                      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
                        pages.push(i);
                      }
                      if (safePage < totalPages - 2) pages.push('e');
                      pages.push(totalPages);
                    }
                    return pages.map((p, idx) =>
                      p === 'e' ? (
                        <span key={`e-${idx}`} className="px-0.5 text-sm text-muted">{'\u2026'}</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={cn(
                            'h-8 w-8 rounded-md text-sm font-medium transition-colors',
                            p === safePage
                              ? 'bg-primary text-primary-fg'
                              : 'text-muted hover:bg-surface'
                          )}
                        >
                          {p}
                        </button>
                      )
                    );
                  })()}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                >
                  {t('pageNext')}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safePage >= totalPages}
                  aria-label={t('pageLast')}
                >
                  {t('pageLast')} {'\u00BB'}
                </Button>
              </div>

              <span className="text-xs text-muted">
                {t('pageOf', { current: safePage, total: totalPages })}
              </span>
            </div>
          )}
        </div>
      )}

      {results && results.length === 0 && (
        <div className="mt-8 rounded-lg border border-border bg-surface/30 px-4 py-8 text-center text-sm text-muted">
          {urlError || t('noKeywordsFound')}
        </div>
      )}

      {!results && (
        <div className="mt-8 rounded-lg border border-dashed border-border px-4 py-12 text-center">
          <p className="text-sm text-muted">{t('noResults')}</p>
        </div>
      )}
    </div>
  );
}
