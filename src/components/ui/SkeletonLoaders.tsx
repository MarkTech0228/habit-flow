// src/components/ui/SkeletonLoaders.tsx
// Replaces App.tsx lines 2980–2997 (old generic SkeletonLoader)
// Three purpose-built skeleton variants that match real layouts
import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ── Habit list skeleton ────────────────────────────────────
export const HabitSkeletonLoader: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <div className="grid gap-4">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={`p-5 rounded-3xl border-2 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
          }`}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {/* Row: checkbox + title + streak + action buttons */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex-shrink-0 skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded-lg skeleton" style={{ width: `${55 + (i * 7) % 30}%` }} />
              <div className="h-3 w-16 rounded skeleton" />
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map(b => (
                <div key={b} className="w-9 h-9 rounded-xl skeleton" />
              ))}
            </div>
          </div>
          {/* Weekly progress dots */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map(d => (
              <div key={d} className="flex-1 h-2 rounded-full skeleton" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Expense list skeleton ──────────────────────────────────
export const ExpenseSkeletonLoader: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={`p-4 rounded-2xl border-2 flex items-center justify-between ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl flex-shrink-0 skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded skeleton" style={{ width: `${40 + (i * 11) % 35}%` }} />
              <div className="h-3 w-24 rounded skeleton" />
            </div>
          </div>
          <div className="h-5 w-16 rounded skeleton" />
        </div>
      ))}
    </div>
  );
};

// ── Dashboard overview cards skeleton ─────────────────────
export const DashboardCardSkeletonLoader: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={`p-5 rounded-2xl border-2 space-y-3 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
          }`}
        >
          <div className="w-10 h-10 rounded-xl skeleton" />
          <div className="h-6 w-20 rounded skeleton" />
          <div className="h-3 w-28 rounded skeleton" />
        </div>
      ))}
    </div>
  );
};

// ── Backward-compat alias (replaces old SkeletonLoader) ───
export const SkeletonLoader = HabitSkeletonLoader;