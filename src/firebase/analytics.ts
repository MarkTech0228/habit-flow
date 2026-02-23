// src/firebase/analytics.ts
// Moved from App.tsx lines 615–714
// `Record<string, any>` → `Record<string, unknown>` throughout.
import { logEvent, setUserProperties } from 'firebase/analytics';
import { analytics } from './config';

// ── Consent guard ──────────────────────────────────────────
export const isAnalyticsEnabled = (): boolean => {
  try {
    const consent = localStorage.getItem('data-consent');
    if (!consent) return false;
    return JSON.parse(consent).analytics === true;
  } catch {
    return false;
  }
};

// ── Core event logger ──────────────────────────────────────
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>   // was: Record<string, any>
): void => {
  if (!isAnalyticsEnabled() || !analytics) return;
  try {
    logEvent(analytics, eventName, params as Record<string, unknown>);
    if (import.meta.env.DEV) console.log(`📊 Analytics: ${eventName}`, params);
  } catch (err) {
    console.error('Analytics error:', err);
  }
};

// ── User property setter ──────────────────────────────────
export const setAnalyticsUserProperties = (
  properties: Record<string, unknown>  // was: Record<string, any>
): void => {
  if (!isAnalyticsEnabled() || !analytics) return;
  try {
    setUserProperties(analytics, properties as Record<string, string>);
  } catch (err) {
    console.error('Analytics error:', err);
  }
};

// ── Screen view ────────────────────────────────────────────
export const trackScreenView = (screenName: string): void => {
  if (!isAnalyticsEnabled() || !analytics) return;
  try {
    logEvent(analytics, 'screen_view', {
      firebase_screen:       screenName,
      firebase_screen_class: screenName,
    });
  } catch (err) {
    console.error('Analytics error:', err);
  }
};

// ── Pre-defined event helpers ─────────────────────────────
export const Analytics = {
  // Auth
  userSignedUp:  ()                           => trackEvent('sign_up',               { method: 'email' }),
  userLoggedIn:  ()                           => trackEvent('login',                 { method: 'email' }),
  userLoggedOut: ()                           => trackEvent('logout'),

  // Habits
  habitCreated:  (habitType: string)          => trackEvent('habit_created',         { habit_type: habitType }),
  habitCompleted:(habitId: string)            => trackEvent('habit_completed',        { habit_id: habitId }),
  streakAchieved:(days: number)               => trackEvent('streak_achieved',        { days }),

  // Todos
  todoCreated:   ()                           => trackEvent('todo_created'),
  todoCompleted: ()                           => trackEvent('todo_completed'),

  // Finance
  expenseAdded:  (amount: number, category: string) =>
    trackEvent('expense_added',  { value: amount, category }),
  incomeAdded:   (amount: number, source: string)   =>
    trackEvent('income_added',   { value: amount, source }),
  goalCreated:   (targetAmount: number)        => trackEvent('goal_created',          { value: targetAmount }),
  goalReached:   (amount: number)              => trackEvent('goal_reached',           { value: amount }),

  // App
  themeChanged:  (theme: string, accent: string)    =>
    trackEvent('theme_changed',  { theme, accent }),
  featureUsed:   (featureName: string)         => trackEvent('feature_used',           { feature: featureName }),
  errorOccurred: (errorMessage: string, component: string) =>
    trackEvent('app_error',      { error: errorMessage, component }),

  // Subscriptions
  subscriptionStarted: (tier: string, price: number) =>
    trackEvent('subscription_started', { tier, value: price }),
  subscriptionCanceled:(tier: string)          => trackEvent('subscription_canceled', { tier }),
};