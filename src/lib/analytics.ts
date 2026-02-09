import { analytics } from '../config/firebase';
import { logEvent } from 'firebase/analytics';

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
};

export const trackHabitCompleted = (habitId: string, habitTitle: string) => {
  trackEvent('habit_completed', { habit_id: habitId, habit_title: habitTitle });
};

export const trackTodoCompleted = (todoId: string) => {
  trackEvent('todo_completed', { todo_id: todoId });
};

export const trackExpenseAdded = (amount: number, category: string) => {
  trackEvent('expense_added', { amount, category });
};