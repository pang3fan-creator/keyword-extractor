'use client';

import { useEffect, useState } from 'react';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from '../theme/ThemeToggle';

const CENTER_LINKS = [
  { href: '/', key: 'home' },
  { href: '/pricing', key: 'pricing', enabled: true },
  { href: '/blog', key: 'blog' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const themeT = useTranslations('theme');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();

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
            <LocaleSwitcher />
            <ThemeToggle />
            {isLoaded &&
              (isSignedIn ? (
                <UserButton />
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button type="button" className="btn-login">
                      {t('logIn')}
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button type="button" className="btn-signup">
                      {t('signUp')}
                    </button>
                  </SignUpButton>
                </>
              ))}
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
        <div className="mobile-locale-row">
          <LocaleSwitcher variant="list" />
        </div>
        {isLoaded &&
          (isSignedIn ? (
            <div className="mobile-auth-row" aria-label={t('accountMenu')}>
              <UserButton />
            </div>
          ) : (
            <div className="mobile-auth-actions" aria-label={t('authActions')}>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="mobile-auth-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('logIn')}
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="mobile-auth-cta"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('signUp')}
                </button>
              </SignUpButton>
            </div>
          ))}
      </div>
    </>
  );
}
