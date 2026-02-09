import React, { createContext, useContext, useReducer, ReactNode } from 'react';


// Import types
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


interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: any;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}


interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  createdAt: any;
  receiptImage?: string;
}


// Reducer types
type HabitsAction =
  | { type: 'SET_HABITS'; payload: Habit[] }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: { id: string; updates: Partial<Habit> } }
  | { type: 'DELETE_HABIT'; payload: string };


type TodosAction =
  | { type: 'SET_TODOS'; payload: TodoItem[] }
  | { type: 'ADD_TODO'; payload: TodoItem }
  | { type: 'UPDATE_TODO'; payload: { id: string; updates: Partial<TodoItem> } }
  | { type: 'DELETE_TODO'; payload: string };


type ExpensesAction =
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string };


// State interfaces
interface HabitsState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
}


interface TodosState {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
}


interface ExpensesState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}


interface AppState {
  habits: HabitsState;
  todos: TodosState;
  expenses: ExpensesState;
}


interface AppContextType {
  state: AppState;
  dispatchHabits: React.Dispatch<HabitsAction>;
  dispatchTodos: React.Dispatch<TodosAction>;
  dispatchExpenses: React.Dispatch<ExpensesAction>;
}


const AppContext = createContext<AppContextType | undefined>(undefined);


export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};


// Reducers
const habitsReducer = (state: HabitsState, action: HabitsAction): HabitsState => {
  switch (action.type) {
    case 'SET_HABITS':
      return { ...state, habits: action.payload, loading: false };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(h =>
          h.id === action.payload.id ? { ...h, ...action.payload.updates } : h
        )
      };
    case 'DELETE_HABIT':
      return { ...state, habits: state.habits.filter(h => h.id !== action.payload) };
    default:
      return state;
  }
};


const todosReducer = (state: TodosState, action: TodosAction): TodosState => {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: action.payload, loading: false };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        )
      };
    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
};


const expensesReducer = (state: ExpensesState, action: ExpensesAction): ExpensesState => {
  switch (action.type) {
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload, loading: false };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
    default:
      return state;
  }
};


// Initial states
const initialHabitsState: HabitsState = {
  habits: [],
  loading: false,
  error: null
};


const initialTodosState: TodosState = {
  todos: [],
  loading: false,
  error: null
};


const initialExpensesState: ExpensesState = {
  expenses: [],
  loading: false,
  error: null
};


interface AppProviderProps {
  children: ReactNode;
}


export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [habits, dispatchHabits] = useReducer(habitsReducer, initialHabitsState);
  const [todos, dispatchTodos] = useReducer(todosReducer, initialTodosState);
  const [expenses, dispatchExpenses] = useReducer(expensesReducer, initialExpensesState);


  const state: AppState = {
    habits,
    todos,
    expenses
  };


  return (
    <AppContext.Provider value={{ state, dispatchHabits, dispatchTodos, dispatchExpenses }}>
      {children}
    </AppContext.Provider>
  );
};

