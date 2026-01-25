import React, { useState, useEffect, useCallback, useRef, createContext, useContext, FormEvent, ChangeEvent } from 'react';
import {
  CheckCircle2, 
  Plus, 
  Trash2, 
  TrendingUp,
  TrendingDown, 
  LogOut, 
  Layout, 
  Calendar,
  ChevronRight,
  Shield,
  Zap,
  BarChart3,
  Sparkles,
  Trophy,
  Flame,
  X,
  Sun,
  Moon,
  Heart,
  Edit2,
  Check,
  Coffee,
  Book,
  Dumbbell,
  Droplet,
  Brain,
  Pill,
  Home,
  Briefcase,
  Music,
  Target,
  PieChart,
  Palette,
  UserCircle2,
  ArrowRight,
  Lock, 
  Eye,
  EyeOff,
  Rainbow,
  DollarSign,  // <-- ADD THIS
  Wallet,
  TrendingDown as TrendingDownIcon,
  ShoppingBag,
  Receipt
} from 'lucide-react';

// Define LucideIcon type
type LucideIcon = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

// Firebase Imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import type { User } from "firebase/auth";
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  EmailAuthProvider,
  linkWithCredential
} from "firebase/auth";

type FirebaseUser = User;

import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  setDoc,
  getDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  enableIndexedDbPersistence  // ← ADD THIS
} from "firebase/firestore";
import { 
  ResponsiveContainer, 
  LineChart, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line, 
  Bar,
  Cell 
} from "recharts";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug: Log what we have
console.log('Environment check:', {
  hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
  hasProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
  allEnvVars: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
});

// Initialize Firebase only if config is complete
const isMissingConfig = !firebaseConfig.apiKey || !firebaseConfig.projectId;

let app: any;
let analytics: any;
let auth: any;
let db: any;

if (!isMissingConfig) {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Enable offline persistence
  import('firebase/firestore').then(({ enableIndexedDbPersistence }) => {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Multiple tabs open - offline persistence only works in one tab');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ Browser doesn\'t support offline persistence');
      } else {
        console.error('⚠️ Error enabling offline persistence:', err);
      }
    });
  });
} else {
  console.warn('⚠️ Firebase not configured - app will run in demo-only mode');
  console.warn('Available env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
}

const appId = firebaseConfig.appId;
// --- Types & Constants ---
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
}

interface MoneySettings {
  dailyAllowance: number;
  currency: string;
  currencySymbol: string;
}


interface UserProfile {
  age?: number;
  onboardingComplete?: boolean;
}

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface HabitIcon {
  name: string;
  icon: LucideIcon;
}

interface ThemeColors {
  bg: string;
  border: string;
  text: string;
  icon: string;
  hover: string;
  check: string;
  gradient: string;
}

interface HabitThemeData {
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
}

// --- Theme Context ---
type Theme = 'light' | 'dark';
type Accent = 'pink' | 'green' | 'lgbt'; // Added lgbt

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  accent: Accent;
  toggleAccent: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ 
  theme: 'light', 
  toggleTheme: () => {}, 
  accent: 'pink', 
  toggleAccent: () => {} 
});

const useTheme = () => useContext(ThemeContext);

// Icon Options
const HABIT_ICONS: HabitIcon[] = [
  { name: 'Coffee', icon: Coffee },
  { name: 'Book', icon: Book },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Droplet', icon: Droplet },
  { name: 'Brain', icon: Brain },
  { name: 'Pill', icon: Pill },
  { name: 'Home', icon: Home },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Music', icon: Music },
  { name: 'Target', icon: Target },
];

// Theme Definitions for Habits
const HABIT_THEMES_PINK: HabitThemeData[] = [
  { 
    name: 'Pink', 
    light: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-900', icon: 'text-pink-700', hover: 'hover:bg-pink-100', check: 'bg-pink-600', gradient: 'from-pink-500 to-rose-500' },
    dark: { bg: 'bg-pink-900/20', border: 'border-pink-500/30', text: 'text-pink-100', icon: 'text-pink-300', hover: 'hover:bg-pink-900/40', check: 'bg-pink-400', gradient: 'from-pink-400 to-rose-400' }
  },
  { 
    name: 'Rose', 
    light: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', icon: 'text-rose-700', hover: 'hover:bg-rose-100', check: 'bg-rose-600', gradient: 'from-rose-500 to-pink-500' },
    dark: { bg: 'bg-rose-900/20', border: 'border-rose-500/30', text: 'text-rose-100', icon: 'text-rose-300', hover: 'hover:bg-rose-900/40', check: 'bg-rose-400', gradient: 'from-rose-400 to-pink-400' }
  },
  { 
    name: 'Fuchsia', 
    light: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-900', icon: 'text-fuchsia-700', hover: 'hover:bg-fuchsia-100', check: 'bg-fuchsia-600', gradient: 'from-fuchsia-500 to-purple-500' },
    dark: { bg: 'bg-fuchsia-900/20', border: 'border-fuchsia-500/30', text: 'text-fuchsia-100', icon: 'text-fuchsia-300', hover: 'hover:bg-fuchsia-900/40', check: 'bg-fuchsia-400', gradient: 'from-fuchsia-400 to-purple-400' }
  },
  { 
    name: 'Purple', 
    light: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', icon: 'text-purple-700', hover: 'hover:bg-purple-100', check: 'bg-purple-600', gradient: 'from-purple-500 to-indigo-500' },
    dark: { bg: 'bg-purple-900/20', border: 'border-purple-500/30', text: 'text-purple-100', icon: 'text-purple-300', hover: 'hover:bg-purple-900/40', check: 'bg-purple-400', gradient: 'from-purple-400 to-indigo-400' }
  },
  { 
    name: 'Violet', 
    light: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900', icon: 'text-violet-700', hover: 'hover:bg-violet-100', check: 'bg-violet-600', gradient: 'from-violet-500 to-purple-500' },
    dark: { bg: 'bg-violet-900/20', border: 'border-violet-500/30', text: 'text-violet-100', icon: 'text-violet-300', hover: 'hover:bg-violet-900/40', check: 'bg-violet-400', gradient: 'from-violet-400 to-purple-400' }
  },
];

const HABIT_THEMES_GREEN: HabitThemeData[] = [
  { 
    name: 'Green', 
    light: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', icon: 'text-green-700', hover: 'hover:bg-green-100', check: 'bg-green-600', gradient: 'from-green-500 to-emerald-500' },
    dark: { bg: 'bg-green-900/20', border: 'border-green-500/30', text: 'text-green-100', icon: 'text-green-300', hover: 'hover:bg-green-900/40', check: 'bg-green-400', gradient: 'from-green-400 to-emerald-400' }
  },
  { 
    name: 'Emerald', 
    light: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: 'text-emerald-700', hover: 'hover:bg-emerald-100', check: 'bg-emerald-600', gradient: 'from-emerald-500 to-teal-500' },
    dark: { bg: 'bg-emerald-900/20', border: 'border-emerald-500/30', text: 'text-emerald-100', icon: 'text-emerald-300', hover: 'hover:bg-emerald-900/40', check: 'bg-emerald-400', gradient: 'from-emerald-400 to-teal-400' }
  },
  { 
    name: 'Teal', 
    light: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900', icon: 'text-teal-700', hover: 'hover:bg-teal-100', check: 'bg-teal-600', gradient: 'from-teal-500 to-cyan-500' },
    dark: { bg: 'bg-teal-900/20', border: 'border-teal-500/30', text: 'text-teal-100', icon: 'text-teal-300', hover: 'hover:bg-teal-900/40', check: 'bg-teal-400', gradient: 'from-teal-400 to-cyan-400' }
  },
  { 
    name: 'Cyan', 
    light: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-900', icon: 'text-cyan-700', hover: 'hover:bg-cyan-100', check: 'bg-cyan-600', gradient: 'from-cyan-500 to-sky-500' },
    dark: { bg: 'bg-cyan-900/20', border: 'border-cyan-500/30', text: 'text-cyan-100', icon: 'text-cyan-300', hover: 'hover:bg-cyan-900/40', check: 'bg-cyan-400', gradient: 'from-cyan-400 to-sky-400' }
  },
  { 
    name: 'Sky', 
    light: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-900', icon: 'text-sky-700', hover: 'hover:bg-sky-100', check: 'bg-sky-600', gradient: 'from-sky-500 to-blue-500' },
    dark: { bg: 'bg-sky-900/20', border: 'border-sky-500/30', text: 'text-sky-100', icon: 'text-sky-300', hover: 'hover:bg-sky-900/40', check: 'bg-sky-400', gradient: 'from-sky-400 to-blue-400' }
  },
];

// RAINBOW THEME DEFINITIONS
const HABIT_THEMES_RAINBOW: HabitThemeData[] = [
  { 
    name: 'Red', 
    light: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', icon: 'text-red-600', hover: 'hover:bg-red-100', check: 'bg-red-500', gradient: 'from-red-500 to-orange-500' },
    dark: { bg: 'bg-red-900/20', border: 'border-red-500/30', text: 'text-red-100', icon: 'text-red-400', hover: 'hover:bg-red-900/40', check: 'bg-red-500', gradient: 'from-red-600 to-orange-600' }
  },
  { 
    name: 'Orange', 
    light: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', icon: 'text-orange-600', hover: 'hover:bg-orange-100', check: 'bg-orange-500', gradient: 'from-orange-500 to-amber-500' },
    dark: { bg: 'bg-orange-900/20', border: 'border-orange-500/30', text: 'text-orange-100', icon: 'text-orange-400', hover: 'hover:bg-orange-900/40', check: 'bg-orange-500', gradient: 'from-orange-600 to-amber-600' }
  },
  { 
    name: 'Yellow', 
    light: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', icon: 'text-yellow-600', hover: 'hover:bg-yellow-100', check: 'bg-yellow-500', gradient: 'from-yellow-400 to-lime-500' },
    dark: { bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', text: 'text-yellow-100', icon: 'text-yellow-400', hover: 'hover:bg-yellow-900/40', check: 'bg-yellow-500', gradient: 'from-yellow-600 to-lime-600' }
  },
  { 
    name: 'Green', 
    light: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', icon: 'text-green-600', hover: 'hover:bg-green-100', check: 'bg-green-500', gradient: 'from-green-500 to-emerald-500' },
    dark: { bg: 'bg-green-900/20', border: 'border-green-500/30', text: 'text-green-100', icon: 'text-green-400', hover: 'hover:bg-green-900/40', check: 'bg-green-500', gradient: 'from-green-600 to-emerald-600' }
  },
  { 
    name: 'Blue', 
    light: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: 'text-blue-600', hover: 'hover:bg-blue-100', check: 'bg-blue-500', gradient: 'from-blue-500 to-indigo-500' },
    dark: { bg: 'bg-blue-900/20', border: 'border-blue-500/30', text: 'text-blue-100', icon: 'text-blue-400', hover: 'hover:bg-blue-900/40', check: 'bg-blue-500', gradient: 'from-blue-600 to-indigo-600' }
  },
  { 
    name: 'Purple', 
    light: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', icon: 'text-purple-600', hover: 'hover:bg-purple-100', check: 'bg-purple-500', gradient: 'from-purple-500 to-fuchsia-500' },
    dark: { bg: 'bg-purple-900/20', border: 'border-purple-500/30', text: 'text-purple-100', icon: 'text-purple-400', hover: 'hover:bg-purple-900/40', check: 'bg-purple-500', gradient: 'from-purple-600 to-fuchsia-600' }
  },
];
// HABIT TEMPLATES
interface HabitTemplate {
  title: string;
  icon: string;
  colorTheme: string;
  category: 'student' | 'adult' | 'health' | 'productivity';
  description: string;
}

const HABIT_TEMPLATES: HabitTemplate[] = [
  // STUDENT TEMPLATES
  { 
    title: 'Study Session', 
    icon: 'Book', 
    colorTheme: 'Blue', 
    category: 'student',
    description: 'Daily focused study time'
  },
  { 
    title: 'Review Lecture Notes', 
    icon: 'Brain', 
    colorTheme: 'Purple', 
    category: 'student',
    description: 'Go over today\'s class material'
  },
  { 
    title: 'Practice Problems', 
    icon: 'Target', 
    colorTheme: 'Teal', 
    category: 'student',
    description: 'Solve practice questions'
  },
  { 
    title: 'Read Textbook Chapter', 
    icon: 'Book', 
    colorTheme: 'Cyan', 
    category: 'student',
    description: 'Daily reading assignment'
  },
  
  // HEALTH & FITNESS
  { 
    title: 'Morning Workout', 
    icon: 'Dumbbell', 
    colorTheme: 'Green', 
    category: 'health',
    description: 'Start your day with exercise'
  },
  { 
    title: 'Drink 8 Glasses of Water', 
    icon: 'Droplet', 
    colorTheme: 'Cyan', 
    category: 'health',
    description: 'Stay hydrated throughout the day'
  },
  { 
    title: 'Meditation', 
    icon: 'Brain', 
    colorTheme: 'Purple', 
    category: 'health',
    description: '10 minutes of mindfulness'
  },
  { 
    title: 'Take Vitamins', 
    icon: 'Pill', 
    colorTheme: 'Orange', 
    category: 'health',
    description: 'Daily supplements routine'
  },
  
  // PRODUCTIVITY
  { 
    title: 'Wake Up Early', 
    icon: 'Coffee', 
    colorTheme: 'Rose', 
    category: 'productivity',
    description: 'Rise before 7 AM'
  },
  { 
    title: 'Morning Journaling', 
    icon: 'Book', 
    colorTheme: 'Violet', 
    category: 'productivity',
    description: 'Reflect and plan your day'
  },
  { 
    title: 'No Phone Before 9 AM', 
    icon: 'Target', 
    colorTheme: 'Red', 
    category: 'productivity',
    description: 'Start day distraction-free'
  },
  { 
    title: 'Plan Tomorrow', 
    icon: 'Briefcase', 
    colorTheme: 'Sky', 
    category: 'productivity',
    description: 'Evening planning session'
  },
  
  // ADULT/CAREER
  { 
    title: 'Learn New Skill', 
    icon: 'Brain', 
    colorTheme: 'Emerald', 
    category: 'adult',
    description: '30 mins of professional development'
  },
  { 
    title: 'Network with 1 Person', 
    icon: 'Briefcase', 
    colorTheme: 'Blue', 
    category: 'adult',
    description: 'Expand your professional circle'
  },
  { 
    title: 'Side Project Work', 
    icon: 'Target', 
    colorTheme: 'Fuchsia', 
    category: 'adult',
    description: '1 hour on personal projects'
  },
  { 
    title: 'Clean Workspace', 
    icon: 'Home', 
    colorTheme: 'Green', 
    category: 'adult',
    description: 'Organize your environment'
  },
];
// EXPENSE CATEGORIES
const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food & Drinks', icon: Coffee, color: 'orange' },
  { id: 'transport', label: 'Transportation', icon: Briefcase, color: 'blue' },
  { id: 'entertainment', label: 'Entertainment', icon: Music, color: 'purple' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'pink' },
  { id: 'bills', label: 'Bills & Utilities', icon: Home, color: 'red' },
  { id: 'health', label: 'Health & Fitness', icon: Heart, color: 'green' },
  { id: 'other', label: 'Other', icon: Target, color: 'slate' }
];
// ADD THIS - CURRENCY OPTIONS
const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
];
// --- Helper Functions ---
const getTodayString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const getYesterdayString = (): string => {
  const d = new Date(Date.now() - 86400000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateStreak = (completedDates: string[]): number => {
  if (!completedDates || completedDates.length === 0) return 0;
  
  // Convert all dates to midnight local time to avoid timezone issues
  const sortedDates = [...completedDates]
    .map(dateStr => {
      const [year, month, day] = dateStr.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    })
    .sort((a, b) => b.getTime() - a.getTime());
  
  // Get today and yesterday at midnight local time
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const mostRecentDate = sortedDates[0];
  mostRecentDate.setHours(0, 0, 0, 0);
  
  // Streak must start today or yesterday
  if (mostRecentDate.getTime() !== today.getTime() && 
      mostRecentDate.getTime() !== yesterday.getTime()) {
    return 0;
  }

  let streak = 1;
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    currentDate.setHours(0, 0, 0, 0);
    
    const previousDate = new Date(sortedDates[i - 1]);
    previousDate.setHours(0, 0, 0, 0);
    
    const diffMs = previousDate.getTime() - currentDate.getTime();
    const diffDays = Math.round(diffMs / oneDayMs);
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    days.push({
      date: date.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : date.toLocaleDateString('en-US', { weekday: 'short' })
    });
  }
  return days;
};

// Generates the current standard week (Sun-Sat) for Weekly Progress
const getCurrentWeekDays = () => {
  const now = new Date();
  const todayStr = getTodayString();
  const currentDayOfWeek = now.getDay(); // Changed from getUTCDay()
  
  const startOfWeek = new Date(now);
  startOfWeek.setUTCDate(now.getUTCDate() - currentDayOfWeek);

  const days = [];
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setUTCDate(startOfWeek.getUTCDate() + i);
     const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    days.push({
      date: dateStr,
      label: labels[i],
      isToday: dateStr === todayStr
    });
  }
  return days;
};


const scheduleNotification = (habit: Habit): ReturnType<typeof setTimeout> | null => {
  if (!habit.reminderEnabled || !habit.reminderTime) return null;
  if (!('Notification' in window) || Notification.permission !== 'granted') return null;
  
  const [hours, minutes] = habit.reminderTime.split(':');
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const timeUntil = scheduledTime.getTime() - now.getTime();
  
  const timeoutId = setTimeout(() => {
    const today = getTodayString();
    const isCompleted = habit.completedDates?.includes(today);
    
    if (!isCompleted) {
      new Notification(`⏰ Time for: ${habit.title}`, {
        body: habit.streak > 0 
          ? `You're on a ${habit.streak}-day streak! Don't break it today!` 
          : "Let's build this habit together!",
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: habit.id,
        requireInteraction: false
      });
    }
  }, timeUntil);
  
  return timeoutId;
};
// --- Animations Style Block ---
const AnimationStyles = () => (
  <style>{`
    @keyframes pop {
      0% { transform: scale(1); }
      50% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    @keyframes slideUp {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes confetti {
      0% { transform: translateY(0) rotate(0); opacity: 1; }
      100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }
    @keyframes fall {
      0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes gradient-xy {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-pop { animation: pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-slide-up { animation: slideUp 0.4s ease-out; }
    .animate-slide-in { animation: slideIn 0.3s ease-out; }
    .confetti-piece {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 2px;
    }
    .confetti-pop { animation: confetti 1s ease-out forwards; }
    .confetti-fall { animation: fall 4s ease-out forwards; }
    
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    
    .dark .skeleton {
      background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
      background-size: 200% 100%;
    }

    .progress-bar-fill {
      background-size: 200% 100%;
      background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 2s infinite;
    }

    .bg-rainbow-light {
      background: linear-gradient(135deg, #ffe4e6 0%, #fef3c7 20%, #dcfce7 40%, #e0f2fe 60%, #e8daff 80%, #fae8ff 100%);
      background-size: 200% 200%;
      animation: gradient-xy 15s ease infinite;
    }
    .bg-rainbow-dark {
      background: linear-gradient(135deg, #4c0519 0%, #422006 20%, #064e3b 40%, #1e3a8a 60%, #4c1d95 80%, #701a75 100%);
      background-size: 200% 200%;
      animation: gradient-xy 15s ease infinite;
    }
    
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
    
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `}</style>
);

// --- Components ---

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
        isDark
          ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
      }`}
      aria-label={`Current theme: ${theme}. Click to switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};

const AccentToggle: React.FC = () => {
  const { accent, toggleAccent, theme } = useTheme();
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleAccent}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
        isDark
          ? isGreen ? 'bg-green-900/50 text-green-200 border border-green-800 hover:bg-green-800' : isLgbt ? 'bg-slate-800 text-white border border-slate-600 hover:bg-slate-700' : 'bg-pink-900/50 text-pink-200 border border-pink-800 hover:bg-pink-800'
          : isGreen ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' : isLgbt ? 'bg-gradient-to-r from-red-100 via-yellow-100 to-blue-100 text-indigo-700 border border-indigo-200 hover:shadow-md' : 'bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100'
      }`}
      title={isGreen ? "Switch to LGBT Theme" : isLgbt ? "Switch to Female Theme" : "Switch to Male Theme"}
    >
      <Palette className="w-4 h-4" />
      <span className={`hidden sm:inline ${isLgbt ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-blue-600 font-black' : ''}`}>
        {isGreen ? "Male" : isLgbt ? "LGBT" : "Female"}
      </span>
    </button>
  );
};

const Toast = ({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) => {
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border-2 backdrop-blur-xl animate-slide-in ${
      isDark 
        ? 'bg-slate-900/95 border-slate-700 text-white' 
        : isGreen ? 'bg-white/95 border-green-100 text-slate-900' : isLgbt ? 'bg-white/95 border-indigo-100 text-slate-900' : 'bg-white/95 border-pink-100 text-slate-900'
    }`}>
      <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? (isLgbt ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-green-500') : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
      <p className="flex-1 font-medium">{toast.message}</p>
      {toast.action && (
        <button 
          onClick={toast.action.onClick}
          className={`px-3 py-1.5 rounded-lg font-bold text-sm transition ${
            isDark 
              ? isGreen ? 'bg-green-600 text-white hover:bg-green-500' : isLgbt ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-pink-500 text-white hover:bg-pink-400' 
              : isGreen ? 'bg-green-600 text-white hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90' : 'bg-pink-600 text-white hover:bg-pink-700'
          }`}
        >
          {toast.action.label}
        </button>
      )}
      <button onClick={onDismiss} className={`p-1 rounded-lg transition ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const FullScreenConfetti = () => {
  const { accent } = useTheme();
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';
  
  const colors = isGreen 
    ? ['#10B981', '#34D399', '#059669', '#6EE7B7', '#FCD34D'] 
    : isLgbt
      ? ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#A855F7'] // Rainbow
      : ['#DB2777', '#BE185D', '#F472B6', '#FCD34D', '#60A5FA'];

  const pieces = Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 2 + 's',
    backgroundColor: colors[Math.floor(Math.random() * colors.length)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece confetti-fall absolute top-[-20px]"
          style={{
            left: p.left,
            backgroundColor: p.backgroundColor,
            animationDelay: p.animationDelay,
            width: '12px',
            height: '12px'
          }}
        />
      ))}
    </div>
  );
};

const ConfettiCheck = ({ isChecked, onClick, themeColor, icon }: { isChecked: boolean, onClick: () => void, themeColor: string, icon?: string }) => {
  const [isBursting, setIsBursting] = useState(false);
  const { theme, accent } = useTheme();
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';

  const handleClick = () => {
    if (!isChecked) {
      setIsBursting(true);
      setTimeout(() => setIsBursting(false), 1000);
    }
    onClick();
  };

  const IconComponent = icon ? HABIT_ICONS.find(i => i.name === icon)?.icon || CheckCircle2 : CheckCircle2;
  const confettiColors = isGreen 
    ? ['#10B981', '#34D399', '#059669', '#6EE7B7'] 
    : isLgbt
      ? ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#A855F7']
      : ['#DB2777', '#BE185D', '#F472B6', '#9D174D'];

  return (
    <div className="relative">
      {isBursting && (
        <>
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className={`confetti-piece confetti-pop ${themeColor}`}
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${i * 30}deg) translateY(-25px)`,
                backgroundColor: confettiColors[i % 6], // Cycle through more colors for rainbow
                animationDelay: `${Math.random() * 0.2}s`
              }}
            />
          ))}
        </>
      )}
      <button
  onClick={handleClick}
  aria-label={isChecked ? "Mark habit as incomplete" : "Mark habit as complete"}
  aria-pressed={isChecked}
  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center min-w-[44px] min-h-[44px]
 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          isChecked 
            ? `${themeColor} text-white shadow-xl scale-105` 
            : `${theme === 'dark' 
                ? isGreen ? 'bg-slate-800 text-slate-500 border-2 border-slate-700 hover:border-green-400 hover:text-green-300 hover:bg-slate-700' : isLgbt ? 'bg-slate-800 text-slate-500 border-2 border-slate-700 hover:border-indigo-400 hover:text-indigo-300 hover:bg-slate-700' : 'bg-slate-800 text-slate-500 border-2 border-slate-700 hover:border-pink-400 hover:text-pink-300 hover:bg-slate-700' 
                : isGreen ? 'bg-white text-slate-300 border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 hover:text-green-600' : isLgbt ? 'bg-white text-slate-300 border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600' : 'bg-white text-slate-300 border-2 border-slate-200 hover:border-pink-500 hover:bg-pink-50 hover:text-pink-600'}`
        }`}
      >
        <IconComponent className={`w-8 h-8 transition-all ${isChecked ? 'stroke-[3px]' : 'stroke-[2px]'}`} />
      </button>
    </div>
  );
};

const WeeklyProgress = ({ completedDates }: { completedDates: string[] }) => {
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';
  const days = getCurrentWeekDays();

  return (
    <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pb-1">
      {days.map((day, idx) => {
        const isCompleted = completedDates.includes(day.date);
        return (
          <div 
            key={day.date} 
            className="flex flex-col items-center gap-1 flex-shrink-0"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div 
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-all duration-300 ${
                isCompleted 
                  ? `bg-gradient-to-br ${isGreen ? 'from-green-500 to-emerald-500' : isLgbt ? 'from-red-500 via-yellow-500 to-blue-500' : 'from-pink-500 to-rose-500'} text-white shadow-md ${isDark ? (isGreen ? 'shadow-green-500/40' : isLgbt ? 'shadow-indigo-500/40' : 'shadow-pink-500/40') : (isGreen ? 'shadow-green-300' : isLgbt ? 'shadow-indigo-300' : 'shadow-pink-300')}` 
                  : day.isToday
                    ? `border-2 ${isGreen ? 'border-green-500 text-green-600' : isLgbt ? 'border-indigo-500 text-indigo-600' : 'border-pink-500 text-pink-600'} ${isDark ? (isGreen ? 'text-green-400 bg-slate-800' : isLgbt ? 'text-indigo-400 bg-slate-800' : 'text-pink-400 bg-slate-800') : 'bg-white'}` 
                    : `${isDark ? 'bg-slate-800 text-slate-600 border border-slate-700' : 'bg-slate-100 text-slate-400 border border-slate-200'}`
              }`}
            >
              {day.label.charAt(0)}
            </div>
            <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wide ${day.isToday ? (isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')) : (isDark ? 'text-slate-600' : 'text-slate-400')}`}>
              {day.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const SkeletonLoader = () => {
  const { theme } = useTheme();
  return (
    <div className="grid gap-5">
      {[1, 2, 3].map(i => (
        <div key={i} className={`p-6 rounded-3xl border-2 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl skeleton`} />
            <div className="flex-1 space-y-3">
              <div className={`h-5 w-48 rounded skeleton`} />
              <div className={`h-4 w-32 rounded skeleton`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Enhanced HabitStats Component with Advanced Analytics ---
const HabitStats = ({ 
  habits, 
  expenses, 
  dailyAllowance, 
  currencySymbol,
  onClose 
}: { 
  habits: Habit[];
  expenses: Expense[];
  dailyAllowance: number;
  currencySymbol: string;
  onClose: () => void;
}) => {
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'habits' | 'money'>('overview');
  const [moneyView, setMoneyView] = useState<'overview' | 'weekly' | 'monthly' | 'yearly'>('overview');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const days = getLast7Days();
  const today = getTodayString();

  // Enhanced Analytics Calculations
  const totalHabits = habits.length;
  const activeHabits = habits.filter(h => h.streak > 0).length;
  const bestStreak = Math.max(...habits.map(h => h.streak), 0);
  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
  const completedToday = habits.filter(h => h.completedDates?.includes(today)).length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  
  // Calculate average completion rate over last 7 days
  const last7DaysRate = days.map(day => {
    const completed = habits.filter(h => h.completedDates.includes(day.date)).length;
    return totalHabits > 0 ? (completed / totalHabits) * 100 : 0;
  });
  const avgCompletionRate = Math.round(last7DaysRate.reduce((a, b) => a + b, 0) / 7);
  
  // Weekly Activity Data
  const weeklyData = days.map(day => {
    const count = habits.filter(h => h.completedDates.includes(day.date)).length;
    return { ...day, count };
  });
  const maxDaily = Math.max(...weeklyData.map(d => d.count), 1);
  
  // Top performing habits
  const topHabits = [...habits]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 3);
  
  // Habits needing attention (lowest streaks or zero)
  const needsAttention = [...habits]
    .filter(h => h.streak === 0)
    .slice(0, 3);
  
  // Consistency score (percentage of days with at least 1 habit completed)
  const daysWithActivity = days.filter(day => 
    habits.some(h => h.completedDates.includes(day.date))
  ).length;
  const consistencyScore = Math.round((daysWithActivity / 7) * 100);

  // Monthly projection
  const avgDailyCompletions = weeklyData.reduce((sum, d) => sum + d.count, 0) / 7;
  const monthlyProjection = Math.round(avgDailyCompletions * 30);
  // Money Analytics Functions
const getMonthlyData = (month: number, year: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
  });
  
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayExpenses = monthExpenses.filter(e => e.date === dateStr);
    return {
      day,
      spent: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
      count: dayExpenses.length
    };
  });
  
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyBudget = dailyAllowance * daysInMonth;
  const saved = monthlyBudget - totalSpent;
  
  const categoryTotals = EXPENSE_CATEGORIES.map(cat => ({
    ...cat,
    total: monthExpenses.filter(e => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0)
  })).filter(cat => cat.total > 0);
  
  return { dailyData, totalSpent, monthlyBudget, saved, categoryTotals };
};

const getYearlyData = (year: number) => {
  const yearExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getFullYear() === year;
  });
  
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthExpenses = yearExpenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === i;
    });
    const daysInMonth = new Date(year, i + 1, 0).getDate();
    return {
      month: new Date(year, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      spent: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
      budget: dailyAllowance * daysInMonth,
      saved: (dailyAllowance * daysInMonth) - monthExpenses.reduce((sum, e) => sum + e.amount, 0)
    };
  });
  
  const totalSpent = yearExpenses.reduce((sum, e) => sum + e.amount, 0);
  const yearlyBudget = dailyAllowance * 365;
  const saved = yearlyBudget - totalSpent;
  
  return { monthlyData, totalSpent, yearlyBudget, saved };
};

// Weekly money data
const last7Days = getLast7Days();
const weeklySpending = last7Days.map(day => {
  const dayExpenses = expenses.filter(e => e.date === day.date);
  return {
    ...day,
    spent: dayExpenses.reduce((sum, e) => sum + e.amount, 0)
  };
});
const weeklyTotal = weeklySpending.reduce((sum, day) => sum + day.spent, 0);
const weeklyBudget = dailyAllowance * 7;
const weeklySaved = weeklyBudget - weeklyTotal;

const monthlyAnalytics = getMonthlyData(selectedMonth, selectedYear);
const yearlyAnalytics = getYearlyData(selectedYear);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-3xl my-8 rounded-3xl shadow-2xl animate-pop ${isDark ? 'bg-slate-900 border-2 border-slate-800 text-white' : 'bg-white border-2 border-slate-100 text-slate-900'}`}>
        <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-xl transition z-10 ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${isDark ? (isGreen ? 'bg-green-500/20 text-green-400' : isLgbt ? 'bg-slate-800 text-indigo-400' : 'bg-pink-500/20 text-pink-400') : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600')}`}>
              <BarChart3 className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-black mb-2">Advanced Insights</h2>
            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Deep dive into your habit patterns
            </p>
          </div>

          {/* Tabs */}
          <div className={`flex gap-2 mt-6 p-1.5 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            {[
            { id: 'overview', label: 'Overview', icon: PieChart },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'habits', label: 'By Habit', icon: Target },
            { id: 'money', label: 'Money', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition ${
                    activeTab === tab.id
                      ? (isDark 
                          ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
                          : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 text-white')
                        )
                      : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Total Habits</div>
                  <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalHabits}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{activeHabits} active</div>
                </div>
                
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Best Streak</div>
                  <div className={`text-2xl font-black ${isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')}`}>{bestStreak}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>days</div>
                </div>
                
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Today</div>
                  <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{completionRate}%</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{completedToday}/{totalHabits} done</div>
                </div>
                
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>7-Day Avg</div>
                  <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{avgCompletionRate}%</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>completion</div>
                </div>
              </div>

              {/* Consistency Score */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Consistency Score</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Days active in the last week</p>
                  </div>
                  <div className={`text-4xl font-black ${isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')}`}>
                    {consistencyScore}%
                  </div>
                </div>
                <div className={`h-3 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isDark ? (isGreen ? 'bg-gradient-to-r from-green-500 to-emerald-400' : isLgbt ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500' : 'bg-gradient-to-r from-pink-500 to-rose-400') : (isGreen ? 'bg-gradient-to-r from-green-600 to-emerald-600' : isLgbt ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-600' : 'bg-gradient-to-r from-pink-600 to-rose-600')}`}
                    style={{ width: `${consistencyScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Monthly Projection */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? (isGreen ? 'bg-green-500/20 text-green-400' : isLgbt ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400') : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600')}`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>30-Day Projection</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Based on your current pace</p>
                  </div>
                  <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {monthlyProjection}
                  </div>
                </div>
              </div>
            </div>
          )}
           
          {/* TRENDS TAB */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div>
                <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>7-Day Activity</h3>
                <div className="h-48 flex items-end justify-between gap-2">
                  {weeklyData.map((d, i) => (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full relative flex-1 flex items-end">
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-500 ${isDark ? (isGreen ? 'bg-green-600 group-hover:bg-green-500' : isLgbt ? 'bg-gradient-to-t from-blue-500 via-green-500 to-red-500 group-hover:opacity-80' : 'bg-pink-600 group-hover:bg-pink-500') : (isGreen ? 'bg-green-500 group-hover:bg-green-600' : isLgbt ? 'bg-gradient-to-t from-blue-500 via-green-500 to-red-500 group-hover:opacity-90' : 'bg-pink-500 group-hover:bg-pink-600')}`}
                          style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count > 0 ? '8px' : '0' }}
                        ></div>
                        {d.count > 0 && (
                          <div className={`absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded ${isDark ? 'bg-slate-800' : 'bg-white shadow-lg'}`}>
                            {d.count}
                          </div>
                        )}
                      </div>
                      <div className={`text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{d.label.slice(0, 3)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completion Rate Trend */}
              <div>
                <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Daily Completion Rate</h3>
                <div className="h-32 flex items-end justify-between gap-1">
                  {last7DaysRate.map((rate, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className={`w-full h-24 flex items-end ${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg overflow-hidden`}>
                        <div 
                          className={`w-full transition-all duration-500 ${isDark ? (isGreen ? 'bg-green-500' : isLgbt ? 'bg-indigo-500' : 'bg-pink-500') : (isGreen ? 'bg-green-600' : isLgbt ? 'bg-indigo-600' : 'bg-pink-600')}`}
                          style={{ height: `${rate}%` }}
                        ></div>
                      </div>
                      <div className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {Math.round(rate)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Completions */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>All-Time Completions</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total habits completed since you started</p>
                  </div>
                  <div className={`text-4xl font-black ${isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')}`}>
                    {totalCompletions}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HABITS TAB */}
          {activeTab === 'habits' && (
            <div className="space-y-6">
              {/* Top Performers */}
              {topHabits.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className={`w-5 h-5 ${isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-yellow-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-yellow-500' : 'text-pink-600')}`} />
                    <h3 className={`font-bold text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Top Performers</h3>
                  </div>
                  <div className="space-y-3">
                    {topHabits.map((habit, idx) => (
                      <div key={habit.id} className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                            idx === 0 ? 'bg-yellow-500 text-white' :
                            idx === 1 ? 'bg-slate-400 text-white' :
                            'bg-orange-600 text-white'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{habit.title}</p>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {habit.completedDates.length} total completions
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flame className={`w-5 h-5 ${isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-orange-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-orange-500' : 'text-pink-600')}`} />
                          <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{habit.streak}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Needs Attention */}
              {needsAttention.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                    <h3 className={`font-bold text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Needs Attention</h3>
                  </div>
                  <div className="space-y-3">
                    {needsAttention.map((habit) => (
                      <div key={habit.id} className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{habit.title}</p>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Streak broken • {habit.completedDates.length} total completions
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-lg text-xs font-bold ${isDark ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>
                        0 days
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* All Habits Summary */}
          <div>
            <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>All Habits</h3>
            <div className="space-y-2">
              {habits.map((habit) => {
                const completionRate = habit.completedDates.length > 0 
                  ? Math.round((habit.streak / habit.completedDates.length) * 100)
                  : 0;
                
                return (
                  <div key={habit.id} className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{habit.title}</p>
                      <div className="flex items-center gap-2">
                        <Flame className={`w-4 h-4 ${habit.streak > 0 ? (isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-orange-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-orange-500' : 'text-pink-600')) : 'text-slate-400'}`} />
                        <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{habit.streak}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        {habit.completedDates.length} completions
                      </span>
                      <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div 
                          className={`h-full ${isDark ? (isGreen ? 'bg-green-500' : isLgbt ? 'bg-indigo-500' : 'bg-pink-500') : (isGreen ? 'bg-green-600' : isLgbt ? 'bg-indigo-600' : 'bg-pink-600')}`}
                          style={{ width: `${Math.min(habit.streak * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* MONEY TAB */}
{activeTab === 'money' && (
  <div className="space-y-6">
    {/* View Selector */}
    <div className={`flex gap-2 p-1.5 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
      <button
        onClick={() => setMoneyView('overview')}
        className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition ${
          moneyView === 'overview'
            ? (isDark 
                ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
                : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 text-white')
              )
            : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`
        }`}
      >
        Overview
      </button>
      <button
        onClick={() => setMoneyView('monthly')}
        className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition ${
          moneyView === 'monthly'
            ? (isDark 
                ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
                : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 text-white')
              )
            : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => setMoneyView('yearly')}
        className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition ${
          moneyView === 'yearly'
            ? (isDark 
                ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
                : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 text-white')
              )
            : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`
        }`}
      >
        Yearly
      </button>
    </div>

    {/* Overview View - Weekly Line Chart */}
    {moneyView === 'overview' && (
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'}`}>
            <div className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-blue-600'}`}>Total Spent</div>
            <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-blue-900'}`}>
              {currencySymbol}{weeklyTotal.toFixed(2)}
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-green-50 border-green-200'}`}>
            <div className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-green-600'}`}>Total Budget</div>
            <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-green-900'}`}>
              {currencySymbol}{weeklyBudget.toFixed(2)}
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${weeklySaved >= 0 ? (isDark ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50 border-emerald-200') : (isDark ? 'bg-slate-800 border-slate-700' : 'bg-red-50 border-red-200')}`}>
            <div className={`text-sm font-medium mb-1 ${weeklySaved >= 0 ? (isDark ? 'text-slate-400' : 'text-emerald-600') : (isDark ? 'text-slate-400' : 'text-red-600')}`}>
              {weeklySaved >= 0 ? 'Savings' : 'Over Budget'}
            </div>
            <div className={`text-2xl font-black ${weeklySaved >= 0 ? (isDark ? 'text-green-400' : 'text-emerald-900') : (isDark ? 'text-red-400' : 'text-red-900')}`}>
              {currencySymbol}{Math.abs(weeklySaved).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Weekly Line Chart */}
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h4 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Weekly Spending Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklySpending}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
              <XAxis 
                dataKey="label" 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                axisLine={{ stroke: isDark ? '#475569' : '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                axisLine={{ stroke: isDark ? '#475569' : '#cbd5e1' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  color: isDark ? '#ffffff' : '#000000'
                }}
                formatter={(value: any) => [`${currencySymbol}${value.toFixed(2)}`, 'Spent']}
              />
              <Line 
                type="monotone" 
                dataKey="spent" 
                stroke={isDark ? (isGreen ? '#10b981' : isLgbt ? '#6366f1' : '#ec4899') : (isGreen ? '#059669' : isLgbt ? '#4f46e5' : '#db2777')}
                strokeWidth={3}
                dot={{ fill: isDark ? (isGreen ? '#10b981' : isLgbt ? '#6366f1' : '#ec4899') : (isGreen ? '#059669' : isLgbt ? '#4f46e5' : '#db2777'), r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}

    {/* Monthly View - Daily Bar Chart */}
    {moneyView === 'monthly' && (
      <div className="space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
              } else {
                setSelectedMonth(selectedMonth - 1);
              }
            }}
            className={`p-2 rounded-xl transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            ←
          </button>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {new Date(selectedYear, selectedMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={() => {
              if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
              } else {
                setSelectedMonth(selectedMonth + 1);
              }
            }}
            className={`p-2 rounded-xl transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            →
          </button>
        </div>

        {/* Monthly Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'}`}>
            <div className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-blue-600'}`}>Spent</div>
            <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-blue-900'}`}>
              {currencySymbol}{monthlyAnalytics.totalSpent.toFixed(2)}
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-green-50 border-green-200'}`}>
            <div className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-green-600'}`}>Budget</div>
            <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-green-900'}`}>
              {currencySymbol}{monthlyAnalytics.monthlyBudget.toFixed(2)}
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${monthlyAnalytics.saved >= 0 ? (isDark ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50 border-emerald-200') : (isDark ? 'bg-slate-800 border-slate-700' : 'bg-red-50 border-red-200')}`}>
            <div className={`text-sm font-medium mb-1 ${monthlyAnalytics.saved >= 0 ? (isDark ? 'text-slate-400' : 'text-emerald-600') : (isDark ? 'text-slate-400' : 'text-red-600')}`}>
              {monthlyAnalytics.saved >= 0 ? 'Saved' : 'Over'}
            </div>
            <div className={`text-xl font-black ${monthlyAnalytics.saved >= 0 ? (isDark ? 'text-green-400' : 'text-emerald-900') : (isDark ? 'text-red-400' : 'text-red-900')}`}>
              {currencySymbol}{Math.abs(monthlyAnalytics.saved).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Daily Spending Bar Chart */}
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h4 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Daily Spending</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyAnalytics.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
              <XAxis 
                dataKey="day" 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                axisLine={{ stroke: isDark ? '#475569' : '#cbd5e1' }}
                interval={4}
                label={{ value: 'Day of Month', position: 'insideBottom', offset: -5, fill: isDark ? '#94a3b8' : '#64748b' }}
              />
              <YAxis 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                axisLine={{ stroke: isDark ? '#475569' : '#cbd5e1' }}
                label={{ value: `Amount (${currencySymbol})`, angle: -90, position: 'insideLeft', fill: isDark ? '#94a3b8' : '#64748b' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  color: isDark ? '#ffffff' : '#000000'
                }}
                formatter={(value: any) => [`${currencySymbol}${value.toFixed(2)}`, 'Spent']}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Bar 
                dataKey="spent" 
                fill={isDark ? (isGreen ? '#10b981' : isLgbt ? '#6366f1' : '#ec4899') : (isGreen ? '#059669' : isLgbt ? '#4f46e5' : '#db2777')}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        {monthlyAnalytics.categoryTotals.length > 0 && (
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h4 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Category Breakdown</h4>
            <div className="space-y-3">
              {monthlyAnalytics.categoryTotals
                .sort((a, b) => b.total - a.total)
                .map((cat) => {
                  const percentage = (cat.total / monthlyAnalytics.totalSpent) * 100;
                  const Icon = cat.icon;
                  
                  return (
                    <div key={cat.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.label}</span>
                        </div>
                        <span className={`font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {currencySymbol}{cat.total.toFixed(2)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div
                          className={`h-full rounded-full ${
                            isDark 
                              ? (isGreen ? 'bg-green-500' : isLgbt ? 'bg-indigo-500' : 'bg-pink-500')
                              : (isGreen ? 'bg-green-600' : isLgbt ? 'bg-indigo-600' : 'bg-pink-600')
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    )}

    {/* Yearly View - Monthly Bar Chart with Line Overlay */}
    {moneyView === 'yearly' && (
      <div className="space-y-6">
        {/* Year Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedYear(selectedYear - 1)}
            className={`p-2 rounded-xl transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            ←
          </button>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedYear}</h3>
          <button
            onClick={() => setSelectedYear(selectedYear + 1)}
            className={`p-2 rounded-xl transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            →
          </button>
        </div>

        {/* Yearly Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'}`}>
            <div className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-blue-600'}`}>Total Spent</div>
            <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-blue-900'}`}>
              {currencySymbol}{yearlyAnalytics.totalSpent.toFixed(2)}
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-green-50 border-green-200'}`}>
            <div className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-green-600'}`}>Total Budget</div>
            <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-green-900'}`}>
              {currencySymbol}{yearlyAnalytics.yearlyBudget.toFixed(2)}
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${yearlyAnalytics.saved >= 0 ? (isDark ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50 border-emerald-200') : (isDark ? 'bg-slate-800 border-slate-700' : 'bg-red-50 border-red-200')}`}>
            <div className={`text-sm font-medium mb-1 ${yearlyAnalytics.saved >= 0 ? (isDark ? 'text-slate-400' : 'text-emerald-600') : (isDark ? 'text-slate-400' : 'text-red-600')}`}>
              {yearlyAnalytics.saved >= 0 ? 'Total Saved' : 'Over Budget'}
            </div>
            <div className={`text-xl font-black ${yearlyAnalytics.saved >= 0 ? (isDark ? 'text-green-400' : 'text-emerald-900') : (isDark ? 'text-red-400' : 'text-red-900')}`}>
              {currencySymbol}{Math.abs(yearlyAnalytics.saved).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Monthly Spending Bar + Line Chart */}
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h4 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Monthly Spending vs Budget</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={yearlyAnalytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                axisLine={{ stroke: isDark ? '#475569' : '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                axisLine={{ stroke: isDark ? '#475569' : '#cbd5e1' }}
                label={{ value: `Amount (${currencySymbol})`, angle: -90, position: 'insideLeft', fill: isDark ? '#94a3b8' : '#64748b' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  color: isDark ? '#ffffff' : '#000000'
                }}
                formatter={(value: any) => `${currencySymbol}${value.toFixed(2)}`}
              />
              <Bar 
                dataKey="spent" 
                fill={isDark ? (isGreen ? '#10b981' : isLgbt ? '#6366f1' : '#ec4899') : (isGreen ? '#059669' : isLgbt ? '#4f46e5' : '#db2777')}
                name="Spent"
                radius={[8, 8, 0, 0]}
              />
              <Line 
                type="monotone" 
                dataKey="budget" 
                stroke={isDark ? '#64748b' : '#94a3b8'}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: isDark ? '#64748b' : '#94a3b8', r: 4 }}
                name="Budget"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Savings Bar Chart */}
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h4 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Monthly Savings/Deficit</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={yearlyAnalytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                axisLine={{ stroke: isDark ? '#475569' : '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                axisLine={{ stroke: isDark ? '#475569' : '#cbd5e1' }}
                label={{ value: `Amount (${currencySymbol})`, angle: -90, position: 'insideLeft', fill: isDark ? '#94a3b8' : '#64748b' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  color: isDark ? '#ffffff' : '#000000'
                }}
                formatter={(value: any) => [`${currencySymbol}${value.toFixed(2)}`, value >= 0 ? 'Saved' : 'Over Budget']}
              />
              <Bar dataKey="saved" name="Savings" radius={[8, 8, 0, 0]}>
                {yearlyAnalytics.monthlyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.saved >= 0 
                      ? (isDark ? '#10b981' : '#059669') 
                      : '#ef4444'
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}
  </div>
)}
    </div>
  </div>
</div>
);
};


// Landing Page
const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';

  return (
    <div className={`min-h-screen font-sans overflow-hidden relative transition-colors duration-500 ${isDark ? (isLgbt ? 'bg-rainbow-dark text-white' : 'bg-slate-950 text-white') : isGreen ? 'bg-green-50 text-slate-900' : isLgbt ? 'bg-rainbow-light text-slate-900' : 'bg-pink-50 text-slate-900'}`}>
      <AnimationStyles />
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl animate-float ${isDark ? (isGreen ? 'bg-green-900/10' : isLgbt ? 'bg-red-900/10' : 'bg-pink-900/10') : (isGreen ? 'bg-green-200' : isLgbt ? 'bg-red-200' : 'bg-pink-200')} mix-blend-multiply opacity-50`} style={{ animationDuration: '7s' }}></div>
        <div className={`absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl animate-float ${isDark ? (isGreen ? 'bg-emerald-900/10' : isLgbt ? 'bg-blue-900/10' : 'bg-rose-900/10') : (isGreen ? 'bg-emerald-200' : isLgbt ? 'bg-blue-200' : 'bg-rose-200')} mix-blend-multiply opacity-50`} style={{ animationDuration: '10s' }}></div>
        <div className={`absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] rounded-full blur-3xl animate-float ${isDark ? (isGreen ? 'bg-teal-900/10' : isLgbt ? 'bg-green-900/10' : 'bg-fuchsia-900/10') : (isGreen ? 'bg-teal-200' : isLgbt ? 'bg-green-200' : 'bg-fuchsia-200')} mix-blend-multiply opacity-50`} style={{ animationDuration: '12s' }}></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto w-full backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition ${isDark ? (isGreen ? 'bg-green-400' : isLgbt ? 'bg-gradient-to-br from-red-500 to-blue-500' : 'bg-pink-400') : (isGreen ? 'bg-green-600' : isLgbt ? 'bg-gradient-to-br from-red-500 to-blue-500' : 'bg-pink-600')}`}>
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <span className={`text-2xl font-black ${isDark ? (isGreen ? 'text-green-300' : isLgbt ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400' : 'text-pink-300') : (isGreen ? 'text-green-700' : isLgbt ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-600' : 'text-pink-700')}`}>HabitFlow</span>
        </div>
        <div className="flex items-center space-x-4">
          <AccentToggle />
          <ThemeToggle />
        </div>
      </nav>

      <header className="relative z-10 flex-grow flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto mt-10 mb-20">
        <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-bold mb-8 shadow-sm backdrop-blur-md animate-float ${isDark ? (isGreen ? 'bg-slate-900/50 border-green-500 text-green-300' : isLgbt ? 'bg-slate-900/50 border-indigo-500 text-white' : 'bg-slate-900/50 border-pink-500 text-pink-300') : (isGreen ? 'bg-white border-green-200 text-green-600' : isLgbt ? 'bg-white border-indigo-200 text-indigo-600' : 'bg-white border-pink-200 text-pink-600')}`}>
          <Sparkles className={`w-4 h-4 mr-2 ${isGreen ? 'text-green-500 fill-green-500' : isLgbt ? 'text-yellow-500 fill-yellow-500' : 'text-pink-500 fill-pink-500'}`} />
          Level up your daily routine
        </div>
        
        <h1 className={`text-5xl sm:text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Build habits that <br className="hidden md:block" />
          <span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark ? (isGreen ? 'from-green-400 to-emerald-400' : isLgbt ? 'from-red-400 via-yellow-400 to-blue-400' : 'from-pink-400 to-rose-400') : (isGreen ? 'from-green-600 to-emerald-600' : isLgbt ? 'from-red-500 via-green-500 to-blue-600' : 'from-pink-600 to-rose-600')}`}>improve your life.</span>
        </h1>
        
        <p className={`text-lg sm:text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Turn your daily tasks into a vibrant streak. Visualize your progress with a dashboard that actually motivates you.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button onClick={onGetStarted} className={`text-white text-lg px-10 py-4 rounded-2xl font-bold transition transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center ${isDark ? (isGreen ? 'bg-green-500 hover:bg-green-400 shadow-green-500/40' : isLgbt ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-600 hover:opacity-90 shadow-indigo-500/40' : 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/40') : (isGreen ? 'bg-green-600 hover:bg-green-700 shadow-green-600/40' : isLgbt ? 'bg-gradient-to-r from-red-600 via-green-600 to-blue-700 hover:opacity-90 shadow-indigo-600/40' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-600/40')}`}>
            Get Started
            <ChevronRight className="ml-2 w-6 h-6" />
          </button>
        </div>

        <div className="mt-16 sm:mt-20 relative w-full max-w-3xl transform hover:scale-[1.02] transition duration-500">
          <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-20 ${isDark ? (isGreen ? 'bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500' : 'bg-pink-400') : (isGreen ? 'bg-green-600' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600' : 'bg-pink-600')}`}></div>
          <div className={`relative backdrop-blur-xl border p-4 sm:p-6 rounded-3xl shadow-2xl ${isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/60 border-white/50'}`}>
            <div className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl shadow-sm border mb-4 ${isDark ? 'bg-slate-800 border-slate-700' : (isGreen ? 'bg-white border-green-100' : isLgbt ? 'bg-white border-indigo-100' : 'bg-white border-pink-100')}`}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${isDark ? (isGreen ? 'bg-green-900/50 text-green-300' : isLgbt ? 'bg-indigo-900/50 text-indigo-300' : 'bg-pink-900/50 text-pink-300') : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-gradient-to-br from-red-100 to-blue-100 text-indigo-600' : 'bg-pink-100 text-pink-600')}`}>
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 text-left">
                <div className={`h-3 sm:h-4 w-24 sm:w-32 rounded mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                <div className={`h-2 sm:h-3 w-16 sm:w-20 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
              </div>
              <div className={`px-3 py-1.5 sm:w-20 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm ${isDark ? (isGreen ? 'bg-green-900/30 text-green-300' : isLgbt ? 'bg-indigo-900/30 text-indigo-300' : 'bg-pink-900/30 text-pink-300') : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600')}`}>Done!</div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

// Welcome Component (Replaces AuthPage)
// Replace the WelcomePage component with this updated version

const WelcomePage = ({ onSuccess }: { onSuccess: () => void }) => {
  const [mode, setMode] = useState<'signup' | 'login'>('login'); // Default to login
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const username = name.trim();
  if (!username || !password.trim()) return;
  
  setLoading(true);
  setError('');

  try {
    const normalizedUsername = username.toLowerCase().replace(/\s+/g, '');
    const email = `${normalizedUsername}@habitflow.app`;

    if (mode === 'login') {
      // LOGIN MODE
      await signInWithEmailAndPassword(auth, email, password);
      // Firebase's onAuthStateChanged will handle the transition
    } else {
      // SIGNUP MODE - CREATE NEW ACCOUNT DIRECTLY
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Update display name
      await updateProfile(newUser, { displayName: username });

      // Store additional data in Firestore
      try {
        await setDoc(doc(db, 'users', newUser.uid, 'profile'), {
          username: username,
          onboardingComplete: true,
          createdAt: serverTimestamp()
        });

        // Reserve username
        await setDoc(doc(db, 'usernames', normalizedUsername), {
          uid: newUser.uid,
          username: username,
          createdAt: serverTimestamp()
        });
      } catch (firestoreErr) {
        console.warn("Firestore write failed (likely permissions), continuing with auth only", firestoreErr);
      }
      
      // Firebase's onAuthStateChanged will handle the transition
    }
  } catch (err: any) {
    console.error("Auth Failed:", err);
    
    // Handle specific auth errors
    if (err.code === 'auth/user-not-found') {
      setError('Account not found. Please sign up first.');
    } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      setError('Invalid username or password.');
    } else if (err.code === 'auth/email-already-in-use') {
      setError('Username already taken. Please try logging in instead.');
    } else if (err.code === 'auth/weak-password') {
      setError('Password should be at least 6 characters.');
    } else {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }
};

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-500 ${isDark ? (isLgbt ? 'bg-rainbow-dark' : 'bg-slate-950') : isGreen ? 'bg-green-50' : isLgbt ? 'bg-rainbow-light' : 'bg-pink-50'}`}>
      <AnimationStyles />
      <div className={`absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-40 -top-20 -left-20 animate-float ${isDark ? (isGreen ? 'bg-green-900/10' : isLgbt ? 'bg-purple-900/10' : 'bg-pink-900/10') : (isGreen ? 'bg-green-200' : isLgbt ? 'bg-purple-200' : 'bg-pink-200')}`}></div>
      
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex gap-2">
        <AccentToggle />
        <ThemeToggle />
      </div>

      <div className={`backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md border relative z-10 transition-colors duration-300 ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-white'}`}>
        
        {/* Tabs */}
        <div className={`flex gap-2 p-1.5 rounded-2xl mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              mode === 'login'
                ? `${isDark 
                    ? (isGreen ? 'bg-green-500 text-white shadow-lg' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-lg' : 'bg-pink-500 text-white shadow-lg')
                    : (isGreen ? 'bg-green-600 text-white shadow-lg' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg' : 'bg-pink-600 text-white shadow-lg')
                  }`
                : `${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              mode === 'signup'
                ? `${isDark 
                    ? (isGreen ? 'bg-green-500 text-white shadow-lg' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-lg' : 'bg-pink-500 text-white shadow-lg')
                    : (isGreen ? 'bg-green-600 text-white shadow-lg' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg' : 'bg-pink-600 text-white shadow-lg')
                  }`
                : `${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg transform rotate-3 ${isDark ? (isGreen ? 'bg-green-500 text-white shadow-green-500/40' : isLgbt ? 'bg-gradient-to-br from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white shadow-pink-500/40') : (isGreen ? 'bg-green-600 text-white shadow-green-200' : isLgbt ? 'bg-gradient-to-br from-red-500 to-blue-500 text-white' : 'bg-pink-600 text-white shadow-pink-200')}`}>
            {mode === 'login' ? <UserCircle2 className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
          </div>
          <h2 className={`text-3xl font-black mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {mode === 'login' ? 'Welcome Back!' : 'Welcome!'}
          </h2>
          <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {mode === 'login' 
              ? 'Great to see you again! Ready to continue your journey?' 
              : "Let's get to know you better to personalize your experience."
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className={`p-3 rounded-xl text-sm font-bold text-center animate-pop ${isDark ? 'bg-red-900/30 text-red-300 border border-red-800' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              {error}
            </div>
          )}

          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Username</label>
            <input
              type="text"
              required
              className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition font-medium text-lg ${
                isDark 
                  ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-500 focus:bg-slate-800 placeholder-slate-500' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-500 focus:bg-slate-800 placeholder-slate-500' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-500 focus:bg-slate-800 placeholder-slate-500') 
                  : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-600 focus:bg-white focus:ring-4 focus:ring-pink-100')
              }`}
              placeholder={mode === 'login' ? 'Enter your username' : 'e.g. warrior123'}
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition font-medium text-lg ${
                  isDark 
                    ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-500 focus:bg-slate-800 placeholder-slate-500' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-500 focus:bg-slate-800 placeholder-slate-500' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-500 focus:bg-slate-800 placeholder-slate-500')
                    : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-600 focus:bg-white focus:ring-4 focus:ring-pink-100')
                }`}
                placeholder="••••••••"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              {password.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              ) : (
                <Lock className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-opacity ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-4 rounded-xl font-bold text-xl transition transform hover:-translate-y-1 shadow-xl flex items-center justify-center gap-2 ${
              isDark ? (isGreen ? 'bg-green-500 hover:bg-green-400 shadow-green-500/40' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/40') : (isGreen ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : isLgbt ? 'bg-gradient-to-r from-red-600 via-green-600 to-blue-700 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200')
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (mode === 'login' ? 'Logging in...' : 'Setting up...') : (
              <>
                {mode === 'login' ? (
                  <>
                    Login <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Start Journey <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </>
            )}
          </button>
        </form>

        {mode === 'login' && (
          <p className={`text-center text-sm mt-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`font-bold ${isDark ? (isGreen ? 'text-green-400 hover:text-green-300' : isLgbt ? 'text-indigo-400 hover:text-indigo-300' : 'text-pink-400 hover:text-pink-300') : (isGreen ? 'text-green-600 hover:text-green-700' : isLgbt ? 'text-indigo-600 hover:text-indigo-700' : 'text-pink-600 hover:text-pink-700')}`}
            >
              Sign up here
            </button>
          </p>
        )}

        {mode === 'signup' && (
          <p className={`text-center text-sm mt-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`font-bold ${isDark ? (isGreen ? 'text-green-400 hover:text-green-300' : isLgbt ? 'text-indigo-400 hover:text-indigo-300' : 'text-pink-400 hover:text-pink-300') : (isGreen ? 'text-green-600 hover:text-green-700' : isLgbt ? 'text-indigo-600 hover:text-indigo-700' : 'text-pink-600 hover:text-pink-700')}`}
            >
              Login here
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

// Template Browser Component
const TemplateBrowser = ({ 
  onSelectTemplate, 
  onClose 
}: { 
  onSelectTemplate: (template: HabitTemplate) => void;
  onClose: () => void;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'student' | 'adult' | 'health' | 'productivity'>('all');
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';

  const categories = [
    { id: 'all', label: 'All Templates', icon: Layout },
    { id: 'student', label: 'Student', icon: Book },
    { id: 'adult', label: 'Career', icon: Briefcase },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'productivity', label: 'Productivity', icon: Zap },
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? HABIT_TEMPLATES 
    : HABIT_TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl animate-pop ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      } border-2`}>
        
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 border-b backdrop-blur-md ${
          isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isDark 
                  ? (isGreen ? 'bg-green-500/20 text-green-400' : isLgbt ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400')
                  : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600')
              }`}>
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Habit Templates
                </h2>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Choose a pre-made habit to get started quickly
                </p>
              </div>
            </div>
            <button 
               onClick={onClose}
              aria-label="Close modal"
              className={`absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition`}
              >
             <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition ${
                    isSelected
                      ? (isDark 
                          ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
                          : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 text-white')
                        )
                      : (isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template, idx) => {
              const IconComponent = HABIT_ICONS.find(i => i.name === template.icon)?.icon || CheckCircle2;
              
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  className={`group text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900'
                      : (isGreen 
                          ? 'bg-white border-green-100 hover:border-green-300 hover:shadow-lg hover:shadow-green-100'
                          : isLgbt
                            ? 'bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100'
                            : 'bg-white border-pink-100 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100'
                        )
                  }`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                      isDark
                        ? (isGreen ? 'bg-green-900/40 text-green-400 group-hover:bg-green-900/60' : isLgbt ? 'bg-indigo-900/40 text-indigo-400 group-hover:bg-indigo-900/60' : 'bg-pink-900/40 text-pink-400 group-hover:bg-pink-900/60')
                        : (isGreen ? 'bg-green-100 text-green-600 group-hover:bg-green-200' : isLgbt ? 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200' : 'bg-pink-100 text-pink-600 group-hover:bg-pink-200')
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {template.title}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {template.description}
                      </p>
                      <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-lg text-xs font-bold ${
                        isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className="capitalize">{template.category}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <p className="text-lg font-bold mb-2">No templates found</p>
              <p className="text-sm">Try selecting a different category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Reminder Settings Modal
const ReminderModal = ({ 
  habit, 
  onClose, 
  onSave 
}: { 
  habit: Habit;
  onClose: () => void;
  onSave: (enabled: boolean, time: string) => void;
}) => {
  const [enabled, setEnabled] = useState(habit.reminderEnabled || false);
  const [time, setTime] = useState(habit.reminderTime || '09:00');
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';

  const handleSave = () => {
    onSave(enabled, time);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-6 animate-pop ${
        isDark ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white border-2 border-slate-100'
      }`}>
        
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl transition ${
            isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 ${
            isDark 
              ? (isGreen ? 'bg-green-500/20 text-green-400' : isLgbt ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400')
              : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600')
          }`}>
            <span className="text-2xl">🔔</span>
          </div>
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Daily Reminder
          </h2>
          <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            for "{habit.title}"
          </p>
        </div>

        <div className="space-y-5">
          {/* Enable/Disable Toggle */}
          <div className={`p-4 rounded-2xl border-2 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Enable Reminder
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Get notified daily
                </p>
              </div>
              <button
                onClick={() => setEnabled(!enabled)}
                className={`w-14 h-8 rounded-full transition-all duration-300 relative ${
                  enabled 
                    ? (isDark 
                        ? (isGreen ? 'bg-green-500' : isLgbt ? 'bg-indigo-500' : 'bg-pink-500')
                        : (isGreen ? 'bg-green-600' : isLgbt ? 'bg-indigo-600' : 'bg-pink-600')
                      )
                    : (isDark ? 'bg-slate-700' : 'bg-slate-300')
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-300 ${
                  enabled ? 'left-7' : 'left-1'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Time Picker */}
          {enabled && (
            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Reminder Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition font-bold text-xl text-center ${
                  isDark 
                    ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-500' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-500' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-500')
                    : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
                }`}
              />
            </div>
          )}

          {/* Permission Warning */}
          {enabled && 'Notification' in window && Notification.permission !== 'granted' && (
            <div className={`p-3 rounded-xl text-sm font-medium ${
              isDark ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-800' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
            }`}>
              ⚠️ Please allow notifications in your browser settings
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className={`flex-1 text-white py-4 rounded-2xl font-bold text-lg transition shadow-lg hover:-translate-y-0.5 ${
                isDark 
                  ? (isGreen ? 'bg-green-500 hover:bg-green-400 shadow-green-500/40' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/40')
                  : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
              }`}
            >
              Save Reminder
            </button>
            <button
              onClick={onClose}
              className={`px-6 py-4 rounded-2xl font-bold transition ${
                isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Dashboard Component
const Dashboard = ({ user, onLogout }: { user: FirebaseUser, onLogout: () => void }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState(HABIT_ICONS[0].name); // Added state for icon
  const [isAdding, setIsAdding] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false); 
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editIcon, setEditIcon] = useState(''); // ← ADD THIS
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const [showStats, setShowStats] = useState(false);
  const [reminderHabit, setReminderHabit] = useState<Habit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<'habits' | 'todos' | 'money'>('habits');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  // Money Tracking State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dailyAllowance, setDailyAllowance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');  // ADD THIS
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');  // ADD THIS
  const [showAllowanceModal, setShowAllowanceModal] = useState(false);
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('food');
  const [newExpenseDescription, setNewExpenseDescription] = useState('');
  const [newExpenseDate, setNewExpenseDate] = useState(getTodayString());
  const [moneyView, setMoneyView] = useState<'overview' | 'monthly' | 'yearly'>('overview');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // 👇 ADD FROM HERE
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  // 👆 ADD UNTIL HERE
   useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
  
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';
  const [toast, setToast] = useState<ToastData | null>(null);

  // Load Habits
 // Load Habits
  useEffect(() => {
    if (!user || !user.uid) {
      setHabits([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'habits'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        streak: calculateStreak(doc.data().completedDates || [])
      })) as Habit[];
      setHabits(habitsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching habits:", error);
      setLoading(false);
    });

    return () => unsubscribe();
     }, [user]);

   useEffect(() => {
  const timeoutIds: ReturnType<typeof setTimeout>[] = [];
  
  habits.forEach(habit => {
    if (habit.reminderEnabled) {
      const timeoutId = scheduleNotification(habit);
      if (timeoutId !== null) {
        timeoutIds.push(timeoutId);
      }
    }
  });
  
  // Cleanup function - clears all timeouts when component unmounts or habits change
  return () => {
    timeoutIds.forEach(id => {
      if (id) clearTimeout(id);
    });
  };
}, [habits]);
  useEffect(() => {
    if (!user || !user.uid) {
      setTodos([]);
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'todos'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TodoItem[];
      setTodos(todosData);
    }, (error) => {
      console.error("Error fetching todos:", error);
    });

    return () => unsubscribe();
  }, [user]);
  // Load Money Settings
  useEffect(() => {
  if (!user || !user.uid) return;

  const settingsRef = doc(db, 'users', user.uid, 'money', 'settings');
  const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      setDailyAllowance(data.dailyAllowance || 0);
      setCurrency(data.currency || 'USD');
      setCurrencySymbol(data.currencySymbol || '$');
    } else {
      setShowAllowanceModal(true);
    }
  }, (error) => {
    console.error("Error fetching money settings:", error);
  });

  return () => unsubscribe();
}, [user]);

  // Load Expenses
  useEffect(() => {
    if (!user || !user.uid) {
      setExpenses([]);
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'expenses'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];
      setExpenses(expensesData);
    }, (error) => {
      console.error("Error fetching expenses:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const today = getTodayString();
  const totalHabits = habits.length;
  const filteredHabits = habits.filter(habit => 
    habit.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const completedToday = habits.filter(h => h.completedDates?.includes(today)).length;
  const progress = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  // Trigger celebration logic
  useEffect(() => {
    if (progress === 100 && totalHabits > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [progress, totalHabits]);

  const selectTemplate = (template: HabitTemplate) => {
    setNewHabitTitle(template.title);
    setNewHabitIcon(template.icon);
    setIsAdding(true);
  };


  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim() || !user) return;

    // Validation
    if (newHabitTitle.length > 100) {
      setToast({ id: Date.now().toString(), message: 'Title too long (max 100 characters)', type: 'error' });
      return;
    }

    // Check for duplicates
    if (habits.some(h => h.title.toLowerCase() === newHabitTitle.trim().toLowerCase())) {
      setToast({ id: Date.now().toString(), message: 'You already have this habit!', type: 'error' });
      return;
    }

    const newHabit = {
      title: newHabitTitle,
      frequency: 'daily',
      completedDates: [],
      createdAt: serverTimestamp(),
      icon: newHabitIcon, // Use selected icon
      colorTheme: isGreen ? 'Green' : isLgbt ? 'Red' : 'Pink' 
    };

    // Optimistic UI Update: Close modal and reset immediately
    setNewHabitTitle('');
    setNewHabitIcon(HABIT_ICONS[0].name); 
    setIsAdding(false);
    setToast({ id: Date.now().toString(), message: 'Habit created successfully!', type: 'success' });

    try {
      await addDoc(collection(db, 'users', user.uid, 'habits'), newHabit);
    } catch (error) {
      console.error("Error adding habit", error);
     setToast({ id: Date.now().toString(), message: 'Failed to create habit.', type: 'error' });
    }
  };

  const toggleCheckIn = async (habit: Habit) => {
    if (!user) return;
    let newDates = [...(habit.completedDates || [])];
    
    if (newDates.includes(today)) {
      newDates = newDates.filter(d => d !== today);
    } else {
     newDates.push(today);
    }

    try {

     const habitRef = doc(db, 'users', user.uid, 'habits', habit.id);
     await updateDoc(habitRef, {
     completedDates: newDates
     });
    } catch (error) {
     console.error("Error updating habit", error);
     setToast({ id: Date.now().toString(), message: 'Failed to update habit.', type: 'error' });
    }
  };

  const deleteHabit = (habitId: string) => {
    if (!user) return;
    
    const habitToDelete = habits.find(h => h.id === habitId);
    if (!habitToDelete) return;

    // Optimistically remove from UI
    const updatedHabits = habits.filter(h => h.id !== habitId);
    setHabits(updatedHabits);

   let timeoutId: ReturnType<typeof setTimeout>;

    const undoDelete = () => {
      clearTimeout(timeoutId);
      setHabits(prevHabits => {
        const restored = [...prevHabits, habitToDelete].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return restored;
      });
      setToast(null);
    };

    // Show undo toast
    setToast({ 
      id: Date.now().toString(), 
      message: `"${habitToDelete.title}" deleted`, 
      type: 'info',
      action: {
        label: 'Undo',
        onClick: undoDelete
      }
    });

   // Delete after 5 seconds if not undone
    timeoutId = setTimeout(() => {
      deleteDoc(doc(db, 'users', user.uid, 'habits', habitId))
          .catch((error) => {
          console.error("Error deleting habit", error);
          // Restore on error
          setHabits(prevHabits => [...prevHabits, habitToDelete]);
          setToast({ id: Date.now().toString(), message: 'Failed to delete habit.', type: 'error' });
        });
    }, 5000);
  };
    const saveReminder = async (habitId: string, enabled: boolean, time: string) => {
  if (!user) return;

  const updatedHabits = habits.map(h => 
    h.id === habitId 
      ? { ...h, reminderEnabled: enabled, reminderTime: time }
      : h
  );
  
  setHabits(updatedHabits);

  try {
    const habitRef = doc(db, 'users', user.uid, 'habits', habitId);
    await updateDoc(habitRef, {
      reminderEnabled: enabled,
      reminderTime: time
    });
    
    setToast({ 
      id: Date.now().toString(), 
      message: enabled ? `Reminder set for ${time}` : 'Reminder disabled', 
      type: 'success' 
    });
  } catch (error) {
    console.error("Error updating reminder", error);
    setToast({ id: Date.now().toString(), message: 'Failed to update reminder.', type: 'error' });
  }
};

const startEditingHabit = (habit: Habit) => {
  setEditingHabit(habit);
  setEditTitle(habit.title);
  setEditIcon(habit.icon || HABIT_ICONS[0].name);
};

const cancelEditing = () => {
  setEditingHabit(null);
  setEditTitle('');
  setEditIcon('');
};

const saveEditedHabit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editTitle.trim() || !editingHabit || !user) return;

  if (editTitle.length > 100) {
    setToast({ id: Date.now().toString(), message: 'Title too long (max 100 chars)', type: 'error' });
    return;
  }

  // Check for duplicate (excluding current habit)
  if (habits.some(h => h.id !== editingHabit.id && h.title.toLowerCase() === editTitle.toLowerCase())) {
    setToast({ id: Date.now().toString(), message: 'You already have a habit with this name!', type: 'error' });
    return;
  }

  const updates = {
    title: editTitle.trim(),
    icon: editIcon
  };

  // Optimistic update
  setHabits(prevHabits => 
    prevHabits.map(h => h.id === editingHabit.id ? { ...h, ...updates } : h)
  );
  cancelEditing();
  setToast({ id: Date.now().toString(), message: 'Habit updated!', type: 'success' });

  try {
    const habitRef = doc(db, 'users', user.uid, 'habits', editingHabit.id);
    await updateDoc(habitRef, updates);
  } catch (error) {
    console.error("Error updating habit", error);
    // Revert on error
    setHabits(prevHabits => 
      prevHabits.map(h => h.id === editingHabit.id ? editingHabit : h)
    );
    setToast({ id: Date.now().toString(), message: 'Failed to update habit.', type: 'error' });
  }
};
  
 

 const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      setCurrentPage('todos');
    } else if (swipeDistance < -minSwipeDistance) {
      setCurrentPage('habits');
    }
  };

  const addTodo = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newTodoTitle.trim() || !user) return;

  const newTodo = {
    title: newTodoTitle.trim(),
    completed: false,
    priority: newTodoPriority,
    dueDate: newTodoDueDate || undefined,
    createdAt: serverTimestamp()
  };

  setNewTodoTitle('');
  setNewTodoDueDate('');
  setToast({ id: Date.now().toString(), message: 'To-do added!', type: 'success' });

    try {
      await addDoc(collection(db, 'users', user.uid, 'todos'), newTodo);
    } catch (error) {
      console.error("Error adding todo", error);
      setToast({ id: Date.now().toString(), message: 'Failed to add to-do.', type: 'error' });
    }
  };

  const toggleTodo = async (todo: TodoItem) => {
    if (!user) return;
    try {
      const todoRef = doc(db, 'users', user.uid, 'todos', todo.id);
      await updateDoc(todoRef, {
        completed: !todo.completed
      });
    } catch (error) {
      console.error("Error updating todo", error);
    }
  };

  const deleteTodo = async (todoId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'todos', todoId));
      setToast({ id: Date.now().toString(), message: 'To-do deleted', type: 'success' });
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };
  // Money Tracking Functions
  const saveDailyAllowance = async (amount: number, currencyCode: string) => {
  if (!user) return;

  console.log('💰 Saving allowance:', { amount, currencyCode }); // ← ADD THIS
  try {
    const selectedCurrency = CURRENCIES.find(c => c.code === currencyCode);
    const symbol = selectedCurrency?.symbol || '$';
    console.log('💱 Found currency:', selectedCurrency); // ← ADD THIS
    console.log('💲 Symbol to save:', symbol); // ← ADD THIS

    await setDoc(doc(db, 'users', user.uid, 'money', 'settings'), {
      dailyAllowance: amount,
      currency: currencyCode,
      currencySymbol: symbol,
      updatedAt: serverTimestamp()
    });
    setDailyAllowance(amount);
    setCurrency(currencyCode);
    setCurrencySymbol(symbol);
    setShowAllowanceModal(false);
    setToast({ id: Date.now().toString(), message: 'Daily allowance saved!', type: 'success' });
  } catch (error) {
    console.error("Error saving allowance", error);
    setToast({ id: Date.now().toString(), message: 'Failed to save allowance.', type: 'error' });
  }
};

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseAmount.trim() || !user) return;

    const amount = parseFloat(newExpenseAmount);
    if (isNaN(amount) || amount <= 0) {
      setToast({ id: Date.now().toString(), message: 'Please enter a valid amount', type: 'error' });
      return;
    }

    const newExpense = {
      date: newExpenseDate,
      amount: amount,
      category: newExpenseCategory,
      description: newExpenseDescription.trim() || 'Expense',
      createdAt: serverTimestamp()
    };

    setNewExpenseAmount('');
    setNewExpenseDescription('');
    setNewExpenseDate(getTodayString());
    setToast({ id: Date.now().toString(), message: 'Expense added!', type: 'success' });

    try {
      await addDoc(collection(db, 'users', user.uid, 'expenses'), newExpense);
    } catch (error) {
      console.error("Error adding expense", error);
      setToast({ id: Date.now().toString(), message: 'Failed to add expense.', type: 'error' });
    }
  };

  const deleteExpense = async (expenseId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'expenses', expenseId));
      setToast({ id: Date.now().toString(), message: 'Expense deleted', type: 'success' });
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };

  // Calculate today's spending
  const todayExpenses = expenses.filter(e => e.date === today);
  const todaySpent = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const todayRemaining = dailyAllowance - todaySpent;
  const todaySavingsRate = dailyAllowance > 0 ? Math.round((todayRemaining / dailyAllowance) * 100) : 0;

  // Calculate weekly spending
  const last7Days = getLast7Days();
  const weeklySpending = last7Days.map(day => {
    const dayExpenses = expenses.filter(e => e.date === day.date);
    return {
      ...day,
      spent: dayExpenses.reduce((sum, e) => sum + e.amount, 0)
    };
  });
  const weeklyTotal = weeklySpending.reduce((sum, day) => sum + day.spent, 0);
  const weeklyBudget = dailyAllowance * 7;
  const weeklySaved = weeklyBudget - weeklyTotal;
  // Monthly Analytics
const getMonthlyData = (month: number, year: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
  });
  
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayExpenses = monthExpenses.filter(e => e.date === dateStr);
    return {
      day,
      spent: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
      count: dayExpenses.length
    };
  });
  
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyBudget = dailyAllowance * daysInMonth;
  const saved = monthlyBudget - totalSpent;
  
  // Category breakdown
  const categoryTotals = EXPENSE_CATEGORIES.map(cat => ({
    ...cat,
    total: monthExpenses.filter(e => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0)
  })).filter(cat => cat.total > 0);
  
  return { dailyData, totalSpent, monthlyBudget, saved, categoryTotals };
};

// Yearly Analytics
const getYearlyData = (year: number) => {
  const yearExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getFullYear() === year;
  });
  
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthExpenses = yearExpenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === i;
    });
    const daysInMonth = new Date(year, i + 1, 0).getDate();
    return {
      month: new Date(year, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      spent: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
      budget: dailyAllowance * daysInMonth,
      saved: (dailyAllowance * daysInMonth) - monthExpenses.reduce((sum, e) => sum + e.amount, 0)
    };
  });
  
  const totalSpent = yearExpenses.reduce((sum, e) => sum + e.amount, 0);
  const yearlyBudget = dailyAllowance * 365;
  const saved = yearlyBudget - totalSpent;
  
  return { monthlyData, totalSpent, yearlyBudget, saved };
};

const monthlyAnalytics = getMonthlyData(selectedMonth, selectedYear);
const yearlyAnalytics = getYearlyData(selectedYear);
  // Helper to get correct theme set
  const getColorTheme = (str: string) => {
    const themes = isGreen ? HABIT_THEMES_GREEN : isLgbt ? HABIT_THEMES_RAINBOW : HABIT_THEMES_PINK;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % themes.length;
    return themes[index];
  };

  return (
    <div className={`min-h-screen w-full overflow-x-hidden font-sans pb-20 px-4 sm:px-6 transition-colors duration-500 relative overflow-hidden ${isDark ? (isLgbt ? 'bg-rainbow-dark text-slate-100' : 'bg-slate-950 text-slate-100') : isGreen ? 'bg-[#F0FDF4] text-slate-900' : isLgbt ? 'bg-rainbow-light text-slate-900' : 'bg-[#FDF2F8] text-slate-900'}`}>
      <AnimationStyles />
      {!isOnline && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-yellow-500 text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl animate-bounce">
          📡 You're offline - changes will sync when back online
        </div>
      )}
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         {/* Dot Pattern */}
         <div className={`absolute inset-0 opacity-[0.03] ${isDark ? 'bg-white' : 'bg-black'}`} 
              style={{ 
                maskImage: 'radial-gradient(circle, black 1px, transparent 1px)',
                WebkitMaskImage: 'radial-gradient(circle, black 1px, transparent 1px)',
                maskSize: '24px 24px',
                WebkitMaskSize: '24px 24px',
                backgroundColor: 'currentColor'
              }}>
         </div>
         
         {/* Soft Blobs */}
         <div className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float ${isDark ? (isGreen ? 'bg-green-900' : isLgbt ? 'bg-indigo-900' : 'bg-pink-900') : (isGreen ? 'bg-green-300' : isLgbt ? 'bg-blue-200' : 'bg-pink-200')}`} style={{ animationDuration: '8s' }}></div>
         <div className={`absolute top-40 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20 animate-float ${isDark ? (isGreen ? 'bg-emerald-900' : isLgbt ? 'bg-purple-900' : 'bg-rose-900') : (isGreen ? 'bg-emerald-300' : isLgbt ? 'bg-purple-200' : 'bg-rose-200')}`} style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      </div>

      {showCelebration && <FullScreenConfetti />}
      {showStats && <HabitStats habits={habits} expenses={expenses} dailyAllowance={dailyAllowance} currencySymbol={currencySymbol} onClose={() => setShowStats(false)} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Toast toast={toast} onDismiss={() => setToast(null)} />
        </div>
      )}

      {/* Top Bar */}
      <div className={`backdrop-blur-md border-b sticky top-0 z-20 transition-colors duration-300 relative ${isDark ? (isGreen ? 'bg-green-900/80 border-green-800 shadow-green-900/40' : isLgbt ? 'bg-slate-900/80 border-slate-800' : 'bg-pink-900/80 border-pink-800 shadow-pink-900/40') : (isGreen ? 'bg-green-600/90 border-green-700' : isLgbt ? 'bg-white/80 border-slate-200' : 'bg-pink-600/90 border-pink-700')}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${isDark ? (isGreen ? 'bg-green-500 shadow-green-500/50 text-white' : isLgbt ? 'bg-gradient-to-br from-red-500 to-blue-500 text-white' : 'bg-pink-500 shadow-pink-500/50 text-white') : (isGreen ? 'bg-white text-green-600 shadow-lg' : isLgbt ? 'bg-gradient-to-br from-red-500 to-blue-500 text-white shadow-lg' : 'bg-white text-pink-600 shadow-lg')}`}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className={`text-xl font-black hidden sm:block ${isDark ? (isGreen ? 'text-green-100' : isLgbt ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400' : 'text-pink-100') : (isLgbt ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-600' : 'text-white')}`}>HabitFlow</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowStats(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition ${isDark ? (isGreen ? 'bg-green-800/50 hover:bg-green-700 text-green-100' : isLgbt ? 'bg-slate-800/50 hover:bg-slate-700 text-indigo-300' : 'bg-pink-800/50 hover:bg-pink-700 text-pink-100') : (isLgbt ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/20 hover:bg-white/30 text-white')}`}
            >
              <PieChart className="w-5 h-5" />
              <span className="hidden sm:inline">Insights</span>
            </button>

            <AccentToggle />
            <ThemeToggle />
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? (isGreen ? 'text-green-300' : isLgbt ? 'text-indigo-300' : 'text-pink-300') : (isGreen ? 'text-green-200' : isLgbt ? 'text-slate-500' : 'text-pink-200')}`}>Logged in as</span>
              <span className={`text-sm font-bold ${isDark ? (isGreen ? 'text-green-100' : isLgbt ? 'text-white' : 'text-pink-100') : (isLgbt ? 'text-slate-900' : 'text-white')}`}>{user.displayName || user.email}</span>
            </div>
            <button 
              onClick={onLogout}
              className={`transition p-3 rounded-xl ${isDark ? (isGreen ? 'bg-green-800 hover:bg-green-700 text-green-300 hover:text-green-100' : isLgbt ? 'bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-indigo-100' : 'bg-pink-800 hover:bg-pink-700 text-pink-300 hover:text-pink-100') : (isGreen ? 'bg-white text-green-600 hover:bg-green-50' : isLgbt ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-white text-pink-600 hover:bg-pink-50')}`}
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10 relative z-10">
        
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in-up">
           <h1 className={`text-3xl md:text-4xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
             Let's crush it today, {user.displayName ? user.displayName.split(' ')[0] : 'Champ'}. 
             <span className="inline-block animate-bounce ml-2">👋</span>
           </h1>
           <p className={`font-medium text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your consistency is building a better future.</p>
        </div>

        {/* Health Bar */}
        <div className={`mb-10 p-6 rounded-3xl border shadow-sm transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : (isGreen ? 'bg-white border-green-100' : isLgbt ? 'bg-white border-indigo-100' : 'bg-white border-pink-100')}`}>
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Heart className={`w-5 h-5 fill-current ${isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-red-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-red-500' : 'text-pink-600')}`} />
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Habit Health</h3>
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {progress === 100 ? "Amazing work! You're fully charged." : "Complete habits to boost your daily health."}
              </p>
            </div>
            <div className={`text-3xl font-black ${isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500' : 'text-pink-600')}`}>
              {progress}%
            </div>
          </div>
          
          <div className={`h-6 w-full rounded-full overflow-hidden p-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out relative shadow-sm ${progress === 100 ? (isGreen ? 'shadow-[0_0_15px_rgba(16,185,129,0.6)]' : isLgbt ? 'shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'shadow-[0_0_15px_rgba(236,72,153,0.6)]') : ''} ${isDark ? (isGreen ? 'bg-gradient-to-r from-green-500 to-emerald-400' : isLgbt ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500' : 'bg-gradient-to-r from-pink-500 to-rose-400') : (isGreen ? 'bg-gradient-to-r from-green-600 to-emerald-600' : isLgbt ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-600' : 'bg-gradient-to-r from-pink-600 to-rose-600')}`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 progress-bar-fill"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-10">
          <div className={`p-5 rounded-3xl shadow-sm border transition ${isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : (isGreen ? 'bg-white border-green-100 hover:shadow-lg hover:shadow-green-100' : isLgbt ? 'bg-white border-indigo-100 hover:shadow-lg hover:shadow-indigo-100' : 'bg-white border-pink-100 hover:shadow-lg hover:shadow-pink-100')}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${isDark ? (isGreen ? 'bg-green-900/40 text-green-300' : isLgbt ? 'bg-indigo-900/40 text-indigo-300' : 'bg-pink-900/40 text-pink-300') : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600')}`}>
               <Layout className="w-5 h-5" />
            </div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : (isGreen ? 'text-green-300' : isLgbt ? 'text-indigo-400' : 'text-pink-300')}`}>Total Habits</p>
            <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{habits.length}</p>
          </div>
          <div className={`p-5 rounded-3xl shadow-sm border transition ${isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : (isGreen ? 'bg-white border-green-100 hover:shadow-lg hover:shadow-green-100' : isLgbt ? 'bg-white border-indigo-100 hover:shadow-lg hover:shadow-indigo-100' : 'bg-white border-pink-100 hover:shadow-lg hover:shadow-pink-100')}`}>
             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${isDark ? (isGreen ? 'bg-emerald-900/40 text-emerald-300' : isLgbt ? 'bg-purple-900/40 text-purple-300' : 'bg-rose-900/40 text-rose-300') : (isGreen ? 'bg-emerald-100 text-emerald-600' : isLgbt ? 'bg-purple-100 text-purple-600' : 'bg-rose-100 text-rose-600')}`}>
               <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : (isGreen ? 'text-green-300' : isLgbt ? 'text-purple-400' : 'text-pink-300')}`}>Done Today</p>
            <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {completedToday}
            </p>
          </div>
          <div className={`col-span-2 p-6 rounded-3xl shadow-xl text-white flex items-center justify-between relative overflow-hidden group cursor-default ${isDark ? (isGreen ? 'bg-green-900 shadow-green-900/50' : isLgbt ? 'bg-slate-800 shadow-indigo-900/50' : 'bg-pink-900 shadow-pink-900/50') : (isGreen ? 'bg-green-600 shadow-green-200' : isLgbt ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-indigo-200' : 'bg-pink-600 shadow-pink-200')}`}>
             <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-110 transition duration-700"></div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-2 opacity-90">
                 <Trophy className={`w-4 h-4 ${isGreen ? 'text-green-200' : isLgbt ? 'text-white' : 'text-pink-200'}`} />
                 <span className={`text-xs font-bold uppercase tracking-wider ${isGreen ? 'text-green-100' : isLgbt ? 'text-white/80' : 'text-pink-100'}`}>Top Streak</span>
               </div>
               <p className="text-4xl font-black">
                 {Math.max(...habits.map(h => h.streak), 0)} <span className="text-lg font-medium opacity-80">days</span>
               </p>
             </div>
             <Flame className={`w-16 h-16 opacity-80 drop-shadow-lg animate-pulse ${isGreen ? 'text-green-200' : isLgbt ? 'text-yellow-300' : 'text-pink-200'}`} />
          </div>
        </div>

         {/* Add Habit Section */}
        <div className="mb-8">
          {!isAdding ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Browse Templates Button */}
              <button 
                onClick={() => setShowTemplates(true)}
                className={`group py-5 border-2 rounded-3xl font-bold transition flex items-center justify-center gap-3 text-lg ${
                  isDark 
                    ? (isGreen ? 'border-green-500 bg-green-500/10 text-green-300 hover:bg-green-500/20' : isLgbt ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20' : 'border-pink-500 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20') 
                    : (isGreen ? 'border-green-400 bg-green-50 text-green-600 hover:bg-green-100' : isLgbt ? 'border-indigo-400 bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'border-pink-400 bg-pink-50 text-pink-600 hover:bg-pink-100')
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  isDark 
                    ? (isGreen ? 'bg-green-500/20 group-hover:bg-green-500/30' : isLgbt ? 'bg-indigo-500/20 group-hover:bg-indigo-500/30' : 'bg-pink-500/20 group-hover:bg-pink-500/30') 
                    : (isGreen ? 'bg-green-200 group-hover:bg-green-300' : isLgbt ? 'bg-indigo-200 group-hover:bg-indigo-300' : 'bg-pink-200 group-hover:bg-pink-300')
                }`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                Browse Templates
              </button>

              {/* Create Custom Habit Button */}
              <button 
                onClick={() => setIsAdding(true)}
                className={`group py-5 border-2 border-dashed rounded-3xl font-bold transition flex items-center justify-center gap-3 text-lg ${
                  isDark 
                    ? (isGreen ? 'border-slate-800 text-slate-500 hover:border-green-500 hover:text-green-300 hover:bg-slate-900' : isLgbt ? 'border-slate-800 text-slate-500 hover:border-indigo-500 hover:text-indigo-300 hover:bg-slate-900' : 'border-slate-800 text-slate-500 hover:border-pink-500 hover:text-pink-300 hover:bg-slate-900') 
                    : (isGreen ? 'border-green-200 text-green-400 hover:border-green-400 hover:text-green-600 hover:bg-green-50' : isLgbt ? 'border-indigo-200 text-indigo-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50' : 'border-pink-200 text-pink-400 hover:border-pink-400 hover:text-pink-600 hover:bg-pink-50')
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  isDark 
                    ? (isGreen ? 'bg-slate-800 group-hover:bg-green-900/50' : isLgbt ? 'bg-slate-800 group-hover:bg-indigo-900/50' : 'bg-slate-800 group-hover:bg-pink-900/50') 
                    : (isGreen ? 'bg-green-100 group-hover:bg-green-200' : isLgbt ? 'bg-indigo-100 group-hover:bg-indigo-200' : 'bg-pink-100 group-hover:bg-pink-200')
                }`}>
                  <Plus className="w-5 h-5" />
                </div>
                Create Custom Habit
              </button>
            </div>
          ) : (
            <form onSubmit={addHabit} className={`p-6 rounded-3xl shadow-xl border animate-pop ${isDark ? 'bg-slate-900 border-slate-700 shadow-slate-950' : (isGreen ? 'bg-white shadow-green-100 border-green-100' : isLgbt ? 'bg-white shadow-indigo-100 border-indigo-100' : 'bg-white shadow-pink-100 border-pink-100')}`}>
              <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>What's your new goal?</h3>
              
              <div className="space-y-5">
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g., Meditate for 10 mins..."
                  className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition font-medium text-lg ${
                    isDark 
                      ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-400') 
                      : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500 focus:bg-white' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500 focus:bg-white' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500 focus:bg-white')
                  }`}
                  value={newHabitTitle}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewHabitTitle(e.target.value)}
                />

                {/* Icon Selection */}
                <div>
                  <label className={`block text-sm font-bold mb-3 ml-1 uppercase tracking-wider text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Choose an icon</label>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {HABIT_ICONS.map((iconData) => {
                      const Icon = iconData.icon;
                      const isSelected = newHabitIcon === iconData.name;
                      return (
                        <button
                          key={iconData.name}
                          type="button"
                          onClick={() => setNewHabitIcon(iconData.name)}
                          className={`aspect-square rounded-xl flex items-center justify-center transition border-2 ${
                            isSelected 
                              ? `${isGreen ? 'border-green-500 bg-green-500/20 text-green-500' : isLgbt ? 'border-indigo-500 bg-indigo-500/20 text-indigo-500' : 'border-pink-500 bg-pink-500/20 text-pink-500'} scale-110 shadow-sm` 
                              : `${isDark ? 'border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300' : 'border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="submit" 
                    className={`flex-1 text-white px-6 py-3.5 rounded-2xl font-bold transition shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${isDark ? (isGreen ? 'bg-green-500 hover:bg-green-400 shadow-green-500/40' : isLgbt ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 shadow-indigo-500/40' : 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/40') : (isGreen ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : isLgbt ? 'bg-gradient-to-r from-red-600 via-green-600 to-blue-600 hover:opacity-90 shadow-indigo-200' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200')}`}
                  >
                    Save Habit
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className={`px-6 py-3.5 font-bold rounded-2xl transition hover:bg-opacity-80 ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Swipeable Container */}
        <div className="relative overflow-hidden">
          <div className="flex justify-center gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setCurrentPage('habits')}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
                currentPage === 'habits'
                  ? (isDark 
                      ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
                      : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 text-white')
                    )
                  : (isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
              }`}
            >
              Habits
            </button>
            <button
              onClick={() => setCurrentPage('todos')}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
                currentPage === 'todos'
                  ? (isDark 
                      ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
                      : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 text-white')
                    )
                  : (isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
              }`}
            >
              To-Do List
            </button>
            <button
              onClick={() => setCurrentPage('money')}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
                currentPage === 'money'
                  ? (isDark 
                      ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
                      : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 text-white')
                    )
                  : (isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
              }`}
            >
              💰 Money
            </button>
          </div>

          <div
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* HABITS PAGE */}
            <div className={`transition-all duration-300 ${currentPage === 'habits' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              {/* Habits List */}
              {habits.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                    <div className="text-center sm:text-left">
                      <h2 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Your Habits
                      </h2>
                      <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {filteredHabits.length} {filteredHabits.length === 1 ? 'habit' : 'habits'}
                        {searchQuery && ` matching "${searchQuery}"`}
                      </p>
                    </div>
                    <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                    <label htmlFor="habit-search" className="sr-only">Search habits</label>
                    <input
                     id="habit-search"
                          type="text"
                          placeholder="Search habits..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full px-4 py-3 pl-11 rounded-xl border-2 outline-none transition font-medium ${
                          isDark 
                            ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-400 placeholder-slate-500' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-400 placeholder-slate-500' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-400 placeholder-slate-500') 
                            : (isGreen ? 'bg-white border-green-200 text-slate-900 focus:border-green-500 placeholder-slate-400' : isLgbt ? 'bg-white border-indigo-200 text-slate-900 focus:border-indigo-500 placeholder-slate-400' : 'bg-white border-pink-200 text-slate-900 focus:border-pink-500 placeholder-slate-400')
                        }`}
                      />
                      <Target className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition ${
                            isDark ? 'hover:bg-slate-700 text-slate-500' : 'hover:bg-slate-100 text-slate-400'
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid gap-5">
                {loading && <SkeletonLoader />}

                {!loading && habits.length === 0 && !isAdding && (
                  <div className={`text-center py-16 rounded-3xl border border-dashed ${isDark ? 'bg-slate-900 border-slate-800' : (isGreen ? 'bg-white border-green-200' : isLgbt ? 'bg-white border-indigo-200' : 'bg-white border-pink-200')}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float ${isDark ? 'bg-slate-800 text-slate-600' : (isGreen ? 'bg-green-50 text-green-300' : isLgbt ? 'bg-indigo-50 text-indigo-300' : 'bg-pink-50 text-pink-300')}`}>
                      <Calendar className="w-10 h-10" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>It's quiet here...</h3>
                    <p className={isDark ? 'text-slate-500' : 'text-slate-500'}>Add your first habit to start the engine!</p>
                  </div>
                )}

                {!loading && habits.length > 0 && filteredHabits.length === 0 && (
                  <div className={`text-center py-16 rounded-3xl border border-dashed ${isDark ? 'bg-slate-900 border-slate-800' : (isGreen ? 'bg-white border-green-200' : isLgbt ? 'bg-white border-indigo-200' : 'bg-white border-pink-200')}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-800 text-slate-600' : (isGreen ? 'bg-green-50 text-green-300' : isLgbt ? 'bg-indigo-50 text-indigo-300' : 'bg-pink-50 text-pink-300')}`}>
                      <Target className="w-10 h-10" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No habits found</h3>
                    <p className={isDark ? 'text-slate-500' : 'text-slate-500'}>Try a different search term</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`mt-4 px-6 py-3 rounded-xl font-bold transition ${
                        isDark 
                          ? (isGreen ? 'bg-green-500 hover:bg-green-400 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 hover:bg-pink-400 text-white')
                          : (isGreen ? 'bg-green-600 hover:bg-green-700 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 hover:bg-pink-700 text-white')
                      }`}
                    >
                      Clear Search
                    </button>
                  </div>
                )}

                {filteredHabits
                .sort((a, b) => {
               const aCompleted = a.completedDates?.includes(today) ? 1 : 0;
               const bCompleted = b.completedDates?.includes(today) ? 1 : 0;
               return aCompleted - bCompleted; // Incomplete habits first
                })
               .map((habit, idx) => {
                const isCompletedToday = habit.completedDates?.includes(today);
                const themeBase = getColorTheme(habit.title); 
                const theme = isDark ? themeBase.dark : themeBase.light;
                  
                  if (editingHabit?.id === habit.id) {
                    return (
                      <form 
                        key={habit.id}
                        onSubmit={saveEditedHabit}
                        className={`p-6 rounded-3xl border-2 shadow-lg animate-pop ${
                          isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'
                        }`}
                      >
                        <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          Edit Habit
                        </h3>
                        
                        <div className="space-y-5">
                          <input
                            type="text"
                            autoFocus
                            placeholder="Habit title..."
                            maxLength={100}
                            className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition font-medium text-lg ${
                              isDark 
                                ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-400') 
                                : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500 focus:bg-white' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500 focus:bg-white' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500 focus:bg-white')
                            }`}
                            value={editTitle}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
                          />

                          <div>
                            <label className={`block text-sm font-bold mb-3 ml-1 uppercase tracking-wider text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Choose an icon
                            </label>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                              {HABIT_ICONS.map((iconData) => {
                                const Icon = iconData.icon;
                                const isSelected = editIcon === iconData.name;
                                return (
                                  <button
                                    key={iconData.name}
                                    type="button"
                                    onClick={() => setEditIcon(iconData.name)}
                                    className={`aspect-square rounded-xl flex items-center justify-center transition border-2 ${
                                      isSelected 
                                        ? `${isGreen ? 'border-green-500 bg-green-500/20 text-green-500' : isLgbt ? 'border-indigo-500 bg-indigo-500/20 text-indigo-500' : 'border-pink-500 bg-pink-500/20 text-pink-500'} scale-110 shadow-sm` 
                                        : `${isDark ? 'border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300' : 'border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`
                                    }`}
                                  >
                                    <Icon className="w-5 h-5" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button 
                              type="submit" 
                              className={`flex-1 text-white px-6 py-3.5 rounded-2xl font-bold transition shadow-lg hover:-translate-y-0.5 ${
                                isDark 
                                  ? (isGreen ? 'bg-green-500 hover:bg-green-400 shadow-green-500/40' : isLgbt ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 shadow-indigo-500/40' : 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/40') 
                                  : (isGreen ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : isLgbt ? 'bg-gradient-to-r from-red-600 via-green-600 to-blue-600 hover:opacity-90 shadow-indigo-200' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200')
                              }`}
                            >
                              Save Changes
                            </button>
                            <button 
                              type="button" 
                              onClick={cancelEditing}
                              className={`px-6 py-3.5 font-bold rounded-2xl transition ${
                                isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
                              }`}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    );
                  }
                  
                  return (
                    <div 
                      key={habit.id} 
                      style={{ animationDelay: `${idx * 0.05}s` }}
                      className={`group relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 animate-pop ${
                        isCompletedToday 
                          ? `${isDark ? 'bg-slate-900 border-slate-800' : (isGreen ? 'bg-white border-green-100' : isLgbt ? 'bg-white border-indigo-100' : 'bg-white border-pink-100')}`
                          : `${isDark ? 'bg-slate-900 border-slate-900 hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900' : (isGreen ? 'bg-white border-white hover:border-green-100 hover:shadow-lg hover:shadow-green-100' : isLgbt ? 'bg-white border-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100' : 'bg-white border-white hover:border-pink-100 hover:shadow-lg hover:shadow-pink-100')} shadow-sm`
                      }`}
                    >
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 rounded-3xl bg-gradient-to-r ${themeBase.light.bg.replace('bg-', 'from-white via-white to-')}/30 pointer-events-none`}></div>

                      {/* MOBILE LAYOUT */}
                      <div className="block sm:hidden relative z-10">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <ConfettiCheck 
                                isChecked={!!isCompletedToday} 
                                onClick={() => toggleCheckIn(habit)} 
                                themeColor={theme.check}
                                icon={habit.icon}
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-bold text-base sm:text-lg transition-colors ${
                                isCompletedToday 
                                  ? `${isDark ? 'text-slate-600 decoration-slate-700' : (isGreen ? 'text-slate-400 decoration-green-200' : isLgbt ? 'text-slate-400 decoration-indigo-200' : 'text-slate-400 decoration-pink-200')} line-through decoration-2` 
                                  : `${isDark ? 'text-slate-100' : 'text-slate-800'}`
                              } line-clamp-2`}>
                                {habit.title}
                              </h3>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold mt-1 ${theme.bg} ${theme.text} ${theme.border} border`}>
                                <Flame className={`w-3 h-3 mr-1 ${theme.icon}`} />
                                {habit.streak} days
                              </span>
                            </div>
                          </div>

                          {/* Mobile Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => startEditingHabit(habit)}
                              className={`p-2.5 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center ${
                                isDark ? 'text-slate-600 hover:bg-slate-800 hover:text-slate-400' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'
                              }`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setReminderHabit(habit)}
                              className={`p-2.5 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center ${
                                habit.reminderEnabled
                                  ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600')
                                  : (isDark ? 'text-slate-600 hover:bg-slate-800' : 'text-slate-300 hover:bg-slate-100')
                              }`}
                            >
                              <span className="text-base">{habit.reminderEnabled ? '🔔' : '🔕'}</span>
                            </button>
                            <button 
                             onClick={() => deleteHabit(habit.id)}
                              aria-label={`Delete habit: ${habit.title}`}
                             className={`p-2.5 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center ${
                             isDark 
                              ? 'text-slate-600 hover:text-red-400 hover:bg-red-900/20' 
                             : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                           </button>
                          </div>
                        </div>

                        <div className="w-full">
                          <WeeklyProgress completedDates={habit.completedDates} />
                        </div>
                      </div>

                      {/* DESKTOP LAYOUT */}
                      <div className="hidden sm:flex items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-6 flex-1">
                          <ConfettiCheck 
                            isChecked={!!isCompletedToday} 
                            onClick={() => toggleCheckIn(habit)} 
                            themeColor={theme.check}
                            icon={habit.icon}
                          />
                          
                          <div className="flex-1">
                            <h3 className={`font-bold text-xl transition-colors ${
                              isCompletedToday 
                                ? `${isDark ? 'text-slate-600 decoration-slate-700' : (isGreen ? 'text-slate-400 decoration-green-200' : isLgbt ? 'text-slate-400 decoration-indigo-200' : 'text-slate-400 decoration-pink-200')} line-through decoration-2` 
                                : `${isDark ? 'text-slate-100' : 'text-slate-800'}`
                            }`}>
                              {habit.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${theme.bg} ${theme.text} ${theme.border} border`}>
                                <Flame className={`w-3 h-3 mr-1 ${theme.icon}`} />
                                {habit.streak} day streak
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <WeeklyProgress completedDates={habit.completedDates} />
                          <button
                            onClick={() => startEditingHabit(habit)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-xl ${
                              isDark ? 'text-slate-600 hover:bg-slate-800 hover:text-slate-400' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                            title="Edit Habit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setReminderHabit(habit)}
                            className={`p-3 rounded-xl transition ${
                              habit.reminderEnabled
                                ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600')
                                : (isDark ? 'text-slate-600 hover:bg-slate-800' : 'text-slate-300 hover:bg-slate-100')
                            }`}
                            title={habit.reminderEnabled ? "Reminder On" : "Reminder Off"}
                          >
                            <span className="text-lg">{habit.reminderEnabled ? '🔔' : '🔕'}</span>
                          </button>
                          <button 
                            onClick={() => deleteHabit(habit.id)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-xl ${
                              isDark 
                                ? 'text-slate-600 hover:text-red-400 hover:bg-red-900/20' 
                                : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                            }`}
                            title="Delete Habit"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TO-DO LIST PAGE */}
            <div className={`transition-all duration-300 ${currentPage === 'todos' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <div className="mb-6">
                <h2 className={`text-2xl md:text-3xl font-black text-center sm:text-left mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  To-Do List
                </h2>
                
                {/* Add Todo Form */}
<form onSubmit={addTodo} className={`p-4 rounded-2xl border-2 mb-6 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
  <div className="space-y-3">
    <div className="flex gap-3">
      <input
        type="text"
        placeholder="Add a new task..."
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none transition font-medium ${
          isDark 
            ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-400 placeholder-slate-500' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-400 placeholder-slate-500' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-400 placeholder-slate-500') 
            : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500 placeholder-slate-400' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500 placeholder-slate-400' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500 placeholder-slate-400')
        }`}
      />
      <button
        type="submit"
        className={`px-6 py-3 rounded-xl font-bold transition shadow-lg ${
          isDark 
            ? (isGreen ? 'bg-green-500 hover:bg-green-400 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 hover:bg-pink-400 text-white')
            : (isGreen ? 'bg-green-600 hover:bg-green-700 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 hover:bg-pink-700 text-white')
        }`}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
    <div className="flex gap-3">
      <input
        type="date"
        value={newTodoDueDate}
        onChange={(e) => setNewTodoDueDate(e.target.value)}
        className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none transition font-medium ${
          isDark 
            ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-400') 
            : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
        }`}
      />
      <select
        value={newTodoPriority}
        onChange={(e) => setNewTodoPriority(e.target.value as 'low' | 'medium' | 'high')}
        className={`px-4 py-3 rounded-xl border-2 outline-none transition font-bold ${
           isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
           }`}
           >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
               <option value="high">High</option>
              </select>
               </div>
              </div>
             </form>
              </div>

              {/* Todo Items */}
              <div className="grid gap-3">
                {todos.length === 0 ? (
                  <div className={`text-center py-16 rounded-3xl border border-dashed ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No tasks yet</h3>
                    <p className={isDark ? 'text-slate-500' : 'text-slate-500'}>Add your first to-do to get started!</p>
                  </div>
                ) : (
                  todos.map((todo, idx) => (
                    <div
                      key={todo.id}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                      className={`p-4 rounded-2xl border-2 transition-all animate-pop ${
                        todo.completed
                          ? (isDark ? 'bg-slate-900 border-slate-800 opacity-60' : 'bg-slate-50 border-slate-200 opacity-60')
                          : (isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100')
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTodo(todo)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                            todo.completed
                              ? (isDark 
                                  ? (isGreen ? 'bg-green-500 border-green-500' : isLgbt ? 'bg-indigo-500 border-indigo-500' : 'bg-pink-500 border-pink-500')
                                  : (isGreen ? 'bg-green-600 border-green-600' : isLgbt ? 'bg-indigo-600 border-indigo-600' : 'bg-pink-600 border-pink-600')
                                )
                              : (isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-300 hover:border-slate-400')
                          }`}
                        >
                          {todo.completed && <Check className="w-4 h-4 text-white" />}
                        </button>
                        
                        <div className="flex-1">
                       <p className={`font-medium ${todo.completed ? 'line-through' : ''} ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {todo.title}
                       </p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                     {todo.priority && (
                         <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                         todo.priority === 'high' 
                         ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : todo.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                         }`}>
                           Urgency level: {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                         </span>
                          )}
                         {todo.dueDate && (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                            new Date(todo.dueDate) < new Date() && !todo.completed
                           ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                           : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                      📅 DEADLINE: {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                       </span>
                           )}
                          </div>
                          </div>
                        
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className={`p-2 rounded-lg transition ${
                            isDark ? 'text-slate-600 hover:text-red-400 hover:bg-red-900/20' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* MONEY TRACKING PAGE */}
            <div className={`transition-all duration-300 ${currentPage === 'money' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <div className="mb-6">
                <div className="mb-6">
  <h2 className={`text-2xl md:text-3xl font-black text-center sm:text-left mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
    💰 Money Tracker
  </h2>
  
  {/* Analytics Tabs */}
  <div className={`flex gap-2 p-1.5 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
    {[
      { id: 'overview', label: 'Overview', icon: PieChart },
      { id: 'monthly', label: 'Monthly', icon: Calendar },
      { id: 'yearly', label: 'Yearly', icon: BarChart3 }
    ].map((tab) => {
      const Icon = tab.icon;
      return (
        <button
          key={tab.id}
          onClick={() => setMoneyView(tab.id as any)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition ${
            moneyView === tab.id
              ? (isDark 
                  ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
                  : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 text-white')
                )
              : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      );
    })}
  </div>
</div>

                {/* Today's Budget Card */}
                <div className={`mb-6 p-6 rounded-3xl border-2 shadow-lg ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className={`text-sm font-bold uppercase tracking-wider mb-1 ${
                        isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        Today's Budget
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {currencySymbol}{todaySpent.toFixed(2)}
                        </span>
                        <span className={`text-xl font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        / {currencySymbol}{dailyAllowance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAllowanceModal(true)}
                      className={`p-3 rounded-xl transition ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                      title="Edit Daily Allowance"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className={`h-4 w-full rounded-full overflow-hidden mb-3 ${
                    isDark ? 'bg-slate-800' : 'bg-slate-100'
                  }`}>
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        todaySpent > dailyAllowance
                          ? 'bg-red-500'
                          : todaySavingsRate > 50
                          ? (isDark 
                              ? (isGreen ? 'bg-gradient-to-r from-green-500 to-emerald-400' : isLgbt ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-400')
                              : (isGreen ? 'bg-gradient-to-r from-green-600 to-emerald-600' : isLgbt ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-pink-600 to-rose-600')
                            )
                          : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min((todaySpent / dailyAllowance) * 100, 100)}%` }}
                    ></div>
                  </div>

                  {/* Status Message */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${
                      todaySpent > dailyAllowance
                        ? 'text-red-500'
                        : todayRemaining > dailyAllowance * 0.5
                        ? (isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-blue-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-blue-600' : 'text-pink-600'))
                        : 'text-yellow-600'
                    }`}>
                      {todaySpent > dailyAllowance
                      ? `⚠️ Over budget by ${currencySymbol}${(todaySpent - dailyAllowance).toFixed(2)}`
                      : todayRemaining > 0
                      ? `💚 ${currencySymbol}${todayRemaining.toFixed(2)} remaining`
                      : '🎉 Right on budget!'}
                    </span>
                    <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {todaySavingsRate}%
                    </span>
                  </div>
                </div>

                {/* Quick Add Expense */}
                <form onSubmit={addExpense} className={`p-5 rounded-2xl border-2 mb-6 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Plus className="w-5 h-5" />
                    Quick Add Expense
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Amount"
                        value={newExpenseAmount}
                        onChange={(e) => setNewExpenseAmount(e.target.value)}
                        className={`px-4 py-3 rounded-xl border-2 outline-none transition font-bold text-lg ${
                          isDark 
                            ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-400 placeholder-slate-500' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-400 placeholder-slate-500' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-400 placeholder-slate-500')
                            : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500 placeholder-slate-400' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500 placeholder-slate-400' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500 placeholder-slate-400')
                        }`}
                      />
                      <select
                        value={newExpenseCategory}
                        onChange={(e) => setNewExpenseCategory(e.target.value)}
                        className={`px-4 py-3 rounded-xl border-2 outline-none transition font-bold ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      >
                        {EXPENSE_CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={newExpenseDescription}
                      onChange={(e) => setNewExpenseDescription(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition font-medium ${
                        isDark 
                          ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-400 placeholder-slate-500' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-400 placeholder-slate-500' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-400 placeholder-slate-500')
                          : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500 placeholder-slate-400' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500 placeholder-slate-400' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500 placeholder-slate-400')
                      }`}
                    />

                    <div className="flex gap-3">
                      <input
                        type="date"
                        value={newExpenseDate}
                        onChange={(e) => setNewExpenseDate(e.target.value)}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none transition font-medium ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                      <button
                        type="submit"
                        className={`px-8 py-3 rounded-xl font-bold transition shadow-lg ${
                          isDark 
                            ? (isGreen ? 'bg-green-500 hover:bg-green-400 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400 text-white')
                            : (isGreen ? 'bg-green-600 hover:bg-green-700 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700 text-white')
                        }`}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>

                {/* Weekly Overview */}
                <div className={`p-5 rounded-2xl border-2 mb-6 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <BarChart3 className="w-5 h-5" />
                    This Week's Spending
                  </h3>
                  
                  <div className="h-40 flex items-end justify-between gap-2 mb-4">
                    {weeklySpending.map((day, i) => {
                      const maxSpent = Math.max(...weeklySpending.map(d => d.spent), 1);
                      const height = (day.spent / maxSpent) * 100;
                      const isOverBudget = day.spent > dailyAllowance;
                      
                      return (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="w-full relative flex-1 flex items-end">
                            <div
                              className={`w-full rounded-t-lg transition-all duration-500 ${
                                isOverBudget
                                  ? 'bg-red-500 group-hover:bg-red-400'
                                  : (isDark 
                                      ? (isGreen ? 'bg-green-600 group-hover:bg-green-500' : isLgbt ? 'bg-gradient-to-t from-blue-500 to-purple-500 group-hover:opacity-80' : 'bg-pink-600 group-hover:bg-pink-500')
                                      : (isGreen ? 'bg-green-500 group-hover:bg-green-600' : isLgbt ? 'bg-gradient-to-t from-blue-500 to-purple-500 group-hover:opacity-90' : 'bg-pink-500 group-hover:bg-pink-600')
                                    )
                              }`}
                              style={{ height: `${height}%`, minHeight: day.spent > 0 ? '8px' : '0' }}
                            ></div>
                            {day.spent > 0 && (
                              <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded whitespace-nowrap ${
                              isDark ? 'bg-slate-800' : 'bg-white shadow-lg'
                              }`}>
                              {currencySymbol}{day.spent.toFixed(0)}
                            </div>
                            )}
                          </div>
                          <div className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {day.label.slice(0, 3)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Weekly Total
                      </p>
                      <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                       {currencySymbol}{weeklyTotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {weeklySaved >= 0 ? 'Saved' : 'Over'}
                      </p>
                      <p className={`text-2xl font-black ${
                        weeklySaved >= 0
                          ? (isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-blue-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-blue-600' : 'text-pink-600'))
                          : 'text-red-500'
                      }`}>
                       {currencySymbol}{Math.abs(weeklySaved).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Expenses */}
                <div>
                  <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Recent Expenses
                  </h3>
                  
                  {expenses.length === 0 ? (
                    <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Receipt className="w-8 h-8" />
                      </div>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No expenses yet</p>
                      <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Start tracking your spending above!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {expenses.slice(0, 10).map((expense, idx) => {
                        const category = EXPENSE_CATEGORIES.find(c => c.id === expense.category);
                        const CategoryIcon = category?.icon || Target;
                        
                        return (
                          <div
                            key={expense.id}
                            style={{ animationDelay: `${idx * 0.05}s` }}
                            className={`p-4 rounded-2xl border-2 transition-all animate-pop flex items-center justify-between ${
                              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                isDark ? 'bg-slate-800' : 'bg-slate-100'
                              }`}>
                                <CategoryIcon className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                              </div>
                              <div className="flex-1">
                                <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {expense.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                    isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {category?.label}
                                  </span>
                                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                           
                            
                            <div className="flex items-center gap-3">
                              <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {currencySymbol}{expense.amount.toFixed(2)}
                              </span>
                              <button
                                onClick={() => deleteExpense(expense.id)}
                                className={`p-2 rounded-lg transition ${
                                  isDark ? 'text-slate-600 hover:text-red-400 hover:bg-red-900/20' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              </div>
              {moneyView === 'monthly' && (
  <div className="space-y-6">
    {/* Month Selector */}
    <div className="flex gap-3 items-center justify-center">
      <button
        onClick={() => {
          if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear(selectedYear - 1);
          } else {
            setSelectedMonth(selectedMonth - 1);
          }
        }}
        className={`p-3 rounded-xl font-bold transition ${
          isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
        }`}
      >
        ←
      </button>
      <div className={`px-6 py-3 rounded-xl font-black text-xl ${
        isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'
      }`}>
        {new Date(selectedYear, selectedMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>
      <button
        onClick={() => {
          if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear(selectedYear + 1);
          } else {
            setSelectedMonth(selectedMonth + 1);
          }
        }}
        className={`p-3 rounded-xl font-bold transition ${
          isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
        }`}
      >
        →
      </button>
    </div>

    {/* Monthly Summary Cards */}
    <div className="grid grid-cols-3 gap-3">
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Total Spent</div>
        <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {currencySymbol}{monthlyAnalytics.totalSpent.toFixed(2)}
        </div>
      </div>
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Budget</div>
        <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {currencySymbol}{monthlyAnalytics.monthlyBudget.toFixed(2)}
        </div>
      </div>
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {monthlyAnalytics.saved >= 0 ? 'Saved' : 'Over'}
        </div>
        <div className={`text-2xl font-black ${
          monthlyAnalytics.saved >= 0
            ? (isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-blue-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-blue-600' : 'text-pink-600'))
            : 'text-red-500'
        }`}>
          {currencySymbol}{Math.abs(monthlyAnalytics.saved).toFixed(2)}
        </div>
      </div>
    </div>

    {/* Daily Spending Chart */}
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Daily Spending</h3>
      <div className="h-64 flex items-end justify-between gap-1">
        {monthlyAnalytics.dailyData.map((day, i) => {
          const maxSpent = Math.max(...monthlyAnalytics.dailyData.map(d => d.spent), 1);
          const height = (day.spent / maxSpent) * 100;
          const isOverBudget = day.spent > dailyAllowance;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group min-w-0">
              <div className="w-full relative flex-1 flex items-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isOverBudget
                      ? 'bg-red-500 group-hover:bg-red-400'
                      : day.spent > 0
                      ? (isDark 
                          ? (isGreen ? 'bg-green-600 group-hover:bg-green-500' : isLgbt ? 'bg-gradient-to-t from-blue-500 to-purple-500 group-hover:opacity-80' : 'bg-pink-600 group-hover:bg-pink-500')
                          : (isGreen ? 'bg-green-500 group-hover:bg-green-600' : isLgbt ? 'bg-gradient-to-t from-blue-500 to-purple-500 group-hover:opacity-90' : 'bg-pink-500 group-hover:bg-pink-600')
                        )
                      : (isDark ? 'bg-slate-700' : 'bg-slate-200')
                  }`}
                  style={{ height: `${height}%`, minHeight: day.spent > 0 ? '4px' : '2px' }}
                ></div>
                {day.spent > 0 && (
                  <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded whitespace-nowrap ${
                    isDark ? 'bg-slate-800' : 'bg-white shadow-lg'
                  }`}>
                    {currencySymbol}{day.spent.toFixed(0)}
                  </div>
                )}
              </div>
              {i % 5 === 0 && (
                <div className={`text-[8px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {day.day}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>

    {/* Category Breakdown */}
    {monthlyAnalytics.categoryTotals.length > 0 && (
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Spending by Category</h3>
        <div className="space-y-3">
          {monthlyAnalytics.categoryTotals
            .sort((a, b) => b.total - a.total)
            .map((cat) => {
              const Icon = cat.icon;
              const percentage = (cat.total / monthlyAnalytics.totalSpent) * 100;
              
              return (
                <div key={cat.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                      <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {cat.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {percentage.toFixed(1)}%
                      </span>
                      <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {currencySymbol}{cat.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className={`h-full rounded-full ${
                        isDark 
                          ? (isGreen ? 'bg-green-500' : isLgbt ? 'bg-indigo-500' : 'bg-pink-500')
                          : (isGreen ? 'bg-green-600' : isLgbt ? 'bg-indigo-600' : 'bg-pink-600')
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    )}
  </div>
)}

{moneyView === 'yearly' && (
  <div className="space-y-6">
    {/* Year Selector */}
    <div className="flex gap-3 items-center justify-center">
      <button
        onClick={() => setSelectedYear(selectedYear - 1)}
        className={`p-3 rounded-xl font-bold transition ${
          isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
        }`}
      >
        ←
      </button>
      <div className={`px-6 py-3 rounded-xl font-black text-xl ${
        isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'
      }`}>
        {selectedYear}
      </div>
      <button
        onClick={() => setSelectedYear(selectedYear + 1)}
        className={`p-3 rounded-xl font-bold transition ${
          isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
        }`}
      >
        →
      </button>
    </div>

    {/* Yearly Summary Cards */}
    <div className="grid grid-cols-3 gap-3">
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Total Spent</div>
        <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {currencySymbol}{yearlyAnalytics.totalSpent.toFixed(2)}
        </div>
      </div>
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Budget</div>
        <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {currencySymbol}{yearlyAnalytics.yearlyBudget.toFixed(2)}
        </div>
      </div>
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {yearlyAnalytics.saved >= 0 ? 'Saved' : 'Over'}
        </div>
        <div className={`text-2xl font-black ${
          yearlyAnalytics.saved >= 0
            ? (isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-blue-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-blue-600' : 'text-pink-600'))
            : 'text-red-500'
        }`}>
          {currencySymbol}{Math.abs(yearlyAnalytics.saved).toFixed(2)}
        </div>
      </div>
    </div>

    {/* Monthly Trend Chart */}
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Monthly Spending Trend</h3>
      <div className="h-64 flex items-end justify-between gap-2">
        {yearlyAnalytics.monthlyData.map((month, i) => {
          const maxSpent = Math.max(...yearlyAnalytics.monthlyData.map(m => m.spent), 1);
          const height = (month.spent / maxSpent) * 100;
          const isOverBudget = month.spent > month.budget;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full relative flex-1 flex items-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isOverBudget
                      ? 'bg-red-500 group-hover:bg-red-400'
                      : month.spent > 0
                      ? (isDark 
                          ? (isGreen ? 'bg-green-600 group-hover:bg-green-500' : isLgbt ? 'bg-gradient-to-t from-blue-500 to-purple-500 group-hover:opacity-80' : 'bg-pink-600 group-hover:bg-pink-500')
                          : (isGreen ? 'bg-green-500 group-hover:bg-green-600' : isLgbt ? 'bg-gradient-to-t from-blue-500 to-purple-500 group-hover:opacity-90' : 'bg-pink-500 group-hover:bg-pink-600')
                        )
                      : (isDark ? 'bg-slate-700' : 'bg-slate-200')
                  }`}
                  style={{ height: `${height}%`, minHeight: month.spent > 0 ? '8px' : '4px' }}
                ></div>
                {month.spent > 0 && (
                  <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded whitespace-nowrap ${
                    isDark ? 'bg-slate-800' : 'bg-white shadow-lg'
                  }`}>
                    {currencySymbol}{month.spent.toFixed(0)}
                  </div>
                )}
              </div>
              <div className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {month.month}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Savings Trend */}
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Monthly Savings</h3>
      <div className="h-48 flex items-center justify-between gap-2">
        {yearlyAnalytics.monthlyData.map((month, i) => {
          const maxAbsSaved = Math.max(...yearlyAnalytics.monthlyData.map(m => Math.abs(m.saved)), 1);
          const height = (Math.abs(month.saved) / maxAbsSaved) * 100;
          const isSavings = month.saved >= 0;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center group">
              <div className="w-full h-24 flex items-center relative">
                <div
                  className={`w-full rounded-lg transition-all duration-500 ${
                    isSavings
                      ? (isDark 
                          ? (isGreen ? 'bg-green-600 group-hover:bg-green-500' : isLgbt ? 'bg-blue-600 group-hover:bg-blue-500' : 'bg-pink-600 group-hover:bg-pink-500')
                          : (isGreen ? 'bg-green-500 group-hover:bg-green-600' : isLgbt ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-pink-500 group-hover:bg-pink-600')
                        )
                      : 'bg-red-500 group-hover:bg-red-400'
                  }`}
                  style={{ height: `${height}%`, minHeight: '4px' }}
                ></div>
                <div className={`absolute left-1/2 -translate-x-1/2 ${isSavings ? '-top-8' : '-bottom-8'} text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded whitespace-nowrap ${
                  isDark ? 'bg-slate-800' : 'bg-white shadow-lg'
                }`}>
                  {currencySymbol}{Math.abs(month.saved).toFixed(0)}
                </div>
              </div>
              <div className={`text-[10px] font-bold mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {month.month}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}
              {showAllowanceModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAllowanceModal(false)}></div>
    
    <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-6 animate-pop ${
      isDark ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white border-2 border-slate-100'
    }`}>
      
      <button 
        onClick={() => setShowAllowanceModal(false)}
        className={`absolute top-4 right-4 p-2 rounded-xl transition ${
          isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
        }`}
      >
        <X className="w-5 h-5" />
      </button>

      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 ${
          isDark 
            ? (isGreen ? 'bg-green-500/20 text-green-400' : isLgbt ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400')
            : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600')
        }`}>
          <DollarSign className="w-7 h-7" />
        </div>
        <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Set Daily Allowance
        </h2>
        <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          How much can you spend per day?
        </p>
      </div>

      <form onSubmit={(e) => {
  e.preventDefault();
  const formElements = (e.target as HTMLFormElement).elements;
  const allowanceInput = formElements.namedItem('allowance') as HTMLInputElement;
  const currencySelect = formElements.namedItem('currency') as HTMLSelectElement;
  console.log('📝 Form values:', {
    allowance: allowanceInput.value,
    currency: currencySelect?.value
  }); // ← ADD THIS
  const amount = parseFloat(allowanceInput.value);
  const selectedCurrency = currencySelect?.value || currency;
   console.log('✅ Submitting:', { amount, selectedCurrency }); // ← ADD THIS
  if (!isNaN(amount) && amount > 0) {
    saveDailyAllowance(amount, selectedCurrency);
  }
}} className="space-y-5">
  
  {/* Daily Budget Input */}
  <div>
    <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
      Daily Budget
    </label>
    <input
      type="number"
      name="allowance"
      step="0.01"
      min="0"
      defaultValue={dailyAllowance || ''}
      placeholder="e.g., 50.00"
      className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition font-bold text-2xl text-center ${
        isDark 
          ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-400')
          : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
      }`}
      required
    />
  </div>

  {/* 👇 NEW: Currency Selector - ADD THIS ENTIRE BLOCK */}
  <div>
    <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
      Currency
    </label>
    <select
      name="currency"
      defaultValue={currency}
      className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition font-bold text-lg ${
        isDark 
          ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-400')
          : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
      }`}
    >
      {CURRENCIES.map(curr => (
        <option key={curr.code} value={curr.code}>
          {curr.symbol} - {curr.name}
        </option>
      ))}
    </select>
  </div>
  {/* 👆 END OF NEW CURRENCY SELECTOR */}

  <button
    type="submit"
    className={`w-full text-white py-4 rounded-2xl font-bold text-lg transition shadow-lg hover:-translate-y-0.5 ${
      isDark 
        ? (isGreen ? 'bg-green-500 hover:bg-green-400 shadow-green-500/40' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/40')
        : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
    }`}
  >
    Save Budget
  </button>
</form>
    </div>
  </div>
)}
   
            </div>
      </main>
     </div> 
      );
      };


const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
    }
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
      setShowInstall(false);
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstall(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 animate-slide-up max-w-md mx-auto">
      <div className={`p-4 rounded-2xl shadow-2xl flex items-center justify-between backdrop-blur-xl border-2 ${
        isDark 
          ? (isGreen ? 'bg-green-900/90 border-green-700' : isLgbt ? 'bg-gradient-to-r from-red-900/90 to-blue-900/90 border-indigo-700' : 'bg-pink-900/90 border-pink-700')
          : (isGreen ? 'bg-green-600 border-green-500' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-600 border-indigo-400' : 'bg-pink-600 border-pink-500')
      } text-white`}>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg">Install HabitFlow</p>
            <p className="text-sm opacity-90">Quick access from your home screen!</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              isDark ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-white/90 text-slate-900 hover:bg-white'
            }`}
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'welcome' | 'dashboard'>('landing');
  const [theme, setTheme] = useState<Theme>('light');
  const [accent, setAccent] = useState<Accent>('pink');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleAccent = () => {
    setAccent(prev => {
        if (prev === 'pink') return 'green';
        if (prev === 'green') return 'lgbt';
        return 'pink';
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setView('dashboard');
      } else {
        setUser(null);
        if (view === 'dashboard') setView('landing');
      }
      setAuthLoading(false);
    });

    const initAuth = async () => {
        const initialToken = (window as any).__initial_auth_token;
        if (initialToken) {
          try {
            await signInWithCustomToken(auth, initialToken);
          } catch (e) {
            console.error("Custom token failed", e);
          }
        }
    };
    initAuth();

    return () => unsubscribe();
  }, [view]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('landing');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${accent === 'green' ? 'bg-green-50' : accent === 'lgbt' ? 'bg-rainbow-light' : 'bg-pink-50'}`}>
        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 rounded-2xl animate-spin mb-4 shadow-lg ${accent === 'green' ? 'bg-green-600 shadow-green-200' : accent === 'lgbt' ? 'bg-gradient-to-br from-red-500 to-blue-500 shadow-indigo-200' : 'bg-pink-600 shadow-pink-200'}`}></div>
          <p className={`font-bold animate-pulse ${accent === 'green' ? 'text-green-900' : accent === 'lgbt' ? 'text-indigo-900' : 'text-pink-900'}`}>Loading HabitFlow...</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    if (view === 'dashboard' && user) {
      return <Dashboard user={user} onLogout={handleLogout} />;
    }
    if (view === 'welcome') {
      return <WelcomePage onSuccess={() => setView('dashboard')} />;
    }
    return <LandingPage onGetStarted={() => setView('welcome')} />;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accent, toggleAccent }}>
      <div className={theme}>
        <PWAInstallPrompt />
        {renderView()}
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
