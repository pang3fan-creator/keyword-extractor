'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type FaqItem = {
  question: string;
  answer: string;
};

export function PricingFaqSection() {
  const t = useTranslations('pricing');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => setOpenIndex(openIndex === index ? null : index);

  const items = t.raw('faq') as FaqItem[];

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className={cn('faq-item', openIndex === i && 'open')}>
          <button
            className="faq-question"
            aria-expanded={openIndex === i}
            onClick={() => toggle(i)}
            type="button"
          >
            {item.question}
            <span className="faq-arrow">&#9662;</span>
          </button>
          <div className="faq-answer">{item.answer}</div>
        </div>
      ))}
    </div>
  );
}
