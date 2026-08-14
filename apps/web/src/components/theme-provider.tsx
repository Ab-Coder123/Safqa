'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 1. Load saved theme preference
    const savedTheme = (localStorage.getItem('safqa-theme') as Theme) || 'system';
    setThemeState(savedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (targetTheme: Theme) => {
      let activeTheme: 'light' | 'dark' = 'light';

      if (targetTheme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        activeTheme = systemDark ? 'dark' : 'light';
      } else {
        activeTheme = targetTheme;
      }

      if (activeTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      setResolvedTheme(activeTheme);
    };

    applyTheme(theme);
    localStorage.setItem('safqa-theme', theme);

    // System theme listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
