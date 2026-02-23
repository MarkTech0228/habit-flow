// src/components/ui/ErrorBoundary.tsx
// Moved from App.tsx lines 1315–1438
import React from 'react';
import { analytics } from '../../firebase/config';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('💥 App Error Caught:', error);
    if (analytics) {
      import('firebase/analytics').then(({ logEvent }) => {
        logEvent(analytics!, 'app_error', {
          error_message:   error.message,
          error_stack:     error.stack?.substring(0, 500),
          component_stack: errorInfo.componentStack?.substring(0, 500),
        });
      }).catch(() => {/* silent */});
    }
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Oops! Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              We encountered an unexpected error. Your data is safe.
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
              If this keeps happening, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}