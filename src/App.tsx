import React, { useState, useEffect, useCallback, useRef, createContext, useContext, FormEvent, ChangeEvent } from 'react';
import { 
  CheckCircle2, 
  Plus, 
  Trash2, 
  TrendingUp, 
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
  Rainbow // Added Rainbow icon if available in lucide-react, otherwise we fallback
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
  Timestamp
} from "firebase/firestore";

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

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Firebase configuration is missing!');
  console.error('Available env vars:', Object.keys(import.meta.env));
  throw new Error('Firebase configuration is incomplete');
}
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
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

// --- Helper Functions ---
const getTodayString = (): string => new Date().toISOString().split('T')[0];
const getYesterdayString = (): string => new Date(Date.now() - 86400000).toISOString().split('T')[0];

const calculateStreak = (completedDates: string[]): number => {
  if (!completedDates || completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = getTodayString();
  const yesterday = getYesterdayString();
  
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;

  let streak = 0;
  let currentDate = new Date(sortedDates[0]); 

  for (let i = 0; i < sortedDates.length; i++) {
    const dateStr = sortedDates[i];
    const dateObj = new Date(dateStr);
    const diffTime = Math.abs(currentDate.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (i === 0) {
      streak++;
    } else {
      if (diffDays === 1) {
        streak++;
        currentDate = dateObj;
      } else {
        break;
      }
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
  const todayStr = now.toISOString().split('T')[0];
  const currentDayOfWeek = now.getUTCDay(); // 0=Sun, 6=Sat matches storage
  
  const startOfWeek = new Date(now);
  startOfWeek.setUTCDate(now.getUTCDate() - currentDayOfWeek);

  const days = [];
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setUTCDate(startOfWeek.getUTCDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    days.push({
      date: dateStr,
      label: labels[i],
      isToday: dateStr === todayStr
    });
  }
  return days;
};


const scheduleNotification = (habit: Habit) => {
  if (!habit.reminderEnabled || !habit.reminderTime) return;
  if ('Notification' in window && Notification.permission === 'granted') {
    const [hours, minutes] = habit.reminderTime.split(':');
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const timeUntil = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
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
      
      setTimeout(() => scheduleNotification(habit), 24 * 60 * 60 * 1000);
    }, timeUntil);
  }
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
  `}</style>
);

// --- Components ---

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, accent } = useTheme();
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';
  
  return (
    <button 
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
        theme === 'dark' 
          ? `${isGreen ? 'bg-green-800 text-green-100 hover:bg-green-700 border-green-700' : isLgbt ? 'bg-slate-800 text-white hover:bg-slate-700 border-slate-600' : 'bg-pink-800 text-pink-100 hover:bg-pink-700 border-pink-700'} border shadow-md` 
          : `${isGreen ? 'bg-white text-green-700 hover:bg-green-50 border-green-100' : isLgbt ? 'bg-white text-indigo-700 hover:bg-indigo-50 border-indigo-100' : 'bg-white text-pink-700 hover:bg-pink-50 border-pink-100'} shadow-md border`
      }`}
      aria-label="Toggle Theme"
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
        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${
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
    <div className="flex gap-2">
      {days.map((day, idx) => {
        const isCompleted = completedDates.includes(day.date);
        return (
          <div 
            key={day.date} 
            className="flex flex-col items-center gap-1.5"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                isCompleted 
                  ? `bg-gradient-to-br ${isGreen ? 'from-green-500 to-emerald-500' : isLgbt ? 'from-red-500 via-yellow-500 to-blue-500' : 'from-pink-500 to-rose-500'} text-white shadow-md ${isDark ? (isGreen ? 'shadow-green-500/40' : isLgbt ? 'shadow-indigo-500/40' : 'shadow-pink-500/40') : (isGreen ? 'shadow-green-300' : isLgbt ? 'shadow-indigo-300' : 'shadow-pink-300')}` 
                  : day.isToday
                    ? `border-2 ${isGreen ? 'border-green-500 text-green-600' : isLgbt ? 'border-indigo-500 text-indigo-600' : 'border-pink-500 text-pink-600'} ${isDark ? (isGreen ? 'text-green-400 bg-slate-800' : isLgbt ? 'text-indigo-400 bg-slate-800' : 'text-pink-400 bg-slate-800') : 'bg-white'}` 
                    : `${isDark ? 'bg-slate-800 text-slate-600 border border-slate-700' : 'bg-slate-100 text-slate-400 border border-slate-200'}`
              }`}
            >
              {day.label.charAt(0)}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wide ${day.isToday ? (isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')) : (isDark ? 'text-slate-600' : 'text-slate-400')}`}>
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

// --- New Component: HabitStats (Insights Modal) ---
const HabitStats = ({ habits, onClose }: { habits: Habit[], onClose: () => void }) => {
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';
  const days = getLast7Days();

  // Calculate Data
  const totalHabits = habits.length;
  const bestStreak = Math.max(...habits.map(h => h.streak), 0);
  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
  
  // Weekly Activity Data
  const weeklyData = days.map(day => {
    const count = habits.filter(h => h.completedDates.includes(day.date)).length;
    return { ...day, count };
  });
  
  const maxDaily = Math.max(...weeklyData.map(d => d.count), 1); // Avoid div by zero

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full max-w-lg rounded-3xl shadow-2xl p-6 md:p-8 animate-pop ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-900'}`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 ${isDark ? (isGreen ? 'bg-green-500/20 text-green-400' : isLgbt ? 'bg-slate-800 text-indigo-400' : 'bg-pink-500/20 text-pink-400') : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600')}`}>
            <BarChart3 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black">Habit Insights</h2>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your progress at a glance.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
            <div className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalHabits}</div>
            <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Active</div>
          </div>
          <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
            <div className={`text-2xl font-black mb-1 ${isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')}`}>{bestStreak}</div>
            <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Best Streak</div>
          </div>
          <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
            <div className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalCompletions}</div>
            <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Total Done</div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div>
          <h3 className={`font-bold mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Last 7 Days Activity</h3>
          <div className="h-40 flex items-end justify-between gap-2">
            {weeklyData.map((d, i) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative flex-1 flex items-end">
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-500 ${isDark ? (isGreen ? 'bg-green-600 group-hover:bg-green-500' : isLgbt ? 'bg-gradient-to-t from-blue-500 via-green-500 to-red-500 group-hover:opacity-80' : 'bg-pink-600 group-hover:bg-pink-500') : (isGreen ? 'bg-green-500 group-hover:bg-green-600' : isLgbt ? 'bg-gradient-to-t from-blue-500 via-green-500 to-red-500 group-hover:opacity-90' : 'bg-pink-500 group-hover:bg-pink-600')}`}
                    style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count > 0 ? '4px' : '0' }}
                  ></div>
                  {/* Tooltip-ish number */}
                  {d.count > 0 && (
                    <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? (isGreen ? 'text-green-300' : isLgbt ? 'text-indigo-300' : 'text-pink-300') : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')}`}>
                      {d.count}
                    </div>
                  )}
                </div>
                <div className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{d.label.slice(0, 1)}</div>
              </div>
            ))}
          </div>
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

const WelcomePage = ({ onSuccess, onDemoMode }: { onSuccess: () => void, onDemoMode: (name: string, password: string) => void }) => {
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
              className={`p-2 rounded-xl transition ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <X className="w-6 h-6" />
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

// Dashboard Component
const Dashboard = ({ user, onLogout }: { user: FirebaseUser, onLogout: () => void }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState(HABIT_ICONS[0].name); // Added state for icon
  const [isAdding, setIsAdding] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);  // ← ADD THIS
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const [showStats, setShowStats] = useState(false);
  
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
  useEffect(() => {
    if (!user) return;

    // Demo Mode Handler: Use LocalStorage
    if (user.uid === 'demo-user') {
      const storedHabits = localStorage.getItem('demo_habits');
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      } else {
        setHabits([]);
      }
      setLoading(false);
      return;
    }
    
    // Firebase Real-time Listener
    // 🟢 SAFETY CHECK: If there is no user, stop immediately.
    if (!user || !user.uid) {
      setHabits([]); // Optional: clear habits on logout
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

    return () => unsubscribe();
  }, [user]);
   useEffect(() => {
    habits.forEach(habit => {
      if (habit.reminderEnabled) {
        scheduleNotification(habit);
      }
    });
  }, [habits]);

  const today = getTodayString();
  const totalHabits = habits.length;
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

    if (user.uid === 'demo-user') {
      const habitWithId = { ...newHabit, id: Date.now().toString(), createdAt: new Date().toISOString(), streak: 0 };
      const updatedHabits = [habitWithId as unknown as Habit, ...habits];
      setHabits(updatedHabits);
      localStorage.setItem('demo_habits', JSON.stringify(updatedHabits));
      return;
    }

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

    if (user.uid === 'demo-user') {
      const updatedHabits = habits.map(h => 
        h.id === habit.id ? { ...h, completedDates: newDates, streak: calculateStreak(newDates) } : h
      );
      setHabits(updatedHabits);
      localStorage.setItem('demo_habits', JSON.stringify(updatedHabits));
      return;
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
    // Removed window.confirm for seamless experience
    
    // Immediate Feedback
    setToast({ id: Date.now().toString(), message: 'Habit deleted.', type: 'info' });

    if (user.uid === 'demo-user') {
      const updatedHabits = habits.filter(h => h.id !== habitId);
      setHabits(updatedHabits);
      localStorage.setItem('demo_habits', JSON.stringify(updatedHabits));
      return;
    }

     deleteDoc(doc(db, 'users', user.uid, 'habits', habitId))
       .catch((error) => {
         console.error("Error deleting habit", error);
         setToast({ id: Date.now().toString(), message: 'Failed to delete habit.', type: 'error' });
        });
  };

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
    <div className={`min-h-screen font-sans pb-20 transition-colors duration-500 relative overflow-hidden ${isDark ? (isLgbt ? 'bg-rainbow-dark text-slate-100' : 'bg-slate-950 text-slate-100') : isGreen ? 'bg-[#F0FDF4] text-slate-900' : isLgbt ? 'bg-rainbow-light text-slate-900' : 'bg-[#FDF2F8] text-slate-900'}`}>
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
      {showStats && <HabitStats habits={habits} onClose={() => setShowStats(false)} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Toast toast={toast} onDismiss={() => setToast(null)} />
        </div>
      )}

      {/* Top Bar */}
      <div className={`backdrop-blur-md border-b sticky top-0 z-20 transition-colors duration-300 relative ${isDark ? (isGreen ? 'bg-green-900/80 border-green-800 shadow-green-900/40' : isLgbt ? 'bg-slate-900/80 border-slate-800' : 'bg-pink-900/80 border-pink-800 shadow-pink-900/40') : (isGreen ? 'bg-green-600/90 border-green-700' : isLgbt ? 'bg-white/80 border-slate-200' : 'bg-pink-600/90 border-pink-700')}`}>
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
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
              <span className={`text-sm font-bold ${isDark ? (isGreen ? 'text-green-100' : isLgbt ? 'text-white' : 'text-pink-100') : (isLgbt ? 'text-slate-900' : 'text-white')}`}>{user.displayName || 'Guest'}</span>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
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

        {/* Habits List */}
        <div className="grid gap-5">
          {loading && (
             <SkeletonLoader />
          )}

          {!loading && habits.length === 0 && !isAdding && (
            <div className={`text-center py-16 rounded-3xl border border-dashed ${isDark ? 'bg-slate-900 border-slate-800' : (isGreen ? 'bg-white border-green-200' : isLgbt ? 'bg-white border-indigo-200' : 'bg-white border-pink-200')}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float ${isDark ? 'bg-slate-800 text-slate-600' : (isGreen ? 'bg-green-50 text-green-300' : isLgbt ? 'bg-indigo-50 text-indigo-300' : 'bg-pink-50 text-pink-300')}`}>
                <Calendar className="w-10 h-10" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>It's quiet here...</h3>
              <p className={isDark ? 'text-slate-500' : 'text-slate-500'}>Add your first habit to start the engine!</p>
            </div>
          )}

          {habits.map((habit, idx) => {
            const isCompletedToday = habit.completedDates?.includes(today);
            const themeBase = getColorTheme(habit.title); 
            const theme = isDark ? themeBase.dark : themeBase.light;
            
            return (
              <div 
                key={habit.id} 
                style={{ animationDelay: `${idx * 0.05}s` }}
                className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pop ${
                  isCompletedToday 
                    ? `${isDark ? 'bg-slate-900 border-slate-800' : (isGreen ? 'bg-white border-green-100' : isLgbt ? 'bg-white border-indigo-100' : 'bg-white border-pink-100')}`
                    : `${isDark ? 'bg-slate-900 border-slate-900 hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900' : (isGreen ? 'bg-white border-white hover:border-green-100 hover:shadow-lg hover:shadow-green-100' : isLgbt ? 'bg-white border-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100' : 'bg-white border-white hover:border-pink-100 hover:shadow-lg hover:shadow-pink-100')} shadow-sm`
                }`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 rounded-3xl bg-gradient-to-r ${themeBase.light.bg.replace('bg-', 'from-white via-white to-')}/30 pointer-events-none`}></div>

                <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
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

                <div className="flex items-center justify-between w-full md:w-auto gap-4 relative z-10 pl-[88px] md:pl-0">
                  <WeeklyProgress completedDates={habit.completedDates} />
                  <button
                    onClick={() => {
                      const updatedHabits = habits.map(h => 
                        h.id === habit.id 
                          ? { ...h, reminderEnabled: !h.reminderEnabled, reminderTime: h.reminderTime || '09:00' }
                          : h
                      );
                      setHabits(updatedHabits);
                      if (user.uid === 'demo-user') {
                        localStorage.setItem('demo_habits', JSON.stringify(updatedHabits));
                      }
                    }}
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
            );
          })}
        </div>

        {/* Template Browser Modal */}
        {showTemplates && (
          <TemplateBrowser 
            onSelectTemplate={selectTemplate}
            onClose={() => setShowTemplates(false)}
          />
        )}
        
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
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
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

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 animate-slide-up">
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
            onClick={() => setShowInstall(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
// 5. Main App Container
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

  // ... rest of the App component ...
  const handleDemoLogin = (name: string, password: string) => { // Updated signature
  const mockUser = {
  uid: 'demo-user',
  displayName: name,
  email: 'guest@example.com', // <-- ADD THIS LINE
  emailVerified: true,
  isAnonymous: true,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  providerId: 'firebase', // <-- ADD THIS LINE
  delete: async () => {},
  getIdToken: async () => '',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
  phoneNumber: null,
  photoURL: null,
} as FirebaseUser;

    setUser(mockUser);
    setView('dashboard');
    localStorage.setItem('demo_user_name', name);
    localStorage.setItem('demo_user_password', password); // Store password
    localStorage.setItem('habitflow_guest_mode', 'true');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setView('dashboard');
      } else {
        const isGuest = localStorage.getItem('habitflow_guest_mode');
        if (isGuest === 'true') {
           const name = localStorage.getItem('demo_user_name') || 'Guest';
           const mockUser = {
  uid: 'demo-user',
  displayName: name,
  email: 'guest@example.com', // <-- ADD THIS LINE
  emailVerified: true,
  isAnonymous: true,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  providerId: 'firebase', // <-- ADD THIS LINE
  delete: async () => {},
  getIdToken: async () => '',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
  phoneNumber: null,
  photoURL: null,
} as FirebaseUser;
           setUser(mockUser);
           setView('dashboard');
        } else {
           setUser(null);
           if (view === 'dashboard') setView('landing');
        }
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
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('habitflow_guest_mode');
    await signOut(auth);
    setView('landing'); // 🟢 Switch screen first
    setTimeout(() => setUser(null), 0); // Clear user after unmount
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
      return <WelcomePage onSuccess={() => setView('dashboard')} onDemoMode={handleDemoLogin} />;
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

