// src/components/ui/Toast.tsx
// Moved from App.tsx lines 2724–2774
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import type { ToastData } from '../../types';

interface ToastProps {
  toast: ToastData;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { isDark, accent } = useTheme();
  const isGreen = accent === 'green';
  const isLgbt  = accent === 'lgbt';

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border-2 backdrop-blur-xl animate-slide-in ${
      isDark
        ? 'bg-slate-900/95 border-slate-700 text-white'
        : isGreen
          ? 'bg-white/95 border-green-100 text-slate-900'
          : isLgbt
          ? 'bg-white/95 border-indigo-100 text-slate-900'
          : 'bg-white/95 border-pink-100 text-slate-900'
    }`}>
      {/* Status dot */}
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
        toast.type === 'success'
          ? (isLgbt ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-green-500')
          : toast.type === 'error'
          ? 'bg-red-500'
          : 'bg-blue-500'
      }`} />

      <p className="flex-1 font-medium">{toast.message}</p>

      {toast.action && (
        <button
          onClick={toast.action.onClick}
          className={`px-3 py-1.5 rounded-lg font-bold text-sm transition ${
            isDark
              ? isGreen ? 'bg-green-600 text-white hover:bg-green-500'
                : isLgbt ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                : 'bg-pink-500 text-white hover:bg-pink-400'
              : isGreen ? 'bg-green-600 text-white hover:bg-green-700'
                : isLgbt ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90'
                : 'bg-pink-600 text-white hover:bg-pink-700'
          }`}
        >
          {toast.action.label}
        </button>
      )}

      <button
        onClick={onDismiss}
        className={`p-1 rounded-lg transition ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};