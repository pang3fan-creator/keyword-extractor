import { useTranslations } from 'next-intl';

const AI_ERROR_KEYS: Record<string, string> = {
  PRO_REQUIRED: 'errors.proRequired',
  AI_LIMIT_REACHED: 'errors.aiLimitReached',
  AI_TIMEOUT: 'errors.aiTimeout',
  AI_FAILED: 'errors.aiFailed',
  AI_CONFIG_MISSING: 'errors.aiConfigMissing',
};

interface AIErrorDisplayProps {
  errorCode: string;
  onRetry: () => void;
  onSwitchToBasic: () => void;
}

export function AIErrorDisplay({ errorCode, onRetry, onSwitchToBasic }: AIErrorDisplayProps) {
  const t = useTranslations('home');
  const message = AI_ERROR_KEYS[errorCode]
    ? t(AI_ERROR_KEYS[errorCode] as never)
    : t('extractFailed');
  const isTimeout = errorCode === 'AI_TIMEOUT' || errorCode === 'AI_FAILED';

  return (
    <div className="ai-error">
      <p className="message">{message}</p>
      <div className="actions">
        {isTimeout && (
          <button className="btn-retry" onClick={onRetry} type="button">
            {t('ai.retry')}
          </button>
        )}
        <button className="btn-basic" onClick={onSwitchToBasic} type="button">
          {t('ai.useBasicExtraction')}
        </button>
      </div>
    </div>
  );
}
