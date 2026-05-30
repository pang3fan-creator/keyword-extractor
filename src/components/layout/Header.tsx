'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { ThemeToggle } from '../theme/ThemeToggle';

export function Header() {
  const t = useTranslations('nav');

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            {t('pricing')}
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-9 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
          >
            {t('login')}
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
