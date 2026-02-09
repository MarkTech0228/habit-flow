import { Habit } from '../types';
import { calculateStreak } from '../utils/streakCalculator';

export type HabitsAction =
  | { type: 'SET_HABITS'; payload: Habit[] }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: { id: string; updates: Partial<Habit> } }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'TOGGLE_HABIT'; payload: { id: string; date: string } }
  | { type: 'RESTORE_HABIT'; payload: Habit };

export interface HabitsState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

export const initialHabitsState: HabitsState = {
  habits: [],
  loading: false,
  error: null
};

export function habitsReducer(state: HabitsState, action: HabitsAction): HabitsState {
  switch (action.type) {
    case 'SET_HABITS':
      return {
        ...state,
        habits: action.payload,
        loading: false
      };

    case 'ADD_HABIT':
  // Validate that the habit has an ID
  if (!action.payload || !action.payload.id) {
    console.error('❌ Reducer: Cannot add habit without ID:', action.payload);
    return state;
  }
  
  // Check for duplicates
  const habitExists = state.habits.some(h => h.id === action.payload.id);
  if (habitExists) {
    console.warn('⚠️ Reducer: Habit already exists:', action.payload.id);
    return state;
  }
  
  console.log('✅ Reducer: Adding habit:', action.payload.id);
  
  return {
    ...state,
    habits: [...state.habits, action.payload]
  };

    case 'UPDATE_HABIT': {
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id
            ? { ...habit, ...action.payload.updates }
            : habit
        )
      };
    }

    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload)
      };

    case 'TOGGLE_HABIT': {
      const { id, date } = action.payload;
      return {
        ...state,
        habits: state.habits.map(habit => {
          if (habit.id !== id) return habit;

          const completedDates = habit.completedDates || [];
          const newDates = completedDates.includes(date)
            ? completedDates.filter(d => d !== date)
            : [...completedDates, date];

          return {
            ...habit,
            completedDates: newDates,
            streak: calculateStreak(newDates)
          };
        })
      };
    }

    case 'RESTORE_HABIT':
      return {
        ...state,
        habits: [...state.habits, action.payload].sort(
          (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
        )
      };

    default:
      return state;
  }
}


