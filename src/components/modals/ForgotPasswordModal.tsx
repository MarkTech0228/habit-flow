import React, { useState } from 'react';
import { X, Lock, ArrowRight } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isDark,
  isGreen,
  isLgbt
}) => {
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError('');

    try {
      await onSubmit(resetEmail);
      setResetEmail('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  const handleClose = () => {
    setResetEmail('');
    setError('');
    setResetLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
     
      <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-6 animate-pop ${
        isDark ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white border-2 border-slate-100'
      }`}>
       
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-xl transition ${
            isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${
            isDark
              ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-br from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
              : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-br from-red-500 to-blue-500 text-white' : 'bg-pink-600 text-white')
          }`}>
            <Lock className="w-8 h-8" />
          </div>
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Reset Password
          </h2>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Enter your email and we'll send you a password reset link
          </p>
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-5">
          {error && (
            <div className={`p-3 rounded-xl text-sm font-bold text-center animate-pop ${
              isDark ? 'bg-red-900/30 text-red-300 border border-red-800' : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {error}
            </div>
          )}

          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition font-medium text-lg ${
                isDark
                  ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-400 placeholder-slate-500' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-400 placeholder-slate-500' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-400 placeholder-slate-500')
                  : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-600 focus:bg-white focus:ring-4 focus:ring-pink-100')
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={resetLoading}
            className={`w-full text-white py-4 rounded-xl font-bold text-xl transition transform hover:-translate-y-1 shadow-xl flex items-center justify-center gap-2 ${
              isDark
                ? (isGreen ? 'bg-green-500 hover:bg-green-400 shadow-green-500/40' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/40')
                : (isGreen ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : isLgbt ? 'bg-gradient-to-r from-red-600 via-green-600 to-blue-700 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200')
            } ${resetLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {resetLoading ? 'Sending...' : (
              <>
                Send Reset Link <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className={`w-full py-3 rounded-xl font-bold transition ${
              isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;