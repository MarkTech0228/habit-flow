// src/components/ui/FullScreenConfetti.tsx
// Moved from App.tsx lines 2783–2832
import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export const FullScreenConfetti: React.FC = () => {
  const { accent } = useTheme();
  const isGreen = accent === 'green';
  const isLgbt  = accent === 'lgbt';

  const colors = isGreen
    ? ['#10B981', '#34D399', '#059669', '#6EE7B7', '#FCD34D']
    : isLgbt
    ? ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#A855F7']
    : ['#DB2777', '#BE185D', '#F472B6', '#FCD34D', '#60A5FA'];

  const pieces = Array.from({ length: 80 }, (_, i) => ({
    id:              i,
    left:            `${Math.random() * 100}%`,
    animationDelay:  `${Math.random() * 2}s`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece confetti-fall absolute top-[-20px]"
          style={{
            left:            p.left,
            backgroundColor: p.backgroundColor,
            animationDelay:  p.animationDelay,
            width:           '12px',
            height:          '12px',
          }}
        />
      ))}
    </div>
  );
};