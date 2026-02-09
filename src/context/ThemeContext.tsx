import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';
export type Accent = 'pink' | 'green' | 'lgbt';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  accent: Accent;
  toggleAccent: () => void;
  setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('habitflow-theme');
    return (saved as Theme) || 'light';
  });

  const [accent, setAccent] = useState<Accent>(() => {
    const saved = localStorage.getItem('habitflow-accent');
    return (saved as Accent) || 'pink';
  });

  useEffect(() => {
    localStorage.setItem('habitflow-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('habitflow-accent', accent);
  }, [accent]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleAccent = () => {
    setAccent((prev) => {
      if (prev === 'pink') return 'green';
      if (prev === 'green') return 'lgbt';
      return 'pink';
    });
  };

  const value = {
    theme,
    toggleTheme,
    accent,
    toggleAccent,
    setAccent,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};