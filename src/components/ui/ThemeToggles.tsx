// src/components/ui/ThemeToggles.tsx
// Moved from App.tsx lines 2659–2715
import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

// ── Light / Dark toggle ────────────────────────────────────
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Current theme: ${theme}. Click to switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
        isDark
          ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
      }`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

// ── Accent colour cycle toggle ─────────────────────────────
export const AccentToggle: React.FC = () => {
  const { accent, toggleAccent, isDark } = useTheme();
  const isGreen = accent === 'green';
  const isLgbt  = accent === 'lgbt';

  return (
    <button
      onClick={toggleAccent}
      title={isGreen ? 'Switch to LGBT Theme' : isLgbt ? 'Switch to Female Theme' : 'Switch to Male Theme'}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
        isDark
          ? isGreen ? 'bg-green-900/50 text-green-200 border border-green-800 hover:bg-green-800'
            : isLgbt ? 'bg-slate-800 text-white border border-slate-600 hover:bg-slate-700'
            : 'bg-pink-900/50 text-pink-200 border border-pink-800 hover:bg-pink-800'
          : isGreen ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
            : isLgbt ? 'bg-gradient-to-r from-red-100 via-yellow-100 to-blue-100 text-indigo-700 border border-indigo-200 hover:shadow-md'
            : 'bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100'
      }`}
    >
      <Palette className="w-4 h-4" />
      <span className={`hidden sm:inline ${
        isLgbt ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-blue-600 font-black' : ''
      }`}>
        {isGreen ? 'Male' : isLgbt ? 'LGBT' : 'Female'}
      </span>
    </button>
  );
};