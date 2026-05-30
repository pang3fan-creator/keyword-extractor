'use client';

import { useTheme, type Theme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const order: Theme[] = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  const icons: Record<Theme, string> = {
    light: '☀',
    dark: '☾',
    system: '◐',
  };

  return (
    <button
      onClick={cycle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-sm transition-colors hover:border-primary"
      aria-label={`Theme: ${theme}`}
      title={`Theme: ${theme}`}
    >
      {icons[theme]}
    </button>
  );
}
