import { useState, useEffect } from 'react';
import { TrendingUp, X } from 'lucide-react';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  
  // Theme states (replacing useTheme)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [accent, setAccent] = useState<'pink' | 'green' | 'lgbt'>('pink');
  
  const isDark = theme === 'dark';
  const isGreen = accent === 'green';
  const isLgbt = accent === 'lgbt';

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const savedAccent = localStorage.getItem('accent') as 'pink' | 'green' | 'lgbt';
    if (savedTheme) setTheme(savedTheme);
    if (savedAccent) setAccent(savedAccent);
  }, []);

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

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 animate-slide-up max-w-md mx-auto">
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
            onClick={handleDismiss}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};