import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { routing } from '@/i18n/routing';
import { buildUrl } from '@/lib/url';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const canonical = buildUrl(locale, '/');

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = buildUrl(loc, '/');
  }
  languages['x-default'] = buildUrl(routing.defaultLocale, '/');

  return {
    alternates: {
      canonical,
      languages,
    },
  };
}

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>{children}</ThemeProvider>
    </NextIntlClientProvider>
  );
}
