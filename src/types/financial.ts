import type { Timestamp } from 'firebase/firestore';
import type { LucideIcon } from 'lucide-react';


// ============================================================================
// EXPENSE TYPES
// ============================================================================


export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  createdAt: Timestamp | any;
  receiptImage?: string;
}


export interface ExpenseCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
}


// ============================================================================
// INCOME TYPES
// ============================================================================


export interface Income {
  id: string;
  date: string;
  amount: number;
  source: string;
  description: string;
  createdAt: Timestamp | any;
}


// ============================================================================
// RECURRING EXPENSE TYPES
// ============================================================================


export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextPaymentDate: string;
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  isActive: boolean;
  notes?: string;
  createdAt: Timestamp | any;
}


export interface RecurringExpenseSummary {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  total: number;
  count: number;
}


// ============================================================================
// DEBT TYPES
// ============================================================================


export type DebtType = 'credit_card' | 'student_loan' | 'mortgage' | 'personal_loan' | 'other';


export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type: DebtType;
  dueDay: number;
  createdAt: Timestamp | any;
}


// ============================================================================
// SAVINGS TYPES
// ============================================================================


export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: Timestamp | any;
}


// ============================================================================
// BUDGET TYPES
// ============================================================================


export interface CategoryBudget {
  category: string;
  categoryLabel: string;
  categoryIcon: LucideIcon;
  categoryColor: string;
  monthlyLimit: number;
  spent: number;
  percentage: number;
}


export interface MoneySettings {
  dailyAllowance: number;
  currency: string;
  currencySymbol: string;
}


// ============================================================================
// SPENDING INSIGHT TYPES
// ============================================================================


export interface SpendingInsight {
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  topCategory: string;
  topCategoryAmount: number;
}


// ============================================================================
// FINANCIAL HEALTH TYPES
// ============================================================================


export interface FinancialHealthScore {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: {
    savingsRate: { score: number; value: number };
    budgetAdherence: { score: number; value: number };
    debtRatio: { score: number; value: number };
    emergencyFund: { score: number; value: number };
    investmentDiversity: { score: number; value: number };
  };
  recommendations: string[];
}


// ============================================================================
// CHART DATA TYPES
// ============================================================================


export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}


export interface SpendingTrendData {
  date: string;
  amount: number;
  category?: string;
}

