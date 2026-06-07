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
      <div className="footer-bottom">
        <p>{t('copyright')}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://dang.ai"
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{ textDecoration: 'none' }}
          >
            <img
              src="https://assets.dang.ai/badges/dang-verified-dark.png"
              alt="Verified on DANG!"
              width={130}
              height={47}
              className="block max-w-full"
              style={{ height: 'auto', borderRadius: 10, border: 0, outline: 'none' }}
            />
          </a>
          <a
            href="https://submitaitools.org"
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{ textDecoration: 'none' }}
          >
            <img
              src="https://submitaitools.org/static_submitaitools/images/submitaitools.png"
              alt="Submit AI Tools"
              width={200}
              height={60}
              className="block max-w-full"
              style={{ height: 'auto', borderRadius: 10, border: 0, outline: 'none' }}
            />
          </a>
          <a
            href="https://aiagentsdirectory.com/agent/extractkeywords"
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{ textDecoration: 'none' }}
          >
            <img
              src="https://aiagentsdirectory.com/featured-badge.svg?v=2024"
              alt="ExtractKeywords - Featured on AI Agents Directory"
              width={200}
              height={50}
              className="block max-w-full"
              style={{ height: 'auto', borderRadius: 10, border: 0, outline: 'none' }}
            />
          </a>
          <a
            href="https://sellwithboost.com"
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{ textDecoration: 'none' }}
          >
            <img
              src="https://sellwithboost.com/badge/listing.svg"
              alt="Listed on Sell With boost"
              className="block max-w-full"
              style={{ height: 40, width: 'auto', borderRadius: 10, border: 0, outline: 'none' }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
