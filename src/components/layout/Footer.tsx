'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer>
      <div className="inner">
        <div className="brand-col">
          <Link href="/" className="logo" style={{ fontSize: 18 }}>
            ExtractKeywords
          </Link>
          <p>{t('tagline')}</p>
        </div>
        <div>
          <h4>{t('product')}</h4>
          <ul>
            <li>
              <Link href="#" onClick={(e) => e.preventDefault()}>
                {t('pricing')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>{t('resources')}</h4>
          <ul>
            <li>
              <Link href="#" onClick={(e) => e.preventDefault()}>
                {t('blog')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>{t('legal')}</h4>
          <ul>
            <li>
              <Link href="/about">{t('about')}</Link>
            </li>
            <li>
              <Link href="/privacy">{t('privacy')}</Link>
            </li>
            <li>
              <Link href="/terms">{t('terms')}</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">{t('copyright')}</div>
    </footer>
  );
}
