'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Table, TableHead, Th, TableBody, Tr, Td } from '@/components/ui/Table';

interface KeywordItem {
  word: string;
  count: number;
  density: number;
}

export function ToolSection() {
  const t = useTranslations('home');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [results, setResults] = useState<KeywordItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const charCount = textInput.length;

  const handleExtract = () => {
    setLoading(true);
    setTimeout(() => {
      const sampleText =
        activeTab === 'text' ? textInput : 'Sample content from URL extraction results.';
      const words = sampleText
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      const freq: Record<string, number> = {};
      const stopWords = new Set([
        'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
        'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
        'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
        'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each',
        'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
        'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
      ]);

      words.forEach((w) => {
        const cleaned = w.replace(/[^a-z0-9-]/g, '');
        if (cleaned.length < 2 || stopWords.has(cleaned)) return;
        freq[cleaned] = (freq[cleaned] || 0) + 1;
      });

      const total = Object.values(freq).reduce((a, b) => a + b, 0);
      const items: KeywordItem[] = Object.entries(freq)
        .map(([word, count]) => ({
          word,
          count,
          density: Math.round((count / total) * 10000) / 100,
        }))
        .sort((a, b) => b.count - a.count);

      setResults(items);
      setLoading(false);
    }, 500);
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

  const tabs = [
    {
      id: 'text',
      label: t('tabText'),
      content: (
        <div className="space-y-4">
          <textarea
            className="h-64 w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            placeholder={t('placeholderText')}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">
              {t('characters', { count: charCount.toLocaleString() })}
            </span>
            <Button onClick={handleExtract} disabled={loading || !textInput.trim()}>
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
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleExtract} disabled={loading || !urlInput.trim()}>
              {loading ? t('extracting') : t('extract')}
            </Button>
          </div>
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
              {t('results', { count: results.length })}
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
          <Table>
            <TableHead>
              <Th>Keyword</Th>
              <Th className="text-right">Count</Th>
              <Th className="text-right">Density</Th>
            </TableHead>
            <TableBody>
              {results.map((item) => (
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
          No keywords found. Try pasting more text.
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
