import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Accent = 'pink' | 'green' | 'lgbt';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [accent, setAccent] = useState<Accent>('pink');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedAccent = localStorage.getItem('accent') as Accent;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedAccent) setAccent(savedAccent);

    // Check system preference if no saved theme
    if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const changeAccent = (newAccent: Accent) => {
    setAccent(newAccent);
    localStorage.setItem('accent', newAccent);
  };

  return { theme, accent, toggleTheme, changeAccent };
};