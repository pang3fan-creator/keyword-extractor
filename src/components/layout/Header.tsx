'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { ThemeToggle } from '../theme/ThemeToggle';

const CENTER_LINKS = [
  { href: '/', key: 'home' },
  { href: '/pricing', key: 'pricing' },
  { href: '/blog', key: 'blog' },
  { href: '/privacy', key: 'privacy' },
  { href: '/terms', key: 'terms' },
  { href: '/about', key: 'about' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const themeT = useTranslations('theme');
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
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="relative mx-auto flex h-[60px] max-w-6xl items-center justify-between px-3 sm:px-6">
        <Logo className="text-xl font-extrabold tracking-normal" />

        <nav
          aria-label={t('centerNavigation')}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
        >
          {CENTER_LINKS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground hover:no-underline"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <nav aria-label={t('mainNavigation')} className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/sign-in">{t('logIn')}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/sign-up">{t('signUp')}</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:border-primary md:hidden"
          aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-x-0 top-[60px] z-50 flex min-h-[calc(100dvh-60px)] flex-col bg-background/95 px-6 py-6 backdrop-blur-xl md:hidden">
          <nav aria-label={t('mainNavigation')} className="flex flex-col">
            {CENTER_LINKS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border py-3.5 text-lg font-medium text-foreground transition-colors hover:text-primary hover:no-underline"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="flex items-center gap-3 border-b border-border py-3.5">
              <span className="text-sm font-medium text-muted-foreground">{themeT('theme')}</span>
              <ThemeToggle className="h-10 w-10" />
            </div>
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="py-3.5 text-lg font-semibold text-foreground transition-colors hover:text-primary hover:no-underline"
            >
              {t('logIn')}
            </Link>
            <Button asChild className="mt-2 h-12">
              <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                {t('signUp')}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
