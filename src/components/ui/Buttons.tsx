// src/components/ui/Buttons.tsx
// Moved from App.tsx lines 66–246
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import type { LucideIcon } from '../../types';

// ── TouchButton ────────────────────────────────────────────
interface TouchButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: LucideIcon;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  variant  = 'primary',
  disabled = false,
  loading  = false,
  className = '',
  icon: Icon,
  fullWidth = false,
  size = 'md',
}) => {
  const { accent, isDark } = useTheme();

  const sizeClasses = {
    sm: 'min-h-[44px] px-4 py-2 text-sm',
    md: 'min-h-[56px] px-6 py-3 text-base',
    lg: 'min-h-[64px] px-8 py-4 text-lg',
  };

  const base = `
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : 'min-w-[120px]'}
    rounded-2xl font-bold transition-all duration-200
    active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
    disabled:active:scale-100 touch-manipulation
    flex items-center justify-center gap-2
    focus:outline-none focus:ring-4 focus:ring-offset-2
  `;

  const accentColor = accent === 'green' ? 'green' : accent === 'lgbt' ? 'purple' : 'pink';

  const variants: Record<string, string> = {
    primary: isDark
      ? `bg-${accentColor}-600 hover:bg-${accentColor}-500 text-white focus:ring-${accentColor}-500/50 shadow-lg shadow-${accentColor}-900/20`
      : `bg-${accentColor}-700 hover:bg-${accentColor}-600 text-white focus:ring-${accentColor}-500/50 shadow-lg shadow-${accentColor}-200/50`,
    secondary: isDark
      ? 'bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-700 focus:ring-slate-500/50'
      : 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 focus:ring-slate-400/50',
    danger:  'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500/50 shadow-lg shadow-red-900/20',
    ghost: isDark
      ? 'bg-transparent hover:bg-slate-800/50 text-slate-300 focus:ring-slate-500/30'
      : 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400/30',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] ?? ''} ${className}`}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  );
};

// ── IconButton ─────────────────────────────────────────────
interface IconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  label,
  variant  = 'ghost',
  disabled = false,
  className = '',
}) => {
  const { accent, isDark } = useTheme();
  const accentColor = accent === 'green' ? 'green' : accent === 'lgbt' ? 'purple' : 'pink';

  const variants: Record<string, string> = {
    primary: isDark
      ? `bg-${accentColor}-600 hover:bg-${accentColor}-500 text-white`
      : `bg-${accentColor}-700 hover:bg-${accentColor}-600 text-white`,
    secondary: isDark
      ? 'bg-slate-800 hover:bg-slate-700 text-white'
      : 'bg-slate-200 hover:bg-slate-300 text-slate-900',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    ghost: isDark
      ? 'hover:bg-slate-800 text-slate-300'
      : 'hover:bg-slate-100 text-slate-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        min-w-[44px] min-h-[44px] p-2 rounded-xl transition-all
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        touch-manipulation flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${variants[variant] ?? ''} ${className}
      `}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};