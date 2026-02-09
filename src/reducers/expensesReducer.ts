import { Expense } from '../models/Expense';

export type ExpensesAction =
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string };

export interface ExpensesState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

export const initialExpensesState: ExpensesState = {
  expenses: [],
  loading: false,
  error: null
};

export function expensesReducer(state: ExpensesState, action: ExpensesAction): ExpensesState {
  switch (action.type) {
    case 'SET_EXPENSES':
      return {
        ...state,
        expenses: action.payload,
        loading: false
      };

    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload]
      };

    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };

    default:
      return state;
  }
}