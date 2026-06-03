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

        <section className="hero">
          <div className="container">
            <h1>{t('title')}</h1>
            <p className="subtitle">{t('subtitle')}</p>
          </div>
        </section>

        <section className="container" aria-label={t('title')}>
          <div className="tool-area">
            <ToolSection />
          </div>
        </section>

        <section className="seo-content" id="seoContent" aria-label="About this tool">
          <div className="container">
            <div className="seo-section">
              <h2>{t('seoHowTitle')}</h2>
              <p>{t('seoHowDesc1')}</p>
              <p>{t('seoHowDesc2')}</p>
            </div>

            <div className="seo-section">
              <h2>{t('seoWhyTitle')}</h2>
              <p>{t('seoWhyDesc')}</p>
            </div>

            <div className="seo-section">
              <h2>{t('seoUseTitle')}</h2>
              <ul>
                {[1, 2, 3, 4, 5].map((index) => (
                  <li key={index}>{t(`seoUse${index}` as never)}</li>
                ))}
              </ul>
            </div>

            <FaqSection />

            <div className="bottom-cta">
              <p>{t('seoCtaDesc')}</p>
              <a href="#toolArea">{t('seoCtaButton')} &rarr;</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
