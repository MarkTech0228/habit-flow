// src/components/ui/LoadingScreen.tsx
// Moved from App.tsx lines 14448–14492
import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export const LoadingScreen: React.FC = () => {
  const { accent, isDark } = useTheme();

  const bgClass =
    isDark ? 'bg-slate-900'
    : accent === 'green' ? 'bg-green-50'
    : accent === 'lgbt'  ? 'bg-gradient-to-br from-purple-50 to-pink-50'
    : 'bg-pink-50';

  const spinnerClass =
    isDark
      ? accent === 'green' ? 'bg-green-500'
        : accent === 'lgbt'  ? 'bg-gradient-to-br from-purple-500 to-pink-500'
        : 'bg-pink-500'
      : accent === 'green' ? 'bg-green-600'
        : accent === 'lgbt'  ? 'bg-gradient-to-br from-purple-600 to-pink-600'
        : 'bg-pink-600';

  const textClass =
    isDark ? 'text-slate-100'
    : accent === 'green' ? 'text-green-900'
    : accent === 'lgbt'  ? 'text-purple-900'
    : 'text-pink-900';

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 rounded-2xl animate-spin mb-4 shadow-lg ${spinnerClass}`} />
        <p className={`font-bold text-lg animate-pulse ${textClass}`}>
          Loading HabitFlow...
        </p>
        <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Please wait while we prepare your experience
        </p>
      </div>
    </div>
  );
};