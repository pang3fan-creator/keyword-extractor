'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export function FaqSection() {
  const t = useTranslations('home');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
        {t('seoFaqTitle')}
      </h2>
      <div className="mx-auto max-w-2xl divide-y divide-border rounded-lg border border-border bg-background">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-surface/50"
            >
              {t(`seoFaq${i}Q` as never)}
              <svg
                className={cn(
                  'h-4 w-4 shrink-0 text-muted transition-transform duration-200',
                  openIndex === i && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="border-t border-border px-5 pb-4 pt-3">
                <p className="text-sm text-muted">
                  {t(`seoFaq${i}A` as never)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
