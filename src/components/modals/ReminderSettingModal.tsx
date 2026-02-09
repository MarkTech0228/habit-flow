import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Habit {
  id: string;
  title: string;
  reminderEnabled?: boolean;
  reminderTime?: string;
  [key: string]: any;
}

interface ReminderModalProps {
  habit: Habit;
  onClose: () => void;
  onSave: (enabled: boolean, time: string) => void;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  habit,
  onClose,
  onSave,
  isDark,
  isGreen,
  isLgbt
}) => {
  const [enabled, setEnabled] = useState(habit.reminderEnabled || false);
  const [time, setTime] = useState(habit.reminderTime || '09:00');

  const handleSave = () => {
    onSave(enabled, time);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
     
      <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-6 animate-pop ${
        isDark ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white border-2 border-slate-100'
      }`}>
       
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl transition ${
            isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 ${
            isDark
              ? (isGreen ? 'bg-green-500/20 text-green-400' : isLgbt ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400')
              : (isGreen ? 'bg-green-100 text-green-600' : isLgbt ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600')
          }`}>
            <span className="text-2xl">🔔</span>
          </div>
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Daily Reminder
          </h2>
          <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            for "{habit.title}"
          </p>
        </div>

        <div className="space-y-5">
          {/* Enable/Disable Toggle */}
          <div className={`p-4 rounded-2xl border-2 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Enable Reminder
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Get notified daily
                </p>
              </div>
              <button
                onClick={() => setEnabled(!enabled)}
                className={`w-14 h-8 rounded-full transition-all duration-300 relative ${
                  enabled
                    ? (isDark
                        ? (isGreen ? 'bg-green-500' : isLgbt ? 'bg-indigo-500' : 'bg-pink-500')
                        : (isGreen ? 'bg-green-600' : isLgbt ? 'bg-indigo-600' : 'bg-pink-600')
                      )
                    : (isDark ? 'bg-slate-700' : 'bg-slate-300')
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-300 ${
                  enabled ? 'left-7' : 'left-1'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Time Picker */}
          {enabled && (
            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Reminder Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition font-bold text-xl text-center ${
                  isDark
                    ? (isGreen ? 'bg-slate-800 border-green-900/50 text-white focus:border-green-500' : isLgbt ? 'bg-slate-800 border-indigo-900/50 text-white focus:border-indigo-500' : 'bg-slate-800 border-pink-900/50 text-white focus:border-pink-500')
                    : (isGreen ? 'bg-slate-50 border-green-200 text-slate-900 focus:border-green-500' : isLgbt ? 'bg-slate-50 border-indigo-200 text-slate-900 focus:border-indigo-500' : 'bg-slate-50 border-pink-200 text-slate-900 focus:border-pink-500')
                }`}
              />
            </div>
          )}

          {/* Permission Warning */}
          {enabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && (
            <div className={`p-3 rounded-xl text-sm font-medium ${
              isDark ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-800' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
            }`}>
              ⚠️ Please allow notifications in your browser settings
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className={`flex-1 text-white py-4 rounded-2xl font-bold text-lg transition shadow-lg hover:-translate-y-0.5 ${
                isDark
                  ? (isGreen ? 'bg-green-500 hover:bg-green-400 shadow-green-500/40' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/40')
                  : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
              }`}
            >
              Save Reminder
            </button>
            <button
              onClick={onClose}
              className={`px-6 py-4 rounded-2xl font-bold transition ${
                isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;