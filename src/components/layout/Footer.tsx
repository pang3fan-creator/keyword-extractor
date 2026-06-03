import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo className="text-lg" />
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t('tagline')}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">{t('product')}</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/pricing" className="text-sm text-foreground transition-colors hover:text-primary">
                {t('pricing')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">{t('resources')}</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/blog" className="text-sm text-foreground transition-colors hover:text-primary">
                {t('blog')}
              </Link>
            </li>
            <li>
              <Link href="/guides" className="text-sm text-foreground transition-colors hover:text-primary">
                {t('guides')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">{t('legal')}</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/privacy" className="text-sm text-foreground transition-colors hover:text-primary">
                {t('privacy')}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-sm text-foreground transition-colors hover:text-primary">
                {t('terms')}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-foreground transition-colors hover:text-primary">
                {t('contact')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-border px-6 py-5 text-center text-sm text-muted-foreground">
        {t('copyright')}
      </div>
    </footer>
  );
}
