'use client';

import { useTranslations } from 'next-intl';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export function FaqSection() {
  const t = useTranslations('home');

  return (
    <div>
      <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
        {t('seoFaqTitle')}
      </h2>
      <Accordion className="mx-auto max-w-2xl">
        {[1, 2, 3, 4].map((i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
              {t(`seoFaq${i}Q` as never)}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {t(`seoFaq${i}A` as never)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
