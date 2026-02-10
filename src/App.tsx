import React, { useState, useEffect, useCallback, useRef, createContext, useContext, FormEvent, ChangeEvent, useMemo, Suspense } from 'react';
import { useAppStore } from './store/useAppStore';
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
  Receipt,
 Camera,
  Download,
  Upload
} from 'lucide-react';




// Define LucideIcon type
type LucideIcon = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;


// 🎯 ACCESSIBILITY: Touch-friendly button component
interface TouchButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: LucideIcon;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const TouchButton: React.FC<TouchButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  fullWidth = false,
  size = 'md'
}) => {
  const { theme, accent, isDark } = useTheme();
  
  // Size classes
  const sizeClasses = {
    sm: 'min-h-[44px] px-4 py-2 text-sm',
    md: 'min-h-[56px] px-6 py-3 text-base',
    lg: 'min-h-[64px] px-8 py-4 text-lg'
  };
  
  // Base classes for all buttons
  const baseClasses = `
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : 'min-w-[120px]'}
    rounded-2xl 
    font-bold 
    transition-all 
    duration-200
    active:scale-95
    disabled:opacity-50 
    disabled:cursor-not-allowed
    disabled:active:scale-100
    touch-manipulation
    flex items-center justify-center gap-2
    focus:outline-none focus:ring-4 focus:ring-offset-2
  `;
  
  // Variant-specific classes
  const getVariantClasses = () => {
    const accentColor = accent === 'green' ? 'green' : accent === 'lgbt' ? 'purple' : 'pink';
    
    switch (variant) {
      case 'primary':
        return isDark
          ? `bg-${accentColor}-600 hover:bg-${accentColor}-500 text-white 
             focus:ring-${accentColor}-500/50 shadow-lg shadow-${accentColor}-900/20`
          : `bg-${accentColor}-700 hover:bg-${accentColor}-600 text-white 
             focus:ring-${accentColor}-500/50 shadow-lg shadow-${accentColor}-200/50`;
      
      case 'secondary':
        return isDark
          ? `bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-700
             focus:ring-slate-500/50`
          : `bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200
             focus:ring-slate-400/50`;
      
      case 'danger':
        return `bg-red-600 hover:bg-red-500 text-white 
                focus:ring-red-500/50 shadow-lg shadow-red-900/20`;
      
      case 'ghost':
        return isDark
          ? `bg-transparent hover:bg-slate-800/50 text-slate-300
             focus:ring-slate-500/30`
          : `bg-transparent hover:bg-slate-100 text-slate-700
             focus:ring-slate-400/30`;
      
      default:
        return '';
    }
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  );
};

// 🔘 Icon-only button for actions
interface IconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  label: string; // For accessibility
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  label,
  variant = 'ghost',
  disabled = false,
  className = ''
}) => {
  const { theme, accent, isDark } = useTheme();
  
  const getVariantClasses = () => {
    const accentColor = accent === 'green' ? 'green' : accent === 'lgbt' ? 'purple' : 'pink';
    
    switch (variant) {
      case 'primary':
        return isDark
          ? `bg-${accentColor}-600 hover:bg-${accentColor}-500 text-white`
          : `bg-${accentColor}-700 hover:bg-${accentColor}-600 text-white`;
      
      case 'secondary':
        return isDark
          ? `bg-slate-800 hover:bg-slate-700 text-white`
          : `bg-slate-200 hover:bg-slate-300 text-slate-900`;
      
      case 'danger':
        return `bg-red-600 hover:bg-red-500 text-white`;
      
      case 'ghost':
        return isDark
          ? `hover:bg-slate-800 text-slate-300`
          : `hover:bg-slate-100 text-slate-700`;
      
      default:
        return '';
    }
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        min-w-[44px] min-h-[44px]
        p-2
        rounded-xl
        transition-all
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        touch-manipulation
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${getVariantClasses()}
        ${className}
      `}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};
//end of button
// ============ ADD THIS ENTIRE SECTION HERE ============
// 📱 PLATFORM: Safe Area Hook for iOS notch/Dynamic Island
const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });
  
  useEffect(() => {
    const updateSafeArea = () => {
      // Get CSS env() values
      const computedStyle = getComputedStyle(document.documentElement);
      
      const getEnvValue = (varName: string): number => {
        const value = computedStyle.getPropertyValue(varName);
        return value ? parseInt(value.replace('px', '')) : 0;
      };
      
      setSafeArea({
        top: getEnvValue('--sat'),
        bottom: getEnvValue('--sab'),
        left: getEnvValue('--sal'),
        right: getEnvValue('--sar')
      });
    };
    
    updateSafeArea();
    
    // Update on orientation change
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);
    
    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);
  
  return safeArea;
};

// 📱 PLATFORM: Android back button handler
const useAndroidBackButton = (onBack: () => void) => {
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      e.preventDefault();
      onBack();
    };
    
    // Push initial state
    window.history.pushState(null, '', window.location.pathname);
    
    window.addEventListener('popstate', handleBackButton);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [onBack]);
};

// 📱 PLATFORM: Detect platform and capabilities
const usePlatformInfo = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    os: 'web',
    browser: 'unknown',
    version: '0',
    isStandalone: false,
    hasSafeArea: false,
    supportsHaptics: false
  });
  
  useEffect(() => {
    const userAgent = navigator.userAgent;
    
    // Detect OS
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /Android/.test(userAgent);
    const isDesktop = /(Macintosh|Windows|Linux)/.test(userAgent) && !isIOS && !isAndroid;
    
    // Detect standalone mode (PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
    
    // Detect safe area support
    const hasSafeArea = CSS.supports('padding-top: env(safe-area-inset-top)');
    
    // Detect haptics support
    const supportsHaptics = 'vibrate' in navigator;
    
    setPlatformInfo({
      os: isIOS ? 'ios' : isAndroid ? 'android' : isDesktop ? 'desktop' : 'web',
      browser: getBrowser(),
      version: getVersion(),
      isStandalone,
      hasSafeArea,
      supportsHaptics
    });
  }, []);
  
  const getBrowser = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'chrome';
    if (userAgent.includes('Safari')) return 'safari';
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Edge')) return 'edge';
    return 'unknown';
  };
  
  const getVersion = (): string => {
    const match = navigator.userAgent.match(/(?:Chrome|Safari|Firefox|Edge)\/(\d+)/);
    return match ? match[1] : '0';
  };
  
  return platformInfo;
};

// 📳 PLATFORM: Haptic feedback
const useHaptics = () => {
  const platformInfo = usePlatformInfo();
  
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (platformInfo.supportsHaptics && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [platformInfo.supportsHaptics]);
  
  const light = useCallback(() => vibrate(10), [vibrate]);
  const medium = useCallback(() => vibrate(20), [vibrate]);
  const heavy = useCallback(() => vibrate(30), [vibrate]);
  const success = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const warning = useCallback(() => vibrate([20, 100, 20]), [vibrate]);
  const error = useCallback(() => vibrate([30, 100, 30, 100, 30]), [vibrate]);
  
  return { light, medium, heavy, success, warning, error };
};
// ============ END OF PLATFORM HOOKS ============

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
  linkWithCredential,
  sendPasswordResetEmail
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
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from "firebase/storage";




import { 
  ResponsiveContainer, 
  LineChart, 
  BarChart,
  PieChart,  // 🔥 ADD THIS - CRITICAL!
  Pie,
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line, 
  Bar,
  Cell,
  Legend
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
let storage : any;




if (!isMissingConfig) {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app); // 📸 PHASE 3: Storage for receipts
  
 

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

// ============ ADD THIS ENTIRE SECTION HERE ============
// 🔒 SECURITY: Rate Limiter to prevent Firebase abuse
class RateLimiter {
  private callTimestamps: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxCalls: number;

  constructor(maxCalls: number = 10, windowMs: number = 60000) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
  }

  canProceed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.callTimestamps.get(key) || [];
    
    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(ts => now - ts < this.windowMs);
    
    if (validTimestamps.length >= this.maxCalls) {
      console.warn(`⚠️ Rate limit exceeded for ${key}. Please slow down.`);
      return false;
    }
    
    validTimestamps.push(now);
    this.callTimestamps.set(key, validTimestamps);
    return true;
  }

  reset(key: string): void {
    this.callTimestamps.delete(key);
  }
}

// Global rate limiters for different operations
const firestoreWriteLimiter = new RateLimiter(30, 60000); // 30 writes per minute
const firestoreReadLimiter = new RateLimiter(100, 60000); // 100 reads per minute
const storageUploadLimiter = new RateLimiter(5, 60000); // 5 uploads per minute

// Export for use in components
export { firestoreWriteLimiter, firestoreReadLimiter, storageUploadLimiter };
// ============ END OF ADDITION ============


// ============ ADD ANALYTICS HELPERS HERE ============
// 📊 Analytics Helper Functions
import { logEvent, setUserProperties } from 'firebase/analytics';

// Check if analytics is enabled
const isAnalyticsEnabled = (): boolean => {
  const consent = localStorage.getItem('data-consent');
  if (!consent) return false;
  
  try {
    const data = JSON.parse(consent);
    return data.analytics === true;
  } catch {
    return false;
  }
};

// Log analytics event (respects user consent)
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (!isAnalyticsEnabled() || !analytics) return;
  
  try {
    logEvent(analytics, eventName, params);
    console.log(`📊 Analytics: ${eventName}`, params);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// Set user properties
export const setAnalyticsUserProperties = (properties: Record<string, any>) => {
  if (!isAnalyticsEnabled() || !analytics) return;
  
  try {
    setUserProperties(analytics, properties);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// Pre-defined event trackers
export const Analytics = {
  // User events
  userSignedUp: () => trackEvent('sign_up', { method: 'email' }),
  userLoggedIn: () => trackEvent('login', { method: 'email' }),
  userLoggedOut: () => trackEvent('logout'),
  
  // Habit events
  habitCreated: (habitType: string) => trackEvent('habit_created', { habit_type: habitType }),
  habitCompleted: (habitId: string) => trackEvent('habit_completed', { habit_id: habitId }),
  streakAchieved: (days: number) => trackEvent('streak_achieved', { days }),
  
  // Todo events
  todoCreated: () => trackEvent('todo_created'),
  todoCompleted: () => trackEvent('todo_completed'),
  
  // Finance events
  expenseAdded: (amount: number, category: string) => 
    trackEvent('expense_added', { value: amount, category }),
  incomeAdded: (amount: number, source: string) => 
    trackEvent('income_added', { value: amount, source }),
  goalCreated: (targetAmount: number) => 
    trackEvent('goal_created', { value: targetAmount }),
  goalReached: (amount: number) => 
    trackEvent('goal_reached', { value: amount }),
  
  // App events
  themeChanged: (theme: string, accent: string) => 
    trackEvent('theme_changed', { theme, accent }),
  featureUsed: (featureName: string) => 
    trackEvent('feature_used', { feature: featureName }),
  errorOccurred: (errorMessage: string, component: string) => 
    trackEvent('app_error', { error: errorMessage, component }),
  
  // Subscription events
  subscriptionStarted: (tier: string, price: number) => 
    trackEvent('subscription_started', { tier, value: price }),
  subscriptionCanceled: (tier: string) => 
    trackEvent('subscription_canceled', { tier }),
};

// Screen view tracking
export const trackScreenView = (screenName: string) => {
  if (!isAnalyticsEnabled() || !analytics) return;
  
  try {
    logEvent(analytics, 'screen_view', {
      firebase_screen: screenName,
      firebase_screen_class: screenName
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
};
// ============ END OF ANALYTICS HELPERS ============

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
  longestStreak?: number;
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
  imageUrl?: string;  // Add this line
}
interface Income {
  id: string;
  date: string;
  amount: number;
  source: string;
  description: string;
  createdAt: any;
}
interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string; // Optional - for subscriptions that expire
  nextPaymentDate: string;
  reminderEnabled: boolean;
  reminderDaysBefore: number; // Days before payment to remind
  isActive: boolean;
  notes?: string;
  createdAt: any;
}
interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type: 'credit_card' | 'student_loan' | 'mortgage' | 'personal_loan' | 'other';
  dueDay: number;
  createdAt: any;
}




interface RecurringExpenseSummary {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  total: number; // Total monthly cost
  count: number; // Number of active recurring expenses
}
interface MoneySettings {
  dailyAllowance: number;
  currency: string;
  currencySymbol: string;
}








interface CategoryBudget {
  category: string; // Category ID (e.g., 'food', 'transport')
  categoryLabel: string; // Display name
  categoryIcon: React.ComponentType<any>; // Icon component
  categoryColor: string; // Color code
  monthlyLimit: number; // Budget limit
  spent: number; // Amount spent
  percentage: number; // Percentage of budget used
}




interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: any;
}




interface SpendingInsight {
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  topCategory: string;
  topCategoryAmount: number;
}
interface FinancialHealthScore {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: {
    savingsRate: { score: number; value: number; };
    budgetAdherence: { score: number; value: number; };
    spendingControl: { score: number; value: number; };
    consistency: { score: number; value: number; };
  };
  recommendations: string[];
  trend: 'improving' | 'stable' | 'declining';
}
interface AppState {
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

// 🧭 Navigation State
interface NavigationState {
  currentTab: 'dashboard' | 'habits' | 'todos' | 'finance' | 'analytics' | 'settings';
  previousTab: NavigationState['currentTab'] | null;
  history: NavigationState['currentTab'][];
  canGoBack: boolean;
}

// 🎨 UI State Management
interface UIState {
  theme: Theme;
  accent: Accent;
  isDark: boolean;
  isLoading: boolean;
  error: ErrorState | null;
  notification: NotificationState | null;
  modal: ModalState | null;
}

interface ErrorState {
  message: string;
  code?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  dismissible: boolean;
}

interface NotificationState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // ms, undefined = stays until dismissed
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ModalState {
  type: 'confirm' | 'alert' | 'form' | 'custom';
  title: string;
  content: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

// 💳 Subscription & Monetization
interface SubscriptionTier {
  id: 'free' | 'pro' | 'premium';
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: SubscriptionFeatures;
  stripePriceId?: string; // For Stripe integration
  appStoreSku?: string; // For App Store
  playStoreSku?: string; // For Play Store
}

interface SubscriptionFeatures {
  maxHabits: number;
  maxGoals: number;
  maxExpenses: number; // per month
  analytics: boolean;
  cloudBackup: boolean;
  customThemes: boolean;
  aiInsights: boolean;
  exportData: boolean;
  prioritySupport: boolean;
}

const SUBSCRIPTION_TIERS: Record<SubscriptionTier['id'], SubscriptionTier> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    billingPeriod: 'monthly',
    features: {
      maxHabits: 3,
      maxGoals: 1,
      maxExpenses: 50,
      analytics: false,
      cloudBackup: false,
      customThemes: false,
      aiInsights: false,
      exportData: false,
      prioritySupport: false,
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 4.99,
    billingPeriod: 'monthly',
    features: {
      maxHabits: 20,
      maxGoals: 5,
      maxExpenses: 500,
      analytics: true,
      cloudBackup: true,
      customThemes: true,
      aiInsights: false,
      exportData: true,
      prioritySupport: false,
    },
    stripePriceId: 'price_pro_monthly',
    appStoreSku: 'com.habitflow.pro.monthly',
    playStoreSku: 'pro_monthly'
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    billingPeriod: 'monthly',
    features: {
      maxHabits: Infinity,
      maxGoals: Infinity,
      maxExpenses: Infinity,
      analytics: true,
      cloudBackup: true,
      customThemes: true,
      aiInsights: true,
      exportData: true,
      prioritySupport: true,
    },
    stripePriceId: 'price_premium_monthly',
    appStoreSku: 'com.habitflow.premium.monthly',
    playStoreSku: 'premium_monthly'
  }
};

// 🔐 Privacy & Data Consent
interface DataPrivacyConsent {
  analytics: boolean;
  marketing: boolean;
  essential: boolean; // Always true
  timestamp: Date;
  version: string; // Privacy policy version
}

// 📱 Platform Detection
interface PlatformInfo {
  os: 'ios' | 'android' | 'web' | 'desktop';
  browser: string;
  version: string;
  isStandalone: boolean; // PWA installed
  hasSafeArea: boolean; // Has notch/Dynamic Island
  supportsHaptics: boolean;
}

// 🎯 Touch Target Constants (Apple HIG & Material Design)
const TOUCH_TARGETS = {
  MIN_SIZE_IOS: 44,      // Apple minimum
  MIN_SIZE_ANDROID: 48,  // Material Design
  RECOMMENDED: 56,       // Comfortable for all users
  SPACING: 8,            // Minimum between touch targets
  ICON_SIZE: 24,         // Standard icon size
  ICON_SIZE_LARGE: 32,   // Large icons
} as const;

// 🎨 Theme System Constants
const THEME_COLORS = {
  pink: {
    light: {
      primary: '#ec4899',
      primaryHover: '#db2777',
      background: '#fdf2f8',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
    },
    dark: {
      primary: '#ec4899',
      primaryHover: '#f472b6',
      background: '#18181b',
      surface: '#27272a',
      text: '#f9fafb',
      textSecondary: '#9ca3af',
    }
  },
  green: {
    light: {
      primary: '#10b981',
      primaryHover: '#059669',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
    },
    dark: {
      primary: '#10b981',
      primaryHover: '#34d399',
      background: '#18181b',
      surface: '#27272a',
      text: '#f9fafb',
      textSecondary: '#9ca3af',
    }
  },
  lgbt: {
    light: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      background: '#faf5ff',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
    },
    dark: {
      primary: '#8b5cf6',
      primaryHover: '#a78bfa',
      background: '#18181b',
      surface: '#27272a',
      text: '#f9fafb',
      textSecondary: '#9ca3af',
    }
  }
} as const;
interface Achievement {
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
interface SpendingPrediction {
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




// ============ REPLACE ENTIRE ThemeContext SECTION ============
type Theme = 'light' | 'dark';
type Accent = 'pink' | 'green' | 'lgbt';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  accent: Accent;
  toggleAccent: () => void;
  isDark: boolean; // Pre-computed for performance
  accentColor: string; // Pre-computed hex color
  themeColors: {
    primary: string;
    primaryHover: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// 🎨 Memoized Theme Provider for performance
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('app-theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });
  
  const [accent, setAccent] = useState<Accent>(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('app-accent');
    return (saved === 'pink' || saved === 'green' || saved === 'lgbt') ? saved : 'pink';
  });
  
  // Persist theme changes
  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    // Update document class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Persist accent changes
  useEffect(() => {
    localStorage.setItem('app-accent', accent);
  }, [accent]);
  
  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo<ThemeContextValue>(() => {
    const isDark = theme === 'dark';
    const currentColors = THEME_COLORS[accent][theme];
    
    return {
      theme,
      toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
      accent,
      toggleAccent: () => setAccent(prev => {
        if (prev === 'pink') return 'green';
        if (prev === 'green') return 'lgbt';
        return 'pink';
      }),
      isDark,
      accentColor: currentColors.primary,
      themeColors: currentColors
    };
  }, [theme, accent]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook with error handling
const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
// ============ END OF THEME CONTEXT REPLACEMENT ============

// ============ ADD ERROR BOUNDARY HERE ============
// 🚨 Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to Firebase Analytics
    console.error('💥 App Error Caught:', error);
    console.error('Error Info:', errorInfo);
    
    // Log to Firebase if available
    if (typeof analytics !== 'undefined' && analytics) {
      try {
        // Import logEvent from firebase/analytics
        import('firebase/analytics').then(({ logEvent }) => {
          logEvent(analytics, 'app_error', {
            error_message: error.message,
            error_stack: error.stack?.substring(0, 500),
            component_stack: errorInfo.componentStack?.substring(0, 500)
          });
        });
      } catch (e) {
        console.error('Failed to log error to analytics:', e);
      }
    }
    
    this.setState({
      errorInfo
    });
  }
  
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Reload the page
    window.location.reload();
  };
  
  render(): React.ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Oops! Something went wrong
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>
            
            {this.state.error && (
              <details className="mt-4 mb-6 text-left">
                <summary className="cursor-pointer text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                  Technical details
                </summary>
                <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-mono text-red-600 dark:text-red-400 overflow-auto max-h-32">
                  {this.state.error.message}
                </div>
              </details>
            )}
            
            <button
              onClick={this.handleReset}
              className="w-full px-6 py-4 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-pink-500/30"
            >
              Reload App
            </button>
            
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              If this keeps happening, please contact support
            </p>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}
// ============ END OF ERROR BOUNDARY ============

// ============ ADD DATA CONSENT BANNER HERE ============
// 🍪 GDPR/CCPA Consent Banner Component
interface ConsentBannerProps {
  onAccept: () => void;
}

const ConsentBanner: React.FC<ConsentBannerProps> = ({ onAccept }) => {
  const { isDark, accent } = useTheme();
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('data-consent');
    if (!consent) {
      // Show banner after 2 seconds (better UX)
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleAccept = () => {
    const consentData = {
      analytics: true,
      marketing: false,
      essential: true,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem('data-consent', JSON.stringify(consentData));
    setShowBanner(false);
    onAccept();
  };
  
  const handleDeclineAnalytics = () => {
    const consentData = {
      analytics: false,
      marketing: false,
      essential: true,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem('data-consent', JSON.stringify(consentData));
    setShowBanner(false);
    onAccept();
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className={`
        p-4 md:p-6
        ${isDark ? 'bg-slate-900 border-t-2 border-slate-800' : 'bg-white border-t-2 border-slate-200'}
        shadow-2xl
      `}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🍪</span>
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  We Value Your Privacy
                </h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} mb-2`}>
                We use essential cookies to make our app work, and optional analytics to improve your experience. 
                We <strong>never</strong> sell your data.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <a 
                  href="/privacy-policy.html" 
                  target="_blank"
                  className={`underline ${isDark ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'}`}
                >
                  Privacy Policy
                </a>
                <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>•</span>
                <a 
                  href="/terms-of-service.html" 
                  target="_blank"
                  className={`underline ${isDark ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'}`}
                >
                  Terms of Service
                </a>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={handleDeclineAnalytics}
                className={`
                  px-6 py-3 rounded-xl font-semibold transition-all
                  ${isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}
                  active:scale-95
                `}
              >
                Essential Only
              </button>
              <button
                onClick={handleAccept}
                className={`
                  px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg
                  ${accent === 'green'
                    ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
                    : accent === 'lgbt'
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30'
                    : 'bg-pink-600 hover:bg-pink-700 shadow-pink-500/30'}
                  active:scale-95
                `}
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// ============ END OF CONSENT BANNER ============

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




// SUPPRESS CONSOLE WARNINGS








const originalWarn = console.warn;
const originalError = console.error;




console.warn = (...args: any[]) => {
  // Suppress Recharts dimension warnings
  if (typeof args[0] === 'string' && args[0].includes('width(-1) and height(-1)')) return;
  // Suppress deprecated meta tag warning
  if (typeof args[0] === 'string' && args[0].includes('apple-mobile-web-app-capable')) return;
  originalWarn(...args);
};




console.error = (...args: any[]) => {
  // Suppress offline mode errors (these are expected)
  if (args[0]?.message?.includes('client is offline')) return;
  if (args[0]?.message?.includes('Failed to get document because the client is offline')) return;
  originalError(...args);
};








// EXPENSE CATEGORIES
const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food & Drinks', icon: Coffee, color: 'orange' },
  { id: 'transport', label: 'Transportation', icon: Briefcase, color: 'blue' },
  { id: 'entertainment', label: 'Entertainment', icon: Music, color: 'purple' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'pink' },
  { id: 'bills', label: 'Bills & Utilities', icon: Home, color: 'red' },
  { id: 'health', label: 'Health & Fitness', icon: Heart, color: 'green' },
  { id: 'debt_payment', label: 'Debt Payment', icon: 'CreditCard', color: 'indigo' },
  { id: 'other', label: 'Other', icon: Target, color: 'slate' }
];
// 🆕 PHASE 1: Default budget limits (customizable by user)
const DEFAULT_CATEGORY_BUDGETS: Record<string, number> = {
  'Food & Dining': 500,
  'Transportation': 200,
  'Shopping': 300,
  'Entertainment': 150,
  'Bills & Utilities': 400,
  'Healthcare': 200,
  'Education': 300,
  'Personal Care': 100,
  'Gifts & Donations': 100,
  'Other': 200
};
// ========================================
// 🔥 NEW: MEMOIZED HABIT CARD COMPONENT
// ========================================




interface HabitCardProps {
  habit: Habit;
  today: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
  onToggleCheckIn: (habit: Habit) => void;
  onStartEditing: (habit: Habit) => void;
  onSetReminder: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  getColorTheme: (str: string) => HabitThemeData;
}




const HabitCard = React.memo<HabitCardProps>(({ 
  habit, 
  today, 
  isDark, 
  isGreen, 
  isLgbt, 
  onToggleCheckIn, 
  onStartEditing, 
  onSetReminder, 
  onDelete,
  getColorTheme 
}) => {
  const isCompletedToday = habit.completedDates?.includes(today);
  const themeBase = getColorTheme(habit.title);
  const theme = isDark ? themeBase.dark : themeBase.light;
  
  return (
    <div 
      className={`group relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 ${
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
                onClick={() => onToggleCheckIn(habit)} 
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
              onClick={() => onStartEditing(habit)}
              className={`p-2.5 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isDark ? 'text-slate-600 hover:bg-slate-800 hover:text-slate-400' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'
              }`}
              aria-label={`Edit habit: ${habit.title}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSetReminder(habit)}
              className={`p-2.5 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center ${
                habit.reminderEnabled
                  ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600')
                  : (isDark ? 'text-slate-600 hover:bg-slate-800' : 'text-slate-300 hover:bg-slate-100')
              }`}
              aria-label={`${habit.reminderEnabled ? 'Disable' : 'Enable'} reminder for: ${habit.title}`}
            >
              <span className="text-base">{habit.reminderEnabled ? '🔔' : '🔕'}</span>
            </button>
            <button 
              onClick={() => onDelete(habit.id)}
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
            onClick={() => onToggleCheckIn(habit)} 
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
            onClick={() => onStartEditing(habit)}
            className={`opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-xl ${
              isDark ? 'text-slate-600 hover:bg-slate-800 hover:text-slate-400' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'
            }`}
            title="Edit Habit"
            aria-label={`Edit habit: ${habit.title}`}
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onSetReminder(habit)}
            className={`p-3 rounded-xl transition ${
              habit.reminderEnabled
                ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600')
                : (isDark ? 'text-slate-600 hover:bg-slate-800' : 'text-slate-300 hover:bg-slate-100')
            }`}
            title={habit.reminderEnabled ? "Reminder On" : "Reminder Off"}
            aria-label={`${habit.reminderEnabled ? 'Disable' : 'Enable'} reminder for: ${habit.title}`}
          >
            <span className="text-lg">{habit.reminderEnabled ? '🔔' : '🔕'}</span>
          </button>
          <button 
            onClick={() => onDelete(habit.id)}
            className={`opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-xl ${
              isDark 
                ? 'text-slate-600 hover:text-red-400 hover:bg-red-900/20' 
                : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
            }`}
            title="Delete Habit"
            aria-label={`Delete habit: ${habit.title}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // 🔥 CRITICAL: Only re-render if THIS habit changed
  const prevCompleted = prevProps.habit.completedDates?.includes(prevProps.today);
  const nextCompleted = nextProps.habit.completedDates?.includes(nextProps.today);
  
  return (
    prevProps.habit.id === nextProps.habit.id &&
    prevProps.habit.title === nextProps.habit.title &&
    prevProps.habit.streak === nextProps.habit.streak &&
    prevProps.habit.icon === nextProps.habit.icon &&
    prevCompleted === nextCompleted &&
    prevProps.habit.reminderEnabled === nextProps.habit.reminderEnabled &&
    prevProps.habit.colorTheme === nextProps.habit.colorTheme &&
    prevProps.habit.reminderTime === nextProps.habit.reminderTime &&
    prevProps.today === nextProps.today &&
    prevProps.isDark === nextProps.isDark &&
    prevProps.isGreen === nextProps.isGreen &&
    prevProps.isLgbt === nextProps.isLgbt
  );
});




HabitCard.displayName = 'HabitCard';
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




// --- Helper Functions ---// 🏆 ACHIEVEMENT DEFINITIONS
const ACHIEVEMENT_DEFINITIONS = [
  // Habit Achievements
  {
    id: 'first-habit',
    title: 'Getting Started',
    description: 'Create your first habit',
    icon: '🎯',
    category: 'habits' as const,
    requirement: 1,
    reward: 'Welcome to HabitFlow!'
  },
  {
    id: 'habit-master',
    title: 'Habit Master',
    description: 'Create 10 habits',
    icon: '🎓',
    category: 'habits' as const,
    requirement: 10,
    reward: 'You\'re building a better life!'
  },
  // Streak Achievements
  {
    id: 'week-warrior',
    title: '7 Day Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'streak' as const,
    requirement: 7,
    reward: 'One week strong!'
  },
  {
    id: 'month-master',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '⭐',
    category: 'streak' as const,
    requirement: 30,
    reward: 'Consistency is key!'
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Reach a 100-day streak',
    icon: '💯',
    category: 'streak' as const,
    requirement: 100,
    reward: 'You\'re unstoppable!'
  },
  // Money Achievements
  {
    id: 'first-budget',
    title: 'Budget Beginner',
    description: 'Set your first daily budget',
    icon: '💰',
    category: 'money' as const,
    requirement: 1,
    reward: 'Taking control of your finances!'
  },
  {
    id: 'money-saver',
    title: 'Money Saver',
    description: 'Save 20% of your budget for a week',
    icon: '🏦',
    category: 'money' as const,
    requirement: 7,
    reward: 'Smart spending pays off!'
  },
  {
    id: 'budget-boss',
    title: 'Budget Boss',
    description: 'Stay under budget for 30 days',
    icon: '👑',
    category: 'money' as const,
    requirement: 30,
    reward: 'You\'re in complete control!'
  },
  // Milestone Achievements
  {
    id: 'hundred-completions',
    title: 'Centurion',
    description: 'Complete 100 total habits',
    icon: '🎖️',
    category: 'milestone' as const,
    requirement: 100,
    reward: 'You\'re a completion machine!'
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Complete all habits for 7 days straight',
    icon: '✨',
    category: 'milestone' as const,
    requirement: 7,
    reward: 'Absolute dedication!'
  }
];
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
      @keyframes scan {
            0% {
              transform: translateY(-100%);
            }
            100% {
              transform: translateY(100%);
            }
          }




          .animate-scan {
            animation: scan 3s linear infinite;
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
  const [toast, setToast] = useState<ToastData | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
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
  
  // NEW: Check terms agreement for signup
  if (mode === 'signup' && !agreedToTerms) {
    setError('Please agree to the Terms & Conditions');
    return;
  }
  
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
}; // ← ADD THIS LINE




const handlePasswordReset = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!resetEmail.trim()) {
    setError('Please enter your username');
    return;
  }




  setResetLoading(true);
  setError('');




  try {
    const normalizedUsername = resetEmail.toLowerCase().replace(/\s+/g, '');
    const email = `${normalizedUsername}@habitflow.app`;
    
    await sendPasswordResetEmail(auth, email);
    
    // Success! Show toast notification
    setShowForgotPassword(false);
    setResetEmail('');
    // You'll need to add toast state at the top of WelcomePage if not already present
    alert('✅ Password reset email sent! Check your inbox.');
    
  } catch (err: any) {
    console.error("Password reset failed:", err);
    
    if (err.code === 'auth/user-not-found') {
      setError('No account found with this username.');
    } else if (err.code === 'auth/invalid-email') {
      setError('Invalid username format.');
    } else {
      setError('Failed to send reset email. Please try again.');
    }
  } finally {
    setResetLoading(false);
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
          {/* ✨ NEW: Terms & Conditions Checkbox - ONLY for Sign Up */}
          {mode === 'signup' && (
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className={`mt-1 w-5 h-5 rounded border-2 cursor-pointer transition ${
                  isDark 
                    ? (isGreen ? 'border-green-500 accent-green-500' : isLgbt ? 'border-indigo-500 accent-indigo-500' : 'border-pink-500 accent-pink-500')
                    : (isGreen ? 'border-green-600 accent-green-600' : isLgbt ? 'border-indigo-600 accent-indigo-600' : 'border-pink-600 accent-pink-600')
                }`}
              />
              <label htmlFor="terms" className={`text-sm cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className={`font-bold underline ${
                    isDark 
                      ? (isGreen ? 'text-green-400 hover:text-green-300' : isLgbt ? 'text-indigo-400 hover:text-indigo-300' : 'text-pink-400 hover:text-pink-300')
                      : (isGreen ? 'text-green-600 hover:text-green-700' : isLgbt ? 'text-indigo-600 hover:text-indigo-700' : 'text-pink-600 hover:text-pink-700')
                  }`}
                >
                  Terms & Conditions
                </button>
              </label>
            </div>
          )}




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
          <>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className={`text-center text-sm mt-4 font-bold block w-full ${
                isDark 
                  ? (isGreen ? 'text-green-400 hover:text-green-300' : isLgbt ? 'text-indigo-400 hover:text-indigo-300' : 'text-pink-400 hover:text-pink-300')
                  : (isGreen ? 'text-green-600 hover:text-green-700' : isLgbt ? 'text-indigo-600 hover:text-indigo-700' : 'text-pink-600 hover:text-pink-700')
              }`}
            >
              Forgot Password?
            </button>
            
            <p className={`text-center text-sm mt-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`font-bold ${
                  isDark 
                    ? (isGreen ? 'text-green-400 hover:text-green-300' : isLgbt ? 'text-indigo-400 hover:text-indigo-300' : 'text-pink-400 hover:text-pink-300')
                    : (isGreen ? 'text-green-600 hover:text-green-700' : isLgbt ? 'text-indigo-600 hover:text-indigo-700' : 'text-pink-600 hover:text-pink-700')
                }`}
              >
                Sign up here
              </button>
            </p>
          </>
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
    {/* Terms & Conditions Modal */}
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowTermsModal(false)}></div>
            
            <div className={`relative w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl p-6 animate-pop overflow-y-auto ${
              isDark ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white border-2 border-slate-100'
            }`}>
              
              <button 
                onClick={() => setShowTermsModal(false)}
                className={`absolute top-4 right-4 p-2 rounded-xl transition z-10 ${
                  isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>




              <div className="mb-6">
                <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Terms & Conditions
                </h2>
                <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Last updated: January 2026
                </p>
              </div>




              <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <section>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>1. Acceptance of Terms</h3>
                  <p>By accessing and using HabitFlow, you accept and agree to be bound by these Terms & Conditions.</p>
                </section>




                <section>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>2. Use of Service</h3>
                  <p>HabitFlow is a personal habit tracking application. You agree to use this service only for lawful purposes and in accordance with these terms.</p>
                </section>




                <section>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>3. User Data</h3>
                  <p>You retain all rights to your personal data. We store your habits, todos, and expense data securely using Firebase. We do not sell or share your personal information with third parties.</p>
                </section>




                <section>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>4. Account Responsibility</h3>
                  <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
                </section>




                <section>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>5. Service Availability</h3>
                  <p>We strive to keep HabitFlow available 24/7, but we do not guarantee uninterrupted access and may perform maintenance as needed.</p>
                </section>




                <section>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>6. Limitation of Liability</h3>
                  <p>HabitFlow is provided "as is" without warranties. We are not liable for any damages arising from your use of the service.</p>
                </section>




                <section>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>7. Changes to Terms</h3>
                  <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.</p>
                </section>
              </div>




              <button
                onClick={() => {
                  setAgreedToTerms(true);
                  setShowTermsModal(false);
                }}
                className={`w-full mt-6 text-white py-4 rounded-2xl font-bold text-lg transition shadow-lg ${
                  isDark 
                    ? (isGreen ? 'bg-green-500 hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400')
                    : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
                }`}
              >
                I Agree to Terms & Conditions
              </button>
            </div>
          </div>
        )}




        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
              setShowForgotPassword(false);
              setResetEmail('');
              setError('');
            }}></div>
            
            <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-6 animate-pop ${
              isDark ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white border-2 border-slate-100'
            }`}>
              
              <button 
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                  setError('');
                }}
                className={`absolute top-4 right-4 p-2 rounded-xl transition ${
                  isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>




              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${
                  isDark 
                    ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-br from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
                    : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-br from-red-500 to-blue-500 text-white' : 'bg-pink-600 text-white')
                }`}>
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Reset Password
                </h2>
                <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Enter your username and we'll send you a password reset link
                </p>
              </div>




              <form onSubmit={handlePasswordReset} className="space-y-5">
                {error && (
                  <div className={`p-3 rounded-xl text-sm font-bold text-center animate-pop ${
                    isDark ? 'bg-red-900/30 text-red-300 border border-red-800' : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {error}
                  </div>
                )}




                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your username"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition font-medium text-lg ${
                      isDark 
                        ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-400 placeholder-slate-500' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-400 placeholder-slate-500' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-400 placeholder-slate-500')
                        : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-600 focus:bg-white focus:ring-4 focus:ring-pink-100')
                    }`}
                  />
                </div>




                <button
                  type="submit"
                  disabled={resetLoading}
                  className={`w-full text-white py-4 rounded-xl font-bold text-xl transition transform hover:-translate-y-1 shadow-xl flex items-center justify-center gap-2 ${
                    isDark 
                      ? (isGreen ? 'bg-green-500 hover:bg-green-400 shadow-green-500/40' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/40')
                      : (isGreen ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : isLgbt ? 'bg-gradient-to-r from-red-600 via-green-600 to-blue-700 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200')
                  } ${resetLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {resetLoading ? 'Sending...' : (
                    <>
                      Send Reset Link <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>




                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setError('');
                  }}
                  className={`w-full py-3 rounded-xl font-bold transition ${
                    isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
        
        {toast && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <Toast toast={toast} onDismiss={() => setToast(null)} />
          </div>
        )}
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
                    // onClose() is now called inside selectTemplate function
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
// 🆕 PHASE 1: Budget Limits Section
// LOCATION: Add this inside your MoneyTracker component (around line 4600-4700)




interface BudgetLimitsSectionProps {
  budgets: CategoryBudget[];
  currencySymbol: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
  onEditBudgets: () => void;
}




const BudgetLimitsSection: React.FC<BudgetLimitsSectionProps> = ({
  budgets,
  currencySymbol,
  isDark,
  isGreen,
  isLgbt,
  onEditBudgets
}) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return isDark ? 'bg-red-500' : 'bg-red-600';
    if (percentage >= 80) return isDark ? 'bg-yellow-500' : 'bg-yellow-600';
    if (isGreen) return isDark ? 'bg-green-500' : 'bg-green-600';
    if (isLgbt) return 'bg-gradient-to-r from-red-500 to-blue-500';
    return isDark ? 'bg-pink-500' : 'bg-pink-600';
  };




  return (
    <div className={`p-6 rounded-2xl border-2 ${
      isDark 
        ? (isGreen ? 'bg-slate-800/50 border-green-900/50' : isLgbt ? 'bg-slate-800/50 border-indigo-900/50' : 'bg-slate-800/50 border-pink-900/50')
        : (isGreen ? 'bg-green-50 border-green-200' : isLgbt ? 'bg-gradient-to-br from-red-50 to-blue-50 border-indigo-200' : 'bg-pink-50 border-pink-200')
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark 
              ? (isGreen ? 'bg-green-500/20' : isLgbt ? 'bg-gradient-to-br from-red-500/20 to-blue-500/20' : 'bg-pink-500/20')
              : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-br from-red-100 to-blue-100' : 'bg-pink-100')
          }`}>
            <Target className={`w-6 h-6 ${
              isDark 
                ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
            }`} />
          </div>
          <div>
            <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Category Budgets
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Monthly spending limits
            </p>
          </div>
        </div>
        <button
          onClick={onEditBudgets}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
            isDark 
              ? (isGreen ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : isLgbt ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30')
              : (isGreen ? 'bg-green-100 text-green-700 hover:bg-green-200' : isLgbt ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-pink-100 text-pink-700 hover:bg-pink-200')
          }`}
        >
          Edit Limits
        </button>
      </div>




      <div className="space-y-4">
        {budgets.length === 0 ? (
          <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            No budget limits set. Click "Edit Limits" to get started!
          </p>
        ) : (
          budgets.map((budget) => (
            <div key={budget.category}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {budget.category}
                </span>
                <span className={`text-sm font-bold ${
                  budget.percentage >= 100 
                    ? 'text-red-500' 
                    : budget.percentage >= 80 
                    ? 'text-yellow-500' 
                    : isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {currencySymbol}{budget.spent.toFixed(2)} / {currencySymbol}{budget.monthlyLimit.toFixed(2)}
                  {budget.percentage >= 100 && ' ⚠️'}
                </span>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${
                isDark ? 'bg-slate-700' : 'bg-slate-200'
              }`}>
                <div
                  className={`h-full transition-all duration-500 ${getProgressColor(budget.percentage)}`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {budget.percentage.toFixed(0)}% used
                {budget.percentage >= 100 && ' - Budget exceeded!'}
                {budget.percentage >= 80 && budget.percentage < 100 && ' - Approaching limit'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
// 🆕 PHASE 1: Spending Insights Section
// LOCATION: Add this inside your MoneyTracker component




interface SpendingInsightsSectionProps {
  insights: SpendingInsight;
  currencySymbol: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}




const SpendingInsightsSection: React.FC<SpendingInsightsSectionProps> = ({
  insights,
  currencySymbol,
  isDark,
  isGreen,
  isLgbt
}) => {
  const weeklyChange = insights.lastWeek > 0 
    ? ((insights.thisWeek - insights.lastWeek) / insights.lastWeek * 100).toFixed(1)
    : 0;
  
  const monthlyChange = insights.lastMonth > 0 
    ? ((insights.thisMonth - insights.lastMonth) / insights.lastMonth * 100).toFixed(1)
    : 0;




  const isWeeklyUp = Number(weeklyChange) > 0;
  const isMonthlyUp = Number(monthlyChange) > 0;




  return (
    <div className={`p-6 rounded-2xl border-2 ${
      isDark 
        ? (isGreen ? 'bg-slate-800/50 border-green-900/50' : isLgbt ? 'bg-slate-800/50 border-indigo-900/50' : 'bg-slate-800/50 border-pink-900/50')
        : (isGreen ? 'bg-green-50 border-green-200' : isLgbt ? 'bg-gradient-to-br from-red-50 to-blue-50 border-indigo-200' : 'bg-pink-50 border-pink-200')
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isDark 
            ? (isGreen ? 'bg-green-500/20' : isLgbt ? 'bg-gradient-to-br from-red-500/20 to-blue-500/20' : 'bg-pink-500/20')
            : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-br from-red-100 to-blue-100' : 'bg-pink-100')
        }`}>
          <BarChart3 className={`w-6 h-6 ${
            isDark 
              ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
              : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
          }`} />
        </div>
        <div>
          <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Spending Insights
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            How you're doing
          </p>
        </div>
      </div>




      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* This Week */}
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-slate-700/50' : 'bg-white'
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            This Week
          </p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currencySymbol}{insights.thisWeek.toFixed(2)}
          </p>
          <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${
            isWeeklyUp ? 'text-red-500' : 'text-green-500'
          }`}>
            {isWeeklyUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isWeeklyUp ? '+' : ''}{weeklyChange}%</span>
          </div>
        </div>




        {/* This Month */}
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-slate-700/50' : 'bg-white'
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            This Month
          </p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currencySymbol}{insights.thisMonth.toFixed(2)}
          </p>
          <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${
            isMonthlyUp ? 'text-red-500' : 'text-green-500'
          }`}>
            {isMonthlyUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isMonthlyUp ? '+' : ''}{monthlyChange}%</span>
          </div>
        </div>
      </div>




      {/* Top Category */}
      {insights.topCategory !== 'None' && (
        <div className={`p-4 rounded-xl ${
          isDark 
            ? (isGreen ? 'bg-green-500/10 border border-green-500/30' : isLgbt ? 'bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-indigo-500/30' : 'bg-pink-500/10 border border-pink-500/30')
            : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-r from-red-100 to-blue-100' : 'bg-pink-100')
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Top Spending Category
          </p>
          <div className="flex items-center justify-between">
            <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {insights.topCategory}
            </p>
            <p className={`font-bold ${
              isDark 
                ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
            }`}>
              {currencySymbol}{insights.topCategoryAmount.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
// 🆕 PHASE 1: Category Pie Chart Section
// LOCATION: Add this inside your MoneyTracker component
// NOTE: This uses Recharts PieChart which you'll need to import












interface CategoryPieChartProps {
  data: { name: string; value: number }[];
  currencySymbol: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}




const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  currencySymbol,
  isDark,
  isGreen,
  isLgbt
}) => {
  // Color palette for pie slices
  const COLORS = isGreen 
    ? ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#6ee7b7']
    : isLgbt
    ? ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
    : ['#ec4899', '#f43f5e', '#f97316', '#a855f7', '#3b82f6', '#06b6d4'];




  const totalSpending = data.reduce((sum, item) => sum + item.value, 0);




  if (data.length === 0) {
    return (
      <div className={`p-6 rounded-2xl border-2 ${
        isDark 
          ? (isGreen ? 'bg-slate-800/50 border-green-900/50' : isLgbt ? 'bg-slate-800/50 border-indigo-900/50' : 'bg-slate-800/50 border-pink-900/50')
          : (isGreen ? 'bg-green-50 border-green-200' : isLgbt ? 'bg-gradient-to-br from-red-50 to-blue-50 border-indigo-200' : 'bg-pink-50 border-pink-200')
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark 
              ? (isGreen ? 'bg-green-500/20' : isLgbt ? 'bg-gradient-to-br from-red-500/20 to-blue-500/20' : 'bg-pink-500/20')
              : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-br from-red-100 to-blue-100' : 'bg-pink-100')
          }`}>
            <PieChart className={`w-6 h-6 ${
              isDark 
                ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
            }`} />
          </div>
          <div>
            <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Spending Breakdown
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              By category
            </p>
          </div>
        </div>
        <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          No expenses yet. Start tracking to see your breakdown!
        </p>
      </div>
    );
  }




  return (
    <div className={`p-6 rounded-2xl border-2 ${
      isDark 
        ? (isGreen ? 'bg-slate-800/50 border-green-900/50' : isLgbt ? 'bg-slate-800/50 border-indigo-900/50' : 'bg-slate-800/50 border-pink-900/50')
        : (isGreen ? 'bg-green-50 border-green-200' : isLgbt ? 'bg-gradient-to-br from-red-50 to-blue-50 border-indigo-200' : 'bg-pink-50 border-pink-200')
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isDark 
            ? (isGreen ? 'bg-green-500/20' : isLgbt ? 'bg-gradient-to-br from-red-500/20 to-blue-500/20' : 'bg-pink-500/20')
            : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-br from-red-100 to-blue-100' : 'bg-pink-100')
        }`}>
          <PieChart className={`w-6 h-6 ${
            isDark 
              ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
              : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
          }`} />
        </div>
        <div>
          <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Spending Breakdown
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Top {data.length} categories
          </p>
        </div>
      </div>




      <div className="h-80">
  <ResponsiveContainer width="100%" height={300} minHeight={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip 
        formatter={(value: number | undefined) => `${currencySymbol}${(value ?? 0).toFixed(2)}`}
        contentStyle={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          borderRadius: '12px',
          color: isDark ? '#ffffff' : '#000000'
        }}
      />
    </PieChart>
  </ResponsiveContainer>
</div>




      {/* Category List */}
      <div className="mt-4 space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.value / totalSpending) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currencySymbol}{item.value.toFixed(2)}
                </span>
                <span className={`ml-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
// 🆕 PHASE 1: Savings Goals Section
// LOCATION: Add this inside your MoneyTracker component




interface SavingsGoalsSectionProps {
  goals: SavingsGoal[];
  currencySymbol: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
  onAddGoal: () => void;
  onUpdateProgress: (goalId: string, amount: number) => void;
  onDeleteGoal: (goalId: string) => void;
}




const SavingsGoalsSection: React.FC<SavingsGoalsSectionProps> = ({
  goals,
  currencySymbol,
  isDark,
  isGreen,
  isLgbt,
  onAddGoal,
  onUpdateProgress,
  onDeleteGoal
}) => {
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState<string>('');




  const handleAddProgress = (goalId: string) => {
    const amount = parseFloat(addAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdateProgress(goalId, amount);
      setEditingGoal(null);
      setAddAmount('');
    }
  };




  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };




  return (
    <div className={`p-6 rounded-2xl border-2 ${
      isDark 
        ? (isGreen ? 'bg-slate-800/50 border-green-900/50' : isLgbt ? 'bg-slate-800/50 border-indigo-900/50' : 'bg-slate-800/50 border-pink-900/50')
        : (isGreen ? 'bg-green-50 border-green-200' : isLgbt ? 'bg-gradient-to-br from-red-50 to-blue-50 border-indigo-200' : 'bg-pink-50 border-pink-200')
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark 
              ? (isGreen ? 'bg-green-500/20' : isLgbt ? 'bg-gradient-to-br from-red-500/20 to-blue-500/20' : 'bg-pink-500/20')
              : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-br from-red-100 to-blue-100' : 'bg-pink-100')
          }`}>
            <Trophy className={`w-6 h-6 ${
              isDark 
                ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
            }`} />
          </div>
          <div>
            <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Savings Goals
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Track your financial targets
            </p>
          </div>
        </div>
        <button
          onClick={onAddGoal}
          className={`p-2 rounded-xl transition ${
            isDark 
              ? (isGreen ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : isLgbt ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30')
              : (isGreen ? 'bg-green-100 text-green-700 hover:bg-green-200' : isLgbt ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-pink-100 text-pink-700 hover:bg-pink-200')
          }`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>




      {goals.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            No savings goals yet. Start building your future!
          </p>
          <button
            onClick={onAddGoal}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              isDark 
                ? (isGreen ? 'bg-green-500 text-white hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white hover:opacity-90' : 'bg-pink-500 text-white hover:bg-pink-400')
                : (isGreen ? 'bg-green-600 text-white hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:opacity-90' : 'bg-pink-600 text-white hover:bg-pink-700')
            }`}
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            const daysLeft = getDaysRemaining(goal.deadline);
            const isComplete = percentage >= 100;




            return (
              <div 
                key={goal.id}
                className={`p-4 rounded-xl border-2 transition ${
                  isComplete
                    ? isDark 
                      ? (isGreen ? 'bg-green-500/20 border-green-500/50' : isLgbt ? 'bg-gradient-to-r from-red-500/20 to-blue-500/20 border-indigo-500/50' : 'bg-pink-500/20 border-pink-500/50')
                      : (isGreen ? 'bg-green-100 border-green-300' : isLgbt ? 'bg-gradient-to-r from-red-100 to-blue-100 border-indigo-300' : 'bg-pink-100 border-pink-300')
                    : isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {goal.name}
                      </h4>
                      {isComplete && <span className="text-xl">🎉</span>}
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today!' : `${Math.abs(daysLeft)} days overdue`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${goal.name}"?`)) {
                        onDeleteGoal(goal.id);
                      }
                    }}
                    className={`p-2 rounded-lg transition ${
                      isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>




                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Progress
                    </span>
                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {currencySymbol}{goal.currentAmount.toFixed(2)} / {currencySymbol}{goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className={`h-3 rounded-full overflow-hidden ${
                    isDark ? 'bg-slate-600' : 'bg-slate-200'
                  }`}>
                    <div
                      className={`h-full transition-all duration-500 ${
                        isComplete
                          ? isGreen ? 'bg-green-500' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500' : 'bg-pink-500'
                          : isGreen ? 'bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-400 to-blue-400' : 'bg-pink-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {percentage.toFixed(0)}% complete
                  </p>
                </div>




                {!isComplete && (
                  <div className="flex gap-2">
                    {editingGoal === goal.id ? (
                      <>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                          placeholder="Amount"
                          className={`flex-1 px-3 py-2 rounded-lg border-2 outline-none ${
                            isDark 
                              ? 'bg-slate-800 border-slate-600 text-white' 
                              : 'bg-white border-slate-200 text-slate-900'
                          }`}
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddProgress(goal.id)}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            isDark 
                              ? (isGreen ? 'bg-green-500 text-white hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white hover:opacity-90' : 'bg-pink-500 text-white hover:bg-pink-400')
                              : (isGreen ? 'bg-green-600 text-white hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:opacity-90' : 'bg-pink-600 text-white hover:bg-pink-700')
                          }`}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setEditingGoal(null);
                            setAddAmount('');
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            isDark ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingGoal(goal.id)}
                        className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                          isDark 
                            ? (isGreen ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : isLgbt ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30')
                            : (isGreen ? 'bg-green-100 text-green-700 hover:bg-green-200' : isLgbt ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-pink-100 text-pink-700 hover:bg-pink-200')
                        }`}
                      >
                        Add Progress
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};




interface RecurringExpensesSectionProps {
  recurringExpenses: RecurringExpense[];
  currencySymbol: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
  onAddRecurring: () => void;
  onToggleActive: (expenseId: string, isActive: boolean) => void;
  onDeleteRecurring: (expenseId: string) => void;
  onEditRecurring: (expense: RecurringExpense) => void;
}








const RecurringExpensesSection: React.FC<RecurringExpensesSectionProps> = ({
  recurringExpenses,
  currencySymbol,
  isDark,
  isGreen,
  isLgbt,
  onAddRecurring,
  onToggleActive,
  onDeleteRecurring,
  onEditRecurring
}) => {
  // Calculate summary
  const summary: RecurringExpenseSummary = recurringExpenses
    .filter(exp => exp.isActive)
    .reduce((acc, exp) => {
      const monthlyAmount = (() => {
        switch (exp.frequency) {
          case 'daily': return exp.amount * 30;
          case 'weekly': return exp.amount * 4;
          case 'monthly': return exp.amount;
          case 'yearly': return exp.amount / 12;
          default: return 0;
        }
      })();




      return {
        daily: acc.daily + (exp.frequency === 'daily' ? exp.amount : 0),
        weekly: acc.weekly + (exp.frequency === 'weekly' ? exp.amount : 0),
        monthly: acc.monthly + (exp.frequency === 'monthly' ? exp.amount : 0),
        yearly: acc.yearly + (exp.frequency === 'yearly' ? exp.amount : 0),
        total: acc.total + monthlyAmount,
        count: acc.count + 1
      };
    }, { daily: 0, weekly: 0, monthly: 0, yearly: 0, total: 0, count: 0 });




  const getDaysUntilPayment = (nextPaymentDate: string) => {
    const today = new Date();
    const payment = new Date(nextPaymentDate);
    const diffTime = payment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };




  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '📅';
      case 'weekly': return '📆';
      case 'monthly': return '🗓️';
      case 'yearly': return '🎯';
      default: return '💰';
    }
  };




  return (
    <div className={`p-6 rounded-2xl border-2 ${
      isDark 
        ? (isGreen ? 'bg-slate-800/50 border-green-900/50' : isLgbt ? 'bg-slate-800/50 border-indigo-900/50' : 'bg-slate-800/50 border-pink-900/50')
        : (isGreen ? 'bg-green-50 border-green-200' : isLgbt ? 'bg-gradient-to-br from-red-50 to-blue-50 border-indigo-200' : 'bg-pink-50 border-pink-200')
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark 
              ? (isGreen ? 'bg-green-500/20' : isLgbt ? 'bg-gradient-to-br from-red-500/20 to-blue-500/20' : 'bg-pink-500/20')
              : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-br from-red-100 to-blue-100' : 'bg-pink-100')
          }`}>
            <Receipt className={`w-6 h-6 ${
              isDark 
                ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
            }`} />
          </div>
          <div>
            <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Recurring Expenses
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Subscriptions & regular bills
            </p>
          </div>
        </div>
        <button
          onClick={onAddRecurring}
          className={`p-2 rounded-xl transition ${
            isDark 
              ? (isGreen ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : isLgbt ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30')
              : (isGreen ? 'bg-green-100 text-green-700 hover:bg-green-200' : isLgbt ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-pink-100 text-pink-700 hover:bg-pink-200')
          }`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>




      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-white'}`}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Monthly Total
          </div>
          <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currencySymbol}{summary.total.toFixed(2)}
          </div>
          <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            {summary.count} active {summary.count === 1 ? 'subscription' : 'subscriptions'}
          </div>
        </div>




        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-white'}`}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Yearly Cost
          </div>
          <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currencySymbol}{(summary.total * 12).toFixed(2)}
          </div>
          <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            Total annual expense
          </div>
        </div>
      </div>




      {/* Recurring Expenses List */}
      {recurringExpenses.length === 0 ? (
        <div className="text-center py-8">
          <Receipt className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            No recurring expenses yet
          </p>
          <button
            onClick={onAddRecurring}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              isDark 
                ? (isGreen ? 'bg-green-500 text-white hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white hover:opacity-90' : 'bg-pink-500 text-white hover:bg-pink-400')
                : (isGreen ? 'bg-green-600 text-white hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:opacity-90' : 'bg-pink-600 text-white hover:bg-pink-700')
            }`}
          >
            Add Your First Subscription
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recurringExpenses
            .sort((a, b) => getDaysUntilPayment(a.nextPaymentDate) - getDaysUntilPayment(b.nextPaymentDate))
            .map((expense) => {
              const daysUntil = getDaysUntilPayment(expense.nextPaymentDate);
              const isUpcoming = daysUntil <= 7 && daysUntil >= 0;
              const isOverdue = daysUntil < 0;




              return (
                <div
                  key={expense.id}
                  className={`p-4 rounded-xl border-2 transition ${
                    !expense.isActive
                      ? (isDark ? 'bg-slate-800/30 border-slate-700 opacity-50' : 'bg-slate-50 border-slate-200 opacity-50')
                      : isOverdue
                      ? (isDark ? 'bg-red-900/20 border-red-500/50' : 'bg-red-50 border-red-300')
                      : isUpcoming
                      ? (isDark ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-yellow-50 border-yellow-300')
                      : (isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-white border-slate-200')
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {expense.name}
                        </h4>
                        <span className="text-xl">{getFrequencyIcon(expense.frequency)}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {expense.category}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {expense.frequency}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {currencySymbol}{expense.amount.toFixed(2)}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        per {expense.frequency === 'yearly' ? 'year' : expense.frequency === 'monthly' ? 'month' : 'week'}
                      </div>
                    </div>
                  </div>




                  {/* Next Payment Info */}
                  <div className={`p-3 rounded-lg mb-3 ${
                    isOverdue
                      ? (isDark ? 'bg-red-900/30' : 'bg-red-100')
                      : isUpcoming
                      ? (isDark ? 'bg-yellow-900/30' : 'bg-yellow-100')
                      : (isDark ? 'bg-slate-800' : 'bg-slate-100')
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${
                        isOverdue
                          ? 'text-red-500'
                          : isUpcoming
                          ? 'text-yellow-600'
                          : (isDark ? 'text-slate-400' : 'text-slate-600')
                      }`}>
                        {isOverdue ? '⚠️ Overdue' : isUpcoming ? '🔔 Coming Soon' : '📅 Next Payment'}
                      </span>
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {new Date(expense.nextPaymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {!isOverdue && ` (${daysUntil} ${daysUntil === 1 ? 'day' : 'days'})`}
                      </span>
                    </div>
                  </div>




                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onToggleActive(expense.id, !expense.isActive)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition ${
                        expense.isActive
                          ? (isDark ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700')
                          : (isDark 
                              ? (isGreen ? 'bg-green-500 hover:bg-green-400 text-white' : isLgbt ? 'bg-indigo-500 hover:bg-indigo-400 text-white' : 'bg-pink-500 hover:bg-pink-400 text-white')
                              : (isGreen ? 'bg-green-600 hover:bg-green-700 text-white' : isLgbt ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-pink-600 hover:bg-pink-700 text-white')
                            )
                      }`}
                    >
                      {expense.isActive ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => onEditRecurring(expense)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                        isDark ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${expense.name}"?`)) {
                          onDeleteRecurring(expense.id);
                        }
                      }}
                      className={`p-2 rounded-lg transition ${
                        isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'
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
  );
};




// ✅ DEBT TRACKER COMPONENT
interface DebtTrackerProps {
  debts: Debt[];
  currencySymbol: string;
  onAddDebt: () => void;
  onDeleteDebt: (debtId: string) => void;
  onMakePayment: (debtId: string, amount: number) => void;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}




const DebtTracker: React.FC<DebtTrackerProps> = ({
  debts,
  currencySymbol,
  onAddDebt,
  onDeleteDebt,
  onMakePayment,
  isDark,
  isGreen,
  isLgbt
}) => {
  const [paymentDebtId, setPaymentDebtId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');




  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const avgInterestRate = debts.length > 0 
    ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length 
    : 0;




  const getDebtTypeIcon = (type: string) => {
    switch (type) {
      case 'credit_card': return '💳';
      case 'student_loan': return '🎓';
      case 'mortgage': return '🏠';
      case 'personal_loan': return '💰';
      default: return '📄';
    }
  };




  const getDebtTypeLabel = (type: string) => {
    switch (type) {
      case 'credit_card': return 'Credit Card';
      case 'student_loan': return 'Student Loan';
      case 'mortgage': return 'Mortgage';
      case 'personal_loan': return 'Personal Loan';
      default: return 'Other';
    }
  };




  const handlePayment = (debtId: string) => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }
    
    onMakePayment(debtId, amount);
    setPaymentDebtId(null);
    setPaymentAmount('');
  };




  return (
    <div className={`p-6 rounded-2xl border-2 ${
      isDark 
        ? (isGreen ? 'bg-slate-800/50 border-green-900/50' : isLgbt ? 'bg-slate-800/50 border-indigo-900/50' : 'bg-slate-800/50 border-pink-900/50')
        : (isGreen ? 'bg-green-50 border-green-200' : isLgbt ? 'bg-gradient-to-br from-red-50 to-blue-50 border-indigo-200' : 'bg-pink-50 border-pink-200')
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark 
              ? (isGreen ? 'bg-green-500/20' : isLgbt ? 'bg-gradient-to-br from-red-500/20 to-blue-500/20' : 'bg-pink-500/20')
              : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-br from-red-100 to-blue-100' : 'bg-pink-100')
          }`}>
            <Wallet className={`w-6 h-6 ${
              isDark 
                ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
            }`} />
          </div>
          <div>
            <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Debt Tracker
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Manage and pay off your debts
            </p>
          </div>
        </div>
        <button
          onClick={onAddDebt}
          className={`p-2 rounded-xl transition ${
            isDark 
              ? (isGreen ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : isLgbt ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30')
              : (isGreen ? 'bg-green-100 text-green-700 hover:bg-green-200' : isLgbt ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-pink-100 text-pink-700 hover:bg-pink-200')
          }`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>




      {/* Summary Cards */}
      {debts.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-white'}`}>
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Debt
            </div>
            <div className={`text-2xl font-black ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              {currencySymbol}{totalDebt.toFixed(2)}
            </div>
          </div>




          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-white'}`}>
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Min. Payment
            </div>
            <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currencySymbol}{totalMinPayment.toFixed(2)}
            </div>
          </div>




          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-white'}`}>
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Avg. APR
            </div>
            <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {avgInterestRate.toFixed(1)}%
            </div>
          </div>
        </div>
      )}




      {/* Debt List */}
      {debts.length === 0 ? (
        <div className="text-center py-8">
          <Wallet className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            No debts tracked yet
          </p>
          <button
            onClick={onAddDebt}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              isDark 
                ? (isGreen ? 'bg-green-500 text-white hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white hover:opacity-90' : 'bg-pink-500 text-white hover:bg-pink-400')
                : (isGreen ? 'bg-green-600 text-white hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:opacity-90' : 'bg-pink-600 text-white hover:bg-pink-700')
            }`}
          >
            Add Your First Debt
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {debts
            .sort((a, b) => b.interestRate - a.interestRate)
            .map((debt) => (
              <div
                key={debt.id}
                className={`p-4 rounded-xl border-2 transition ${
                  isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{getDebtTypeIcon(debt.type)}</span>
                      <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {debt.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {getDebtTypeLabel(debt.type)}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                      }`}>
                        {debt.interestRate}% APR
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-black ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      {currencySymbol}{debt.balance.toFixed(2)}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      Min: {currencySymbol}{debt.minimumPayment.toFixed(2)}
                    </div>
                  </div>
                </div>




                {/* Payment Section */}
                {paymentDebtId === debt.id ? (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Payment amount"
                      className={`flex-1 px-3 py-2 rounded-lg border-2 outline-none ${
                        isDark 
                          ? 'bg-slate-800 border-slate-600 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                      autoFocus
                    />
                    <button
                      onClick={() => handlePayment(debt.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        isDark 
                          ? (isGreen ? 'bg-green-500 text-white hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white hover:opacity-90' : 'bg-pink-500 text-white hover:bg-pink-400')
                          : (isGreen ? 'bg-green-600 text-white hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:opacity-90' : 'bg-pink-600 text-white hover:bg-pink-700')
                      }`}
                    >
                      Pay
                    </button>
                    <button
                      onClick={() => {
                        setPaymentDebtId(null);
                        setPaymentAmount('');
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        isDark ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setPaymentDebtId(debt.id)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition ${
                        isDark 
                          ? (isGreen ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : isLgbt ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30')
                          : (isGreen ? 'bg-green-100 text-green-700 hover:bg-green-200' : isLgbt ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-pink-100 text-pink-700 hover:bg-pink-200')
                      }`}
                    >
                      Make Payment
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${debt.name}"?`)) {
                          onDeleteDebt(debt.id);
                        }
                      }}
                      className={`p-2 rounded-lg transition ${
                        isDark ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-100 text-red-600'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}




                {/* Due Date Info */}
                <div className={`mt-3 p-2 rounded-lg text-xs font-medium ${
                  isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}>
                  📅 Due on day {debt.dueDay} of each month
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
// 🆕 PHASE 1: Add Savings Goal Modal
// LOCATION: Add this modal component near your other modals (around line 4500-4600)




interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, targetAmount: number, deadline: string) => void;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
  currencySymbol: string;
}




const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isDark,
  isGreen,
  isLgbt,
  currencySymbol
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');




  if (!isOpen) return null;




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (name && !isNaN(amount) && amount > 0 && deadline) {
      onSubmit(name, amount, deadline);
      setName('');
      setTargetAmount('');
      setDeadline('');
    }
  };




  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl p-6 ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Create Savings Goal 🎯
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          </button>
        </div>




        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Goal Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Emergency Fund, New Phone"
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                isDark 
                  ? (isGreen ? 'bg-slate-700 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-700 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-700 border-pink-900/50 text-white focus:border-pink-400')
                  : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
              }`}
              required
            />
          </div>




          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Target Amount ({currencySymbol})
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="1000.00"
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                isDark 
                  ? (isGreen ? 'bg-slate-700 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-700 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-700 border-pink-900/50 text-white focus:border-pink-400')
                  : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
              }`}
              required
            />
          </div>




          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Target Date
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                isDark 
                  ? (isGreen ? 'bg-slate-700 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-700 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-700 border-pink-900/50 text-white focus:border-pink-400')
                  : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
              }`}
              required
            />
          </div>




          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-xl font-bold transition ${
                isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition ${
                isDark 
                  ? (isGreen ? 'bg-green-500 hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400')
                  : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
              }`}
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};




// 🆕 PHASE 1: Edit Budget Limits Modal
// LOCATION: Add this modal component near your other modals




interface EditBudgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryBudgets: Record<string, number>;
  onUpdateBudget: (category: string, limit: number) => void;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
  currencySymbol: string;
  setCategoryBudgets: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}




const EditBudgetsModal: React.FC<EditBudgetsModalProps> = ({
  isOpen,
  onClose,
  categoryBudgets,
  onUpdateBudget,
  isDark,
  isGreen,
  isLgbt,
  currencySymbol,
  setCategoryBudgets
}) => {
  const [tempBudgets, setTempBudgets] = useState<Record<string, string>>({});
  const { theme } = useTheme();




  useEffect(() => {
  if (isOpen) {
    const budgetStrings: Record<string, string> = {};
    EXPENSE_CATEGORIES.forEach(category => {
      budgetStrings[category.label] = (categoryBudgets[category.label] || 0).toString();
    });
    setTempBudgets(budgetStrings);
  }
}, [isOpen, categoryBudgets]);




  if (!isOpen) return null;




  const handleSave = () => {
    Object.entries(tempBudgets).forEach(([category, value]) => {
      const limit = parseFloat(value) || 0;
      if (limit !== categoryBudgets[category]) {
        onUpdateBudget(category, limit);
      }
    });
    onClose();
  };




  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-2xl p-6 my-8 ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Edit Budget Limits 💰
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Set monthly spending limits for each category
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          </button>
        </div>




        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-96 overflow-y-auto pr-2">
  {EXPENSE_CATEGORIES.map(category => (
    <div key={category.id} className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <category.icon className="w-4 h-4" style={{ color: category.color }} />
        <span>{category.label}</span>
      </label>
      <input
        type="number"
        placeholder="Enter monthly budget"
        value={categoryBudgets[category.label] || ''}
        onChange={(e) => {
          const value = parseFloat(e.target.value) || 0;
          setCategoryBudgets({
            ...categoryBudgets,
            [category.label]: value
          });
        }}
      className={`w-full px-3 py-2 rounded-lg border ${
        isDark
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-300 text-gray-900'
      }`}
    />
  </div>
))}
        </div>




        <div className={`p-4 rounded-xl mb-6 ${
          isDark 
            ? (isGreen ? 'bg-green-500/10 border border-green-500/30' : isLgbt ? 'bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-indigo-500/30' : 'bg-pink-500/10 border border-pink-500/30')
            : (isGreen ? 'bg-green-50 border border-green-200' : isLgbt ? 'bg-gradient-to-r from-red-50 to-blue-50 border border-indigo-200' : 'bg-pink-50 border border-pink-200')
        }`}>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            💡 <strong>Tip:</strong> Set realistic monthly limits for each category. You'll get alerts when you reach 80% of your budget.
          </p>
        </div>




        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 px-4 py-3 rounded-xl font-bold transition ${
              isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition ${
              isDark 
                ? (isGreen ? 'bg-green-500 hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400')
                : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
            }`}
          >
            Save Budgets
          </button>
        </div>
      </div>
    </div>
  );
};




// 🆕 PHASE 2: ADD/EDIT RECURRING EXPENSE MODAL
interface RecurringExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<RecurringExpense, 'id' | 'createdAt'>) => void;
  editingExpense?: RecurringExpense | null;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
  currencySymbol: string;
}




const RecurringExpenseModal: React.FC<RecurringExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingExpense,
  isDark,
  isGreen,
  isLgbt,
  currencySymbol
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('bills');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(3);
  const [notes, setNotes] = useState('');




  useEffect(() => {
    if (editingExpense) {
      setName(editingExpense.name);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setFrequency(editingExpense.frequency);
      setStartDate(editingExpense.startDate);
      setEndDate(editingExpense.endDate || '');
      setReminderEnabled(editingExpense.reminderEnabled);
      setReminderDaysBefore(editingExpense.reminderDaysBefore);
      setNotes(editingExpense.notes || '');
    } else {
      setName('');
      setAmount('');
      setCategory('bills');
      setFrequency('monthly');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setReminderEnabled(true);
      setReminderDaysBefore(3);
      setNotes('');
    }
  }, [editingExpense, isOpen]);




  if (!isOpen) return null;




  const calculateNextPaymentDate = (start: string, freq: string): string => {
    const startDateObj = new Date(start);
    const today = new Date();
    
    if (startDateObj > today) {
      return start;
    }




    let nextPayment = new Date(startDateObj);
    
    while (nextPayment < today) {
      switch (freq) {
        case 'daily':
          nextPayment.setDate(nextPayment.getDate() + 1);
          break;
        case 'weekly':
          nextPayment.setDate(nextPayment.getDate() + 7);
          break;
        case 'monthly':
          nextPayment.setMonth(nextPayment.getMonth() + 1);
          break;
        case 'yearly':
          nextPayment.setFullYear(nextPayment.getFullYear() + 1);
          break;
      }
    }
    
    return nextPayment.toISOString().split('T')[0];
  };




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    
    if (!name || isNaN(parsedAmount) || parsedAmount <= 0 || !startDate) {
      alert('Please fill in all required fields');
      return;
    }




    const nextPaymentDate = calculateNextPaymentDate(startDate, frequency);




    onSubmit({
      name: name.trim(),
      amount: parsedAmount,
      category,
      frequency,
      startDate,
      endDate: endDate || undefined,
      nextPaymentDate,
      reminderEnabled,
      reminderDaysBefore,
      isActive: true,
      notes: notes.trim() || undefined
    });




    onClose();
  };




  const popularSubscriptions = [
    { name: 'Netflix', amount: 15.99, category: 'entertainment' },
    { name: 'Spotify', amount: 9.99, category: 'entertainment' },
    { name: 'Amazon Prime', amount: 14.99, category: 'shopping' },
    { name: 'Disney+', amount: 7.99, category: 'entertainment' },
    { name: 'YouTube Premium', amount: 11.99, category: 'entertainment' },
    { name: 'Gym Membership', amount: 50.00, category: 'health' },
  ];




  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-2xl p-6 my-8 ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {editingExpense ? 'Edit' : 'Add'} Recurring Expense
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Track subscriptions and regular bills
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          </button>
        </div>




        {!editingExpense && (
          <div className="mb-6">
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Quick Add (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {popularSubscriptions.map((sub) => (
                <button
                  key={sub.name}
                  type="button"
                  onClick={() => {
                    setName(sub.name);
                    setAmount(sub.amount.toString());
                    setCategory(sub.category);
                  }}
                  className={`p-3 rounded-lg text-left transition ${
                    isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {sub.name}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {currencySymbol}{sub.amount}/mo
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}




        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Netflix, Gym Membership"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark 
                    ? (isGreen ? 'bg-slate-700 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-700 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-700 border-pink-900/50 text-white focus:border-pink-400')
                    : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
                }`}
                required
              />
            </div>




            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Amount ({currencySymbol}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="15.99"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark 
                    ? (isGreen ? 'bg-slate-700 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-700 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-700 border-pink-900/50 text-white focus:border-pink-400')
                    : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
                }`}
                required
              />
            </div>




            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Frequency *
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>




            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>




            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>




            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>




            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="reminder" className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Enable Payment Reminders
                </label>
              </div>
              {reminderEnabled && (
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Remind me (days before payment)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={reminderDaysBefore}
                    onChange={(e) => setReminderDaysBefore(parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                      isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              )}
            </div>




            <div className="md:col-span-2">
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional details..."
                rows={2}
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition resize-none ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>




          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-xl font-bold transition ${
                isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition ${
                isDark 
                  ? (isGreen ? 'bg-green-500 hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400')
                  : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
              }`}
            >
              {editingExpense ? 'Update' : 'Add'} Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// ✅ ADD DEBT MODAL COMPONENT
interface AddDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    balance: number;
    interestRate: number;
    minimumPayment: number;
    type: 'credit_card' | 'student_loan' | 'mortgage' | 'personal_loan' | 'other';
    dueDay: number;
  }) => void;
  currencySymbol: string;
}




const AddDebtModal: React.FC<AddDebtModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  currencySymbol
}) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [type, setType] = useState<'credit_card' | 'student_loan' | 'mortgage' | 'personal_loan' | 'other'>('credit_card');
  const [dueDay, setDueDay] = useState('1');
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';




  if (!isOpen) return null;




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const balanceNum = parseFloat(balance);
    const interestNum = parseFloat(interestRate);
    const minPaymentNum = parseFloat(minimumPayment);
    const dueDayNum = parseInt(dueDay);
    
    if (isNaN(balanceNum) || isNaN(interestNum) || isNaN(minPaymentNum) || isNaN(dueDayNum)) {
      alert('Please fill in all fields with valid numbers');
      return;
    }
    
    if (dueDayNum < 1 || dueDayNum > 31) {
      alert('Due day must be between 1 and 31');
      return;
    }
    
    onAdd({
      name: name.trim(),
      balance: balanceNum,
      interestRate: interestNum,
      minimumPayment: minPaymentNum,
      type,
      dueDay: dueDayNum
    });
    
    // Reset form
    setName('');
    setBalance('');
    setInterestRate('');
    setMinimumPayment('');
    setType('credit_card');
    setDueDay('1');
    onClose();
  };




  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl p-6 ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Add Debt 💳
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          </button>
        </div>




        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Debt Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Credit Card, Student Loan"
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
              required
            />
          </div>




          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Balance ({currencySymbol}) *
              </label>
              <input
                type="number"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="5000.00"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>




            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Interest Rate (%) *
              </label>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="18.99"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>
          </div>




          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Min. Payment ({currencySymbol}) *
              </label>
              <input
                type="number"
                step="0.01"
                value={minimumPayment}
                onChange={(e) => setMinimumPayment(e.target.value)}
                placeholder="150.00"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>




            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Due Day *
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                placeholder="15"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>
          </div>




          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Debt Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="credit_card">Credit Card</option>
              <option value="student_loan">Student Loan</option>
              <option value="mortgage">Mortgage</option>
              <option value="personal_loan">Personal Loan</option>
              <option value="other">Other</option>
            </select>
          </div>




          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-xl font-bold transition ${
                isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition ${
                isDark 
                  ? (isGreen ? 'bg-green-500 hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400')
                  : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
              }`}
            >
              Add Debt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};




// Dashboard Component
const Dashboard = ({ user, onLogout }: { user: FirebaseUser, onLogout: () => void }) => {
  // ✅ ZUSTAND STATE MANAGEMENT
  const { ui, updateUI } = useAppStore();
  const [habits, setHabits] = useState<Habit[]>([]);
 const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>(DEFAULT_CATEGORY_BUDGETS)
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    return !hasVisited;
});
const [showOnboarding, setShowOnboarding] = useState(() => {
  const completed = localStorage.getItem('onboardingCompleted');
  return !completed;
});
const [onboardingStep, setOnboardingStep] = useState(0);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState(HABIT_ICONS[0].name); // Added state for icon
  const isAdding = ui.isAdding;
  const setIsAdding = (adding: boolean) => updateUI({ isAdding: adding });
  const showTemplates = ui.showTemplates;
  const setShowTemplates = (show: boolean) => updateUI({ showTemplates: show }); 
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editIcon, setEditIcon] = useState(''); // ← ADD THIS
  const loading = ui.loading;
  const setLoading = (isLoading: boolean) => updateUI({ loading: isLoading });
  const [deletingExpense, setDeletingExpense] = useState<string | null>(null);
const [deletingHabit, setDeletingHabit] = useState<string | null>(null);
const [addingExpense, setAddingExpense] = useState(false);
const [showExportMenu, setShowExportMenu] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);
const [addingHabit, setAddingHabit] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const showStats = ui.showStats;
  const setShowStats = (show: boolean) => updateUI({ showStats: show });
  const showAchievements = ui.showAchievements;
  const setShowAchievements = (show: boolean) => updateUI({ showAchievements: show });
  const [reminderHabit, setReminderHabit] = useState<Habit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // Map Zustand state to existing variable names (no breaking changes!)
  const currentPage = ui.currentPage;
  const setCurrentPage = (page: 'habits' | 'todos' | 'money') => updateUI({ currentPage: page });
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  // Money Tracking State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  // 🆕 NEW STATE FOR PHASE 1 FEATURES
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  // 🆕 PHASE 2: Recurring Expenses State
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const showRecurringModal = ui.showRecurringModal;
  const setShowRecurringModal = (show: boolean) => updateUI({ showRecurringModal: show });
  const [editingRecurring, setEditingRecurring] = useState<RecurringExpense | null>(null);
  const showBudgetModal = ui.showBudgetModal;
  const setShowBudgetModal = (show: boolean) => updateUI({ showBudgetModal: show });
  const showGoalsModal = ui.showGoalsModal;
  const setShowGoalsModal = (show: boolean) => updateUI({ showGoalsModal: show });
  
  const [dailyAllowance, setDailyAllowance] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0); // 💰 PHASE 3: Track income
  const [currency, setCurrency] = useState<string>('USD');  // ADD THIS
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');  // ADD THIS
  const showAllowanceModal = ui.showAllowanceModal;
  const setShowAllowanceModal = (show: boolean) => updateUI({ showAllowanceModal: show });
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('food');
  const [newExpenseDescription, setNewExpenseDescription] = useState('');
  const [newExpenseDate, setNewExpenseDate] = useState(getTodayString());
  const [newExpenseImage, setNewExpenseImage] = useState<File | null>(null); // 📸 PHASE 3
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 📸 PHASE 3
  const moneyView = ui.moneyView;
  const setMoneyView = (view: 'overview' | 'monthly' | 'yearly') => updateUI({ moneyView: view });
  const selectedMonth = ui.selectedMonth;
  const setSelectedMonth = (month: number) => updateUI({ selectedMonth: month });
   const selectedYear = ui.selectedYear;
  const setSelectedYear = (year: number) => updateUI({ selectedYear: year });
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [incomes, setIncomes] = useState<Income[]>([]); // 💰 PHASE 3
  const showIncomeModal = ui.showIncomeModal;
  const setShowIncomeModal = (show: boolean) => updateUI({ showIncomeModal: show });
  const showDebtModal = ui.showDebtModal;
  const setShowDebtModal = (show: boolean) => updateUI({ showDebtModal: show });
  const showInvestmentModal = ui.showInvestmentModal;
  const setShowInvestmentModal = (show: boolean) => updateUI({ showInvestmentModal: show });
  // 🆕 PHASE 1: Savings Goals Handlers
  const handleAddGoal = async (name: string, targetAmount: number, deadline: string) => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, `users/${user.uid}/savingsGoals`), {
        name,
        targetAmount,
        currentAmount: 0,
        deadline,
        createdAt: serverTimestamp()
      });
      setShowGoalsModal(false);
      setToast({ 
        id: Date.now().toString(), 
        message: `Goal "${name}" created!`, 
        type: 'success' 
      });
    } catch (error) {
      console.error("Error creating goal:", error);
      setToast({ 
        id: Date.now().toString(), 
        message: 'Failed to create goal.', 
        type: 'error' 
      });
    }
  };




  const handleUpdateProgress = async (goalId: string, amount: number) => {
    if (!user) return;
    
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!goal) return;
    
    try {
      const newAmount = goal.currentAmount + amount;
      await updateDoc(doc(db, `users/${user.uid}/savingsGoals/${goalId}`), {
        currentAmount: newAmount
      });
      
      // Check if goal completed
      if (newAmount >= goal.targetAmount) {
        setToast({ 
          id: Date.now().toString(), 
          message: `🎉 Goal "${goal.name}" completed!`, 
          type: 'success' 
        });
      } else {
        setToast({ 
          id: Date.now().toString(), 
          message: `${currencySymbol}${amount} added to "${goal.name}"`, 
          type: 'success' 
        });
      }
    } catch (error) {
      console.error("Error updating goal:", error);
      setToast({ 
        id: Date.now().toString(), 
        message: 'Failed to update goal.', 
        type: 'error' 
      });
    }
  };




  const handleDeleteGoal = async (goalId: string) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, `users/${user.uid}/savingsGoals/${goalId}`));
      setToast({ 
        id: Date.now().toString(), 
        message: 'Goal deleted', 
        type: 'success' 
      });
    } catch (error) {
      console.error("Error deleting goal:", error);
      setToast({ 
        id: Date.now().toString(), 
        message: 'Failed to delete goal.', 
        type: 'error' 
      });
    }
  };




  const handleUpdateBudget = async (category: string, limit: number) => {
  if (!user) return;
  
  try {
    const updatedBudgets = { ...categoryBudgets, [category]: limit };
    setCategoryBudgets(updatedBudgets);
    
    // ✅ FIX: Wrap budgets in 'categories' object
    await setDoc(doc(db, `users/${user.uid}/settings/budgets`), {
      categories: updatedBudgets,  // ← ADD THIS LINE
      updatedAt: serverTimestamp()
    });
    
    setToast({ 
      id: Date.now().toString(), 
      message: 'Budget updated!', 
      type: 'success' 
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    setToast({ 
      id: Date.now().toString(), 
      message: 'Failed to update budget.', 
      type: 'error' 
    });
  }
};
  
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
     
     // 🆕 PHASE 1: Load savings goals from Firebase
useEffect(() => {
  if (!user) return;
  
  const goalsQuery = query(
    collection(db, `users/${user.uid}/savingsGoals`),
    orderBy('createdAt', 'desc')
  );
  
  const unsubscribe = onSnapshot(goalsQuery, (snapshot) => {
    const goalsData: SavingsGoal[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SavingsGoal));
    setSavingsGoals(goalsData);
  });
  
  return () => unsubscribe();
}, [user]);




// 🆕 PHASE 1: Load category budgets from Firebase
useEffect(() => {
  if (!user) return;
  
  const loadBudgets = async () => {
    const budgetRef = doc(db, `users/${user.uid}/settings/budgets`);
    const budgetSnap = await getDoc(budgetRef);
    
   if (budgetSnap.exists()) {
  const data = budgetSnap.data();
  setCategoryBudgets(data.categories || data); // Handle both formats
}
  };
  
  loadBudgets();
}, [user]);
// 🆕 PHASE 2: Load recurring expenses
useEffect(() => {
  if (!user) return;
  
  const recurringQuery = query(
    collection(db, `users/${user.uid}/recurringExpenses`),
    orderBy('nextPaymentDate', 'asc')
  );
  
  const unsubscribe = onSnapshot(recurringQuery, (snapshot) => {
    const recurringData: RecurringExpense[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as RecurringExpense));
    setRecurringExpenses(recurringData);
  });
  
  return () => unsubscribe();
}, [user]);




// ✅ Load Debts
useEffect(() => {
  if (!user) return;
  
  const debtsQuery = query(
    collection(db, `users/${user.uid}/debts`),
    orderBy('interestRate', 'desc') // Highest interest first
  );
  
  const unsubscribe = onSnapshot(debtsQuery, (snapshot) => {
    const debtsData: Debt[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Debt));
    setDebts(debtsData);
  });
  
  return () => unsubscribe();
}, [user]);








useEffect(() => {
  if (!user) return;
  
  const expensesQuery = query(
    collection(db, `users/${user.uid}/expenses`),
    orderBy('createdAt', 'desc')
  );
  
  const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
    const expenseData: Expense[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Expense));
    setExpenses(expenseData);
  });
  
  return () => unsubscribe();
}, [user]);
  
  // Load savings goals
  useEffect(() => {
    if (!user) return;
    
    const goalsQuery = query(
      collection(db, `users/${user.uid}/savingsGoals`),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(goalsQuery, (snapshot) => {
      const goalsData: SavingsGoal[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SavingsGoal));
      setSavingsGoals(goalsData);
    });
    
    return () => unsubscribe();
  }, [user]);




  // Load category budgets
  useEffect(() => {
    if (!user) return;
    
    const loadBudgets = async () => {
      const budgetRef = doc(db, `users/${user.uid}/settings/budgets`);
      const budgetSnap = await getDoc(budgetRef);
      
      if (budgetSnap.exists()) {
        setCategoryBudgets(budgetSnap.data() as Record<string, number>);
      }
    };
    
    loadBudgets();
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
// Line 3010
  }, [habits]);
  
  // ⬇️ ADD THIS NEW CODE HERE ⬇️
  // Hide welcome message after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);
  // ⬆️ END OF NEW CODE ⬆️
  
  // Line 3011
  useEffect(() => {
    if (!user || !user.uid) {
    if (!user || !user.uid) {
      setTodos([]);
      return;
    }
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




  // Load Money Settings - FIXED VERSION
 useEffect(() => {
  if (!user || !user.uid) return;




  const settingsRef = doc(db, 'users', user.uid, 'money', 'settings');
  
  // First, load immediately to prevent flash
  getDoc(settingsRef).then((docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('💰 Initial currency load:', data);
      setDailyAllowance(data.dailyAllowance || 0);
      setCurrency(data.currency || 'USD');
      setCurrencySymbol(data.currencySymbol || '$');
    } else {
      // Only show modal if no settings exist
      setShowAllowanceModal(true);
    }
  }).catch((error) => {
    // ✅ IMPROVED ERROR HANDLING
    if (error.code === 'unavailable' || error.message?.includes('offline')) {
      console.log('💤 Offline mode - settings will load when connection is restored');
      return;
    }
    console.error("Error loading money settings:", error);
    setShowAllowanceModal(true);
  });




  // Then, listen for real-time updates
  const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('💱 Currency updated:', data);
      setDailyAllowance(data.dailyAllowance || 0);
      setCurrency(data.currency || 'USD');
      setCurrencySymbol(data.currencySymbol || '$');
    }
  }, (error) => {
    // ✅ IMPROVED ERROR HANDLING FOR SNAPSHOT
    if (error.code === 'unavailable' || error.message?.includes('offline')) {
      console.log('💤 Offline mode - will reconnect automatically');
      return;
    }
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


  // Close export menu when clicking outside
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (showExportMenu && !(e.target as Element).closest('.relative')) {
      setShowExportMenu(false);
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [showExportMenu]);
  // Trigger celebration logic
  useEffect(() => {
    if (progress === 100 && totalHabits > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [progress, totalHabits]);
  // 🆕 PHASE 1: Calculate spending insights
const calculateSpendingInsights = useCallback((): SpendingInsight => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);




  const thisWeek = expenses
    .filter(e => new Date(e.date) >= startOfWeek)
    .reduce((sum, e) => sum + e.amount, 0);




  const lastWeek = expenses
    .filter(e => {
      const d = new Date(e.date);
      return d >= startOfLastWeek && d < startOfWeek;
    })
    .reduce((sum, e) => sum + e.amount, 0);




  const thisMonth = expenses
    .filter(e => new Date(e.date) >= startOfMonth)
    .reduce((sum, e) => sum + e.amount, 0);




  const lastMonth = expenses
    .filter(e => {
      const d = new Date(e.date);
      return d >= startOfLastMonth && d <= endOfLastMonth;
    })
    .reduce((sum, e) => sum + e.amount, 0);
    // 💰 PHASE 3: Load Income
useEffect(() => {
  if (!user) return;
  
  const incomeQuery = query(
    collection(db, `users/${user.uid}/incomes`),
    orderBy('createdAt', 'desc')
  );
  
  const unsubscribe = onSnapshot(incomeQuery, (snapshot) => {
    const incomeData: Income[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Income));
    setIncomes(incomeData);
  });
  
  return () => unsubscribe();
}, [user]);




  // Find top spending category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];




  return {
    thisWeek,
    lastWeek,
    thisMonth,
    lastMonth,
    topCategory: topCategory?.[0] || 'None',
    topCategoryAmount: topCategory?.[1] || 0
  };
}, [expenses]);
const categorySpending = expenses.reduce((acc, expense) => {
  acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
  return acc;
}, {} as Record<string, number>);
// 🎯 FINANCIAL HEALTH SCORE CALCULATOR
const calculateFinancialHealth = useCallback((): FinancialHealthScore => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  
  const monthlyExpenses = expenses.filter(e => new Date(e.date) >= startOfMonth);
  const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyBudget = dailyAllowance * daysInMonth;
  
  // Factor 1: Savings Rate (30% weight)
  const savingsAmount = monthlyBudget - totalSpent;
  const savingsRate = monthlyBudget > 0 ? (savingsAmount / monthlyBudget) * 100 : 0;
  const savingsScore = Math.min(Math.max(savingsRate * 5, 0), 100); // 20% = 100 points
  
  // Factor 2: Budget Adherence (30% weight)
  const budgetAdherence = monthlyBudget > 0 ? Math.min((monthlyBudget / Math.max(totalSpent, 1)) * 100, 100) : 100;
  const adherenceScore = budgetAdherence;
  
  // Factor 3: Spending Control - days under budget (20% weight)
  const daysElapsed = now.getDate();
  const dailySpending = Array.from({ length: daysElapsed }, (_, i) => {
    const day = i + 1;
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayExpenses = monthlyExpenses.filter(e => e.date === dateStr);
    const spent = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    return spent <= dailyAllowance ? 1 : 0;
  });
  const daysUnderBudget = dailySpending.reduce((sum: number, val) => sum + val, 0);
  const controlScore = daysElapsed > 0 ? (daysUnderBudget / daysElapsed) * 100 : 100;
  
  // Factor 4: Consistency - tracking regularity (20% weight)
  const hasRecentExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return expenseDate >= threeDaysAgo;
  }).length > 0;
  const consistencyScore = hasRecentExpenses ? 100 : 50;
  
  // Calculate overall score
  const overallScore = Math.round(
    (savingsScore * 0.3) + 
    (adherenceScore * 0.3) + 
    (controlScore * 0.2) + 
    (consistencyScore * 0.2)
  );
  
  // Determine grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (overallScore >= 90) grade = 'A';
  else if (overallScore >= 80) grade = 'B';
  else if (overallScore >= 70) grade = 'C';
  else if (overallScore >= 60) grade = 'D';
  else grade = 'F';
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (savingsScore < 60) recommendations.push("💡 Try to save at least 20% of your income");
  if (adherenceScore < 70) recommendations.push("📊 Review your budget - you're overspending");
  if (controlScore < 60) recommendations.push("🎯 Focus on staying under your daily limit");
  if (consistencyScore < 80) recommendations.push("📱 Track expenses daily for better insights");
  if (recommendations.length === 0) recommendations.push("🌟 Great job! Keep up the excellent financial habits");
  
  // Determine trend (compare to last month if data exists)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastMonthExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    return date >= lastMonthStart && date <= lastMonthEnd;
  });
  const lastMonthSpent = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const trend = totalSpent < lastMonthSpent ? 'improving' : totalSpent > lastMonthSpent ? 'declining' : 'stable';
  
  return {
    score: overallScore,
    grade,
    factors: {
      savingsRate: { score: Math.round(savingsScore), value: savingsRate },
      budgetAdherence: { score: Math.round(adherenceScore), value: budgetAdherence },
      spendingControl: { score: Math.round(controlScore), value: (daysUnderBudget / Math.max(daysElapsed, 1)) * 100 },
      consistency: { score: Math.round(consistencyScore), value: consistencyScore }
    },
    recommendations,
    trend
  };
}, [expenses, dailyAllowance]);
// 🏆 ACHIEVEMENT CALCULATOR
const calculateAchievements = useCallback((): Achievement[] => {
  const totalHabits = habits.length;
  const bestStreak = Math.max(...habits.map(h => h.streak), 0);
  const totalCompletions = habits.reduce((sum, h) => h.completedDates.length + sum, 0);
  
  // Check perfect week
  const last7Days = getLast7Days();
  const perfectWeekDays = last7Days.filter(day => {
    const completed = habits.filter(h => h.completedDates.includes(day.date)).length;
    return completed === totalHabits && totalHabits > 0;
  }).length;
  
  // Check budget adherence
  const last7DaysExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return expenseDate >= sevenDaysAgo;
  });
  
  const daysUnderBudget = getLast7Days().filter(day => {
    const dayExpenses = expenses.filter(e => e.date === day.date);
    const spent = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    return spent <= dailyAllowance;
  }).length;
  
  const hasBudget = dailyAllowance > 0;
  
  return ACHIEVEMENT_DEFINITIONS.map(def => {
    let progress = 0;
    
    switch (def.id) {
      case 'first-habit':
      case 'habit-master':
        progress = totalHabits;
        break;
      case 'week-warrior':
      case 'month-master':
      case 'century-club':
        progress = bestStreak;
        break;
      case 'first-budget':
        progress = hasBudget ? 1 : 0;
        break;
      case 'money-saver':
      case 'budget-boss':
        progress = daysUnderBudget;
        break;
      case 'hundred-completions':
        progress = totalCompletions;
        break;
      case 'perfect-week':
        progress = perfectWeekDays;
        break;
      default:
        progress = 0;
    }
    
    const unlocked = progress >= def.requirement;
    
    return {
      ...def,
      progress,
      unlocked,
      unlockedAt: unlocked ? new Date() : undefined
    };
  });
}, [habits, expenses, dailyAllowance]);


// 🔮 SPENDING PREDICTION CALCULATOR
const calculateSpendingPrediction = useCallback((): SpendingPrediction => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysElapsed = now.getDate();
  const daysRemaining = daysInMonth - daysElapsed;
  
  // Get last 30 days of expenses for analysis
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentExpenses = expenses.filter(e => new Date(e.date) >= thirtyDaysAgo);
  const totalRecentSpending = recentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const averageDailySpending = recentExpenses.length > 0 ? totalRecentSpending / 30 : 0;
  
  // Current month expenses
  const monthExpenses = expenses.filter(e => new Date(e.date) >= startOfMonth);
  const currentMonthSpending = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Weekly analysis (last 7 days vs previous 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  
  const lastWeekExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    return date >= sevenDaysAgo && date < now;
  });
  const previousWeekExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    return date >= fourteenDaysAgo && date < sevenDaysAgo;
  });
  
  const lastWeekTotal = lastWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
  const previousWeekTotal = previousWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Determine trend
  let trend: 'increasing' | 'stable' | 'decreasing';
  const weeklyChange = lastWeekTotal - previousWeekTotal;
  if (weeklyChange > previousWeekTotal * 0.1) trend = 'increasing';
  else if (weeklyChange < -previousWeekTotal * 0.1) trend = 'decreasing';
  else trend = 'stable';
  
  // Predictions
  const nextWeekEstimate = trend === 'increasing' 
    ? lastWeekTotal * 1.1 
    : trend === 'decreasing' 
    ? lastWeekTotal * 0.9 
    : lastWeekTotal;
    
  const projectedMonthEnd = currentMonthSpending + (averageDailySpending * daysRemaining);
  const monthlyBudget = dailyAllowance * daysInMonth;
  const willExceedBudget = projectedMonthEnd > monthlyBudget;
  
  // Calculate days until budget exceeded
  let daysUntilBudgetExceeded: number | null = null;
  if (averageDailySpending > 0) {
    const budgetRemaining = monthlyBudget - currentMonthSpending;
    if (budgetRemaining > 0) {
      daysUntilBudgetExceeded = Math.floor(budgetRemaining / averageDailySpending);
      if (daysUntilBudgetExceeded > daysRemaining) {
        daysUntilBudgetExceeded = null; // Won't exceed this month
      }
    } else {
      daysUntilBudgetExceeded = 0; // Already exceeded
    }
  }
  
  // Confidence level based on data availability
  let confidence: 'high' | 'medium' | 'low';
  if (recentExpenses.length >= 20) confidence = 'high';
  else if (recentExpenses.length >= 10) confidence = 'medium';
  else confidence = 'low';
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (willExceedBudget) {
    const overage = projectedMonthEnd - monthlyBudget;
    recommendations.push(`⚠️ You're projected to exceed budget by ${currencySymbol}${overage.toFixed(2)} this month`);
    recommendations.push(`💡 Reduce daily spending to ${currencySymbol}${((monthlyBudget - currentMonthSpending) / daysRemaining).toFixed(2)} to stay on track`);
  } else {
    recommendations.push(`✅ You're on track to stay within budget this month!`);
  }
  
  if (trend === 'increasing') {
    recommendations.push(`📈 Your spending is trending up - review recent purchases`);
  } else if (trend === 'decreasing') {
    recommendations.push(`📉 Great job! Your spending is decreasing`);
  }
  
  if (averageDailySpending > dailyAllowance) {
    recommendations.push(`🎯 Daily average (${currencySymbol}${averageDailySpending.toFixed(2)}) exceeds your limit (${currencySymbol}${dailyAllowance.toFixed(2)})`);
  }
  
  if (daysUntilBudgetExceeded !== null && daysUntilBudgetExceeded <= 7) {
    recommendations.push(`⏰ At current rate, budget will be exceeded in ${daysUntilBudgetExceeded} days`);
  }
  
  const nextMonthEstimate = averageDailySpending * new Date(now.getFullYear(), now.getMonth() + 2, 0).getDate();
  
  return {
    nextWeekEstimate,
    nextMonthEstimate,
    confidence,
    trend,
    averageDailySpending,
    projectedMonthEnd,
    willExceedBudget,
    daysUntilBudgetExceeded,
    recommendations
  };
}, [expenses, dailyAllowance, currencySymbol]);




// 🆕 PHASE 1: Calculate category budgets with spending
const calculateCategoryBudgets = useCallback((): CategoryBudget[] => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const monthlyExpenses = expenses.filter(e => new Date(e.date) >= startOfMonth);
  
  const budgets: CategoryBudget[] = EXPENSE_CATEGORIES.map(category => {
    const spent = monthlyExpenses
      .filter(e => e.category === category.label)
      .reduce((sum, e) => sum + e.amount, 0);
    
    const monthlyLimit = categoryBudgets[category.id] || DEFAULT_CATEGORY_BUDGETS[category.id] || 0;
    const percentage = monthlyLimit > 0 ? Math.min((spent / monthlyLimit) * 100, 100) : 0;
    
    // Ensure icon is a component, not a string
    const icon = typeof category.icon === 'string' ? undefined : category.icon;
    
    return {
      category: category.id,
      categoryLabel: category.label,
      categoryIcon: icon as React.ComponentType<any>,
      categoryColor: category.color,
      monthlyLimit,
      spent,
      percentage
    };
  }).filter(b => b.monthlyLimit > 0);
  
  return budgets;
}, [expenses, categoryBudgets]);
// 🏆 ACHIEVEMENTS MODAL COMPONENT
const AchievementsModal = ({ 
  achievements, 
  onClose,
  isDark,
  isGreen,
  isLgbt 
}: { 
  achievements: Achievement[];
  onClose: () => void;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = (unlockedCount / totalCount) * 100;
  
  const categories = ['habits', 'money', 'streak', 'milestone'] as const;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-3xl my-8 rounded-3xl shadow-2xl animate-pop ${
        isDark ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white border-2 border-slate-100'
      }`}>
        
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl transition z-10 ${
            isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          <X className="w-5 h-5" />
        </button>




        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
              isDark 
                ? (isGreen ? 'bg-green-500/20 text-green-400' : isLgbt ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400')
                : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600')
            }`}>
              <Trophy className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-black mb-2">Achievements</h2>
            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {unlockedCount} of {totalCount} unlocked
            </p>
            
            {/* Progress Bar */}
            <div className={`h-3 w-full rounded-full overflow-hidden mt-4 ${
              isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}>
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  isDark 
                    ? (isGreen ? 'bg-gradient-to-r from-green-500 to-emerald-400' : isLgbt ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500' : 'bg-gradient-to-r from-pink-500 to-rose-400')
                    : (isGreen ? 'bg-gradient-to-r from-green-600 to-emerald-600' : isLgbt ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-600' : 'bg-gradient-to-r from-pink-600 to-rose-600')
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>




        {/* Achievement Grid */}
        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
          {categories.map(category => {
            const categoryAchievements = achievements.filter(a => a.category === category);
            if (categoryAchievements.length === 0) return null;
            
            return (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className={`text-lg font-bold mb-3 capitalize ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {category}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryAchievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        achievement.unlocked
                          ? (isDark 
                              ? (isGreen ? 'bg-green-900/20 border-green-500/50' : isLgbt ? 'bg-gradient-to-r from-red-900/20 to-blue-900/20 border-indigo-500/50' : 'bg-pink-900/20 border-pink-500/50')
                              : (isGreen ? 'bg-green-50 border-green-300' : isLgbt ? 'bg-gradient-to-r from-red-50 to-blue-50 border-indigo-300' : 'bg-pink-50 border-pink-300')
                            )
                          : (isDark ? 'bg-slate-800 border-slate-700 opacity-60' : 'bg-slate-50 border-slate-200 opacity-60')
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`text-3xl ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {achievement.title}
                          </h4>
                          <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {achievement.description}
                          </p>
                          
                          {achievement.unlocked ? (
                            <div className={`text-xs font-bold ${
                              isDark 
                                ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                                : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
                            }`}>
                              ✓ Unlocked! {achievement.reward}
                            </div>
                          ) : (
                            <div>
                              <div className={`flex items-center justify-between text-xs mb-1 ${
                                isDark ? 'text-slate-500' : 'text-slate-500'
                              }`}>
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.requirement}</span>
                              </div>
                              <div className={`h-1.5 rounded-full overflow-hidden ${
                                isDark ? 'bg-slate-700' : 'bg-slate-200'
                              }`}>
                                <div
                                  className={`h-full rounded-full ${
                                    isDark ? 'bg-slate-600' : 'bg-slate-400'
                                  }`}
                                  style={{ width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};








// 🎯 FINANCIAL HEALTH SCORE COMPONENT
interface FinancialHealthProps {
  healthScore: FinancialHealthScore;
  currencySymbol: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}




const FinancialHealthCard: React.FC<FinancialHealthProps> = ({
  healthScore,
  currencySymbol,
  isDark,
  isGreen,
  isLgbt
}) => {
  const getGradeColor = (grade: string) => {
    if (grade === 'A') return isDark ? 'text-green-400' : 'text-green-600';
    if (grade === 'B') return isDark ? 'text-blue-400' : 'text-blue-600';
    if (grade === 'C') return isDark ? 'text-yellow-400' : 'text-yellow-600';
    if (grade === 'D') return isDark ? 'text-orange-400' : 'text-orange-600';
    return isDark ? 'text-red-400' : 'text-red-600';
  };
  
  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return { icon: TrendingUp, color: 'text-green-500' };
    if (trend === 'declining') return { icon: TrendingDown, color: 'text-red-500' };
    return { icon: TrendingUp, color: 'text-slate-400' };
  };
  
  const trendData = getTrendIcon(healthScore.trend);
  const TrendIcon = trendData.icon;
  
  return (
    <div className={`p-6 rounded-2xl border-2 ${
      isDark 
        ? (isGreen ? 'bg-slate-800/50 border-green-900/50' : isLgbt ? 'bg-slate-800/50 border-indigo-900/50' : 'bg-slate-800/50 border-pink-900/50')
        : (isGreen ? 'bg-green-50 border-green-200' : isLgbt ? 'bg-gradient-to-br from-red-50 to-blue-50 border-indigo-200' : 'bg-pink-50 border-pink-200')
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isDark 
            ? (isGreen ? 'bg-green-500/20' : isLgbt ? 'bg-gradient-to-br from-red-500/20 to-blue-500/20' : 'bg-pink-500/20')
            : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-br from-red-100 to-blue-100' : 'bg-pink-100')
        }`}>
          <Shield className={`w-6 h-6 ${
            isDark 
              ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
              : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
          }`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Financial Health Score
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Your money management rating
          </p>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-black ${getGradeColor(healthScore.grade)}`}>
            {healthScore.grade}
          </div>
          <div className={`text-sm font-bold flex items-center gap-1 justify-end mt-1 ${trendData.color}`}>
            <TrendIcon className="w-4 h-4" />
            {healthScore.trend}
          </div>
        </div>
      </div>




      {/* Score Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className={isDark ? 'text-slate-700' : 'text-slate-200'}
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${(healthScore.score / 100) * 351.86} 351.86`}
              className={
                healthScore.score >= 80 
                  ? 'text-green-500' 
                  : healthScore.score >= 60 
                  ? 'text-yellow-500' 
                  : 'text-red-500'
              }
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {healthScore.score}
            </span>
          </div>
        </div>
      </div>




      {/* Factors Breakdown */}
      <div className="space-y-3 mb-6">
        {Object.entries(healthScore.factors).map(([key, data]) => {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {label}
                </span>
                <span className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {data.score}/100
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    data.score >= 80 ? 'bg-green-500' : data.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${data.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>




      {/* Recommendations */}
      <div className={`p-4 rounded-xl ${
        isDark 
          ? (isGreen ? 'bg-green-500/10 border border-green-500/30' : isLgbt ? 'bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-indigo-500/30' : 'bg-pink-500/10 border border-pink-500/30')
          : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-r from-red-100 to-blue-100' : 'bg-pink-100')
      }`}>
        <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          💡 Recommendations
        </h4>
        <ul className="space-y-1">
          {healthScore.recommendations.map((rec, idx) => (
            <li key={idx} className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


// 🔮 SPENDING PREDICTIONS COMPONENT
const SpendingPredictionsCard: React.FC<{
  prediction: SpendingPrediction;
  currencySymbol: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}> = ({ prediction, currencySymbol, isDark, isGreen, isLgbt }) => {
  
  const getTrendIcon = () => {
    if (prediction.trend === 'increasing') return { icon: TrendingUp, color: 'text-red-500', bg: 'bg-red-500/10' };
    if (prediction.trend === 'decreasing') return { icon: TrendingDown, color: 'text-green-500', bg: 'bg-green-500/10' };
    return { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' };
  };
  
  const trendData = getTrendIcon();
  const TrendIcon = trendData.icon;
  
  const getConfidenceBadge = () => {
    if (prediction.confidence === 'high') return { text: 'High Confidence', color: 'bg-green-500' };
    if (prediction.confidence === 'medium') return { text: 'Medium Confidence', color: 'bg-yellow-500' };
    return { text: 'Low Confidence', color: 'bg-orange-500' };
  };
  
  const confidenceBadge = getConfidenceBadge();
  
  return (
    <div className={`p-6 rounded-2xl border-2 ${
      isDark 
        ? (isGreen ? 'bg-slate-800/50 border-green-900/50' : isLgbt ? 'bg-slate-800/50 border-indigo-900/50' : 'bg-slate-800/50 border-pink-900/50')
        : (isGreen ? 'bg-green-50 border-green-200' : isLgbt ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-indigo-200' : 'bg-pink-50 border-pink-200')
    }`}>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isDark 
            ? (isGreen ? 'bg-green-500/20' : isLgbt ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20' : 'bg-pink-500/20')
            : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-br from-purple-100 to-blue-100' : 'bg-pink-100')
        }`}>
          <Zap className={`w-6 h-6 ${
            isDark 
              ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
              : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
          }`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Spending Predictions
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            AI-powered forecast
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${confidenceBadge.color}`}>
          {confidenceBadge.text}
        </div>
      </div>


      {/* Trend Indicator */}
      <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${trendData.bg}`}>
        <TrendIcon className={`w-6 h-6 ${trendData.color}`} />
        <div>
          <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Spending Trend: {prediction.trend.charAt(0).toUpperCase() + prediction.trend.slice(1)}
          </div>
          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Average: {currencySymbol}{prediction.averageDailySpending.toFixed(2)}/day
          </div>
        </div>
      </div>


      {/* Predictions Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-slate-900/50' : 'bg-white'
        }`}>
          <div className={`text-xs font-bold mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            NEXT WEEK
          </div>
          <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currencySymbol}{prediction.nextWeekEstimate.toFixed(0)}
          </div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-slate-900/50' : 'bg-white'
        }`}>
          <div className={`text-xs font-bold mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            NEXT MONTH
          </div>
          <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currencySymbol}{prediction.nextMonthEstimate.toFixed(0)}
          </div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-slate-900/50' : 'bg-white'
        }`}>
          <div className={`text-xs font-bold mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            MONTH END PROJECTION
          </div>
          <div className={`text-2xl font-black ${
            prediction.willExceedBudget 
              ? 'text-red-500' 
              : 'text-green-500'
          }`}>
            {currencySymbol}{prediction.projectedMonthEnd.toFixed(0)}
          </div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-slate-900/50' : 'bg-white'
        }`}>
          <div className={`text-xs font-bold mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            BUDGET STATUS
          </div>
          <div className={`text-lg font-black ${
            prediction.willExceedBudget 
              ? 'text-red-500' 
              : 'text-green-500'
          }`}>
            {prediction.willExceedBudget ? '⚠️ OVER' : '✅ SAFE'}
          </div>
        </div>
      </div>


      {/* Budget Warning */}
      {prediction.daysUntilBudgetExceeded !== null && (
        <div className={`p-4 rounded-xl mb-4 border-2 ${
          isDark 
            ? 'bg-red-900/20 border-red-500/50 text-red-300'
            : 'bg-red-50 border-red-300 text-red-700'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">⏰</span>
            <span className="font-bold">Budget Alert</span>
          </div>
          <div className="text-sm">
            {prediction.daysUntilBudgetExceeded === 0 
              ? 'Budget already exceeded this month'
              : `Budget will be exceeded in ${prediction.daysUntilBudgetExceeded} days at current rate`
            }
          </div>
        </div>
      )}


      {/* Recommendations */}
      <div className={`p-4 rounded-xl ${
        isDark 
          ? (isGreen ? 'bg-green-500/10 border border-green-500/30' : isLgbt ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-indigo-500/30' : 'bg-pink-500/10 border border-pink-500/30')
          : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-r from-purple-100 to-blue-100' : 'bg-pink-100')
      }`}>
        <h4 className={`text-sm font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Sparkles className="w-4 h-4" />
          AI Recommendations
        </h4>
        <ul className="space-y-1">
          {prediction.recommendations.map((rec, idx) => (
            <li key={idx} className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


// 🆕 PHASE 1: Get pie chart data
const getCategoryPieData = useCallback(() => {
  const categoryTotals: Record<string, number> = {};
  
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  
  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      name: category,
      value: amount
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Top 6 categories
  
}, [expenses]);












  const selectTemplate = (template: HabitTemplate) => {
  setNewHabitTitle(template.title);
  setNewHabitIcon(template.icon);
  // Also set the color theme based on template
  setIsAdding(true);
  setShowTemplates(false); // Close the template browser
  
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
  setAddingExpense(true);
  if (isNaN(amount) || amount <= 0) {
    setToast({ id: Date.now().toString(), message: 'Please enter a valid amount', type: 'error' });
    return;
  }




  try {
    let receiptUrl = '';
    
    // 📸 PHASE 3: Upload image if exists
    if (newExpenseImage) {
      const imageRef = ref(storage, `receipts/${user.uid}/${Date.now()}_${newExpenseImage.name}`);
      await uploadBytes(imageRef, newExpenseImage);
      receiptUrl = await getDownloadURL(imageRef);
    }




    const newExpense: any = {
  date: newExpenseDate,
  amount: amount,
  category: newExpenseCategory,
  description: newExpenseDescription.trim() || 'Expense',
  createdAt: serverTimestamp()
};




// Only add receiptImage if it exists
if (receiptUrl) {
  newExpense.receiptImage = receiptUrl;
}




    await addDoc(collection(db, 'users', user.uid, 'expenses'), newExpense);
    
    // Reset form
    setNewExpenseAmount('');
    setNewExpenseDescription('');
    setNewExpenseDate(getTodayString());
    setNewExpenseImage(null); // 📸 PHASE 3
    setImagePreview(null); // 📸 PHASE 3
    
   setToast({ id: Date.now().toString(), message: 'Expense added!', type: 'success' });
  } catch (error) {
    console.error("Error adding expense", error);
    setToast({ id: Date.now().toString(), message: 'Failed to add expense.', type: 'error' });
  } finally {
    setAddingExpense(false);
  }
};
// 📸 PHASE 3: Handle image selection
const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    setToast({ 
      id: Date.now().toString(), 
      message: 'Please select an image file', 
      type: 'error' 
    });
    return;
  }
  
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    setToast({ 
      id: Date.now().toString(), 
      message: 'Image must be less than 5MB', 
      type: 'error' 
    });
    return;
  }
  
  setNewExpenseImage(file);
  
  // Create preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result as string);
  };
  reader.readAsDataURL(file);
};




  const deleteExpense = async (expenseId: string) => {
    if (!user) return;
    setDeletingExpense(expenseId);
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'expenses', expenseId));
      setToast({ id: Date.now().toString(), message: 'Expense deleted', type: 'success' });
    } catch (error) {
      console.error("Error deleting expense", error);
      setToast({ id: Date.now().toString(), message: 'Failed to delete', type: 'error' });
    } finally {
      setDeletingExpense(null);
    }
  };
  // ✅ Add Debt Handler
const handleAddDebt = async (debtData: {
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type: 'credit_card' | 'student_loan' | 'mortgage' | 'personal_loan' | 'other';
  dueDay: number;
}) => {
  if (!user) return;
  
  try {
    await addDoc(collection(db, `users/${user.uid}/debts`), {
      ...debtData,
      createdAt: serverTimestamp()
    });
    
    setToast({ 
      id: Date.now().toString(), 
      message: 'Debt added successfully', 
      type: 'success' 
    });
  } catch (error) {
    console.error('Error adding debt:', error);
    setToast({ 
      id: Date.now().toString(), 
      message: 'Failed to add debt', 
      type: 'error' 
    });
  }
};




// ✅ Delete Debt Handler
const handleDeleteDebt = async (debtId: string) => {
  if (!user) return;
  
  try {
    await deleteDoc(doc(db, `users/${user.uid}/debts/${debtId}`));
    setToast({ 
      id: Date.now().toString(), 
      message: 'Debt removed', 
      type: 'success' 
    });
  } catch (error) {
    console.error('Error deleting debt:', error);
    setToast({ 
      id: Date.now().toString(), 
      message: 'Failed to delete debt', 
      type: 'error' 
    });
  }
};




// ✅ Make Payment Handler
const handleMakePayment = async (debtId: string, amount: number) => {
  if (!user) return;
  
  const debt = debts.find(d => d.id === debtId);
  if (!debt) return;
  
  try {
    // Update debt balance
    const newBalance = Math.max(0, debt.balance - amount);
    await updateDoc(doc(db, `users/${user.uid}/debts/${debtId}`), {
      balance: newBalance
    });
    
    // Record as expense
    await addDoc(collection(db, `users/${user.uid}/expenses`), {
      date: getTodayString(),
      amount: amount,
      category: 'debt_payment',
      description: `Payment to ${debt.name}`,
      createdAt: serverTimestamp()
    });
    
    setToast({ 
      id: Date.now().toString(), 
      message: `${currencySymbol}${amount.toFixed(2)} payment recorded!`, 
      type: 'success' 
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    setToast({ 
      id: Date.now().toString(), 
      message: 'Failed to record payment', 
      type: 'error' 
    });
  }
};
  // 🆕 PHASE 2: Recurring Expense Handlers
const handleAddRecurring = async (data: Omit<RecurringExpense, 'id' | 'createdAt'>) => {
  if (!user) return;
  
  try {
    await addDoc(collection(db, `users/${user.uid}/recurringExpenses`), {
      ...data,
      createdAt: serverTimestamp()
    });
    
    setToast({ 
      id: Date.now().toString(), 
      message: `"${data.name}" added to recurring expenses!`, 
      type: 'success' 
    });
  } catch (error) {
    console.error("Error adding recurring expense:", error);
    setToast({ 
      id: Date.now().toString(), 
      message: 'Failed to add recurring expense.', 
      type: 'error' 
    });
  }
};




const handleUpdateRecurring = async (expenseId: string, data: Partial<RecurringExpense>) => {
  if (!user) return;
  
  try {
    await updateDoc(doc(db, `users/${user.uid}/recurringExpenses/${expenseId}`), data);
    
    setToast({ 
      id: Date.now().toString(), 
      message: 'Recurring expense updated!', 
      type: 'success' 
    });
  } catch (error) {
    console.error("Error updating recurring expense:", error);
    setToast({ 
      id: Date.now().toString(), 
      message: 'Failed to update recurring expense.', 
      type: 'error' 
    });
  }
};




const handleToggleRecurringActive = async (expenseId: string, isActive: boolean) => {
  if (!user) return;
  
  try {
    await updateDoc(doc(db, `users/${user.uid}/recurringExpenses/${expenseId}`), {
      isActive
    });
    
    setToast({ 
      id: Date.now().toString(), 
      message: isActive ? 'Recurring expense activated' : 'Recurring expense paused', 
      type: 'success' 
    });
  } catch (error) {
    console.error("Error toggling recurring expense:", error);
  }
};




const handleDeleteRecurring = async (expenseId: string) => {
  if (!user) return;
  
  try {
    await deleteDoc(doc(db, `users/${user.uid}/recurringExpenses/${expenseId}`));
    setToast({ 
      id: Date.now().toString(), 
      message: 'Recurring expense deleted', 
      type: 'success' 
    });
  } catch (error) {
    console.error("Error deleting recurring expense:", error);
    setToast({ 
      id: Date.now().toString(), 
      message: 'Failed to delete recurring expense.', 
      type: 'error' 
    });
  }
};
// 📊 PHASE 3: Export to CSV
const exportToCSV = () => {
  if (expenses.length === 0) {
    setToast({ 
      id: Date.now().toString(), 
      message: 'No expenses to export', 
      type: 'error' 
    });
    return;
  }




  // Create CSV header
  const headers = ['Date', 'Category', 'Description', 'Amount', 'Currency'];
  
  // Create CSV rows
  const rows = expenses.map(expense => {
    const category = EXPENSE_CATEGORIES.find(c => c.id === expense.category);
    return [
      expense.date,
      category?.label || expense.category,
      expense.description,
      expense.amount.toFixed(2),
      currencySymbol
    ];
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Create download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `habitflow-expenses-${getTodayString()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setToast({ 
    id: Date.now().toString(), 
    message: `Exported ${expenses.length} expenses!`, 
    type: 'success' 
  });
};
// 📦 COMPLETE DATA EXPORT (JSON) - Full Backup
const exportAllData = () => {
  try {
    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      user: {
        email: user?.email || 'anonymous',
        displayName: user?.displayName || 'User'
      },
      habits: habits.map(h => ({
        id: h.id,
        title: h.title,
        icon: h.icon || '🎯',  // ✅ CHANGED: emoji → icon
        streak: h.streak,
        longestStreak: h.longestStreak || 0,  // ✅ CHANGED: bestStreak → longestStreak
        completedDates: h.completedDates,
        createdAt: h.createdAt
      })),
      todos: todos.map(t => ({
        id: t.id,
        title: t.title,  // ✅ CHANGED: text → title
        completed: t.completed,
        priority: t.priority,
        dueDate: t.dueDate,
        createdAt: t.createdAt
      })),
      expenses: expenses.map(e => ({
        id: e.id,
        amount: e.amount,
        category: e.category,
        description: e.description || '',  // ✅ CHANGED: note → description
        date: e.date,
        imageUrl: e.imageUrl || null  // ✅ CHANGED: receiptUrl → imageUrl
      })),
      settings: {
        dailyAllowance,
        currency,
        currencySymbol,
        theme: isDark ? 'dark' : 'light',  // ✅ CHANGED: Store as string
        accentColor: isGreen ? 'green' : isLgbt ? 'lgbt' : 'pink'  // ✅ CHANGED: Store as string
      },
      statistics: {
        totalHabits: habits.length,
        totalTodos: todos.length,
        totalExpenses: expenses.length,
        totalSpent: expenses.reduce((sum, e) => sum + e.amount, 0),
        longestStreak: Math.max(...habits.map(h => h.longestStreak|| 0), 0)  // ✅ CHANGED: bestStreak → longestStreak
      }
    };


    const jsonString = JSON.stringify(exportData, null, 2);


    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habitflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);


    setToast({
      id: Date.now().toString(),
      message: `✅ Complete backup exported!`,
      type: 'success'
    });
  } catch (error) {
    console.error('Export failed:', error);
    setToast({
      id: Date.now().toString(),
      message: '❌ Export failed',
      type: 'error'
    });
  }
};
// 📥 IMPORT DATA FROM JSON - Restore Backup
const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file || !user) return;


  try {
    const text = await file.text();
    const importedData = JSON.parse(text);


    // Validate data structure
    if (!importedData.version || !importedData.habits) {
      throw new Error('Invalid backup file format');
    }


    // Confirm with user
    const confirmImport = window.confirm(
      `Import ${importedData.habits?.length || 0} habits, ${importedData.todos?.length || 0} todos, and ${importedData.expenses?.length || 0} expenses?\n\nThis will REPLACE your current data.`
    );


    if (!confirmImport) return;


    // Import habits
    if (importedData.habits && Array.isArray(importedData.habits)) {
      for (const habit of importedData.habits) {
        await setDoc(doc(db, 'users', user.uid, 'habits', habit.id), {
          title: habit.title,
          icon: habit.icon || '🎯',  // ✅ CHANGED: emoji → icon
          streak: habit.streak || 0,
          longestStreak: habit.longestStreak || 0,  // ✅ CHANGED: bestStreak → longestStreak
          completedDates: habit.completedDates || [],
          createdAt: habit.createdAt || new Date().toISOString()
        });
      }
    }


    // Import todos
    if (importedData.todos && Array.isArray(importedData.todos)) {
      for (const todo of importedData.todos) {
        await setDoc(doc(db, 'users', user.uid, 'todos', todo.id), {
          title: todo.title,  // ✅ CHANGED: text → title
          completed: todo.completed || false,
          priority: todo.priority || 'medium',
          dueDate: todo.dueDate || null,
          createdAt: todo.createdAt || new Date().toISOString()
        });
      }
    }


    // Import expenses
    if (importedData.expenses && Array.isArray(importedData.expenses)) {
      for (const expense of importedData.expenses) {
        await setDoc(doc(db, 'users', user.uid, 'expenses', expense.id), {
          amount: expense.amount,
          category: expense.category,
          description: expense.description || '',  // ✅ CHANGED: note → description
          date: expense.date,
          imageUrl: expense.imageUrl || null  // ✅ CHANGED: receiptUrl → imageUrl
        });
      }
    }


    // Import settings
    if (importedData.settings) {
      await setDoc(doc(db, 'users', user.uid, 'settings', 'money'), {
        dailyAllowance: importedData.settings.dailyAllowance || 0,
        currency: importedData.settings.currency || 'USD',
        currencySymbol: importedData.settings.currencySymbol || '$'
      });


      // ✅ FIXED: Update theme settings using localStorage only
      if (importedData.settings.theme) {
        localStorage.setItem('theme', importedData.settings.theme);
        window.location.reload(); // Reload to apply theme
      }
      if (importedData.settings.accentColor) {
        localStorage.setItem('accentColor', importedData.settings.accentColor);
        window.location.reload(); // Reload to apply accent color
      }
    }


    setToast({
      id: Date.now().toString(),
      message: `✅ Data imported successfully! Page will reload...`,
      type: 'success'
    });


    // Reload after 2 seconds to apply all changes
    setTimeout(() => {
      window.location.reload();
    }, 2000);


    // Reset file input
    event.target.value = '';
  } catch (error) {
    console.error('Import failed:', error);
    setToast({
      id: Date.now().toString(),
      message: `❌ Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      type: 'error'
    });
  }
};




const handleEditRecurring = (expense: RecurringExpense) => {
  setEditingRecurring(expense);
  setShowRecurringModal(true);
};
  




  // Calculate today's spending
  const todayExpenses = expenses.filter(e => e.date === today);
  const todaySpent = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const todayRemaining = dailyAllowance - todaySpent;
  const todaySavingsRate = dailyAllowance > 0 ? Math.round((todayRemaining / dailyAllowance) * 100) : 0;
   // 💰 PHASE 3: Net Worth Calculations
const totalIncomeAmount = incomes.reduce((sum, income) => sum + income.amount, 0);
const totalExpenseAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
const netWorth = totalIncomeAmount - totalExpenseAmount;
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
      {/* 🎓 ONBOARDING FLOW */}
{showOnboarding && (
  <OnboardingFlow
    onComplete={() => setShowOnboarding(false)}
    isDark={isDark}
    isGreen={isGreen}
    isLgbt={isLgbt}
  />
)}
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
        {showAchievements && (
  <AchievementsModal
    achievements={calculateAchievements()}
    onClose={() => setShowAchievements(false)}
    isDark={isDark}
    isGreen={isGreen}
    isLgbt={isLgbt}
  />
)}
       
       {showTemplates && (
       <TemplateBrowser 
        onSelectTemplate={selectTemplate} 
         onClose={() => setShowTemplates(false)} 
      />
)}




{/* WELCOME MESSAGE */}
{showWelcome && (
  <div 
    className="fixed top-24 left-1/2 z-50 pointer-events-none max-w-md px-4" 
    style={{ 
      animation: 'slideUp 0.4s ease-out, fadeOut 4s ease-in-out forwards',
      transform: 'translateX(-50%)'
    }}
  >
    <div className={`backdrop-blur-xl p-6 rounded-3xl shadow-2xl border-2 text-center ${
      isDark
        ? (isGreen 
            ? 'bg-green-900/95 border-green-700 text-white' 
            : isLgbt 
              ? 'bg-gradient-to-r from-red-900/95 to-blue-900/95 border-indigo-700 text-white' 
              : 'bg-pink-900/95 border-pink-700 text-white')
        : (isGreen 
            ? 'bg-green-600/95 border-green-500 text-white' 
            : isLgbt 
              ? 'bg-gradient-to-r from-red-500/95 to-blue-600/95 border-indigo-400 text-white' 
              : 'bg-pink-600/95 border-pink-500 text-white')
    }`}>
      <h2 className="text-xl sm:text-2xl font-black mb-2">
        Let's crush it today, {user.displayName || user.email?.split('@')[0]}! 👋
      </h2>
      <p className="text-sm opacity-90 font-medium">
        Your consistency is building a better future.
      </p>
    </div>
  </div>
)}




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
            <button 
  onClick={() => setShowAchievements(true)}
  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition ${isDark ? (isGreen ? 'bg-green-800/50 hover:bg-green-700 text-green-100' : isLgbt ? 'bg-slate-800/50 hover:bg-slate-700 text-indigo-300' : 'bg-pink-800/50 hover:bg-pink-700 text-pink-100') : (isLgbt ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/20 hover:bg-white/30 text-white')}`}
>
  <Trophy className="w-5 h-5" />
  <span className="hidden sm:inline">Achievements</span>
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




      
        
       <main className="max-w-5xl mx-auto px-6 py-10 pb-24 md:pb-10 relative z-10">
        
        {/* 🆕 LED-Style Digital Display Component */}
        <div className={`mb-8 p-6 rounded-3xl border-2 shadow-2xl overflow-hidden relative ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-700'}`}>
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500 to-transparent animate-scan"></div>
          </div>
          
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>




          {/* Main Display Content */}
          <div className="relative z-10">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></div>
                <span className="ml-2 font-mono text-sm text-green-400 tracking-wider">SYSTEM STATUS: ONLINE</span>
              </div>
              <div className="font-mono text-xs text-green-400/60">
                {new Date().toLocaleTimeString('en-US', { hour12: false })}
              </div>
            </div>




            {/* LED Display Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Display Panel 1 - Habits */}
              <div className={`p-5 rounded-2xl border backdrop-blur-sm ${isDark ? 'bg-slate-900/50 border-green-900/30' : 'bg-slate-800/50 border-green-800/30'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                  <span className="font-mono text-xs text-green-400/80 uppercase tracking-widest">Habits Module</span>
                </div>
                <div className="font-mono text-4xl font-black text-green-400 mb-1 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                  {progress}%
                </div>
                <div className="font-mono text-xs text-green-400/60">
                  {completedToday}/{habits.length} COMPLETE
                </div>
              </div>




              {/* Display Panel 2 - ToDo */}
              <div className={`p-5 rounded-2xl border backdrop-blur-sm ${isDark ? 'bg-slate-900/50 border-cyan-900/30' : 'bg-slate-800/50 border-cyan-800/30'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                  <span className="font-mono text-xs text-cyan-400/80 uppercase tracking-widest">Tasks Module</span>
                </div>
                <div className="font-mono text-4xl font-black text-cyan-400 mb-1 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                  {todos.filter(t => !t.completed).length}
                </div>
                <div className="font-mono text-xs text-cyan-400/60">
                  PENDING TASKS
                </div>
              </div>




              {/* Display Panel 3 - Money */}
              <div className={`p-5 rounded-2xl border backdrop-blur-sm ${isDark ? 'bg-slate-900/50 border-yellow-900/30' : 'bg-slate-800/50 border-yellow-800/30'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
                  <span className="font-mono text-xs text-yellow-400/80 uppercase tracking-widest">Finance Module</span>
                </div>
                <div className="font-mono text-4xl font-black text-yellow-400 mb-1 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                  ₱{((totalIncomeAmount - totalExpenseAmount) / 1000).toFixed(1)}K
                </div>
                <div className="font-mono text-xs text-yellow-400/60">
                  NET BALANCE
                </div>
              </div>
            </div>




            {/* Bottom Info Bar */}
            <div className="mt-6 pt-4 border-t border-green-900/30 flex items-center justify-between">
              <div className="font-mono text-xs text-green-400/40 flex items-center gap-4">
                <span>SYS: v2.0.1</span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">CORE: STABLE</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
                <span className="font-mono text-xs text-green-400/60">READY</span>
              </div>
            </div>
          </div>
        </div>




        {/* Swipeable Container */}
        <div className="relative">
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
              
              
      
               {/* 🆕 Habit Health Card - NOW INSIDE HABITS TAB */}
              <div className={`mb-6 p-6 rounded-3xl border-2 shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : (isGreen ? 'bg-white border-green-100' : isLgbt ? 'bg-white border-indigo-100' : 'bg-white border-pink-100')}`}>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className={`w-5 h-5 fill-current ${isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-red-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-red-500' : 'text-pink-600')}`} />
                      <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>Habit Health</h3>
                    </div>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {progress === 100 ? "Amazing work! You're fully charged." : "Complete habits to boost your daily health."}
                    </p>
                  </div>
                  <div className={`text-5xl font-black ${isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500' : 'text-pink-600')}`}>
                    {progress}%
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className={`h-6 w-full rounded-full overflow-hidden p-1 mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out relative shadow-sm ${progress === 100 ? (isGreen ? 'shadow-[0_0_15px_rgba(16,185,129,0.6)]' : isLgbt ? 'shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'shadow-[0_0_15px_rgba(236,72,153,0.6)]') : ''} ${isDark ? (isGreen ? 'bg-gradient-to-r from-green-500 to-emerald-400' : isLgbt ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500' : 'bg-gradient-to-r from-pink-500 to-rose-400') : (isGreen ? 'bg-gradient-to-r from-green-600 to-emerald-600' : isLgbt ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-600' : 'bg-gradient-to-r from-pink-600 to-rose-600')}`}
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-white/20 progress-bar-fill"></div>
                  </div>
                </div>




                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${isDark ? (isGreen ? 'bg-green-900/40 text-green-300' : isLgbt ? 'bg-indigo-900/40 text-indigo-300' : 'bg-pink-900/40 text-pink-300') : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600')}`}>
                      <Layout className="w-4 h-4" />
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Total</p>
                    <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{habits.length}</p>
                  </div>
                  
                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${isDark ? (isGreen ? 'bg-emerald-900/40 text-emerald-300' : isLgbt ? 'bg-purple-900/40 text-purple-300' : 'bg-rose-900/40 text-rose-300') : (isGreen ? 'bg-emerald-100 text-emerald-600' : isLgbt ? 'bg-purple-100 text-purple-600' : 'bg-rose-100 text-rose-600')}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Done</p>
                    <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{completedToday}</p>
                  </div>
                  
                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${isDark ? (isGreen ? 'bg-green-900/40 text-green-300' : isLgbt ? 'bg-orange-900/40 text-orange-300' : 'bg-pink-900/40 text-pink-300') : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-orange-100 text-orange-600' : 'bg-pink-100 text-pink-600')}`}>
                      <Flame className="w-4 h-4" />
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Streak</p>
                    <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{Math.max(...habits.map(h => h.streak), 0)}</p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
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




                    <div className="space-y-3">
  {/* 📸 PHASE 3: Image Upload */}
  <div className={`p-4 rounded-xl border-2 border-dashed ${
    isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
  }`}>
    <label className="cursor-pointer flex items-center gap-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        isDark ? 'bg-slate-700' : 'bg-white'
      }`}>
        <Camera className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
      </div>
      <div className="flex-1">
        <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {imagePreview ? 'Receipt attached' : 'Attach receipt (optional)'}
        </p>
        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Click to upload image
        </p>
      </div>
      {imagePreview && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setImagePreview(null);
            setNewExpenseImage(null);
          }}
          className={`p-2 rounded-lg transition ${
            isDark ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-500'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </label>
    
    {/* Image Preview */}
    {imagePreview && (
      <div className="mt-3">
        <img 
          src={imagePreview} 
          alt="Receipt preview" 
          className="w-full h-32 object-cover rounded-lg"
        />
      </div>
    )}
  </div>




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
  disabled={addingExpense}
  className={`px-8 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2 ${
    addingExpense ? 'opacity-50 cursor-not-allowed' : ''
  } ${
    isDark 
      ? (isGreen ? 'bg-green-500 hover:bg-green-400 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400 text-white')
      : (isGreen ? 'bg-green-600 hover:bg-green-700 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700 text-white')
  }`}
>
  {addingExpense ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Adding...
    </>
  ) : (
    'Add'
  )}
</button>
  </div>
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
                
                
                
                {/* 🎯 FINANCIAL HEALTH SCORE */}
<div className="mb-6">
  <FinancialHealthCard
    healthScore={calculateFinancialHealth()}
    currencySymbol={currencySymbol}
    isDark={isDark}
    isGreen={isGreen}
    isLgbt={isLgbt}
  />
</div>


{/* 🔮 SPENDING PREDICTIONS */}
{expenses.length >= 5 && (
  <div className="mb-6">
    <SpendingPredictionsCard
      prediction={calculateSpendingPrediction()}
      currencySymbol={currencySymbol}
      isDark={isDark}
      isGreen={isGreen}
      isLgbt={isLgbt}
    />
  </div>
)}


                {/* 🆕 PHASE 1: Budget Limits Section */}
                <div className="mb-6">
                  <BudgetLimitsSection
                    budgets={calculateCategoryBudgets()}
                    currencySymbol={currencySymbol}
                    isDark={isDark}
                    isGreen={isGreen}
                    isLgbt={isLgbt}
                    onEditBudgets={() => setShowBudgetModal(true)}
                  />
                </div>




                {/* 🆕 PHASE 1: Spending Insights Section */}
                <div className="mb-6">
                  <SpendingInsightsSection
                    insights={calculateSpendingInsights()}
                    currencySymbol={currencySymbol}
                    isDark={isDark}
                    isGreen={isGreen}
                    isLgbt={isLgbt}
                  />
                </div>




                {/* 🆕 PHASE 1: Category Pie Chart */}
                <div className="mb-6">
                  <CategoryPieChart
                    data={getCategoryPieData()}
                    currencySymbol={currencySymbol}
                    isDark={isDark}
                    isGreen={isGreen}
                    isLgbt={isLgbt}
                  />
                </div>




                {/* 🆕 PHASE 1: Savings Goals Section */}
                <div className="mb-6">
                  <SavingsGoalsSection
                    goals={savingsGoals}
                    currencySymbol={currencySymbol}
                    isDark={isDark}
                    isGreen={isGreen}
                    isLgbt={isLgbt}
                    onAddGoal={() => setShowGoalsModal(true)}
                    onUpdateProgress={handleUpdateProgress}
                    onDeleteGoal={handleDeleteGoal}
                  />
                </div>
                {/* 🆕 PHASE 2: Recurring Expenses Section */}
<div className="mb-6">
  <RecurringExpensesSection
    recurringExpenses={recurringExpenses}
    currencySymbol={currencySymbol}
    isDark={isDark}
    isGreen={isGreen}
    isLgbt={isLgbt}
    onAddRecurring={() => {
      setEditingRecurring(null);
      setShowRecurringModal(true);
    }}
    onToggleActive={handleToggleRecurringActive}
    onDeleteRecurring={handleDeleteRecurring}
    onEditRecurring={handleEditRecurring}
  />
</div>
                {/* 🆕 PHASE 2: Recurring Expense Modal */}
{showRecurringModal && (
  <RecurringExpenseModal
    isOpen={showRecurringModal}
    onClose={() => {
      setShowRecurringModal(false);
      setEditingRecurring(null);
    }}
    onSubmit={(data) => {
      if (editingRecurring) {
        handleUpdateRecurring(editingRecurring.id, data);
      } else {
        handleAddRecurring(data);
      }
      setShowRecurringModal(false);
      setEditingRecurring(null);
    }}
    editingExpense={editingRecurring}
    isDark={isDark}
    isGreen={isGreen}
    isLgbt={isLgbt}
    currencySymbol={currencySymbol}
  />
)}
{/* ✅ DEBT TRACKER SECTION */}
<div className="mb-6">
  <DebtTracker
    debts={debts}
    currencySymbol={currencySymbol}
    onAddDebt={() => setShowDebtModal(true)}
    onDeleteDebt={handleDeleteDebt}
    onMakePayment={handleMakePayment}
    isDark={isDark}
    isGreen={isGreen}
    isLgbt={isLgbt}
  />
</div>
                {/* Recent Expenses */}
                <div>
  <div className="flex items-center justify-between mb-4">
    <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
      Recent Expenses
    </h3>
    <div className="relative">
  <button
    onClick={() => setShowExportMenu(!showExportMenu)}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${
      isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
    }`}
  >
    <Download className="w-4 h-4" />
    Export Data
    <ChevronRight className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-90' : ''}`} />
  </button>


  {showExportMenu && (
    <div className={`absolute top-full right-0 mt-2 w-56 rounded-xl shadow-2xl border-2 overflow-hidden z-50 ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <button
        onClick={() => {
          exportToCSV();
          setShowExportMenu(false);
        }}
        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition ${
          isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
        }`}
      >
        <Receipt className="w-4 h-4" />
        <div>
          <div className="font-bold text-sm">Export as CSV</div>
          <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Expenses only (spreadsheet)
          </div>
        </div>
      </button>


      <button
        onClick={() => {
          exportAllData();
          setShowExportMenu(false);
        }}
        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition border-t ${
          isDark ? 'hover:bg-slate-700 text-slate-300 border-slate-700' : 'hover:bg-slate-50 text-slate-700 border-slate-200'
        }`}
      >
        <Shield className="w-4 h-4" />
        <div>
          <div className="font-bold text-sm">Complete Backup</div>
          <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            All data (habits + todos + expenses)
          </div>
        </div>
      </button>


      <button
        onClick={() => {
          fileInputRef.current?.click();
          setShowExportMenu(false);
        }}
        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition border-t ${
          isDark ? 'hover:bg-slate-700 text-green-400 border-slate-700' : 'hover:bg-slate-50 text-green-600 border-slate-200'
        }`}
      >
        <Upload className="w-4 h-4" />
        <div>
          <div className="font-bold text-sm">Import Backup</div>
          <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Restore from JSON file
          </div>
        </div>
      </button>
    </div>
  )}


  {/* Hidden File Input */}
  <input
    ref={fileInputRef}
    type="file"
    accept=".json"
    onChange={importData}
    className="hidden"
  />
</div>
  </div>
                  
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
              
  {/* 📸 PHASE 3: Show receipt thumbnail or category icon */}
  {expense.receiptImage ? (
    <div className="relative group">
      <img 
        src={expense.receiptImage} 
        alt="Receipt" 
        className="w-10 h-10 rounded-xl object-cover cursor-pointer"
        onClick={() => window.open(expense.receiptImage, '_blank')}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center">
        <Camera className="w-5 h-5 text-white" />
      </div>
    </div>
  ) : (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
      isDark ? 'bg-slate-800' : 'bg-slate-100'
    }`}>
      <CategoryIcon className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
    </div>
  )}
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
  disabled={deletingExpense === expense.id}
  className={`p-2 rounded-lg transition ${
    deletingExpense === expense.id ? 'opacity-50 cursor-not-allowed' : ''
  } ${
    isDark ? 'text-slate-600 hover:text-red-400 hover:bg-red-900/20' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
  }`}
>
  {deletingExpense === expense.id ? (
    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  ) : (
    <Trash2 className="w-4 h-4" />
  )}
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
      {/* 🆕 PHASE 1: Savings Goal Modal */}
              {showGoalsModal && (
                <AddGoalModal
                  isOpen={showGoalsModal}
                  onClose={() => setShowGoalsModal(false)}
                  onSubmit={handleAddGoal}
                  isDark={isDark}
                  isGreen={isGreen}
                  isLgbt={isLgbt}
                  currencySymbol={currencySymbol}
                />
              )}




              {/* 🆕 PHASE 1: Edit Budgets Modal */}
              {showBudgetModal && (
                <EditBudgetsModal
                  isOpen={showBudgetModal}
                  onClose={() => setShowBudgetModal(false)}
                  categoryBudgets={categoryBudgets}
                  onUpdateBudget={handleUpdateBudget}
                  isDark={isDark}
                  isGreen={isGreen}
                  isLgbt={isLgbt}
                  currencySymbol={currencySymbol}
                  setCategoryBudgets={setCategoryBudgets}
                />
              )}
              {/* 🆕 PHASE 2: Recurring Expense Modal */}
{showRecurringModal && (
  <RecurringExpenseModal
    isOpen={showRecurringModal}
    onClose={() => {
      setShowRecurringModal(false);
      setEditingRecurring(null);
    }}
    onSubmit={(data) => {
      if (editingRecurring) {
        handleUpdateRecurring(editingRecurring.id, data);
      } else {
        handleAddRecurring(data);
      }
      setShowRecurringModal(false);
      setEditingRecurring(null);
    }}
    editingExpense={editingRecurring}
    isDark={isDark}
    isGreen={isGreen}
    isLgbt={isLgbt}
    currencySymbol={currencySymbol}
  />
)}




{/* ✅ ADD DEBT MODAL */}
<AddDebtModal
  isOpen={showDebtModal}
  onClose={() => setShowDebtModal(false)}
  onAdd={handleAddDebt}
  currencySymbol={currencySymbol}
/>
{/* 💰 PHASE 3: Add Income Modal */}
{showIncomeModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
    <div className={`w-full max-w-md rounded-2xl p-6 ${
      isDark ? 'bg-slate-800' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Add Income 💰
        </h3>
        <button
          onClick={() => setShowIncomeModal(false)}
          className={`p-2 rounded-lg transition ${
            isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
          }`}
        >
          <X className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
        </button>
      </div>




      <form onSubmit={async (e) => {
        e.preventDefault();
        if (!user) return;
        
        const formData = new FormData(e.currentTarget);
        const amount = parseFloat(formData.get('amount') as string);
        const source = formData.get('source') as string;
        const description = formData.get('description') as string;
        const date = formData.get('date') as string;
        
        if (isNaN(amount) || amount <= 0) {
          setToast({ id: Date.now().toString(), message: 'Invalid amount', type: 'error' });
          return;
        }
        
        try {
          await addDoc(collection(db, `users/${user.uid}/incomes`), {
            amount,
            source,
            description: description || 'Income',
            date,
            createdAt: serverTimestamp()
          });
          
          setShowIncomeModal(false);
          setToast({ id: Date.now().toString(), message: 'Income added!', type: 'success' });
        } catch (error) {
          console.error('Error adding income:', error);
          setToast({ id: Date.now().toString(), message: 'Failed to add income', type: 'error' });
        }
      }} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="amount"
            step="0.01"
            placeholder="Amount"
            required
            className={`px-4 py-3 rounded-xl border-2 outline-none transition font-bold text-lg ${
              isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
          <select
            name="source"
            required
            className={`px-4 py-3 rounded-xl border-2 outline-none transition font-bold ${
              isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="investment">Investment</option>
            <option value="gift">Gift</option>
            <option value="other">Other</option>
          </select>
        </div>




        <input
          type="text"
          name="description"
          placeholder="Description (optional)"
          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition font-medium ${
            isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        />




        <input
          type="date"
          name="date"
          defaultValue={getTodayString()}
          required
          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition font-medium ${
            isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        />




        <button
          type="submit"
          className={`w-full px-4 py-3 rounded-xl font-bold text-white transition ${
            isDark 
              ? (isGreen ? 'bg-green-500 hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400')
              : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
          }`}
        >
          Add Income
        </button>
      </form>
    </div>
  </div>
)}              




      <form onSubmit={(e) => {
  e.preventDefault();
  
  const formElements = (e.target as HTMLFormElement).elements;
  const allowanceInput = formElements.namedItem('allowance') as HTMLInputElement;
  const currencySelect = formElements.namedItem('currency') as HTMLSelectElement;
  
  const amount = parseFloat(allowanceInput.value);
  const selectedCurrency = currencySelect?.value || currency;
  
  console.log('📝 Form submitted:', { amount, selectedCurrency });
  
  // Validation
  if (isNaN(amount) || amount <= 0) {
    setToast({ 
      id: Date.now().toString(), 
      message: 'Please enter a valid amount', 
      type: 'error' 
    });
    return;
  }
  
  if (!selectedCurrency) {
    setToast({ 
      id: Date.now().toString(), 
      message: 'Please select a currency', 
      type: 'error' 
    });
    return;
  }
  
  // Save with validated data
  saveDailyAllowance(amount, selectedCurrency);
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
  {/* 💰 PHASE 3: Net Worth Card */}
<div className={`mb-6 p-6 rounded-3xl border-2 shadow-lg ${
  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
}`}>
  <div className="text-center">
    <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${
      isDark ? 'text-slate-500' : 'text-slate-400'
    }`}>
      Net Worth
    </h3>
    <div className={`text-5xl font-black mb-2 ${
      netWorth >= 0
        ? (isDark ? (isGreen ? 'text-green-400' : isLgbt ? 'text-blue-400' : 'text-pink-400') : (isGreen ? 'text-green-600' : isLgbt ? 'text-blue-600' : 'text-pink-600'))
        : 'text-red-500'
    }`}>
      {currencySymbol}{Math.abs(netWorth).toFixed(2)}
    </div>
    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
      {netWorth >= 0 ? '💰 Positive Balance' : '⚠️ In Debt'}
    </p>
  </div>
  
  <div className="grid grid-cols-2 gap-4 mt-6">
    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-green-50'}`}>
      <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
        isDark ? 'text-slate-500' : 'text-green-600'
      }`}>
        Total Income
      </p>
      <p className={`text-2xl font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>
        {currencySymbol}{totalIncomeAmount.toFixed(2)}
      </p>
    </div>
    
    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-red-50'}`}>
      <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
        isDark ? 'text-slate-500' : 'text-red-600'
      }`}>
        Total Expenses
      </p>
      <p className={`text-2xl font-black ${isDark ? 'text-red-400' : 'text-red-600'}`}>
        {currencySymbol}{totalExpenseAmount.toFixed(2)}
      </p>
    </div>
  </div>
  
  <button
    onClick={() => setShowIncomeModal(true)}
    className={`w-full mt-4 px-4 py-3 rounded-xl font-bold transition ${
      isDark 
        ? (isGreen ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : isLgbt ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30')
        : (isGreen ? 'bg-green-100 text-green-700 hover:bg-green-200' : isLgbt ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-pink-100 text-pink-700 hover:bg-pink-200')
    }`}
  >
    + Add Income
  </button>
</div>




  {/* 👇 NEW: Currency Selector - ADD THIS ENTIRE BLOCK */}
  <div>
    <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
      Currency
    </label>
   <select
  name="currency"
  value={currency}  // 🔥 CHANGED: Use value instead of defaultValue
  onChange={(e) => {
    const selectedCode = e.target.value;
    const selectedCurr = CURRENCIES.find(c => c.code === selectedCode);
    if (selectedCurr) {
      console.log('💱 Currency preview:', selectedCurr);
      setCurrency(selectedCode);
      setCurrencySymbol(selectedCurr.symbol);
    }
  }}
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
{/* 📱 MOBILE BOTTOM NAVIGATION */}
<nav className={`fixed bottom-0 left-0 right-0 z-40 md:hidden border-t-2 backdrop-blur-xl ${
  isDark 
    ? (isGreen ? 'bg-slate-900/95 border-green-900' : isLgbt ? 'bg-slate-900/95 border-indigo-900' : 'bg-slate-900/95 border-pink-900')
    : (isGreen ? 'bg-white/95 border-green-200' : isLgbt ? 'bg-white/95 border-indigo-200' : 'bg-white/95 border-pink-200')
}`}>
  <div className="flex justify-around items-center h-16 px-2">
    <button
      onClick={() => setCurrentPage('habits')}
      className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition min-w-[60px] ${
        currentPage === 'habits'
          ? (isDark 
              ? (isGreen ? 'bg-green-500/20 text-green-400' : isLgbt ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400')
              : (isGreen ? 'bg-green-100 text-green-700' : isLgbt ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700')
            )
          : (isDark ? 'text-slate-500' : 'text-slate-400')
      }`}
    >
      <Target className="w-6 h-6" />
      <span className="text-[10px] font-bold">Habits</span>
    </button>
    
    <button
      onClick={() => setCurrentPage('todos')}
      className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition min-w-[60px] ${
        currentPage === 'todos'
          ? (isDark 
              ? (isGreen ? 'bg-green-500/20 text-green-400' : isLgbt ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400')
              : (isGreen ? 'bg-green-100 text-green-700' : isLgbt ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700')
            )
          : (isDark ? 'text-slate-500' : 'text-slate-400')
      }`}
    >
      <CheckCircle2 className="w-6 h-6" />
      <span className="text-[10px] font-bold">Tasks</span>
    </button>
    
    <button
      onClick={() => setCurrentPage('money')}
      className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition min-w-[60px] ${
        currentPage === 'money'
          ? (isDark 
              ? (isGreen ? 'bg-green-500/20 text-green-400' : isLgbt ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400')
              : (isGreen ? 'bg-green-100 text-green-700' : isLgbt ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700')
            )
          : (isDark ? 'text-slate-500' : 'text-slate-400')
      }`}
    >
      <DollarSign className="w-6 h-6" />
      <span className="text-[10px] font-bold">Money</span>
    </button>
    
    <button
      onClick={() => setShowStats(true)}
      className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition min-w-[60px] ${
        isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <PieChart className="w-6 h-6" />
      <span className="text-[10px] font-bold">Stats</span>
    </button>
  </div>
</nav>
</main>
      
      {reminderHabit && (
        <ReminderModal
          habit={reminderHabit}
          onClose={() => setReminderHabit(null)}
          onSave={(enabled, time) => {
            saveReminder(reminderHabit.id, enabled, time);
            setReminderHabit(null);
          }}
        />
      )}
      
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Toast toast={toast} onDismiss={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};




// 🎓 ONBOARDING FLOW COMPONENT
const OnboardingFlow = ({ 
  onComplete, 
  isDark, 
  isGreen, 
  isLgbt 
}: { 
  onComplete: () => void;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}) => {
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState('');
  const [selectedHabit, setSelectedHabit] = useState('');




  const steps = [
    {
      title: "Welcome to HabitFlow! 🎉",
      description: "Your all-in-one platform for habits, tasks, and money management",
      emoji: "👋",
      action: null
    },
    {
      title: "Set Your Daily Budget 💰",
      description: "How much can you spend each day?",
      emoji: "💵",
      action: (
        <div className="w-full">
          <input
            type="number"
            step="0.01"
            placeholder="e.g., 50.00"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition font-bold text-2xl text-center ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-white focus:border-green-400'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-green-500'
            }`}
            autoFocus
          />
        </div>
      )
    },
    {
      title: "Quick Start Habit 🎯",
      description: "Choose a habit to track (or skip)",
      emoji: "🚀",
      action: (
        <div className="grid grid-cols-2 gap-3 w-full">
          {['Workout', 'Meditate', 'Read', 'Study'].map(habit => (
            <button
              key={habit}
              onClick={() => setSelectedHabit(habit)}
              className={`p-4 rounded-xl border-2 font-bold transition ${
                selectedHabit === habit
                  ? (isDark 
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-green-600 border-green-600 text-white'
                    )
                  : (isDark 
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    )
              }`}
            >
              {habit}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "You're All Set! ✅",
      description: "Start building better habits today",
      emoji: "🎊",
      action: null
    }
  ];




  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;




  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    } else {
      setStep(step + 1);
    }
  };




  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };




  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-pop ${
        isDark ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white border-2 border-slate-100'
      }`}>
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                idx <= step
                  ? (isGreen ? 'bg-green-500' : isLgbt ? 'bg-indigo-500' : 'bg-pink-500')
                  : (isDark ? 'bg-slate-700' : 'bg-slate-200')
              }`}
            />
          ))}
        </div>




        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">{currentStep.emoji}</div>
          <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currentStep.title}
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {currentStep.description}
          </p>
        </div>




        {/* Action Area */}
        {currentStep.action && (
          <div className="mb-8 flex justify-center">
            {currentStep.action}
          </div>
        )}




        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && step < steps.length - 1 && (
            <button
              onClick={handleSkip}
              className={`flex-1 px-6 py-4 rounded-2xl font-bold transition ${
                isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step === 1 && !budget}
            className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white transition shadow-lg ${
              isDark 
                ? (isGreen ? 'bg-green-500 hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400')
                : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
            } ${step === 1 && !budget ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLastStep ? "Let's Go!" : 'Continue'}
          </button>
        </div>




        {/* Step Counter */}
        <p className={`text-center mt-6 text-sm font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          Step {step + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
};




const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const { theme, accent, isDark } = useTheme(); // Use isDark from context
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';
  
  // Add platform detection hooks
  const platformInfo = usePlatformInfo();
  const safeArea = useSafeArea();




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




 




 // ============ REPLACE PWA PROMPT RETURN STATEMENT ============
  if (!showInstall) return null;

  return (
    <div 
      className="fixed bottom-6 left-4 right-4 z-50 animate-slide-up max-w-md mx-auto"
      style={{
        bottom: `${24 + (platformInfo?.hasSafeArea ? safeArea?.bottom || 0 : 0)}px`
      }}
    >
      <div className={`
        p-4 rounded-2xl shadow-2xl 
        flex items-center justify-between 
        backdrop-blur-xl border-2 
        ${isDark 
          ? isGreen 
            ? 'bg-green-900/95 border-green-600' 
            : isLgbt 
              ? 'bg-slate-900/95 border-purple-600'
              : 'bg-pink-900/95 border-pink-600'
          : isGreen 
            ? 'bg-green-700 border-green-500' 
            : isLgbt 
              ? 'bg-purple-700 border-purple-500'
              : 'bg-pink-700 border-pink-500'
        }
        text-white
      `}>
        <div className="flex items-center gap-3 flex-1">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-white/20' : 'bg-white/30'}
          `}>
            <Download className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg">Install HabitFlow</p>
            <p className="text-sm opacity-90">Quick access from your home screen!</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <TouchButton
            onClick={handleInstall}
            variant="secondary"
            size="sm"
            className="!bg-white !text-slate-900 hover:!bg-slate-100"
          >
            Install
          </TouchButton>
          
          <IconButton
            icon={X}
            onClick={handleDismiss}
            label="Dismiss install prompt"
            variant="ghost"
            className="!text-white hover:!bg-white/20"
          />
        </div>
      </div>
    </div>
  );
};
// ============ END OF PWA PROMPT REPLACEMENT ============



// ============ REPLACE ENTIRE APP COMPONENT ============


// 📊 Loading Screen Component
const LoadingScreen: React.FC = () => {
  const { accent, isDark } = useTheme();
  
  const bgClass = isDark
    ? 'bg-slate-900'
    : accent === 'green' 
      ? 'bg-green-50' 
      : accent === 'lgbt' 
        ? 'bg-gradient-to-br from-purple-50 to-pink-50' 
        : 'bg-pink-50';
  
  const spinnerClass = isDark
    ? accent === 'green'
      ? 'bg-green-500'
      : accent === 'lgbt'
        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
        : 'bg-pink-500'
    : accent === 'green'
      ? 'bg-green-600'
      : accent === 'lgbt'
        ? 'bg-gradient-to-br from-purple-600 to-pink-600'
        : 'bg-pink-600';
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 rounded-2xl animate-spin mb-4 shadow-lg ${spinnerClass}`} />
        <p className={`font-bold text-lg animate-pulse ${
          isDark ? 'text-slate-100' : 
          accent === 'green' ? 'text-green-900' : 
          accent === 'lgbt' ? 'text-purple-900' : 
          'text-pink-900'
        }`}>
          Loading HabitFlow...
        </p>
        <p className={`text-sm mt-2 ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Please wait while we prepare your experience
        </p>
      </div>
    </div>
  );
};

// 🎯 Main App Component
const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'welcome' | 'dashboard'>('landing');
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false); // ADD THIS LINE
  
  // Platform detection
  const platformInfo = usePlatformInfo();
  const safeArea = useSafeArea();
  const haptics = useHaptics();
  
  // Memoize logout callback
  const handleLogout = useCallback(async () => {
    try {
      haptics.medium(); // Haptic feedback
      await signOut(auth);
      setView('landing');
      setUser(null);
    } catch (error) {
      console.error('❌ Logout error:', error);
      haptics.error();
    }
  }, [haptics]);
  
  // Auth state management
  useEffect(() => {
    if (!auth) {
      console.warn('⚠️ Firebase Auth not initialized');
      setAuthLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔐 Auth state changed:', currentUser ? 'Logged in' : 'Logged out');
      
      if (currentUser) {
        setUser(currentUser);
        setView('dashboard');
      } else {
        setUser(null);
        if (view === 'dashboard') {
          setView('landing');
        }
      }
      
      setAuthLoading(false);
    });
    
    // Custom token sign-in (for SSO or special auth flows)
    const initAuth = async () => {
      const initialToken = (window as any).__initial_auth_token;
      if (initialToken) {
        try {
          console.log('🎫 Attempting custom token sign-in...');
          await signInWithCustomToken(auth, initialToken);
          console.log('✅ Custom token sign-in successful');
        } catch (e) {
          console.error('❌ Custom token sign-in failed:', e);
        }
      }
    };
    
    initAuth();
    
    return () => unsubscribe();
  }, [view]);
  
  // Android back button handler
  useAndroidBackButton(() => {
    if (view === 'welcome') {
      setView('landing');
    } else if (view === 'dashboard') {
      // Show confirmation before exiting
      if (window.confirm('Are you sure you want to exit?')) {
        handleLogout();
      }
    }
  });
  
  // Memoize view rendering to prevent unnecessary re-renders
  const renderedView = useMemo(() => {
    if (authLoading) {
      return <LoadingScreen />;
    }
    
    if (view === 'dashboard' && user) {
      return <Dashboard user={user} onLogout={handleLogout} />;
    }
    
    if (view === 'welcome') {
      return <WelcomePage onSuccess={() => setView('dashboard')} />;
    }
    
    return <LandingPage onGetStarted={() => setView('welcome')} />;
  }, [authLoading, view, user, handleLogout]);
  
  // Apply safe area padding for iOS devices
  const containerStyle: React.CSSProperties = platformInfo.hasSafeArea ? {
    paddingTop: `${safeArea.top}px`,
    paddingBottom: `${safeArea.bottom}px`,
    paddingLeft: `${safeArea.left}px`,
    paddingRight: `${safeArea.right}px`,
  } : {};

  // Handle consent acceptance
  const handleConsent = () => {
    const consent = localStorage.getItem('data-consent');
    if (consent) {
      const data = JSON.parse(consent);
      setAnalyticsEnabled(data.analytics);
      
      // Initialize analytics if consented
      if (data.analytics && analytics) {
        import('firebase/analytics').then(({ setAnalyticsCollectionEnabled }) => {
          setAnalyticsCollectionEnabled(analytics, true);
          console.log('✅ Analytics enabled');
        });
      }
    }
  };
  
  
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div style={containerStyle} className="min-h-screen">
          <Suspense fallback={<LoadingScreen />}>
            <ConsentBanner onAccept={handleConsent} />
            <PWAInstallPrompt />
            {renderedView}
          </Suspense>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
// ============ END OF APP COMPONENT REPLACEMENT ============