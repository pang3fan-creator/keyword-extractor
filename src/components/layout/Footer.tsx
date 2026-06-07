'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

const FOOTER_BADGES = [
  {
    href: 'https://dang.ai',
    imageSrc: 'https://assets.dang.ai/badges/dang-verified-dark.png',
    width: 130,
    height: 47,
    altKey: 'badgeAlt.dang',
    imageClassName: 'footer-badge-image footer-badge-image--compact',
  },
  {
    href: 'https://submitaitools.org',
    imageSrc: 'https://submitaitools.org/static_submitaitools/images/submitaitools.png',
    width: 200,
    height: 60,
    altKey: 'badgeAlt.submitAiTools',
    imageClassName: 'footer-badge-image',
  },
  {
    href: 'https://aiagentsdirectory.com/agent/extractkeywords',
    imageSrc: 'https://aiagentsdirectory.com/featured-badge.svg?v=2024',
    width: 200,
    height: 50,
    altKey: 'badgeAlt.aiAgentsDirectory',
    imageClassName: 'footer-badge-image',
  },
  {
    href: 'https://sellwithboost.com',
    imageSrc: 'https://sellwithboost.com/badge/listing.svg',
    width: 180,
    height: 40,
    altKey: 'badgeAlt.sellWithBoost',
    imageClassName: 'footer-badge-image footer-badge-image--short',
  },
  {
    href: 'https://pitchwall.co/product/extractkeywords?utm_source=badge',
    imageSrc: 'https://pitchwall.co/images/featured/pitchwall-light.png',
    width: 180,
    height: 60,
    altKey: 'badgeAlt.pitchWall',
    imageClassName: 'footer-badge-image',
  },
  {
    href: 'https://tooldirs.com',
    imageSrc: 'https://tooldirs.com/badge/badge_light.svg',
    width: 200,
    height: 54,
    altKey: 'badgeAlt.toolDirs',
    imageClassName: 'footer-badge-image',
  },
] as const;

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
        <div className="footer-badge-rail" aria-label={t('badgeRailLabel')}>
          <div className="footer-badge-track">
            {FOOTER_BADGES.map((badge) => (
              <a
                key={badge.href}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="footer-badge-link"
                aria-label={t(badge.altKey)}
              >
                {/* External badge images are served by third parties; plain img keeps them simple. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={badge.imageSrc}
                  alt={t(badge.altKey)}
                  width={badge.width}
                  height={badge.height}
                  className={badge.imageClassName}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
