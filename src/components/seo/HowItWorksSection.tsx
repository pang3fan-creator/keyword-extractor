import { getTranslations } from 'next-intl/server';

const HOW_KEYS = ['Stats', 'Filter', 'Phrase'] as const;

export default async function HowItWorksSection() {
  const t = await getTranslations('home');

  return (
    <section className="seo-section" aria-labelledby="how-it-works-title">
      <h2 id="how-it-works-title">{t('seoHowTitle')}</h2>
      <p className="text-muted-foreground mt-4">{t('seoHowUrlNote')}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {HOW_KEYS.map((key) => (
          <div key={key} className="border-border rounded-xl border p-6">
            <h3 className="mb-2 text-lg font-semibold">{t(`seoHow${key}Title` as never)}</h3>
            <p className="text-muted-foreground text-sm">{t(`seoHow${key}Desc` as never)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
