import { useTranslations } from 'next-intl';

interface AIQuotaDisplayProps {
  remaining: number;
}

export function AIQuotaDisplay({ remaining }: AIQuotaDisplayProps) {
  const t = useTranslations('home');

  return (
    <p className="ai-quota">{t('ai.quotaRemaining', { count: remaining.toLocaleString() })}</p>
  );
}
