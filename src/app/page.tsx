import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { routing } from '@/i18n/routing';
import { buildUrl } from '@/lib/url';
import HomePage from './[locale]/page';

export async function generateMetadata(): Promise<Metadata> {
  const { defaultLocale, locales } = routing;

  const canonical = buildUrl(defaultLocale, '/');

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = buildUrl(loc, '/');
  }
  languages['x-default'] = buildUrl(defaultLocale, '/');

  return {
    alternates: {
      canonical,
      languages,
    },
  };
}

export default async function RootPage() {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale="en">
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
