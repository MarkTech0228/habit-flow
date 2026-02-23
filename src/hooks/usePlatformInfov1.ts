// src/hooks/usePlatformInfo.ts
// Moved from App.tsx lines 250–388
// Fixed: `(window as any).MSStream` and `(window.navigator as any).standalone`
import { useState, useEffect, useCallback } from 'react';
import type { PlatformInfo } from '../types';

// ── Safe-area insets (iOS notch / Dynamic Island) ─────────
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

  useEffect(() => {
    const update = () => {
      const cs = getComputedStyle(document.documentElement);
      const px = (v: string) => parseInt(cs.getPropertyValue(v).replace('px', '')) || 0;
      setSafeArea({ top: px('--sat'), bottom: px('--sab'), left: px('--sal'), right: px('--sar') });
    };

    update();
    window.addEventListener('resize',            update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize',            update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return safeArea;
};

// ── Android back-button handler ────────────────────────────
export const useAndroidBackButton = (onBack: () => void) => {
  useEffect(() => {
    const handle = (e: PopStateEvent) => { e.preventDefault(); onBack(); };
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handle);
    return () => window.removeEventListener('popstate', handle);
  }, [onBack]);
};

// ── Platform detection ─────────────────────────────────────
export const usePlatformInfo = (): PlatformInfo => {
  const [info, setInfo] = useState<PlatformInfo>({
    os: 'web', browser: 'unknown', version: '0',
    isStandalone: false, hasSafeArea: false, supportsHaptics: false,
  });

  useEffect(() => {
    const ua = navigator.userAgent;

    // FIX: was `(window as any).MSStream`
    const isIOS     = /iPad|iPhone|iPod/.test(ua) &&
                      !(window as Window & { MSStream?: unknown }).MSStream;
    const isAndroid = /Android/.test(ua);
    const isDesktop = /(Macintosh|Windows|Linux)/.test(ua) && !isIOS && !isAndroid;

    // FIX: was `(window.navigator as any).standalone`
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    const hasSafeArea     = CSS.supports('padding-top: env(safe-area-inset-top)');
    const supportsHaptics = 'vibrate' in navigator;

    const getBrowser = (): string => {
      if (ua.includes('Chrome'))  return 'chrome';
      if (ua.includes('Safari'))  return 'safari';
      if (ua.includes('Firefox')) return 'firefox';
      if (ua.includes('Edge'))    return 'edge';
      return 'unknown';
    };

    const getVersion = (): string => {
      const m = ua.match(/(?:Chrome|Safari|Firefox|Edge)\/(\d+)/);
      return m ? m[1] : '0';
    };

    setInfo({
      os: isIOS ? 'ios' : isAndroid ? 'android' : isDesktop ? 'desktop' : 'web',
      browser: getBrowser(),
      version: getVersion(),
      isStandalone,
      hasSafeArea,
      supportsHaptics,
    });
  }, []);

  return info;
};

// ── Haptic feedback ────────────────────────────────────────
export const useHaptics = () => {
  const { supportsHaptics } = usePlatformInfo();

  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (supportsHaptics && navigator.vibrate) navigator.vibrate(pattern);
  }, [supportsHaptics]);

  return {
    light:   useCallback(() => vibrate(10),                [vibrate]),
    medium:  useCallback(() => vibrate(20),                [vibrate]),
    heavy:   useCallback(() => vibrate(30),                [vibrate]),
    success: useCallback(() => vibrate([10, 50, 10]),      [vibrate]),
    warning: useCallback(() => vibrate([20, 100, 20]),     [vibrate]),
    error:   useCallback(() => vibrate([30, 100, 30, 100, 30]), [vibrate]),
  };
};