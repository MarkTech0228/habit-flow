// src/components/ui/PWAInstallPrompt.tsx
// Moved from App.tsx lines 14277–14435
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { usePlatformInfo, useSafeArea } from '../../hooks/usePlatformInfo';
import { TouchButton } from './Buttons';
import { IconButton } from './Buttons';

// Browser's beforeinstallprompt event (not yet in TypeScript lib)
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const { accent, isDark } = useTheme();
  const isGreen = accent === 'green';
  const isLgbt  = accent === 'lgbt';
  const platformInfo = usePlatformInfo();
  const safeArea     = useSafeArea();

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall,    setShowInstall]    = useState(false);

  // Capture install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    if (window.matchMedia('(display-mode: standalone)').matches) setShowInstall(false);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Respect user's previous dismissal (7-day cooldown)
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
    if (outcome === 'accepted') setShowInstall(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstall(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showInstall) return null;

  const bottomOffset = 24 + (platformInfo.hasSafeArea ? safeArea.bottom : 0);

  return (
    <div
      className="fixed left-4 right-4 z-50 animate-slide-up max-w-md mx-auto"
      style={{ bottom: `${bottomOffset}px` }}
    >
      <div className={`p-4 rounded-2xl shadow-2xl flex items-center justify-between backdrop-blur-xl border-2 text-white ${
        isDark
          ? isGreen ? 'bg-green-900/95 border-green-600'
            : isLgbt ? 'bg-slate-900/95 border-purple-600'
            : 'bg-pink-900/95 border-pink-600'
          : isGreen ? 'bg-green-700 border-green-500'
            : isLgbt ? 'bg-purple-700 border-purple-500'
            : 'bg-pink-700 border-pink-500'
      }`}>
        {/* Left: icon + text */}
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/20' : 'bg-white/30'}`}>
            <Download className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg">Install HabitFlow</p>
            <p className="text-sm opacity-90">Quick access from your home screen!</p>
          </div>
        </div>

        {/* Right: buttons */}
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