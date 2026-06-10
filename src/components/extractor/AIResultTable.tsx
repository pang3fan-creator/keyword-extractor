import { useTranslations } from 'next-intl';
import { RelevanceBar } from './RelevanceBar';
import { CategoryPill } from './CategoryPill';
import type { AIKeyword } from '@/types';

interface AIResultTableProps {
  keywords: AIKeyword[];
}

export function AIResultTable({ keywords }: AIResultTableProps) {
  const t = useTranslations('home');

  return (
    <div className="ai-results-table">
      <div className="table-wrap">
        <table>
          <caption className="sr-only">{t('tableCaption')}</caption>
          <thead>
            <tr>
              <th>{t('tableKeyword')}</th>
              <th className="relevance-col">{t('ai.relevance')}</th>
              <th className="category-col">{t('ai.category')}</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((k) => (
              <tr key={k.keyword}>
                <td>{k.keyword}</td>
                <td>
                  <RelevanceBar value={k.relevance} />
                </td>
                <td>
                  <CategoryPill category={k.category} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
