import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'northlab-theme';

export function useTheme() {
  const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage?.getItem(STORAGE_KEY) as Theme | null;
      if (saved) {
        return saved;
      }
      const prefersDark = window
        .matchMedia?.('(prefers-color-scheme: dark)')
        ?.matches;
      if (prefersDark !== undefined) {
        return prefersDark ? 'dark' : 'light';
      }
    }
    return 'light';
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQuery) return;
    const handler = (e: MediaQueryListEvent) => {
      if (!window.localStorage?.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem(STORAGE_KEY, newTheme);
    }
  };

  return { theme, toggleTheme } as const;
}

export default useTheme;
