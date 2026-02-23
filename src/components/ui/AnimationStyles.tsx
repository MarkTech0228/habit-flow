// src/components/ui/AnimationStyles.tsx
// Moved from App.tsx lines 2500–2560
// All custom CSS keyframes used throughout the app
import React from 'react';

export const AnimationStyles: React.FC = () => (
  <style>{`
    /* ── Core micro-animations ── */
    @keyframes pop {
      0%   { transform: scale(1); }
      50%  { transform: scale(0.95); }
      100% { transform: scale(1); }
    }
    @keyframes float {
      0%   { transform: translateY(0px); }
      50%  { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    @keyframes slideUp {
      from { transform: translateY(10px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes confettiFall {
      0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
      100% { transform: translateY(100vh)  rotate(720deg); opacity: 0; }
    }
    @keyframes confettiPop {
      0%   { transform: rotate(var(--r)) translateY(-25px) scale(1);   opacity: 1; }
      100% { transform: rotate(var(--r)) translateY(-50px) scale(0);   opacity: 0; }
    }

    /* ── Utility classes ── */
    .animate-pop         { animation: pop      0.3s ease; }
    .animate-float       { animation: float    3s ease-in-out infinite; }
    .animate-slide-up    { animation: slideUp  0.3s ease; }
    .animate-slide-in    { animation: slideIn  0.3s ease; }
    .animate-fade-in     { animation: fadeIn   0.3s ease; }
    .confetti-fall       { animation: confettiFall 3s ease-in forwards; }
    .confetti-pop        { animation: confettiPop  0.5s ease-out forwards; position: absolute; width: 8px; height: 8px; border-radius: 2px; }
    .confetti-piece      { position: absolute; width: 10px; height: 10px; border-radius: 2px; }

    /* ── Scrollbar hide (WebKit + Firefox) ── */
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

    /* ── Skeleton shimmer ── */
    .skeleton {
      background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .dark .skeleton {
      background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
      background-size: 200% 100%;
    }
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }

    /* ── Rainbow theme backgrounds ── */
    .bg-rainbow-light {
      background: linear-gradient(135deg, #fff0f3 0%, #fff9f0 25%, #fffff0 50%, #f0fff4 75%, #f0f4ff 100%);
    }
    .bg-rainbow-dark {
      background: linear-gradient(135deg, #18181b 0%, #1a1014 50%, #0f1820 100%);
    }
  `}</style>
);