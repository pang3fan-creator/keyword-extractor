export function buildUrl(locale: string, path: string): string {
  const base = 'https://extractkeywords.com';
  if (locale === 'en') return `${base}${path}`;
  return `${base}/${locale}${path}`;
}
