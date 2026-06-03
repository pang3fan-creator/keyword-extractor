'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations('theme');
  const { theme, setTheme } = useTheme();

  const next: Record<Theme, Theme> = { light: 'dark', dark: 'system', system: 'light' };

  return (
    <button
      onClick={() => setTheme(next[theme])}
      className={cn(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:bg-muted hover:text-foreground',
        className,
      )}
      aria-label={t('label', { theme })}
      title={t('switchDetailed')}
    >
      {theme === 'light' && <Sun className="h-4 w-4" aria-hidden="true" />}
      {theme === 'dark' && <Moon className="h-4 w-4" aria-hidden="true" />}
      {theme === 'system' && <Monitor className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
