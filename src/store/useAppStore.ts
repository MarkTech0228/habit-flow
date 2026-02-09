import { create } from 'zustand';


// Simplified store - only for UI state first (safe migration)
interface UIState {
  currentPage: 'habits' | 'todos' | 'money';
  showStats: boolean;
  showAchievements: boolean;
  showTemplates: boolean;
  showAllowanceModal: boolean;
  showBudgetModal: boolean;
  showGoalsModal: boolean;
  showRecurringModal: boolean;
  showIncomeModal: boolean;
  showDebtModal: boolean;
  showInvestmentModal: boolean;
  isAdding: boolean;
  loading: boolean;
  moneyView: 'overview' | 'monthly' | 'yearly';
  selectedMonth: number;
  selectedYear: number;
}


interface AppStore {
  ui: UIState;
  updateUI: (updates: Partial<UIState>) => void;
}


export const useAppStore = create<AppStore>((set) => ({
  ui: {
    currentPage: 'habits',
    showStats: false,
    showAchievements: false,
    showTemplates: false,
    showAllowanceModal: false,
    showBudgetModal: false,
    showGoalsModal: false,
    showRecurringModal: false,
    showIncomeModal: false,
    showDebtModal: false,
    showInvestmentModal: false,
    isAdding: false,
    loading: true,
    moneyView: 'overview',
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
  },
 
  updateUI: (updates) => set((state) => ({
    ui: { ...state.ui, ...updates }
  })),
}));

