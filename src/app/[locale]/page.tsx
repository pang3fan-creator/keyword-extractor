import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolSection } from '@/components/extractor/ToolSection';
import { FaqSection } from '@/components/seo/FaqSection';

export default async function HomePage() {
  const t = await getTranslations('home');
  const metadataT = await getTranslations('metadata');

  const webApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: metadataT('siteName'),
    url: 'https://extractkeywords.com',
    description: metadataT('openGraphDescription'),
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [1, 2, 3, 4].map((index) => ({
      '@type': 'Question',
      name: t(`seoFaq${index}Q` as never),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`seoFaq${index}A` as never),
      },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <section className="mx-auto max-w-4xl px-5 py-10 text-center sm:px-6 sm:py-16">
          <h1 className="text-[28px] font-extrabold leading-tight tracking-normal text-foreground sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-[15px] text-muted-foreground sm:text-[17px]">
            {t('subtitle')}
          </p>
        </section>

        <section id="toolArea" className="mx-auto max-w-[960px] px-5 pb-12 sm:px-6" aria-label={t('title')}>
          <ToolSection />
        </section>

        <section className="border-t border-border py-12">
          <div className="mx-auto max-w-[700px] space-y-10 px-5 sm:px-6">
            <div className="space-y-3">
              <h2 className="text-center text-2xl font-bold tracking-normal text-foreground">
                {t('seoHowTitle')}
              </h2>
              <p className="text-muted-foreground">{t('seoHowDesc1')}</p>
              <p className="text-muted-foreground">{t('seoHowDesc2')}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-center text-2xl font-bold tracking-normal text-foreground">
                {t('seoWhyTitle')}
              </h2>
              <p className="text-muted-foreground">{t('seoWhyDesc')}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-center text-2xl font-bold tracking-normal text-foreground">
                {t('seoUseTitle')}
              </h2>
              <ul className="grid gap-2">
                {[1, 2, 3, 4, 5].map((index) => (
                  <li key={index} className="relative ps-5 text-muted-foreground before:absolute before:start-0 before:top-3 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/50">
                    {t(`seoUse${index}` as never)}
                  </li>
                ))}
              </ul>
            </div>

            <FaqSection />

            <div className="border-t border-border py-10 text-center">
              <p className="mb-3 text-base text-muted-foreground">{t('seoCtaDesc')}</p>
              <a href="#toolArea" className="font-semibold text-primary hover:underline">
                {t('seoCtaButton')}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
