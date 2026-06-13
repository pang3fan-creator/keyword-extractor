import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { routing } from '@/i18n/routing';
import { createBreadcrumbList, createJsonLdGraph } from '@/lib/schema';
import { buildUrl } from '@/lib/url';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const SLUG_NS_MAP: Record<string, string> = {
  'how-to-extract-keywords-from-a-webpage': 'blog.article.howToExtractKeywordsFromAWebpage',
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
  const { locale, slug } = await params;
  const ns = SLUG_NS_MAP[slug];
  if (!ns) return { title: 'Article Not Found', robots: { index: false, follow: false } };

  const t = await getTranslations(`${ns}.metadata`);
  const metadataT = await getTranslations('metadata');
  const canonical = buildUrl(locale, `/blog/${slug}`);

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: true },
    alternates: {
      canonical,
      languages: makeAlternates(`/blog/${slug}`),
    },
    openGraph: {
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
      url: canonical,
      siteName: metadataT('siteName'),
      type: 'article',
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
  const ns = SLUG_NS_MAP[slug];
  const t = await getTranslations('blog.article');

  if (!ns) {
    const navT2 = await getTranslations('nav');

    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Breadcrumbs
            items={[
              { label: navT2('home'), href: '/' },
              { label: navT2('blog'), href: '/blog' },
              { label: t('notFound.title') },
            ]}
          />
          <div className="article-hero">
            <h1>{t('notFound.title')}</h1>
            <p className="article-summary">{t('notFound.description')}</p>
          </div>
          <div className="article-back">
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t('notFound.backToBlog')}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const articleT = await getTranslations(ns);
  const metadataT = await getTranslations('metadata');
  const navT = await getTranslations('nav');

  const category = articleT('category');
  const title = articleT('title');
  const summary = articleT('summary');
  const publishedDate = articleT('publishedDate');
  const readTime = articleT('readTime');
  const authorName = t('authorName');
  const sections = articleT.raw('sections') as Array<{
    heading: string;
    paragraphs: string[];
    list?: string[];
  }>;
  const backToBlog = articleT('backToBlog');
  const relatedTitle = t('relatedArticles.title');
  const canonical = buildUrl(locale, `/blog/${slug}`);

  const relatedArticles = [
    {
      slug: '/blog/how-to-extract-keywords-from-a-webpage',
      category,
      title,
      summary,
      readTime,
    },
  ];

  const jsonLd = createJsonLdGraph([
    {
      '@type': 'BlogPosting',
      headline: title,
      description: summary,
      datePublished: publishedDate,
      author: {
        '@type': 'Organization',
        name: metadataT('siteName'),
        url: buildUrl(locale, '/'),
      },
      url: canonical,
      inLanguage: locale,
      isPartOf: {
        '@type': 'Blog',
        name: 'ExtractKeywords Blog',
        url: buildUrl(locale, '/blog'),
      },
    },
    createBreadcrumbList([
      { name: navT('home'), url: buildUrl(locale, '/') },
      { name: navT('blog'), url: buildUrl(locale, '/blog') },
      { name: title, url: canonical },
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
            { label: title },
          ]}
        />

        <div className="article-hero">
          <h1>{title}</h1>
          <p className="article-summary">{summary}</p>
          <div className="article-meta">
            <span className="text-primary rounded-full border px-3 py-1 text-xs font-medium">
              {category}
            </span>
            <span>·</span>
            <span>{readTime}</span>
            <span>·</span>
            <span>{authorName}</span>
            <span>·</span>
            <span>{publishedDate}</span>
          </div>
        </div>

        <div className="article-content" aria-label={t('labels.content')}>
          {sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {section.list && (
                <ul>
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="article-back">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {backToBlog}
          </Link>
        </div>

        <section className="related-articles" aria-label={t('labels.related')}>
          <h2>{relatedTitle}</h2>
          <div className="related-articles-grid">
            {relatedArticles.map((article) => (
              <Link key={article.slug} href={article.slug} className="related-article-card">
                <span className="card-category">{article.category}</span>
                <div className="card-title">{article.title}</div>
                <div className="card-summary">{article.summary}</div>
                <div className="card-meta">{article.readTime}</div>
              </Link>
            ))}
            {Array.from({ length: Math.max(0, 3 - relatedArticles.length) }).map((_, i) => (
              <div key={`placeholder-${i}`} className="related-article-card">
                <span className="card-category">{t('relatedArticles.placeholderCategory')}</span>
                <div className="card-title">{t('relatedArticles.placeholderTitle')}</div>
                <div className="card-summary">{t('relatedArticles.placeholderSummary')}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
