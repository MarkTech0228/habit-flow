import type { Timestamp } from 'firebase/firestore';


// ============================================================================
// HABIT TYPES
// ============================================================================


export interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  createdAt: Timestamp | any;
  completedDates: string[];
  streak: number;
  colorTheme?: string;
  icon?: string;
  order?: number;
  reminderTime?: string;
  reminderEnabled?: boolean;
}


// ============================================================================
// TODO TYPES
// ============================================================================


export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Timestamp | any;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}


// ============================================================================
// USER TYPES
// ============================================================================


export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp | any;
  lastLoginAt: Timestamp | any;
  preferences?: UserPreferences;
}


export interface UserPreferences {
  theme: 'light' | 'dark';
  accent: 'pink' | 'green' | 'lgbt';
  notifications: boolean;
  currency: string;
  currencySymbol: string;
}


// ============================================================================
// THEME TYPES
// ============================================================================


export type Theme = 'light' | 'dark';
export type Accent = 'pink' | 'green' | 'lgbt';


export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  accent: Accent;
  toggleAccent: () => void;
  setAccent: (accent: Accent) => void;
}


// ============================================================================
// VIEW TYPES
// ============================================================================


export type ViewType = 'landing' | 'welcome' | 'dashboard';
export type DashboardView = 'habits' | 'todos' | 'money' | 'stats';


// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================


export interface AuthCredentials {
  email: string;
  password: string;
}


export interface SignUpData extends AuthCredentials {
  displayName: string;
  confirmPassword: string;
}


// ============================================================================
// MODAL TYPES
// ============================================================================


export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}


// ============================================================================
// NOTIFICATION TYPES
// ============================================================================


export interface NotificationPermission {
  granted: boolean;
  requested: boolean;
}


// ============================================================================
// ACHIEVEMENT TYPES
// ============================================================================


export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Timestamp | any;
  isUnlocked: boolean;
  category: 'habits' | 'streak' | 'todos' | 'money';
}

