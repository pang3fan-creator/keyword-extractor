import { getTranslations } from 'next-intl/server';

const USE_CASE_KEYS = ['Seo', 'Content', 'Academic', 'Marketing'] as const;

export default async function UseCasesSection() {
  const t = await getTranslations('home');

  return (
    <section className="seo-section" aria-labelledby="use-cases-title">
      <h2 id="use-cases-title">{t('seoUseTitle')}</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {USE_CASE_KEYS.map((key) => (
          <div key={key} className="border-border rounded-xl border p-6">
            <h3 className="mb-2 text-lg font-semibold">{t(`seoUse${key}Title` as never)}</h3>
            <p className="text-muted-foreground text-sm">{t(`seoUse${key}Desc` as never)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
