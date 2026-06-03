'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export function FaqSection() {
  const t = useTranslations('home');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="seo-section">
      <h2>{t('seoFaqTitle')}</h2>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={cn('faq-item', openIndex === i && 'open')}>
          <button
            className="faq-question"
            aria-expanded={openIndex === i}
            onClick={() => toggle(i)}
            type="button"
          >
            {t(`seoFaq${i}Q` as never)}
            <span className="faq-arrow">&#x25BE;</span>
          </button>
          <div className="faq-answer">{t(`seoFaq${i}A` as never)}</div>
        </div>
      ))}
    </div>
  );
}
