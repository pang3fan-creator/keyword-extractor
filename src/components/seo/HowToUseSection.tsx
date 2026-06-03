import { getTranslations } from 'next-intl/server';

export default async function HowToUseSection() {
  const t = await getTranslations('home');
  const steps = [1, 2, 3];

  return (
    <section className="seo-section" aria-labelledby="how-to-use-title">
      <h2 id="how-to-use-title">{t('seoHowToUseTitle')}</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step} className="border-border rounded-xl border p-6">
            <div className="text-primary mb-2 text-sm font-bold">
              {t('seoHowToUseStepLabel', { step })}
            </div>
            <h3 className="mb-2 text-lg font-semibold">{t(`seoHowStep${step}Title` as never)}</h3>
            <p className="text-muted-foreground text-sm">{t(`seoHowStep${step}Desc` as never)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
