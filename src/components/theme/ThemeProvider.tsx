'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setThemeState(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      root.classList.toggle('dark', isDark);
      setResolvedTheme(isDark ? 'dark' : 'light');
    };

    if (theme === 'system') {
      localStorage.setItem('theme', 'system');
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mq.matches);
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      applyTheme(theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
