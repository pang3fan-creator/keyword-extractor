import { useTranslations } from 'next-intl';

export function AILoadingState() {
  const t = useTranslations('home');

  return (
    <div className="ai-loading">
      <div className="spinner" />
      <p className="text">{t('ai.analyzing')}</p>
      <div className="loading-dots">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  );
}
