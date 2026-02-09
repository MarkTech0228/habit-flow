import React, { useEffect, useState } from 'react';


interface FullScreenConfettiProps {
  show: boolean;
  onComplete?: () => void;
  duration?: number;
}


const FullScreenConfetti: React.FC<FullScreenConfettiProps> = ({
  show,
  onComplete,
  duration = 3000
}) => {
  const [confetti, setConfetti] = useState<Array<{
    id: number;
    left: number;
    animationDuration: number;
    color: string;
    size: number;
    delay: number;
  }>>([]);


  useEffect(() => {
    if (show) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDuration: 2 + Math.random() * 2,
        color: ['#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'][
          Math.floor(Math.random() * 6)
        ],
        size: 8 + Math.random() * 8,
        delay: Math.random() * 500
      }));


      setConfetti(pieces);


      // Clear confetti after duration
      const timer = setTimeout(() => {
        setConfetti([]);
        if (onComplete) onComplete();
      }, duration);


      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);


  if (!show && confetti.length === 0) return null;


  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-fall absolute"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: '2px',
            animationDuration: `${piece.animationDuration}s`,
            animationDelay: `${piece.delay}ms`
          }}
        />
      ))}
    </div>
  );
};


export default FullScreenConfetti;




