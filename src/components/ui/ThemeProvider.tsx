// src/components/ui/ThemeProvider.tsx
// Moved from App.tsx lines 1247–1312
import React, { useState, useEffect, useMemo } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import { THEME_COLORS } from '../../constants/themes';
import type { Theme, Accent } from '../../types';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const s = localStorage.getItem('app-theme');
    return s === 'dark' || s === 'light' ? s : 'light';
  });

  const [accent, setAccent] = useState<Accent>(() => {
    const s = localStorage.getItem('app-accent');
    return s === 'pink' || s === 'green' || s === 'lgbt' ? s : 'pink';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app-accent', accent);
  }, [accent]);

  const value = useMemo(() => {
    const isDark        = theme === 'dark';
    const currentColors = THEME_COLORS[accent][theme];
    return {
      theme,
      toggleTheme:  () => setTheme(p => p === 'light' ? 'dark' : 'light'),
      accent,
      toggleAccent: () => setAccent(p => p === 'pink' ? 'green' : p === 'green' ? 'lgbt' : 'pink'),
      isDark,
      accentColor:  currentColors.primary,
      themeColors:  currentColors,
    };
  }, [theme, accent]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};