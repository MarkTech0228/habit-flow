// src/components/ui/ConsentBanner.tsx
// Moved from App.tsx lines 1441–1570
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface ConsentBannerProps {
  onAccept: () => void;
}

export const ConsentBanner: React.FC<ConsentBannerProps> = ({ onAccept }) => {
  const { isDark, accent } = useTheme();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('data-consent')) {
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const save = (analytics: boolean) => {
    localStorage.setItem('data-consent', JSON.stringify({
      analytics,
      marketing: false,
      essential: true,
      timestamp: new Date().toISOString(),
      version: '1.0',
    }));
    setShowBanner(false);
    onAccept();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className={`p-4 md:p-6 shadow-2xl ${
        isDark
          ? 'bg-slate-900 border-t-2 border-slate-800'
          : 'bg-white border-t-2 border-slate-200'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

            {/* Copy */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🍪</span>
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  We Value Your Privacy
                </h3>
              </div>
              <p className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                We use essential cookies to make our app work, and optional analytics to improve
                your experience. We <strong>never</strong> sell your data.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <a href="/privacy-policy.html" target="_blank"
                  className={`underline ${isDark ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'}`}>
                  Privacy Policy
                </a>
                <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>•</span>
                <a href="/terms-of-service.html" target="_blank"
                  className={`underline ${isDark ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'}`}>
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={() => save(false)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                Essential Only
              </button>
              <button
                onClick={() => save(true)}
                className={`px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg active:scale-95 ${
                  accent === 'green'
                    ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
                    : accent === 'lgbt'
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30'
                    : 'bg-pink-600 hover:bg-pink-700 shadow-pink-500/30'
                }`}
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