// src/components/habits/WeeklyProgress.tsx
// Moved from App.tsx lines 2928–2971
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { getCurrentWeekDays } from '../../utils/dateHelpers';

export const WeeklyProgress: React.FC<{ completedDates: string[] }> = ({ completedDates }) => {
  const { isDark, accent } = useTheme();
  const isGreen = accent === 'green';
  const isLgbt  = accent === 'lgbt';
  const days    = getCurrentWeekDays();

  return (
    <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pb-1">
      {days.map((day, idx) => {
        const isCompleted = completedDates.includes(day.date);
        return (
          <div
            key={day.date}
            className="flex flex-col items-center gap-1 flex-shrink-0"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
              text-[9px] sm:text-[10px] font-bold transition-all duration-300 ${
                isCompleted
                  ? `bg-gradient-to-br ${
                      isGreen ? 'from-green-500 to-emerald-500'
                      : isLgbt ? 'from-red-500 via-yellow-500 to-blue-500'
                      : 'from-pink-500 to-rose-500'
                    } text-white shadow-md ${
                      isDark
                        ? (isGreen ? 'shadow-green-500/40' : isLgbt ? 'shadow-indigo-500/40' : 'shadow-pink-500/40')
                        : (isGreen ? 'shadow-green-300'    : isLgbt ? 'shadow-indigo-300'    : 'shadow-pink-300')
                    }`
                  : day.isToday
                  ? `border-2 ${
                      isGreen ? 'border-green-500 text-green-600' : isLgbt ? 'border-indigo-500 text-indigo-600' : 'border-pink-500 text-pink-600'
                    } ${
                      isDark
                        ? (isGreen ? 'text-green-400 bg-slate-800' : isLgbt ? 'text-indigo-400 bg-slate-800' : 'text-pink-400 bg-slate-800')
                        : 'bg-white'
                    }`
                  : `${isDark ? 'bg-slate-800 text-slate-600 border border-slate-700' : 'bg-slate-100 text-slate-400 border border-slate-200'}`
              }`}
            >
              {day.label.charAt(0)}
            </div>
            <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wide ${
              day.isToday
                ? (isDark
                    ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                    : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600'))
                : (isDark ? 'text-slate-600' : 'text-slate-400')
            }`}>
              {day.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};