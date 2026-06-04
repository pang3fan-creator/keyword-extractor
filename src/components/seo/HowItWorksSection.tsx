import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';

const HOW_KEYS = ['Stats', 'Filter', 'Phrase'] as const;

export default async function HowItWorksSection() {
  const t = await getTranslations('home');

  return (
    <section className="seo-section" aria-labelledby="how-it-works-title">
      <h2 id="how-it-works-title">{t('seoHowTitle')}</h2>
      <p className="text-muted-foreground mt-4 text-center">{t('seoHowUrlNote')}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {HOW_KEYS.map((key, i) => (
          <div
            key={key}
            className={cn(
              'seo-feature-card border-border hover:border-primary flex flex-col items-center rounded-[12px] border p-3 text-center transition hover:shadow-sm',
            )}
          >
            <div className="seo-feature-badge bg-primary text-primary-foreground mx-auto flex h-10 w-10 items-center justify-center rounded-full text-lg">
              {i + 1}
            </div>
            <h3 className="seo-feature-heading text-lg font-semibold">
              {t(`seoHow${key}Title` as never)}
            </h3>
            <p className="seo-feature-body text-muted-foreground text-sm">
              {t(`seoHow${key}Desc` as never)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
