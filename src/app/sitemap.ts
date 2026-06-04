import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { buildUrl } from '@/lib/url';

const pages = [
  { path: '/', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, priority, changeFrequency }) => {
    const url = buildUrl(routing.defaultLocale, path);

    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = buildUrl(locale, path);
    }

    return {
      url,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: { languages },
    };
  });
}
