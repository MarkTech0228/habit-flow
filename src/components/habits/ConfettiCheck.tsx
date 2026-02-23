// src/components/habits/ConfettiCheck.tsx
// Moved from App.tsx lines 2841–2919
import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { HABIT_ICONS } from '../../constants/habits';

interface ConfettiCheckProps {
  isChecked: boolean;
  onClick:   () => void;
  themeColor: string;
  icon?:     string;
}

export const ConfettiCheck: React.FC<ConfettiCheckProps> = ({
  isChecked,
  onClick,
  themeColor,
  icon,
}) => {
  const [isBursting, setIsBursting] = useState(false);
  const { theme, accent } = useTheme();
  const isGreen = accent === 'green';
  const isLgbt  = accent === 'lgbt';

  const handleClick = () => {
    if (!isChecked) {
      setIsBursting(true);
      setTimeout(() => setIsBursting(false), 1000);
    }
    onClick();
  };

  const IconComponent =
    (icon ? HABIT_ICONS.find(i => i.name === icon)?.icon : undefined) ?? CheckCircle2;

  const confettiColors = isGreen
    ? ['#10B981', '#34D399', '#059669', '#6EE7B7']
    : isLgbt
    ? ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#A855F7']
    : ['#DB2777', '#BE185D', '#F472B6', '#9D174D'];

  return (
    <div className="relative">
      {isBursting && (
        <>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`confetti-piece confetti-pop ${themeColor}`}
              style={{
                left:            '50%',
                top:             '50%',
                transform:       `rotate(${i * 30}deg) translateY(-25px)`,
                backgroundColor: confettiColors[i % confettiColors.length],
                animationDelay:  `${Math.random() * 0.2}s`,
              }}
            />
          ))}
        </>
      )}

      <button
        onClick={handleClick}
        aria-label={isChecked ? 'Mark habit as incomplete' : 'Mark habit as complete'}
        aria-pressed={isChecked}
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center
          min-w-[44px] min-h-[44px] transition-all duration-300 transform
          hover:scale-105 active:scale-95 ${
            isChecked
              ? `${themeColor} text-white shadow-xl scale-105`
              : theme === 'dark'
                ? isGreen  ? 'bg-slate-800 text-slate-500 border-2 border-slate-700 hover:border-green-400 hover:text-green-300 hover:bg-slate-700'
                  : isLgbt ? 'bg-slate-800 text-slate-500 border-2 border-slate-700 hover:border-indigo-400 hover:text-indigo-300 hover:bg-slate-700'
                  :          'bg-slate-800 text-slate-500 border-2 border-slate-700 hover:border-pink-400 hover:text-pink-300 hover:bg-slate-700'
                : isGreen  ? 'bg-white text-slate-300 border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 hover:text-green-600'
                  : isLgbt ? 'bg-white text-slate-300 border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600'
                  :          'bg-white text-slate-300 border-2 border-slate-200 hover:border-pink-500 hover:bg-pink-50 hover:text-pink-600'
          }`}
      >
        <IconComponent className={`w-8 h-8 transition-all ${isChecked ? 'stroke-[3px]' : 'stroke-[2px]'}`} />
      </button>
    </div>
  );
};