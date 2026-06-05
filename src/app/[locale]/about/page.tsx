import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { buildUrl } from '@/lib/url';
import { cn } from '@/lib/utils';
import { routing } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

function makeAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = buildUrl(locale, path);
  }
  languages['x-default'] = buildUrl(routing.defaultLocale, path);
  return languages;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('about.metadata');
  const metadataT = await getTranslations('metadata');
  const canonical = buildUrl(locale, '/about');

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages: makeAlternates('/about'),
    },
    openGraph: {
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
      url: canonical,
      siteName: metadataT('siteName'),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const t = await getTranslations('about');
  const metadataT = await getTranslations('metadata');
  const { locale } = await params;
  const canonical = buildUrl(locale, '/about');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: t('metadata.schemaName'),
    description: t('metadata.schemaDescription'),
    url: canonical,
    inLanguage: 'en',
    dateModified: new Date().toISOString().split('T')[0],
    isPartOf: {
      '@type': 'WebApplication',
      name: metadataT('siteName'),
      url: buildUrl(locale, '/'),
    },
  };

  const principles = [
    { icon: 'sparkles', key: 'free' },
    { icon: 'shield', key: 'privacy' },
    { icon: 'zap', key: 'practical' },
  ] as const;

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
            <h1>{t('heroTitle')}</h1>
            <p className="text-muted-foreground mt-2 text-sm">{t('lastUpdated')}</p>
          </div>
        </section>

        <section className="seo-content" aria-label={t('whatTitle')}>
          <div className="container">
            <div className="seo-section">
              <h2>{t('whatTitle')}</h2>
              <p>{t('whatDesc')}</p>
              <p
                className="text-muted-foreground max-w-65ch mt-4 leading-relaxed"
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
              >
                {t('whatDesc2')}
              </p>
              <p
                className="text-muted-foreground max-w-65ch mt-4 leading-relaxed"
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
              >
                {t('whatDesc3')}
              </p>
            </div>

            <div className="seo-section">
              <h2>{t('principlesTitle')}</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {principles.map(({ icon, key }) => (
                  <div
                    key={key}
                    className="seo-feature-card border-border hover:border-primary flex flex-col items-center rounded-[12px] border p-3 text-center transition hover:shadow-sm"
                  >
                    <div className="seo-feature-badge bg-accent text-primary mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-lg">
                      {icon === 'sparkles' && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M12 3v2m0 14v2m-9-9h2m14 0h2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
                          <circle cx="12" cy="12" r="4" />
                        </svg>
                      )}
                      {icon === 'shield' && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                        </svg>
                      )}
                      {icon === 'zap' && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      )}
                    </div>
                    <h3 className="seo-feature-heading text-lg font-semibold">
                      {t(`principlesCard${key.charAt(0).toUpperCase() + key.slice(1)}Title`)}
                    </h3>
                    <p className="seo-feature-body text-muted-foreground text-sm">
                      {t(`principlesCard${key.charAt(0).toUpperCase() + key.slice(1)}Desc`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="seo-section">
              <h2>{t('whyTitle')}</h2>
              <p>{t('whyDesc')}</p>
              <p
                className="text-muted-foreground max-w-65ch mt-4 leading-relaxed"
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
              >
                {t('whyDesc2')}
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link href="/" className={cn('privacy-back-link')}>
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                {t('backHome')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
