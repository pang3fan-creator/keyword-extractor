'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface AIInputProps {
  onExtract: (text: string) => void;
  disabled: boolean;
  maxLength: number;
}

export function AIInput({ onExtract, disabled, maxLength }: AIInputProps) {
  const t = useTranslations('home');
  const [text, setText] = useState('');
  const canExtract = text.trim().length > 0 && text.length <= maxLength && !disabled;

  return (
    <div className="input-group">
      <textarea
        id="aiInput"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('ai.placeholder')}
        spellCheck={false}
        aria-label={t('ai.inputLabel')}
      />
      <div className="char-count">
        {t('characters', { count: text.length.toLocaleString() })}
        {text.length > maxLength && (
          <span style={{ color: 'var(--error)', marginLeft: 8 }}>{t('ai.charLimit')}</span>
        )}
      </div>
      <button
        className="btn-extract"
        disabled={!canExtract}
        onClick={() => onExtract(text)}
        type="button"
      >
        <span className="btn-text">{t('ai.extract')}</span>
      </button>
    </div>
  );
}
