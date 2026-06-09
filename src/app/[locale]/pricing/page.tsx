import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PricingCheckoutActions } from '@/components/billing/PricingCheckoutActions';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PricingFaqSection } from '@/components/seo/PricingFaqSection';
import { createBreadcrumbList, createJsonLdGraph } from '@/lib/schema';
import { buildUrl } from '@/lib/url';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ checkout?: string }>;
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
  const t = await getTranslations('pricing.metadata');
  const metadataT = await getTranslations('metadata');
  const canonical = buildUrl(locale, '/pricing');

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages: makeAlternates('/pricing'),
    },
    openGraph: {
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
      url: canonical,
      siteName: metadataT('siteName'),
      type: 'website',
      images: [{ url: 'https://extractkeywords.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitterTitle'),
      description: t('twitterDescription'),
      images: ['https://extractkeywords.com/og-image.png'],
    },
  };
}

type RowStyle = 'unlimited' | 'comingSoon' | 'planned';

type ComparisonRow = {
  key: string;
  feature: string;
  free: boolean | string;
  pro: boolean | string;
  proStyle?: RowStyle;
};

type ProFeature = {
  text: string;
  status?: 'comingSoon' | 'planned';
};

type CellLabels = {
  included: string;
  notAvailable: string;
  free: string;
  pro: string;
  planned: string;
};

function renderComparisonValue(
  value: boolean | string,
  isPro: boolean,
  rowStyle: RowStyle | undefined,
  labels: CellLabels,
) {
  if (value === true) {
    return (
      <span className="check" aria-label={labels.included}>
        ✓
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="dash" aria-label={labels.notAvailable}>
        —
      </span>
    );
  }
  if (isPro && rowStyle) {
    if (rowStyle === 'comingSoon') {
      return <span className="pro-label">{value as string}</span>;
    }
    if (rowStyle === 'unlimited') {
      return <span className="pro-label">{value as string}</span>;
    }
    return <span className="cell-label">{value as string}</span>;
  }
  return value as string;
}

function renderComparisonCell(
  value: boolean | string,
  isPro: boolean,
  rowStyle: RowStyle | undefined,
  labels: CellLabels,
) {
  const dataLabel = isPro ? labels.pro : labels.free;

  if (value === true) {
    return (
      <td className={isPro ? 'pro-cell' : ''} data-label={dataLabel}>
        {renderComparisonValue(value, isPro, rowStyle, labels)}
      </td>
    );
  }
  if (value === false) {
    return (
      <td className={isPro ? 'pro-cell' : ''} data-label={dataLabel}>
        {renderComparisonValue(value, isPro, rowStyle, labels)}
      </td>
    );
  }
  if (isPro && rowStyle) {
    return (
      <td className="pro-cell" data-label={labels.pro}>
        {renderComparisonValue(value, isPro, rowStyle, labels)}
      </td>
    );
  }
  return <td data-label={dataLabel}>{value as string}</td>;
}

export default async function PricingPage({ params, searchParams }: Props) {
  const t = await getTranslations('pricing');
  const navT = await getTranslations('nav');
  const { locale } = await params;
  const query = await searchParams;
  const canonical = buildUrl(locale, '/pricing');

  const jsonLd = createJsonLdGraph([
    {
      '@type': 'Product',
      name: t('schema.productName'),
      description: t('schema.productDescription'),
      url: canonical,
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
    createBreadcrumbList([
      { name: navT('home'), url: buildUrl(locale, '/') },
      { name: navT('pricing'), url: canonical },
    ]),
  ]);

  const comparisonRows = t.raw('comparison.rows') as ComparisonRow[];
  const freeFeatures = t.raw('cards.free.features') as string[];
  const proFeatures = t.raw('cards.pro.features') as ProFeature[];

  const cellLabels: CellLabels = {
    included: t('comparison.included'),
    notAvailable: t('comparison.notAvailable'),
    free: t('comparison.colFree'),
    pro: t('comparison.colPro'),
    planned: t('comparison.labelPlanned'),
  };

  const comingSoonLabel = t('comparison.labelComingSoon');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Breadcrumbs items={[{ label: navT('home'), href: '/' }, { label: navT('pricing') }]} />

        {query?.checkout === 'success' && (
          <div className="pricing-status-message" role="status">
            {t('checkout.success')}
          </div>
        )}

        <section className="hero">
          <h1>{t('hero.title')}</h1>
          <p className="subtitle">{t('hero.subtitle')}</p>
        </section>

        <section className="px-6 pb-16" aria-label={t('aria.pricingTable')}>
          <h2
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
            }}
          >
            {t('aria.pricingTable')}
          </h2>
          <div className="pricing-grid">
            <article className="pricing-card" aria-label={t('aria.freeCard')}>
              <div className="plan-name">{t('cards.free.title')}</div>
              <p className="plan-desc">{t('cards.free.desc')}</p>
              <div className="price-row price-free">
                <span className="amount">{t('cards.free.price')}</span>
                <span className="period">{t('cards.free.period')}</span>
              </div>
              <ul className="feature-list" aria-label={t('aria.freeFeatures')}>
                {freeFeatures.map((feature) => (
                  <li key={feature}>
                    <span className="icon pricing-icon-check" aria-hidden="true">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 9l3 3 7-7" />
                      </svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/#toolArea" className="cta cta-primary">
                {t('cards.free.cta')}
              </Link>
            </article>

            <article className="pricing-card pricing-card-pro" aria-label={t('aria.proCard')}>
              <span className="badge badge-pro">{t('cards.pro.badge')}</span>
              <div className="plan-name">{t('cards.pro.title')}</div>
              <p className="plan-desc">{t('cards.pro.desc')}</p>
              <div className="price-row price-dual">
                <div className="price-line">
                  <span className="amount">{t('cards.pro.priceMonthly')}</span>
                  <span className="period">{t('cards.pro.periodMonthly')}</span>
                </div>
                <div className="price-line">
                  <span className="amount">{t('cards.pro.priceYearly')}</span>
                  <span className="period">{t('cards.pro.periodYearly')}</span>
                  <span className="save">{t('cards.pro.saveLabel')}</span>
                </div>
              </div>
              <ul className="feature-list" aria-label={t('aria.proFeatures')}>
                {proFeatures.map((feature) => {
                  const status = feature.status ?? null;
                  const label =
                    status === 'comingSoon'
                      ? comingSoonLabel
                      : status === 'planned'
                        ? cellLabels.planned
                        : null;

                  return (
                    <li key={feature.text}>
                      <span
                        className={cn(
                          'icon',
                          status === 'comingSoon' ? 'pricing-icon-pro' : 'pricing-icon-check',
                        )}
                        aria-hidden="true"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 9l3 3 7-7" />
                        </svg>
                      </span>
                      {feature.text}
                      {label && <span className="pricing-label-muted">{label}</span>}
                    </li>
                  );
                })}
              </ul>
              <PricingCheckoutActions />
            </article>
          </div>
        </section>

        <section className="px-6 pb-16" aria-label={t('aria.comparisonTable')}>
          <h2 className="mb-8 text-center text-[24px] font-bold tracking-[-0.03em]">
            {t('comparison.title')}
          </h2>
          <div className="comparison-table-wrap" style={{ maxWidth: 880, margin: '0 auto' }}>
            <table className="comparison-table">
              <caption
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                  clip: 'rect(0 0 0 0)',
                }}
              >
                {t('comparison.caption')}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{t('comparison.colFeature')}</th>
                  <th scope="col">{t('comparison.colFree')}</th>
                  <th scope="col" className="pro-header">
                    {t('comparison.colPro')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.key}>
                    <td>{row.feature}</td>
                    {renderComparisonCell(row.free, false, undefined, cellLabels)}
                    {renderComparisonCell(row.pro, true, row.proStyle, cellLabels)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="comparison-mobile-list" aria-label={t('comparison.caption')}>
            {comparisonRows.map((row) => {
              return (
                <article className="comparison-mobile-row" key={row.key}>
                  <h3>{row.feature}</h3>
                  <div className="comparison-mobile-values">
                    <div>
                      <span className="comparison-mobile-label">{cellLabels.free}</span>
                      <span className="comparison-mobile-value">
                        {renderComparisonValue(row.free, false, undefined, cellLabels)}
                      </span>
                    </div>
                    <div className="comparison-mobile-pro">
                      <span className="comparison-mobile-label">{cellLabels.pro}</span>
                      <span className="comparison-mobile-value">
                        {renderComparisonValue(row.pro, true, row.proStyle, cellLabels)}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="px-6 pb-16" aria-label={t('aria.faqSection')}>
          <h2 className="mb-8 text-center text-[24px] font-bold tracking-[-0.03em]">
            {t('faqHeading')}
          </h2>
          <div className="mx-auto max-w-[880px]">
            <PricingFaqSection />
          </div>
        </section>

        <section className="bottom-cta">
          <h2 className="mb-2.5 text-[24px] font-bold tracking-[-0.03em]">{t('cta.title')}</h2>
          <p className="mb-5">
            <Link href="/">{t('cta.subtitleLink')}</Link>
            {t('cta.subtitleRest')}
          </p>
          <p className="text-muted-foreground mt-4 text-center text-xs">{t('lastUpdated')}</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
