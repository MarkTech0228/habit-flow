import React, { useState } from 'react';
import { X, Target } from 'lucide-react';

interface HabitFormProps {
  onSubmit: (data: { title: string; frequency: 'daily' | 'weekly' }) => Promise<void>;
  onClose: () => void;
  initialData?: {
    title: string;
    frequency: 'daily' | 'weekly';
  };
  isDark?: boolean;
  isGreen?: boolean;
  isLgbt?: boolean;
}

const HabitForm: React.FC<HabitFormProps> = ({ 
  onSubmit, 
  onClose, 
  initialData,
  isDark = false,
  isGreen = false,
  isLgbt = false
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(initialData?.frequency || 'daily');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    // Validate
    if (!title.trim()) {
      setError('Please enter a habit name');
      return;
    }
   
    setIsSubmitting(true);
    setError('');
   
    try {
      console.log('📝 Submitting habit:', { title: title.trim(), frequency });
     
      await onSubmit({ title: title.trim(), frequency });
     
      console.log('✅ Habit submitted successfully');
      onClose();
     
    } catch (err) {
      console.error('❌ Error submitting habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to add habit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-3xl p-6 max-w-md w-full shadow-2xl ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Target className={`w-6 h-6 ${
              isDark 
                ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
            }`} />
            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {initialData ? 'Edit Habit' : 'New Habit'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Habit Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Exercise"
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                isDark
                  ? (isGreen ? 'bg-slate-700 border-green-900/50 text-white focus:border-green-400' : isLgbt ? 'bg-slate-700 border-indigo-900/50 text-white focus:border-indigo-400' : 'bg-slate-700 border-pink-900/50 text-white focus:border-pink-400')
                  : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
              }`}
              autoFocus
              required
            />
          </div>

          {/* Error Message Display */}
          {error && (
            <div className={`p-3 rounded-xl border-2 ${
              isDark ? 'bg-red-900/30 border-red-500 text-red-300' : 'bg-red-100 border-red-500 text-red-600'
            }`}>
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}
           
          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Frequency
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`py-3 rounded-xl font-bold transition-all ${
                  frequency === 'daily'
                    ? (isDark
                        ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
                        : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 text-white')
                      )
                    : (isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-600')
                }`}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekly')}
                className={`py-3 rounded-xl font-bold transition-all ${
                  frequency === 'weekly'
                    ? (isDark
                        ? (isGreen ? 'bg-green-500 text-white' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white' : 'bg-pink-500 text-white')
                        : (isGreen ? 'bg-green-600 text-white' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white' : 'bg-pink-600 text-white')
                      )
                    : (isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-600')
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
                isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? (isGreen ? 'bg-green-500 hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400')
                  : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
              }`}
            >
              {isSubmitting ? 'Creating...' : (initialData ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;