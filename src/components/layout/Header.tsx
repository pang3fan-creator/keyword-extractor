'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { ThemeToggle } from '../theme/ThemeToggle';

const CENTER_LINKS = [
  { href: '/', key: 'home' },
  { href: '/pricing', key: 'pricing' },
  { href: '/blog', key: 'blog' },
] as const;

export function Header() {
  const SHOW_AUTH = false;
  const t = useTranslations('nav');
  const themeT = useTranslations('theme');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header>
        <div className="inner">
          <Logo />

          <nav className="nav-center" aria-label={t('centerNavigation')}>
            {CENTER_LINKS.map((item) => {
              const isEnabled = item.href === '/' || ('enabled' in item && item.enabled);
              const isActive = item.href === '/' ? pathname === '/' : pathname.endsWith(item.href);

              return isEnabled ? (
                <Link
                  key={item.key}
                  href={item.href}
                  style={isActive ? { color: 'var(--primary)', fontWeight: 600 } : undefined}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {t(item.key)}
                </Link>
              ) : (
                <Link key={item.key} href="#" onClick={(e) => e.preventDefault()}>
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <nav className="nav-right" aria-label={t('mainNavigation')}>
            <ThemeToggle />
            {SHOW_AUTH && (
              <>
                <Link href="#" className="btn-login" onClick={(e) => e.preventDefault()}>
                  {t('logIn')}
                </Link>
                <Link href="#" className="btn-signup" onClick={(e) => e.preventDefault()}>
                  {t('signUp')}
                </Link>
              </>
            )}
          </nav>

          <button
            type="button"
            className="hamburger"
            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </header>

      <div className={cn('mobile-overlay', menuOpen && 'open')} id="mobileOverlay">
        {CENTER_LINKS.map((item) => {
          const isEnabled = item.href === '/' || ('enabled' in item && item.enabled);
          const isActive = item.href === '/' ? pathname === '/' : pathname.endsWith(item.href);

          return isEnabled ? (
            <Link
              key={item.key}
              href={item.href}
              style={isActive ? { color: 'var(--primary)', fontWeight: 600 } : undefined}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {t(item.key)}
            </Link>
          ) : (
            <Link
              key={item.key}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
              }}
            >
              {t(item.key)}
            </Link>
          );
        })}
        <div className="mobile-theme-row">
          <span style={{ fontSize: 14, color: 'var(--muted-foreground)', fontWeight: 500 }}>
            {themeT('theme')}
          </span>
          <ThemeToggle />
        </div>
        {SHOW_AUTH && (
          <>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
              }}
              style={{ border: 'none', fontWeight: 600 }}
            >
              {t('logIn')}
            </Link>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
              }}
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: 8,
                padding: 14,
                borderRadius: 10,
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                fontWeight: 600,
                border: 'none',
              }}
            >
              {t('signUp')}
            </Link>
          </>
        )}
      </div>
    </>
  );
}
