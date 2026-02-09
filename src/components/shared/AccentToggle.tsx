import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';


const AccentToggle: React.FC = () => {
  const { accent, toggleAccent } = useTheme();


  const getAccentColor = () => {
    switch (accent) {
      case 'pink':
        return 'text-pink-600';
      case 'green':
        return 'text-green-600';
      case 'lgbt':
        return 'text-purple-600';
      default:
        return 'text-slate-600';
    }
  };


  const getAccentLabel = () => {
    switch (accent) {
      case 'pink':
        return 'Pink';
      case 'green':
        return 'Green';
      case 'lgbt':
        return 'Rainbow';
      default:
        return 'Pink';
    }
  };


  return (
    <button
      onClick={toggleAccent}
      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
      aria-label="Toggle accent color"
      title={`Current accent: ${getAccentLabel()}`}
    >
      <Palette className={`w-5 h-5 ${getAccentColor()}`} />
    </button>
  );
};


export default AccentToggle;



