// src/types/index.ts
// All shared TypeScript interfaces — moved from App.tsx lines 719–1047, 1118–1212, 1221–1222
// Zero `any` types.
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

// ── Re-exports used throughout the app ────────────────────
export type { LucideIcon };
export type FirebaseUser = User;

// ── Timestamp alias (avoids importing firebase everywhere) ─
type FSTimestamp = Timestamp | null;

// ── Domain models ──────────────────────────────────────────
export interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  createdAt: FSTimestamp;
  completedDates: string[];
  streak: number;
  colorTheme?: string;
  icon?: string;
  order?: number;
  reminderTime?: string;
  reminderEnabled?: boolean;
  longestStreak?: number;
}

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: FSTimestamp;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  createdAt: FSTimestamp;
  receiptImage?: string;
  imageUrl?: string;
}

export interface Income {
  id: string;
  date: string;
  amount: number;
  source: string;
  description: string;
  createdAt: FSTimestamp;
}

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
  createdAt: FSTimestamp;
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type: 'credit_card' | 'student_loan' | 'mortgage' | 'personal_loan' | 'other';
  dueDay: number;
  createdAt: FSTimestamp;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: FSTimestamp;
}

export interface RecurringExpenseSummary {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  total: number;
  count: number;
}

export interface MoneySettings {
  dailyAllowance: number;
  currency: string;
  currencySymbol: string;
}

export interface CategoryBudget {
  category: string;
  categoryLabel: string;
  categoryIcon: React.ComponentType<{ className?: string }>;  // was: any
  categoryColor: string;
  monthlyLimit: number;
  spent: number;
  percentage: number;
}

export interface SpendingInsight {
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  topCategory: string;
  topCategoryAmount: number;
}

export interface FinancialHealthScore {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: {
    savingsRate:      { score: number; value: number };
    budgetAdherence:  { score: number; value: number };
    spendingControl:  { score: number; value: number };
    consistency:      { score: number; value: number };
  };
  recommendations: string[];
  trend: 'improving' | 'stable' | 'declining';
}

export interface SpendingPrediction {
  nextWeekEstimate: number;
  nextMonthEstimate: number;
  confidence: 'high' | 'medium' | 'low';
  trend: 'increasing' | 'stable' | 'decreasing';
  averageDailySpending: number;
  projectedMonthEnd: number;
  willExceedBudget: boolean;
  daysUntilBudgetExceeded: number | null;
  recommendations: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'habits' | 'money' | 'streak' | 'milestone';
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  reward?: string;
}

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface HabitIcon {
  name: string;
  icon: LucideIcon;
}

export interface ThemeColors {
  bg: string;
  border: string;
  text: string;
  icon: string;
  hover: string;
  check: string;
  gradient: string;
}

export interface HabitThemeData {
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
}

// ── UI / Navigation state ──────────────────────────────────
export type Theme  = 'light' | 'dark';
export type Accent = 'pink' | 'green' | 'lgbt';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  accent: Accent;
  toggleAccent: () => void;
  isDark: boolean;
  accentColor: string;
  themeColors: {
    primary: string;
    primaryHover: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
}

export interface PlatformInfo {
  os: 'ios' | 'android' | 'web' | 'desktop';
  browser: string;
  version: string;
  isStandalone: boolean;
  hasSafeArea: boolean;
  supportsHaptics: boolean;
}

export interface AppState {
  habits: Habit[];
  todos: TodoItem[];
  expenses: Expense[];
  incomes: Income[];
  recurringExpenses: RecurringExpense[];
  debts: Debt[];
  savingsGoals: SavingsGoal[];
  settings: MoneySettings;
  user: FirebaseUser | null;
  isLoading: boolean;
  lastSync: Date | null;
}

export interface NavigationState {
  currentTab: 'dashboard' | 'habits' | 'todos' | 'finance' | 'analytics' | 'settings';
  previousTab: NavigationState['currentTab'] | null;
  history: NavigationState['currentTab'][];
  canGoBack: boolean;
}

export interface ErrorState {
  message: string;
  code?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  dismissible: boolean;
}

export interface NotificationState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export interface ModalState {
  type: 'confirm' | 'alert' | 'form' | 'custom';
  title: string;
  content: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export interface SubscriptionFeatures {
  maxHabits: number;
  maxGoals: number;
  maxExpenses: number;
  analytics: boolean;
  cloudBackup: boolean;
  customThemes: boolean;
  aiInsights: boolean;
  exportData: boolean;
  prioritySupport: boolean;
}

export interface SubscriptionTier {
  id: 'free' | 'pro' | 'premium';
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: SubscriptionFeatures;
  stripePriceId?: string;
  appStoreSku?: string;
  playStoreSku?: string;
}

export interface DataPrivacyConsent {
  analytics: boolean;
  marketing: boolean;
  essential: boolean;
  timestamp: Date;
  version: string;
}

export interface UserProfile {
  age?: number;
  onboardingComplete?: boolean;
}