// src/hooks/useTheme.ts
// Moved from App.tsx lines 1221–1243
// Exports the context object and the useTheme hook.
// The ThemeProvider lives in src/components/ui/ThemeProvider.tsx.
import { createContext, useContext } from 'react';
import type { ThemeContextValue } from '../types';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
};