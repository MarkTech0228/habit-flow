export const ROUTES = {
  LANDING: '/',
  WELCOME: '/welcome',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];