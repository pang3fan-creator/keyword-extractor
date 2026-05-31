'use client';

import { useState } from 'react';
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
              {sortedResults.map((item) => (
                <Tr key={item.word}>
                  <Td className="font-medium">{item.word}</Td>
                  <Td className="text-right tabular-nums">{item.count}</Td>
                  <Td className="text-right tabular-nums">{item.density}%</Td>
                </Tr>
              ))}
            </TableBody>
          </Table>
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
