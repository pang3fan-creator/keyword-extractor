import { getTranslations } from 'next-intl/server';

export default async function HowToUseSection() {
  const t = await getTranslations('home');
  const steps = [1, 2, 3];

  return (
    <section className="seo-section" aria-labelledby="how-to-use-title">
      <h2 id="how-to-use-title">{t('seoHowToUseTitle')}</h2>
      <div className="mt-8 flex flex-col items-center gap-6 md:flex-row">
        {steps.map((step, i) => (
          <div
            key={step}
            className="relative w-full flex-1 text-center"
            aria-label={t('seoHowToUseStepLabel', { step })}
          >
            <div className="bg-accent text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl">
              {step}
            </div>
            <h3 className="mb-2 font-semibold">{t(`seoHowStep${step}Title` as never)}</h3>
            <p className="text-muted-foreground text-sm">{t(`seoHowStep${step}Desc` as never)}</p>
            {i < steps.length - 1 && (
              <div className="bg-border absolute top-6 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
