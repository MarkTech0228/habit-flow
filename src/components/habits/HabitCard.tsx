// src/components/habits/HabitCard.tsx
// Moved from App.tsx lines 1942–2187
// Full React.memo optimisation with custom comparator preserved.
import React from 'react';
import { Edit2, Trash2, Flame } from 'lucide-react';
import { ConfettiCheck } from './ConfettiCheck';
import { WeeklyProgress } from './WeeklyProgress';
import type { Habit, HabitThemeData } from '../../types';

export interface HabitCardProps {
  habit:           Habit;
  today:           string;
  isDark:          boolean;
  isGreen:         boolean;
  isLgbt:          boolean;
  onToggleCheckIn: (habit: Habit) => void;
  onStartEditing:  (habit: Habit) => void;
  onSetReminder:   (habit: Habit) => void;
  onDelete:        (habitId: string) => void;
  getColorTheme:   (str: string) => HabitThemeData;
}

export const HabitCard = React.memo<HabitCardProps>(({
  habit,
  today,
  isDark,
  isGreen,
  isLgbt,
  onToggleCheckIn,
  onStartEditing,
  onSetReminder,
  onDelete,
  getColorTheme,
}) => {
  const isCompletedToday = habit.completedDates?.includes(today);
  const themeBase        = getColorTheme(habit.title);
  const theme            = isDark ? themeBase.dark : themeBase.light;

  return (
    <div className={`group relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 ${
      isCompletedToday
        ? `${isDark ? 'bg-slate-900 border-slate-800' : (isGreen ? 'bg-white border-green-100' : isLgbt ? 'bg-white border-indigo-100' : 'bg-white border-pink-100')}`
        : `${isDark
            ? 'bg-slate-900 border-slate-900 hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900'
            : (isGreen ? 'bg-white border-white hover:border-green-100 hover:shadow-lg hover:shadow-green-100'
              : isLgbt ? 'bg-white border-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100'
              : 'bg-white border-white hover:border-pink-100 hover:shadow-lg hover:shadow-pink-100')
          } shadow-sm`
    }`}>
      {/* Hover glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 rounded-3xl bg-gradient-to-r ${themeBase.light.bg.replace('bg-', 'from-white via-white to-')}/30 pointer-events-none`} />

      {/* ── MOBILE LAYOUT ── */}
      <div className="block sm:hidden relative z-10">
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Left: check + title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <ConfettiCheck
                isChecked={!!isCompletedToday}
                onClick={() => onToggleCheckIn(habit)}
                themeColor={theme.check}
                icon={habit.icon}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-base sm:text-lg transition-colors line-clamp-2 ${
                isCompletedToday
                  ? `line-through decoration-2 ${isDark ? 'text-slate-600 decoration-slate-700' : (isGreen ? 'text-slate-400 decoration-green-200' : isLgbt ? 'text-slate-400 decoration-indigo-200' : 'text-slate-400 decoration-pink-200')}`
                  : (isDark ? 'text-slate-100' : 'text-slate-800')
              }`}>
                {habit.title}
              </h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold mt-1 ${theme.bg} ${theme.text} ${theme.border} border`}>
                <Flame className={`w-3 h-3 mr-1 ${theme.icon}`} />
                {habit.streak} days
              </span>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onStartEditing(habit)}
              aria-label={`Edit habit: ${habit.title}`}
              className={`p-2.5 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isDark ? 'text-slate-600 hover:bg-slate-800 hover:text-slate-400' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'
              }`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSetReminder(habit)}
              aria-label={`${habit.reminderEnabled ? 'Disable' : 'Enable'} reminder for: ${habit.title}`}
              className={`p-2.5 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center ${
                habit.reminderEnabled
                  ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600')
                  : (isDark ? 'text-slate-600 hover:bg-slate-800' : 'text-slate-300 hover:bg-slate-100')
              }`}
            >
              <span className="text-base">{habit.reminderEnabled ? '🔔' : '🔕'}</span>
            </button>
            <button
              onClick={() => onDelete(habit.id)}
              aria-label={`Delete habit: ${habit.title}`}
              className={`p-2.5 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isDark ? 'text-slate-600 hover:text-red-400 hover:bg-red-900/20' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekly progress */}
        <div className="w-full">
          <WeeklyProgress completedDates={habit.completedDates} />
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden sm:flex items-center justify-between gap-6 relative z-10">
        {/* Left: check + title + streak */}
        <div className="flex items-center gap-6 flex-1">
          <ConfettiCheck
            isChecked={!!isCompletedToday}
            onClick={() => onToggleCheckIn(habit)}
            themeColor={theme.check}
            icon={habit.icon}
          />
          <div className="flex-1">
            <h3 className={`font-bold text-xl transition-colors ${
              isCompletedToday
                ? `line-through decoration-2 ${isDark ? 'text-slate-600 decoration-slate-700' : (isGreen ? 'text-slate-400 decoration-green-200' : isLgbt ? 'text-slate-400 decoration-indigo-200' : 'text-slate-400 decoration-pink-200')}`
                : (isDark ? 'text-slate-100' : 'text-slate-800')
            }`}>
              {habit.title}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${theme.bg} ${theme.text} ${theme.border} border`}>
                <Flame className={`w-3 h-3 mr-1 ${theme.icon}`} />
                {habit.streak} day streak
              </span>
            </div>
          </div>
        </div>

        {/* Right: weekly progress + action buttons */}
        <div className="flex items-center gap-4">
          <WeeklyProgress completedDates={habit.completedDates} />
          <button
            onClick={() => onStartEditing(habit)}
            aria-label={`Edit habit: ${habit.title}`}
            title="Edit Habit"
            className={`opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-xl ${
              isDark ? 'text-slate-600 hover:bg-slate-800 hover:text-slate-400' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'
            }`}
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onSetReminder(habit)}
            aria-label={`${habit.reminderEnabled ? 'Disable' : 'Enable'} reminder for: ${habit.title}`}
            title={habit.reminderEnabled ? 'Reminder On' : 'Reminder Off'}
            className={`p-3 rounded-xl transition ${
              habit.reminderEnabled
                ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600')
                : (isDark ? 'text-slate-600 hover:bg-slate-800' : 'text-slate-300 hover:bg-slate-100')
            }`}
          >
            <span className="text-lg">{habit.reminderEnabled ? '🔔' : '🔕'}</span>
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            aria-label={`Delete habit: ${habit.title}`}
            title="Delete Habit"
            className={`opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-xl ${
              isDark ? 'text-slate-600 hover:text-red-400 hover:bg-red-900/20' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}, (prev, next) => {
  // 🔥 Custom comparator: only re-render if THIS habit's relevant props changed
  const prevDone = prev.habit.completedDates?.includes(prev.today);
  const nextDone = next.habit.completedDates?.includes(next.today);
  return (
    prev.habit.id               === next.habit.id               &&
    prev.habit.title            === next.habit.title            &&
    prev.habit.streak           === next.habit.streak           &&
    prev.habit.icon             === next.habit.icon             &&
    prevDone                    === nextDone                    &&
    prev.habit.reminderEnabled  === next.habit.reminderEnabled  &&
    prev.habit.colorTheme       === next.habit.colorTheme       &&
    prev.habit.reminderTime     === next.habit.reminderTime     &&
    prev.today                  === next.today                  &&
    prev.isDark                 === next.isDark                 &&
    prev.isGreen                === next.isGreen                &&
    prev.isLgbt                 === next.isLgbt
  );
});

HabitCard.displayName = 'HabitCard';