import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { routing } from '@/i18n/routing';
import { createBreadcrumbList, createJsonLdGraph } from '@/lib/schema';
import { buildUrl } from '@/lib/url';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

type ArticleSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

const ARTICLE_SLUG = 'how-to-extract-keywords-from-a-webpage';
const ARTICLE_TRANSLATION_KEY = 'howToExtractKeywordsFromAWebpage';
const ARTICLE_PUBLISHED_ISO = '2026-06-13';

function makeAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = buildUrl(locale, path);
  }
  languages['x-default'] = buildUrl(routing.defaultLocale, path);
  return languages;
}

function assertKnownArticle(slug: string) {
  if (slug !== ARTICLE_SLUG) notFound();
}

export function generateStaticParams() {
  return [{ slug: ARTICLE_SLUG }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  assertKnownArticle(slug);

  const t = await getTranslations(`blog.article.${ARTICLE_TRANSLATION_KEY}.metadata`);
  const metadataT = await getTranslations('metadata');
  const path = `/blog/${slug}`;
  const canonical = buildUrl(locale, path);

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical,
      languages: makeAlternates(path),
    },
    openGraph: {
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
      url: canonical,
      siteName: metadataT('siteName'),
      type: 'article',
      publishedTime: ARTICLE_PUBLISHED_ISO,
      modifiedTime: ARTICLE_PUBLISHED_ISO,
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

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  assertKnownArticle(slug);

  const t = await getTranslations(`blog.article.${ARTICLE_TRANSLATION_KEY}`);
  const navT = await getTranslations('nav');
  const metadataT = await getTranslations('metadata');
  const articleT = await getTranslations('blog.article.labels');
  const path = `/blog/${slug}`;
  const canonical = buildUrl(locale, path);
  const sections = t.raw('sections') as ArticleSection[];

  const jsonLd = createJsonLdGraph([
    {
      '@type': 'BlogPosting',
      headline: t('title'),
      description: t('metadata.schemaDescription'),
      url: canonical,
      inLanguage: locale,
      datePublished: ARTICLE_PUBLISHED_ISO,
      dateModified: ARTICLE_PUBLISHED_ISO,
      author: {
        '@type': 'Organization',
        name: metadataT('siteName'),
      },
      publisher: {
        '@type': 'Organization',
        name: metadataT('siteName'),
        url: buildUrl(locale, '/'),
      },
      isPartOf: {
        '@type': 'Blog',
        name: navT('blog'),
        url: buildUrl(locale, '/blog'),
      },
    },
    createBreadcrumbList([
      { name: navT('home'), url: buildUrl(locale, '/') },
      { name: navT('blog'), url: buildUrl(locale, '/blog') },
      { name: t('title'), url: canonical },
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
            { label: navT('blog'), href: '/blog' },
            { label: t('title') },
          ]}
        />

        <article className="mx-auto w-full max-w-[960px] px-6 py-14 md:py-18">
          <header className="mx-auto max-w-[720px]">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-medium">
              <span className="text-primary rounded-full border px-3 py-1">{t('category')}</span>
              <span className="text-muted-foreground">{t('status')}</span>
              <span className="text-muted-foreground">{t('readTime')}</span>
            </div>
            <h1 className="text-[40px] leading-[1.05] font-bold tracking-[-0.04em] md:text-[56px]">
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-6 text-base leading-8 md:text-lg">
              {t('summary')}
            </p>
            <dl
              className="mt-8 grid gap-4 border-y py-5 text-sm sm:grid-cols-3"
              aria-label={articleT('articleMeta')}
            >
              <div>
                <dt className="text-muted-foreground">{t('publishedLabel')}</dt>
                <dd className="mt-1 font-medium">{t('publishedDate')}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{articleT('category')}</dt>
                <dd className="mt-1 font-medium">{t('category')}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{articleT('readTime')}</dt>
                <dd className="mt-1 font-medium">{t('readTime')}</dd>
              </div>
            </dl>
          </header>

          <div
            className="mx-auto mt-10 max-w-[720px] rounded-[10px] border p-5"
            aria-label={articleT('draftNotice')}
          >
            <h2 className="text-base font-semibold">{t('noticeTitle')}</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">{t('noticeDesc')}</p>
          </div>

          <div className="mx-auto mt-12 max-w-[720px]" aria-label={articleT('content')}>
            {sections.map((section) => (
              <section key={section.heading} className="mt-12 first:mt-0">
                <h2 className="text-[24px] font-bold tracking-[-0.03em]">{section.heading}</h2>
                <div className="mt-5 space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-muted-foreground text-[15px] leading-8">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.list && (
                  <ul className="mt-6 space-y-3">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-3 text-[15px] leading-7">
                        <span className="text-primary mt-2 size-1.5 shrink-0 rounded-full bg-current" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <footer className="mx-auto mt-14 max-w-[720px]" aria-label={articleT('related')}>
            <div className="bottom-cta">
              <p className="font-semibold text-foreground">{t('cta.title')}</p>
              <p>{t('cta.description')}</p>
              <Link href="/#toolArea">
                {t('cta.link')}
                <ArrowRight className="ms-2 inline size-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 text-center">
              <Link href="/blog" className="privacy-back-link">
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                {t('backToBlog')}
              </Link>
            </div>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
}
