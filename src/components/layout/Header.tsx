'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
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
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('pricing')}
          </Link>
          <Button size="sm" asChild>
            <Link href="/sign-in">{t('login')}</Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
