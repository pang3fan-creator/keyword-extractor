import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolSection } from '@/components/extractor/ToolSection';
import { FaqSection } from '@/components/seo/FaqSection';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const t = await getTranslations('home');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </section>

        {/* Tool Section */}
        <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <ToolSection />
        </section>

        {/* SEO Content */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="mx-auto max-w-3xl space-y-20 px-4 sm:px-6">

            {/* How it Works */}
            <div>
              <h2 className="mb-10 text-center text-2xl font-bold text-foreground sm:text-3xl">
                {t('seoHowTitle')}
              </h2>
              <div className="flex items-start justify-center">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-start">
                    <div className="flex flex-col items-center text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {step}
                      </span>
                      <h3 className="mt-4 font-semibold text-foreground">
                        {t(`seoHowStep${step}Title` as never)}
                      </h3>
                      <p className="mt-1 max-w-[200px] text-sm text-muted-foreground">
                        {t(`seoHowStep${step}Desc` as never)}
                      </p>
                    </div>
                    {step < 3 && (
                      <div className="mx-4 mt-6 h-0.5 w-12 bg-primary/30 sm:w-24" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Why it Matters */}
            <div>
              <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
                {t('seoWhyTitle')}
              </h2>
              <p className="mb-6 text-center text-muted-foreground">{t('seoWhyDesc')}</p>
              <ul className="mx-auto max-w-lg space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded bg-primary/15 text-xs font-bold text-primary">
                      {'\u2713'}
                    </span>
                    <span className="text-sm text-foreground">{t(`seoWhy${i}` as never)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases */}
            <div>
              <h2 className="mb-10 text-center text-2xl font-bold text-foreground sm:text-3xl">
                {t('seoUseTitle')}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-lg border border-border bg-background px-6 py-5">
                    <h3 className="font-semibold text-foreground">
                      {t(`seoUse${i}Title` as never)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t(`seoUse${i}Desc` as never)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <FaqSection />

            {/* CTA */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                {t('seoCtaTitle')}
              </h2>
              <p className="mt-2 text-muted-foreground">{t('seoCtaDesc')}</p>
              <Button size="lg" asChild className="mt-6">
                <a href="#top">{t('seoCtaButton')}</a>
              </Button>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
