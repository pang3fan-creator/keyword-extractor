'use client';

import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const CURRENT_LOCALE = 'en';
const LOCALE_CODES = ['en', 'zh', 'ja'] as const;

export function LocaleSwitcher({ variant = 'dropdown' }: { variant?: 'dropdown' | 'list' }) {
  const t = useTranslations('localeSwitcher');

  if (variant === 'list') {
    return (
      <div>
        <span className="text-muted-foreground mb-2 block text-sm font-medium" id="locale-heading">
          {t('label')}
        </span>
        <div className="flex flex-col gap-1" role="listbox" aria-labelledby="locale-heading">
          {LOCALE_CODES.map((code) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={code === CURRENT_LOCALE}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm',
                code === CURRENT_LOCALE && 'bg-accent text-accent-foreground font-medium',
                code !== CURRENT_LOCALE && 'hover:bg-muted',
              )}
            >
              <span aria-hidden="true">🌐</span>
              <span>{t(`locale.${code}`)}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 inline-flex h-7 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg border border-transparent px-2.5 text-sm font-medium whitespace-nowrap select-none"
        aria-label={t('label')}
      >
        <span className="me-1" aria-hidden="true">
          🌐
        </span>
        <span className="font-medium">{CURRENT_LOCALE.toUpperCase()}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALE_CODES.map((code) => (
          <DropdownMenuItem
            key={code}
            className={cn(
              code === CURRENT_LOCALE && 'bg-accent text-accent-foreground font-medium',
            )}
          >
            <span className="me-2" aria-hidden="true">
              🌐
            </span>
            <span>{t(`locale.${code}`)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
