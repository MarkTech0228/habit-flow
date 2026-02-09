import { getTodayString, isSameDay, getDaysBetween } from './dateHelpers';


/**
 * Calculate current streak from array of completed dates
 */
export const calculateStreak = (completedDates: string[]): number => {
  if (!completedDates || completedDates.length === 0) return 0;


  const sortedDates = [...completedDates].sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );


  const today = getTodayString();
  const mostRecent = sortedDates[0];


  // Check if most recent completion is today or yesterday
  const daysSinceLastCompletion = getDaysBetween(mostRecent, today);
  if (daysSinceLastCompletion > 1) return 0;


  let streak = 1;
  let currentDate = new Date(mostRecent);


  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i]);
    const diff = getDaysBetween(prevDate, currentDate);


    if (diff === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }


  return streak;
};


/**
 * Calculate longest streak from array of completed dates
 */
export const calculateLongestStreak = (completedDates: string[]): number => {
  if (!completedDates || completedDates.length === 0) return 0;


  const sortedDates = [...completedDates].sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );


  let longestStreak = 1;
  let currentStreak = 1;


  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diff = getDaysBetween(prevDate, currDate);


    if (diff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }


  return longestStreak;
};


/**
 * Check if habit was completed today
 */
export const isCompletedToday = (completedDates: string[]): boolean => {
  const today = getTodayString();
  return completedDates.some(date => isSameDay(date, today));
};


/**
 * Get completion rate for a period
 */
export const getCompletionRate = (
  completedDates: string[],
  totalDays: number
): number => {
  if (totalDays === 0) return 0;
  return Math.round((completedDates.length / totalDays) * 100);
};


/**
 * Get weekly completion data
 */
export const getWeeklyCompletionData = (completedDates: string[]) => {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
 
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekAgo);
    date.setDate(date.getDate() + i);
    weekDates.push(date.toISOString().split('T')[0]);
  }


  return weekDates.map(date => ({
    date,
    completed: completedDates.includes(date),
    label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
  }));
};

