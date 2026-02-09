import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';


interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}


interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}


class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }


  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }


  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
   
    this.setState({
      error,
      errorInfo
    });


    // TODO: Log to error reporting service (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
  }


  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };


  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }


      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 text-center border-2 border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
           
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h1>
           
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Don't worry, your data is safe. Try refreshing the page.
            </p>


            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Error Details (Dev Mode)
                </summary>
                <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-4 rounded-xl overflow-auto max-h-48 text-red-600 dark:text-red-400">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}


            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-500 dark:to-rose-500 text-white px-6 py-3 rounded-xl font-bold transition hover:shadow-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-bold transition hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }


    return this.props.children;
  }
}


export default ErrorBoundary;




