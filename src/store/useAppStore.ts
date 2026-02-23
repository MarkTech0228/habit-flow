import { create } from 'zustand';

interface UIState {
  currentPage: 'home' | 'habits' | 'todos' | 'money' | 'stats' | 'debt' | 'goals' | 'awards' | 'more';
  theme: 'light' | 'dark';
  accent: 'pink' | 'green' | 'lgbt';
  isDark: boolean;
  isLoading: boolean;
  error: null;
  notification: null;
  modal: null;
  isAdding: boolean;
  showTemplates: boolean;
  loading: boolean;
  showStats: boolean;
  showAchievements: boolean;
  showRecurringModal: boolean;
  showBudgetModal: boolean;
  showGoalsModal: boolean;
  showAllowanceModal: boolean;
  showIncomeModal: boolean;
  showDebtModal: boolean;
  showInvestmentModal: boolean;
  moneyView: 'overview' | 'monthly' | 'yearly';
  selectedMonth: number;
  selectedYear: number;
}

interface AppStore {
  ui: UIState;
  updateUI: (partial: Partial<UIState>) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  ui: {
    currentPage: 'home',
    theme: 'light',
    accent: 'pink',
    isDark: false,
    isLoading: false,
    error: null,
    notification: null,
    modal: null,
    isAdding: false,
    showTemplates: false,
    loading: false,
    showStats: false,
    showAchievements: false,
    showRecurringModal: false,
    showBudgetModal: false,
    showGoalsModal: false,
    showAllowanceModal: false,
    showIncomeModal: false,
    showDebtModal: false,
    showInvestmentModal: false,
    moneyView: 'overview',
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
  },
  updateUI: (partial) =>
    set((state) => ({ ui: { ...state.ui, ...partial } })),
}));