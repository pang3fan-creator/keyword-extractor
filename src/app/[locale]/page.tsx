import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolSection } from '@/components/extractor/ToolSection';
import { FaqSection } from '@/components/seo/FaqSection';
import HowToUseSection from '@/components/seo/HowToUseSection';
import UseCasesSection from '@/components/seo/UseCasesSection';
import HowItWorksSection from '@/components/seo/HowItWorksSection';

export default async function HomePage() {
  const t = await getTranslations('home');
  const metadataT = await getTranslations('metadata');

  const dateModified = new Date().toISOString().split('T')[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: metadataT('siteName'),
        url: 'https://extractkeywords.com',
        description: metadataT('description'),
        logo: 'https://extractkeywords.com/og-image.png',
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'support@extractkeywords.com',
          contactType: 'customer support',
        },
      },
      {
        '@type': 'WebSite',
        name: metadataT('siteName'),
        url: 'https://extractkeywords.com',
        description: metadataT('description'),
        inLanguage: 'en',
      },
      {
        '@type': 'WebApplication',
        name: metadataT('siteName'),
        url: 'https://extractkeywords.com',
        description: metadataT('openGraphDescription'),
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript',
        inLanguage: 'en',
        dateModified,
        offers: [
          {
            '@type': 'Offer',
            name: 'Free',
            price: '0',
            priceCurrency: 'USD',
            description: 'Text and URL keyword extraction up to 10,000 characters per submission.',
          },
          {
            '@type': 'Offer',
            name: 'Pro',
            price: '9.99',
            priceCurrency: 'USD',
            description:
              'AI-powered semantic extraction, higher limits, and priority access. Planned for future release.',
            availability: 'https://schema.org/PreOrder',
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
    ],
  };

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
