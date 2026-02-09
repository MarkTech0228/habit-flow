import React, { useState, useEffect } from 'react';


interface ConfettiCheckProps {
  checked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}


const ConfettiCheck: React.FC<ConfettiCheckProps> = ({
  checked,
  onToggle,
  size = 'md',
  color = 'pink'
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);


  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };


  const colors = {
    pink: 'bg-pink-600 border-pink-600',
    green: 'bg-green-600 border-green-600',
    blue: 'bg-blue-600 border-blue-600',
    purple: 'bg-purple-600 border-purple-600',
    orange: 'bg-orange-600 border-orange-600'
  };


  useEffect(() => {
    if (checked && !showConfetti) {
      // Trigger confetti
      setShowConfetti(true);
     
      // Generate confetti pieces
      const pieces = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * -100 - 20,
        color: ['#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 200
      }));
     
      setConfettiPieces(pieces);


      // Clear confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
        setConfettiPieces([]);
      }, 1000);
    }
  }, [checked]);


  return (
    <div className="relative inline-block">
      <button
        onClick={onToggle}
        className={`${sizes[size]} rounded-lg border-2 flex items-center justify-center transition-all transform active:scale-95 ${
          checked
            ? colors[color as keyof typeof colors] || colors.pink
            : 'border-slate-300 dark:border-slate-600 hover:border-pink-500 dark:hover:border-pink-500'
        }`}
        aria-label={checked ? 'Uncheck' : 'Check'}
      >
        {checked && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>


      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="confetti-piece confetti-pop absolute"
              style={{
                left: '50%',
                top: '50%',
                backgroundColor: piece.color,
                transform: `translate(${piece.x}px, ${piece.y}px) rotate(${Math.random() * 360}deg)`,
                animationDelay: `${piece.delay}ms`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};


export default ConfettiCheck;




