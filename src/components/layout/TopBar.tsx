import React from 'react';
import { Moon, Sun, Palette } from 'lucide-react';


interface TopBarProps {
  theme: 'light' | 'dark';
  accent: 'pink' | 'green' | 'lgbt';
  onToggleTheme: () => void;
  onToggleAccent: () => void;
}


const TopBar: React.FC<TopBarProps> = ({ theme, accent, onToggleTheme, onToggleAccent }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 dark:text-white">
          HabitFlow
        </h1>
       
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
         
          <button
            onClick={onToggleAccent}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            aria-label="Toggle accent"
          >
            <Palette className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};


export default TopBar;




