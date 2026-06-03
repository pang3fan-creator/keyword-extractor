'use client';

import { useState, useEffect, useRef } from 'react';
import { Download, FileText, Link as LinkIcon, Lock, Sparkles, Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import type { ExtractionResult, Phrase } from '@/types';

interface KeywordItem {
  word: string;
  count: number;
  density: number;
}

const PAGE_SIZE = 20;

type ResultFilter = 'all' | '1word' | '2word' | '3word';

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
  };

  const handleExtract = async () => {
    if (activeTab === 'url' && !validateUrl(urlInput)) return;
    if (activeTab === 'text' && !textInput.trim()) return;

    setLoading(true);
    setUrlError('');

    try {
      const endpoint = activeTab === 'url' ? '/api/extract/url' : '/api/extract/text';
      const body = activeTab === 'url'
        ? { url: normalizeUrl(urlInput), options: { includeBigrams: true, includeTrigrams: true } }
        : { text: textInput, options: { includeBigrams: true, includeTrigrams: true } };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json();

      if (!response.ok) {
        const message = typeof payload.error === 'string' ? payload.error : t('extractFailed');
        setUrlError(message);
        setResults([]);
        return;
      }

      applyExtractionResult(payload as ExtractionResult);
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch {
      setUrlError(t('extractFailed'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const allResults = [
    ...(results ?? []),
    ...bigrams,
    ...trigrams,
  ];

  const handleCopy = async () => {
    if (!results) return;
    const rows = [`${t('tableKeyword')}\t${t('tableCount')}\t${t('tableDensity')}`];
    allResults.forEach((item) => rows.push(`${item.word}\t${item.count}\t${item.density}%`));
    await navigator.clipboard.writeText(rows.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    if (!results) return;
    const rows = [[t('tableKeyword'), t('tableCount'), t('tableDensity')]];
    allResults.forEach((item) => rows.push([item.word, String(item.count), `${item.density}%`]));
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
    if (sortField === 'word') { va = a.word; vb = b.word; }
    else if (sortField === 'density') { va = a.density; vb = b.density; }
    else { va = a.count; vb = b.count; }
    if (typeof va === 'string' && typeof vb === 'string') {
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });

  const totalPages = Math.max(1, Math.ceil(sortedResults.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedResults = sortedResults.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSortHeader = (field: string, defaultDir: 'asc' | 'desc') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir(defaultDir); }
  };

  const sortIcon = (field: string) =>
    sortField === field ? (sortDir === 'asc' ? ' \u2191' : ' \u2193') : '';

  return (
    <div className="rounded-[14px] border border-border bg-background p-4 shadow-[0_1px_4px_hsl(0_0%_0%/0.04)] sm:p-6" ref={resultsRef}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-5 h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-border bg-transparent p-0 max-[480px]:grid max-[480px]:grid-cols-1">
          <TabsTrigger value="text" className="gap-2 rounded-b-none border border-transparent px-5 py-2.5 data-[state=active]:border-border data-[state=active]:border-b-background data-[state=active]:shadow-none max-[480px]:rounded-md max-[480px]:data-[state=active]:border-primary">
            <FileText className="h-4 w-4" aria-hidden="true" />
            {t('tabText')}
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2 rounded-b-none border border-transparent px-5 py-2.5 data-[state=active]:border-border data-[state=active]:border-b-background data-[state=active]:shadow-none max-[480px]:rounded-md max-[480px]:data-[state=active]:border-primary">
            <LinkIcon className="h-4 w-4" aria-hidden="true" />
            {t('tabUrl')}
          </TabsTrigger>
          <TabsTrigger value="ai" disabled>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {t('tabAi')}
            <Lock className="h-3.5 w-3.5 opacity-50" aria-label={t('locked')} />
            <Badge variant="default" className="ml-1.5 bg-amber-500 text-white hover:bg-amber-500">{t('proBadge')}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-4 space-y-4">
          <div className="relative">
            <Textarea
              placeholder={t('placeholderText')}
              aria-label={t('textInputLabel')}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              spellCheck={false}
              className="h-[250px] resize-y border-[1.5px] p-4 text-[15px] leading-relaxed"
            />
            <span className="pointer-events-none absolute right-3 bottom-3 text-xs text-muted-foreground">
              {t('characters', { count: charCount.toLocaleString() })}
            </span>
          </div>
          <Button onClick={handleExtract} disabled={loading || !textInput.trim()} className="mx-auto flex h-12 w-full max-w-[300px] text-base">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                {t('extracting')}
              </span>
            ) : t('extract')}
          </Button>
        </TabsContent>

        <TabsContent value="url" className="mt-4 space-y-4">
          <div className={cn('flex items-center rounded-md border-[1.5px] border-input bg-background transition-colors focus-within:border-ring', urlError && 'border-destructive')}>
            <span className="ps-3 pe-1 font-mono text-sm text-muted-foreground">https://</span>
            <Input
              type="text"
              placeholder={t('placeholderUrl')}
              aria-label={t('urlInputLabel')}
              value={urlInput}
              aria-invalid={!!urlError}
              onBlur={(e) => validateUrl(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void handleExtract();
              }}
              onChange={(e) => {
                setUrlInput(e.target.value.replace(/^https?:\/\//i, ''));
                if (urlError) setUrlError('');
              }}
              className="border-0 bg-transparent ps-1 shadow-none focus-visible:ring-0"
            />
          </div>
          {urlError && <p className="text-sm text-destructive">{urlError}</p>}
          <Button onClick={handleExtract} disabled={loading || !urlInput.trim()} className="mx-auto flex h-12 w-full max-w-[300px] text-base">
            {loading ? t('extracting') : t('extract')}
          </Button>
        </TabsContent>

        <TabsContent value="ai" className="mt-4 space-y-4">
          <div className="flex items-center gap-2 rounded-md bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-700 dark:text-amber-300">
            <Lock className="h-4 w-4" aria-hidden="true" />
            {t('aiLockedBanner')}
            <span className="ms-auto font-bold text-amber-600 dark:text-amber-300">{t('proBadge')}</span>
          </div>
          <div className="relative">
            <Textarea
              placeholder={t('placeholderText')}
              aria-label={t('aiInputLabel')}
              disabled
              value={t('aiSampleText')}
              className="h-[250px] resize-y opacity-50"
            />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-md bg-background/85 p-6 text-center backdrop-blur-sm">
              <Lock className="h-9 w-9 text-muted-foreground/60" aria-hidden="true" />
              <p className="max-w-xs text-sm text-muted-foreground">{t('aiLockedDesc')}</p>
              <Button type="button" className="bg-amber-500 text-white hover:bg-amber-500/90">
                {t('upgradeToPro')}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {results && results.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            <h2 className="text-center text-base font-semibold text-foreground">
              {t('resultsTitle', { count: sortedResults.length })}
            </h2>
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {(['all', '1word', '2word', '3word'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setResultFilter(f)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                  resultFilter === f ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                )}
              >
                {t(f === 'all' ? 'filterAll' : f === '1word' ? 'filterOneWord' : f === '2word' ? 'filterTwoWord' : 'filterThreeWord')}
              </button>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadCsv} aria-label={t('downloadCsvLabel')}>
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              {t('downloadCsv')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} aria-label={t('copyClipboardLabel')}>
              {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
              {copied ? t('copied') : t('copyClipboard')}
            </Button>
          </div>

          <Table className="rounded-lg border border-border [&_td]:px-4 [&_td]:py-2.5 [&_td]:font-mono [&_td]:text-xs [&_th]:px-4 [&_th]:font-mono [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-normal">
            <caption className="caption-bottom mt-2 text-left text-xs text-muted-foreground">
              {t('tableCaption')}
            </caption>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSortHeader('word', 'asc')}>
                  {t('tableKeyword')}{sortIcon('word')}
                </TableHead>
                <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSortHeader('count', 'desc')}>
                  {t('tableCount')}{sortIcon('count')}
                </TableHead>
                <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSortHeader('density', 'desc')}>
                  {t('tableDensity')}{sortIcon('density')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResults.map((item) => (
                <TableRow key={item.word}>
                  <TableCell className="font-medium">{item.word}</TableCell>
                  <TableCell className="text-right tabular-nums">{item.count}</TableCell>
                  <TableCell className="text-right tabular-nums">{item.density}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={safePage <= 1} aria-label={t('pageFirst')}>
                  {'\u00ab'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage <= 1} aria-label={t('pagePrevious')}>
                  {'\u2039'}
                </Button>
                <div className="flex items-center gap-1">
                  {(() => {
                    const pages: (number | 'e')[] = [];
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      if (safePage > 3) pages.push('e');
                      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
                      if (safePage < totalPages - 2) pages.push('e');
                      pages.push(totalPages);
                    }
                    return pages.map((p, idx) =>
                      p === 'e'
                        ? <span key={`e-${idx}`} className="px-0.5 text-sm text-muted-foreground">{'\u2026'}</span>
                        : <button key={p} onClick={() => setCurrentPage(p)} className={cn('h-8 w-8 rounded-md text-sm font-medium transition-colors', p === safePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>{p}</button>
                    );
                  })()}
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} aria-label={t('pageNext')}>
                  {'\u203a'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={safePage >= totalPages} aria-label={t('pageLast')}>
                  {'\u00bb'}
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">
                {t('pageOf', { current: safePage, total: totalPages })}
              </span>
            </div>
          )}
        </div>
      )}

      {results && results.length === 0 && (
        <div className="mt-8 rounded-lg border border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          {urlError || t('noKeywordsFound')}
        </div>
      )}

      {!results && (
        <div className="mt-8 rounded-lg border border-dashed border-border px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">{t('noResults')}</p>
        </div>
      )}
    </div>
  );
}
