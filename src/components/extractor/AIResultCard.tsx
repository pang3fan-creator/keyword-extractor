import { useTranslations } from 'next-intl';
import { CategoryPill } from './CategoryPill';
import type { AIKeyword } from '@/types';

interface AIResultCardProps {
  keywords: AIKeyword[];
}

export function AIResultCard({ keywords }: AIResultCardProps) {
  const t = useTranslations('home');

  return (
    <div className="ai-results-cards" role="list">
      {keywords.map((k) => (
        <div className="ai-keyword-card" key={k.keyword} role="listitem">
          <div className="keyword">{k.keyword}</div>
          <div className="meta">
            <span>
              {t('ai.relevance')}: {k.relevance.toFixed(2)}
            </span>
            <CategoryPill category={k.category} />
          </div>
        </div>
      ))}
    </div>
  );
}
