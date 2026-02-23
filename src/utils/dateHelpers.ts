// src/utils/dateHelpers.ts
// Moved from App.tsx lines 2311–2499

// ── Date string helpers ────────────────────────────────────
export const getTodayString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getYesterdayString = (): string => {
  const d = new Date(Date.now() - 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// ── Streak calculator ──────────────────────────────────────
export const calculateStreak = (completedDates: string[]): number => {
  if (!completedDates || completedDates.length === 0) return 0;

  const sortedDates = [...completedDates]
    .map(dateStr => {
      const [year, month, day] = dateStr.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    })
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const mostRecent = sortedDates[0];
  mostRecent.setHours(0, 0, 0, 0);

  if (
    mostRecent.getTime() !== today.getTime() &&
    mostRecent.getTime() !== yesterday.getTime()
  ) {
    return 0;
  }

  let streak = 1;
  const ONE_DAY = 24 * 60 * 60 * 1000;

  for (let i = 1; i < sortedDates.length; i++) {
    const curr = new Date(sortedDates[i]);
    curr.setHours(0, 0, 0, 0);
    const prev = new Date(sortedDates[i - 1]);
    prev.setHours(0, 0, 0, 0);
    if (Math.round((prev.getTime() - curr.getTime()) / ONE_DAY) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

// ── Last 7 days ────────────────────────────────────────────
export const getLast7Days = (): Array<{ date: string; label: string }> => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86_400_000);
    days.push({
      date: date.toISOString().split('T')[0],
      label:
        i === 0
          ? 'Today'
          : i === 1
          ? 'Yesterday'
          : date.toLocaleDateString('en-US', { weekday: 'short' }),
    });
  }
  return days;
};

// ── Current week (Sun–Sat) ─────────────────────────────────
export const getCurrentWeekDays = (): Array<{
  date: string;
  label: string;
  isToday: boolean;
}> => {
  const now      = new Date();
  const todayStr = getTodayString();
  const startOfWeek = new Date(now);
  startOfWeek.setUTCDate(now.getUTCDate() - now.getDay());

  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setUTCDate(startOfWeek.getUTCDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return { date: dateStr, label: labels[i], isToday: dateStr === todayStr };
  });
};

// ── Notification scheduler ─────────────────────────────────
import type { Habit } from '../types';

export const scheduleNotification = (
  habit: Habit
): ReturnType<typeof setTimeout> | null => {
  if (!habit.reminderEnabled || !habit.reminderTime) return null;
  if (!('Notification' in window) || Notification.permission !== 'granted') return null;

  const [hours, minutes] = habit.reminderTime.split(':');
  const now           = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  return setTimeout(() => {
    const today       = getTodayString();
    const isCompleted = habit.completedDates?.includes(today);
    if (!isCompleted) {
      new Notification(`⏰ Time for: ${habit.title}`, {
        body: habit.streak > 0
          ? `You're on a ${habit.streak}-day streak! Don't break it today!`
          : "Let's build this habit together!",
        icon:             '/icon-192.png',
        badge:            '/icon-192.png',
        tag:              habit.id,
        requireInteraction: false,
      });
    }
  }, scheduledTime.getTime() - now.getTime());
};