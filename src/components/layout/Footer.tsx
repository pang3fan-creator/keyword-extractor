import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <Link href="/" className="text-lg font-semibold text-foreground">
            ExtractKeywords
          </Link>
          <p className="mt-1 text-sm text-muted">{t('tagline')}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('product')}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/pricing" className="text-sm text-muted transition-colors hover:text-foreground">
                  {t('pricing')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('resources')}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-muted transition-colors hover:text-foreground">
                  {t('blog')}
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm text-muted transition-colors hover:text-foreground">
                  {t('guides')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('legal')}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted transition-colors hover:text-foreground">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted transition-colors hover:text-foreground">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted transition-colors hover:text-foreground">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
