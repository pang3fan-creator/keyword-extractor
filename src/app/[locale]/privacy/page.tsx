import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Cookie,
  Eye,
  FileText,
  KeyRound,
  Lock,
  Mail,
  Package,
  Shield,
  User,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { buildUrl } from '@/lib/url';
import { cn } from '@/lib/utils';
import { routing } from '@/i18n/routing';

type PrivacyListItem = {
  label?: string;
  text: string;
  href?: string;
};

type PrivacyTableRow = {
  cells: string[];
};

const sections = [
  { key: 'overview', icon: Shield },
  { key: 'information', icon: Package, table: 'informationTable', highlight: true },
  { key: 'usage', icon: Eye, list: true },
  { key: 'cookies', icon: Cookie, list: true },
  { key: 'thirdParty', icon: KeyRound, table: 'thirdPartyTable' },
  { key: 'security', icon: Lock, list: true },
  { key: 'rights', icon: User, list: true },
  { key: 'contact', icon: Mail, list: true },
  { key: 'changes', icon: FileText },
] as const;

function makeAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = buildUrl(locale, path);
  }
  languages['x-default'] = buildUrl(routing.defaultLocale, path);
  return languages;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('privacy.metadata');
  const metadataT = await getTranslations('metadata');
  const canonical = buildUrl(locale, '/privacy');

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages: makeAlternates('/privacy'),
    },
    openGraph: {
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
      url: canonical,
      siteName: metadataT('siteName'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
    },
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');
  const metadataT = await getTranslations('metadata');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('metadata.schemaName'),
    description: t('metadata.schemaDescription'),
    url: buildUrl(routing.defaultLocale, '/privacy'),
    isPartOf: {
      '@type': 'WebApplication',
      name: metadataT('siteName'),
      url: buildUrl(routing.defaultLocale, '/'),
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .privacy-page-header {
                text-align: center;
                padding: 64px 20px 40px;
              }
              .privacy-page-title {
                font-size: clamp(28px, 4vw, 40px);
                font-weight: 800;
                letter-spacing: -0.04em;
                line-height: 1.2;
                color: var(--foreground);
              }
              .privacy-page-meta {
                margin-top: 8px;
                font-size: 14px;
                color: var(--muted-foreground);
              }
              .privacy-content {
                max-width: 720px;
                margin: 0 auto;
                padding: 0 20px 64px;
              }
              .privacy-card {
                background: var(--card);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 40px 48px;
                box-shadow: 0 1px 4px oklch(0% 0 0 / 0.04);
              }
              .privacy-section {
                margin-bottom: 40px;
              }
              .privacy-section:last-child {
                margin-bottom: 0;
              }
              .privacy-section-title {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 12px;
                letter-spacing: -0.02em;
                display: flex;
                align-items: center;
                gap: 8px;
                color: var(--foreground);
              }
              .privacy-section-icon {
                width: 20px;
                height: 20px;
                color: var(--primary);
                flex-shrink: 0;
              }
              .privacy-paragraph {
                font-size: 16px;
                color: var(--muted-foreground);
                margin-bottom: 10px;
                max-width: 65ch;
                line-height: 1.6;
              }
              .privacy-paragraph:last-child {
                margin-bottom: 0;
              }
              .privacy-list {
                list-style: none;
                padding: 0;
                margin: 8px 0;
                display: flex;
                flex-direction: column;
                gap: 8px;
              }
              .privacy-list-item {
                padding: 6px 0 6px 20px;
                position: relative;
                font-size: 15px;
                color: var(--muted-foreground);
                line-height: 1.6;
              }
              .privacy-list-item::before {
                content: "";
                position: absolute;
                left: 0;
                top: 14px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: var(--primary);
                opacity: 0.5;
              }
              .privacy-list-label {
                font-weight: 600;
                color: var(--foreground);
              }
              .privacy-table-wrap {
                overflow-x: auto;
              }
              .privacy-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
                margin: 12px 0;
              }
              .privacy-table thead {
                background: var(--background);
              }
              .privacy-table th {
                padding: 12px 16px;
                text-align: left;
                font-weight: 600;
                font-size: 13px;
                color: var(--muted-foreground);
                border-bottom: 1px solid var(--border);
                text-transform: uppercase;
                letter-spacing: 0.04em;
                font-family: var(--font-mono);
              }
              .privacy-table td {
                padding: 10px 16px;
                border-bottom: 1px solid var(--border);
                font-family: var(--font-mono);
                font-size: 13px;
                color: var(--muted-foreground);
                line-height: 1.45;
              }
              .privacy-table tr:last-child td {
                border-bottom: 0;
              }
              .privacy-back-link {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                font-weight: 500;
                margin-top: 32px;
                color: var(--muted-foreground);
              }
              .privacy-back-link:hover {
                color: var(--primary);
                text-decoration: none;
              }
              @media (max-width: 768px) {
                .privacy-page-header {
                  padding: 40px 16px 24px;
                }
                .privacy-card {
                  padding: 28px 20px;
                  border-radius: 12px;
                }
              }
              @media (max-width: 480px) {
                .privacy-page-title {
                  font-size: 24px;
                }
                .privacy-card {
                  padding: 20px 16px;
                }
                .privacy-section-title {
                  font-size: 16px;
                }
                .privacy-table {
                  table-layout: fixed;
                }
                .privacy-table th,
                .privacy-table td {
                  overflow-wrap: anywhere;
                }
                .privacy-table,
                .privacy-table tbody,
                .privacy-table tr,
                .privacy-table td {
                  display: block;
                  width: 100%;
                }
                .privacy-table thead {
                  display: none;
                }
                .privacy-table tr {
                  border-bottom: 1px solid var(--border);
                  padding: 8px 0;
                }
                .privacy-table tr:last-child {
                  border-bottom: 0;
                }
                .privacy-table td {
                  border-bottom: 0;
                  display: grid;
                  grid-template-columns: minmax(92px, 34%) 1fr;
                  gap: 12px;
                  padding: 8px 0;
                }
                .privacy-table td::before {
                  content: attr(data-label);
                  font-family: var(--font-mono);
                  font-size: 12px;
                  font-weight: 600;
                  letter-spacing: 0.04em;
                  text-transform: uppercase;
                  color: var(--muted-foreground);
                }
              }
            `,
          }}
        />

        <section className="privacy-page-header" aria-labelledby="privacy-title">
          <h1 id="privacy-title" className="privacy-page-title">
            {t('title')}
          </h1>
          <p className="privacy-page-meta">{t('lastUpdated')}</p>
        </section>

        <div className="privacy-content">
          <article className="privacy-card" aria-label={t('articleLabel')}>
            {sections.map((section) => {
              const Icon = section.icon;
              const list =
                'list' in section
                  ? (t.raw(`sections.${section.key}.list`) as PrivacyListItem[])
                  : [];
              const paragraphs = t.raw(`sections.${section.key}.paragraphs`) as string[];
              const table =
                'table' in section
                  ? (t.raw(`tables.${section.table}`) as {
                      headers: string[];
                      rows: PrivacyTableRow[];
                    })
                  : null;

              return (
                <section key={section.key} className="privacy-section">
                  <h2 className="privacy-section-title">
                    <Icon className="privacy-section-icon" aria-hidden="true" />
                    {t(`sections.${section.key}.title`)}
                  </h2>

                  {paragraphs.map((paragraph) => (
                    <p key={paragraph} className="privacy-paragraph">
                      {paragraph}
                    </p>
                  ))}

                  {table ? (
                    <div className="privacy-table-wrap">
                      <table className="privacy-table">
                        <thead>
                          <tr>
                            {table.headers.map((header) => (
                              <th key={header}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row) => (
                            <tr key={row.cells.join('|')}>
                              {row.cells.map((cell, index) => (
                                <td key={cell} data-label={table.headers[index]}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}

                  {'highlight' in section ? (
                    <div className="doc-highlight">
                      <strong>{t('highlightLabel')}</strong> {t('highlightText')}
                    </div>
                  ) : null}

                  {list.length > 0 ? (
                    <ul className="privacy-list">
                      {list.map((item) => (
                        <li key={`${item.label ?? ''}${item.text}`} className="privacy-list-item">
                          {item.label ? (
                            <strong className="privacy-list-label">{item.label}</strong>
                          ) : null}
                          {item.label ? ' ' : null}
                          {item.href ? (
                            <a href={item.href} className="break-words">
                              {item.text}
                            </a>
                          ) : (
                            item.text
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              );
            })}

            <Link href="/" className={cn('privacy-back-link')}>
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              {t('backHome')}
            </Link>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
