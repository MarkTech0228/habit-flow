// src/constants/themes.ts
// Moved from App.tsx lines 1050–1117 + subscription tiers 968–1026
// Free-tier limits raised: maxHabits 3→7, maxGoals 1→3, maxExpenses 50→100
import type { SubscriptionTier } from '../types';

// ── Touch target sizes (Apple HIG + Material Design) ──────
export const TOUCH_TARGETS = {
  MIN_SIZE_IOS:     44,   // Apple minimum
  MIN_SIZE_ANDROID: 48,   // Material Design minimum
  RECOMMENDED:      56,   // Comfortable for all users
  SPACING:           8,   // Minimum space between targets
  ICON_SIZE:        24,   // Standard icon
  ICON_SIZE_LARGE:  32,   // Large icon
} as const;

// ── Design-token colour palette ────────────────────────────
export const THEME_COLORS = {
  pink: {
    light: {
      primary:         '#ec4899',
      primaryHover:    '#db2777',
      background:      '#fdf2f8',
      surface:         '#ffffff',
      text:            '#1f2937',
      textSecondary:   '#6b7280',
    },
    dark: {
      primary:         '#ec4899',
      primaryHover:    '#f472b6',
      background:      '#18181b',
      surface:         '#27272a',
      text:            '#f9fafb',
      textSecondary:   '#9ca3af',
    },
  },
  green: {
    light: {
      primary:         '#10b981',
      primaryHover:    '#059669',
      background:      '#f0fdf4',
      surface:         '#ffffff',
      text:            '#1f2937',
      textSecondary:   '#6b7280',
    },
    dark: {
      primary:         '#10b981',
      primaryHover:    '#34d399',
      background:      '#18181b',
      surface:         '#27272a',
      text:            '#f9fafb',
      textSecondary:   '#9ca3af',
    },
  },
  lgbt: {
    light: {
      primary:         '#8b5cf6',
      primaryHover:    '#7c3aed',
      background:      '#faf5ff',
      surface:         '#ffffff',
      text:            '#1f2937',
      textSecondary:   '#6b7280',
    },
    dark: {
      primary:         '#8b5cf6',
      primaryHover:    '#a78bfa',
      background:      '#18181b',
      surface:         '#27272a',
      text:            '#f9fafb',
      textSecondary:   '#9ca3af',
    },
  },
} as const;

// ── Subscription tiers ─────────────────────────────────────
// NOTE: Free tier limits intentionally raised from the original
// (maxHabits 3→7, maxGoals 1→3, maxExpenses 50→100) per growth strategy.
export const SUBSCRIPTION_TIERS_CONST: Record<SubscriptionTier['id'], SubscriptionTier> = {
  free: {
    id:            'free',
    name:          'Free',
    price:         0,
    billingPeriod: 'monthly',
    features: {
      maxHabits:        7,     // was 3
      maxGoals:         3,     // was 1
      maxExpenses:      100,   // was 50
      analytics:        false,
      cloudBackup:      false,
      customThemes:     false,
      aiInsights:       false,
      exportData:       false,
      prioritySupport:  false,
    },
  },
  pro: {
    id:            'pro',
    name:          'Pro',
    price:         4.99,
    billingPeriod: 'monthly',
    features: {
      maxHabits:        20,
      maxGoals:         5,
      maxExpenses:      500,
      analytics:        true,
      cloudBackup:      true,
      customThemes:     true,
      aiInsights:       false,
      exportData:       true,
      prioritySupport:  false,
    },
    stripePriceId: 'price_pro_monthly',
    appStoreSku:   'com.habitflow.pro.monthly',
    playStoreSku:  'pro_monthly',
  },
  premium: {
    id:            'premium',
    name:          'Premium',
    price:         9.99,
    billingPeriod: 'monthly',
    features: {
      maxHabits:        Infinity,
      maxGoals:         Infinity,
      maxExpenses:      Infinity,
      analytics:        true,
      cloudBackup:      true,
      customThemes:     true,
      aiInsights:       true,
      exportData:       true,
      prioritySupport:  true,
    },
    stripePriceId: 'price_premium_monthly',
    appStoreSku:   'com.habitflow.premium.monthly',
    playStoreSku:  'premium_monthly',
  },
};