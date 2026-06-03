'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';

interface KeywordItem {
  word: string;
  count: number;
  density: number;
}

const PAGE_SIZE = 20;
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
]);

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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [results, resultFilter, sortField, sortDir]);

  const charCount = textInput.length;

  const validateUrl = (value: string) => {
    if (!value) { setUrlError(''); return; }
    try { new URL(value); setUrlError(''); }
    catch { setUrlError(t('invalidUrl')); }
  };

  const extractKeywords = (text: string): KeywordItem[] => {
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    const freq: Record<string, number> = {};
    words.forEach((w) => {
      const cleaned = w.replace(/[^a-z0-9-]/g, '');
      if (cleaned.length < 2 || STOP_WORDS.has(cleaned)) return;
      freq[cleaned] = (freq[cleaned] || 0) + 1;
    });
    const total = Object.values(freq).reduce((a, b) => a + b, 0);
    return Object.entries(freq)
      .map(([word, count]) => ({ word, count, density: Math.round((count / (total || 1)) * 10000) / 100 }))
      .sort((a, b) => b.count - a.count);
  };

  const extractPhrases = (text: string, n: number): KeywordItem[] => {
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    const cleaned = words.map((w) => w.replace(/[^a-z0-9-]/g, '')).filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
    const map: Record<string, number> = {};
    for (let i = 0; i <= cleaned.length - n; i++) {
      const phrase = cleaned.slice(i, i + n).join(' ');
      map[phrase] = (map[phrase] || 0) + 1;
    }
    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(map)
      .map(([word, count]) => ({ word, count, density: Math.round((count / total) * 10000) / 100 }))
      .sort((a, b) => b.count - a.count);
  };

  const handleExtract = () => {
    if (activeTab === 'url') { validateUrl(urlInput); try { new URL(urlInput); } catch { return; } }
    setLoading(true);
    setUrlError('');

    // Simulate extraction (replace with real API call later)
    const sourceText = activeTab === 'url' ? 'Sample content from URL extraction results for testing.' : textInput;
    setTimeout(() => {
      setResults(extractKeywords(sourceText));
      setBigrams(extractPhrases(sourceText, 2));
      setTrigrams(extractPhrases(sourceText, 3));
      setResultFilter('1word');
      setLoading(false);
    }, 400);
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
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'keywords.csv';
    a.click();
    URL.revokeObjectURL(a.href);
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
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="text">{t('tabText')}</TabsTrigger>
          <TabsTrigger value="url">{t('tabUrl')}</TabsTrigger>
          <TabsTrigger value="ai" disabled>
            {t('tabAi')}
            <Badge variant="default" className="ml-1.5 bg-amber-500 text-white hover:bg-amber-500">{t('proBadge')}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-4 space-y-4">
          <div className="relative">
            <Textarea
              placeholder={t('placeholderText')}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="h-64"
            />
            <span className="pointer-events-none absolute right-3 bottom-3 text-xs text-muted-foreground">
              {t('characters', { count: charCount.toLocaleString() })}
            </span>
          </div>
          <Button onClick={handleExtract} disabled={loading || !textInput.trim()} className="w-full h-11 text-base">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                {t('extracting')}
              </span>
            ) : t('extract')}
          </Button>
        </TabsContent>

        <TabsContent value="url" className="mt-4 space-y-4">
          <Input
            type="url"
            placeholder={t('placeholderUrl')}
            value={urlInput}
            aria-invalid={!!urlError}
            onChange={(e) => { setUrlInput(e.target.value); validateUrl(e.target.value); }}
          />
          {urlError && <p className="text-sm text-destructive">{urlError}</p>}
          <Button onClick={handleExtract} disabled={loading || !urlInput.trim()} className="w-full h-11 text-base">
            {loading ? t('extracting') : t('extract')}
          </Button>
        </TabsContent>

        <TabsContent value="ai" className="mt-4 space-y-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
            AI-powered semantic extraction uses DeepSeek to understand context and meaning, not just word frequency. Available with Pro subscription.
          </div>
          <Textarea
            placeholder={t('placeholderText')}
            disabled
            className="h-64 opacity-50"
          />
          <Button onClick={() => alert('AI extraction requires a Pro subscription.')} className="w-full h-11 text-base">
            {t('extract')}
          </Button>
        </TabsContent>
      </Tabs>

      {results && results.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {t('results', { count: sortedResults.length })}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>{copied ? t('copied') : t('copyClipboard')}</Button>
              <Button variant="outline" size="sm" onClick={handleDownloadCsv}>{t('downloadCsv')}</Button>
            </div>
          </div>

          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(['1word', '2word', '3word'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setResultFilter(f)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  resultFilter === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t(f === '1word' ? 'filterOneWord' : f === '2word' ? 'filterTwoWord' : 'filterThreeWord')}
              </button>
            ))}
          </div>

          <Table className="rounded-lg border border-border [&_td]:px-4 [&_td]:py-2.5 [&_th]:px-4">
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
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={safePage <= 1}>
                  {t('pageFirst')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}>
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
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>
                  {t('pageNext')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={safePage >= totalPages}>
                  {t('pageLast')}
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
