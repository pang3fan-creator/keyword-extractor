import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import HomePage from './[locale]/page';

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
