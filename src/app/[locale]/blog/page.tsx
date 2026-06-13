import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { routing } from '@/i18n/routing';
import { createBreadcrumbList, createJsonLdGraph } from '@/lib/schema';
import { buildUrl } from '@/lib/url';

type Props = {
  params: Promise<{ locale: string }>;
};

type BlogTopic = {
  category: string;
  title: string;
  description: string;
  meta: string;
};

const PREVIEW_ARTICLE_PATH = '/blog/how-to-extract-keywords-from-a-webpage';

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
  const t = await getTranslations('blog.metadata');
  const metadataT = await getTranslations('metadata');
  const canonical = buildUrl(locale, '/blog');

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical,
      languages: makeAlternates('/blog'),
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
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
      images: ['https://extractkeywords.com/og-image.png'],
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('blog');
  const navT = await getTranslations('nav');
  const metadataT = await getTranslations('metadata');
  const canonical = buildUrl(locale, '/blog');
  const topics = t.raw('topics') as BlogTopic[];

  const jsonLd = createJsonLdGraph([
    {
      '@type': 'Blog',
      name: t('metadata.schemaName'),
      description: t('metadata.schemaDescription'),
      url: canonical,
      inLanguage: locale,
      dateModified: new Date().toISOString().split('T')[0],
      isPartOf: {
        '@type': 'WebApplication',
        name: metadataT('siteName'),
        url: buildUrl(locale, '/'),
      },
    },
    createBreadcrumbList([
      { name: navT('home'), url: buildUrl(locale, '/') },
      { name: navT('blog'), url: canonical },
    ]),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Breadcrumbs
          items={[
            { label: navT('home'), href: '/' },
            { label: navT('blog') },
          ]}
        />

        <section className="hero">
          <div className="container max-w-[960px]">
            <h1>{t('hero.title')}</h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-[640px] text-sm leading-7">
              {t('hero.subtitle')}
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label={t('aria.scope')}>
          <div className="container max-w-[960px]">
            <div className="seo-section">
              <h2>{t('sections.scopeTitle')}</h2>
              <p>{t('sections.scopeDesc')}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <section aria-label={t('aria.featured')} className="rounded-[10px] border p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h2 className="text-[24px] font-bold tracking-[-0.03em]">
                    {t('sections.featuredTitle')}
                  </h2>
                </div>
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[10px] border border-dashed p-8 text-center">
                  <FileText className="text-muted-foreground mb-4 size-8" aria-hidden="true" />
                  <h3 className="text-base font-semibold">{t('sections.emptyTitle')}</h3>
                  <p className="text-muted-foreground mt-2 max-w-[520px] text-sm leading-6">
                    {t('sections.emptyDesc')}
                  </p>
                </div>
              </section>

              <aside aria-label={t('aria.latest')} className="rounded-[10px] border p-6">
                <h2 className="text-[24px] font-bold tracking-[-0.03em]">
                  {t('sections.latestTitle')}
                </h2>
                <p className="text-muted-foreground mt-4 text-sm leading-6">
                  {t('sections.emptyDesc')}
                </p>
              </aside>
            </div>

            <section className="mt-12" aria-label={t('aria.planned')}>
              <div className="mb-6">
                <h2 className="text-[24px] font-bold tracking-[-0.03em]">
                  {t('sections.plannedTitle')}
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {topics.map((topic, index) => {
                  const card = (
                    <article className="h-full rounded-[10px] border p-5 transition hover:border-primary">
                      <p className="text-primary text-xs font-semibold uppercase tracking-[0.08em]">
                        {topic.category}
                      </p>
                      <h3 className="mt-3 text-base font-semibold leading-6">{topic.title}</h3>
                      <p className="text-muted-foreground mt-3 text-sm leading-6">
                        {topic.description}
                      </p>
                      <p className="text-muted-foreground mt-5 text-xs">{topic.meta}</p>
                    </article>
                  );

                  return index === 0 ? (
                    <Link
                      key={topic.title}
                      href={PREVIEW_ARTICLE_PATH}
                      className="block no-underline"
                    >
                      {card}
                    </Link>
                  ) : (
                    <div key={topic.title}>{card}</div>
                  );
                })}
              </div>
            </section>

            <div className="bottom-cta mt-12">
              <p className="font-semibold text-foreground">{t('cta.title')}</p>
              <p>{t('cta.description')}</p>
              <Link href="/#toolArea">
                {t('cta.link')}
                <ArrowRight className="ms-2 inline size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
