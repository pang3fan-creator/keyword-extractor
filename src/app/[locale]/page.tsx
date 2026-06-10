import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolSection } from '@/components/extractor/ToolSection';
import { FaqSection } from '@/components/seo/FaqSection';
import HowToUseSection from '@/components/seo/HowToUseSection';
import UseCasesSection from '@/components/seo/UseCasesSection';
import HowItWorksSection from '@/components/seo/HowItWorksSection';
import { routing } from '@/i18n/routing';
import { createBreadcrumbList, createJsonLdGraph } from '@/lib/schema';
import { buildUrl } from '@/lib/url';

export default async function HomePage() {
  const t = await getTranslations('home');
  const metadataT = await getTranslations('metadata');
  const navT = await getTranslations('nav');

  const dateModified = new Date().toISOString().split('T')[0];
  const homeUrl = buildUrl(routing.defaultLocale, '/');

  const jsonLd = createJsonLdGraph([
    {
      '@type': 'Organization',
      name: metadataT('siteName'),
      url: homeUrl,
      description: metadataT('description'),
      logo: 'https://extractkeywords.com/og-image.png',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@extractkeywords.com',
        contactType: t('schema.contactType'),
      },
    },
    {
      '@type': 'WebSite',
      name: metadataT('siteName'),
      url: homeUrl,
      description: metadataT('description'),
      inLanguage: routing.defaultLocale,
    },
    {
      '@type': 'WebApplication',
      name: metadataT('siteName'),
      url: homeUrl,
      description: metadataT('openGraphDescription'),
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript',
      inLanguage: routing.defaultLocale,
      dateModified,
      offers: [
        {
          '@type': 'Offer',
          name: t('schema.freeOfferName'),
          price: '0',
          priceCurrency: 'USD',
          description: t('schema.freeOfferDescription'),
        },
        {
          '@type': 'Offer',
          name: t('schema.proOfferName'),
          price: '9.99',
          priceCurrency: 'USD',
          description: t('schema.proOfferDescription'),
          availability: 'https://schema.org/InStock',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: Array.from({ length: 6 }, (_, i) => i + 1).map((index) => ({
        '@type': 'Question',
        name: t(`seoFaq${index}Q` as never),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t(`seoFaq${index}A` as never),
        },
      })),
    },
    createBreadcrumbList([{ name: navT('home'), url: homeUrl }]),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="hero">
          <div className="container">
            <h1>{t('title')}</h1>
            <p className="subtitle">{t('subtitle')}</p>
          </div>
        </section>

        <section className="container" id="toolArea" aria-label={t('title')}>
          <div className="tool-area">
            <ToolSection />
          </div>
        </section>

        <section className="seo-content" id="seoContent" aria-label={t('seoContentLabel')}>
          <div className="container">
            <HowItWorksSection />
            <HowToUseSection />
            <UseCasesSection />

            <FaqSection />

            <div className="bottom-cta">
              <a href="#toolArea">{t('seoCtaButton')} &rarr;</a>
              <p className="text-muted-foreground mt-4 text-center text-xs">{t('lastUpdated')}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
