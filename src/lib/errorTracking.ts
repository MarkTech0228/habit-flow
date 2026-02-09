export const logError = (error: Error, context?: string) => {
  console.error(`[${context || 'Error'}]:`, error);
  
  // In production, you'd send this to a service like Sentry
  if (import.meta.env.PROD) {
    // Example: Sentry.captureException(error);
  }
};

export const logWarning = (message: string, context?: string) => {
  console.warn(`[${context || 'Warning'}]:`, message);
};