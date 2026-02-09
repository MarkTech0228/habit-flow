export const FEATURES = {
  HABITS: true,
  TODOS: true,
  MONEY_TRACKING: true,
  RECEIPTS: true,
  NOTIFICATIONS: true,
  GAMIFICATION: true,
  ANALYTICS: true,
  EXPORT_DATA: true,
  DARK_MODE: true,
  PWA_INSTALL: true,
  ONBOARDING: true,
} as const;

export const isFeatureEnabled = (feature: keyof typeof FEATURES): boolean => {
  return FEATURES[feature];
};