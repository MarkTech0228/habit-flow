import React from 'react';
import HabitCard from './HabitCard1';

interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  createdAt: any;
  completedDates: string[];
  streak: number;
  colorTheme?: string;
  icon?: string;
  order?: number;
  reminderTime?: string;
  reminderEnabled?: boolean;
}

interface HabitThemeData {
  name: string;
  light: {
    bg: string;
    border: string;
    text: string;
    icon: string;
    hover: string;
    check: string;
    gradient: string;
  };
  dark: {
    bg: string;
    border: string;
    text: string;
    icon: string;
    hover: string;
    check: string;
    gradient: string;
  };
}

interface HabitListProps {
  habits: Habit[];
  onToggleCheckIn: (habit: Habit) => void;
  onStartEditing: (habit: Habit) => void;
  onSetReminder: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  getColorTheme: (str: string) => HabitThemeData;
  today: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  onToggleCheckIn,
  onStartEditing,
  onSetReminder,
  onDelete,
  getColorTheme,
  today,
  isDark,
  isGreen,
  isLgbt
}) => {
  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className={`text-6xl mb-4`}>🎯</div>
        <p className={`text-lg font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          No habits yet
        </p>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Create your first one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          today={today}
          isDark={isDark}
          isGreen={isGreen}
          isLgbt={isLgbt}
          onToggleCheckIn={onToggleCheckIn}
          onStartEditing={onStartEditing}
          onSetReminder={onSetReminder}
          onDelete={onDelete}
          getColorTheme={getColorTheme}
        />
      ))}
    </div>
  );
};

export default HabitList;
export type { Habit, HabitListProps, HabitThemeData };