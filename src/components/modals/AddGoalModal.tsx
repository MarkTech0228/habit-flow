import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, targetAmount: number, deadline: string) => void;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
  currencySymbol: string;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isDark,
  isGreen,
  isLgbt,
  currencySymbol
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (name && !isNaN(amount) && amount > 0 && deadline) {
      onSubmit(name, amount, deadline);
      setName('');
      setTargetAmount('');
      setDeadline('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl p-6 ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Create Savings Goal 🎯
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Goal Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Emergency Fund, New Phone"
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                isDark 
                  ? (isGreen ? 'bg-slate-700 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-700 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-700 border-pink-900/50 text-white focus:border-pink-400')
                  : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Target Amount ({currencySymbol})
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="1000.00"
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                isDark 
                  ? (isGreen ? 'bg-slate-700 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-700 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-700 border-pink-900/50 text-white focus:border-pink-400')
                  : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Target Date
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                isDark 
                  ? (isGreen ? 'bg-slate-700 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-700 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-700 border-pink-900/50 text-white focus:border-pink-400')
                  : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
              }`}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-xl font-bold transition ${
                isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition ${
                isDark 
                  ? (isGreen ? 'bg-green-500 hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400')
                  : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
              }`}
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;