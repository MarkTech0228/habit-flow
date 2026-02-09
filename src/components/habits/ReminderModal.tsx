import React, { useState, useEffect } from 'react';
import { X, Bell, Clock, Save } from 'lucide-react';


interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { reminderTime: string; reminderEnabled: boolean }) => void;
  currentReminderTime?: string;
  currentReminderEnabled?: boolean;
  habitTitle: string;
}


const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentReminderTime = '09:00',
  currentReminderEnabled = false,
  habitTitle
}) => {
  const [reminderTime, setReminderTime] = useState(currentReminderTime);
  const [reminderEnabled, setReminderEnabled] = useState(currentReminderEnabled);
  const [error, setError] = useState('');


  useEffect(() => {
    if (isOpen) {
      setReminderTime(currentReminderTime);
      setReminderEnabled(currentReminderEnabled);
      setError('');
    }
  }, [isOpen, currentReminderTime, currentReminderEnabled]);


  const handleSave = () => {
    if (reminderEnabled && !reminderTime) {
      setError('Please select a reminder time');
      return;
    }


    onSave({
      reminderTime,
      reminderEnabled
    });


    onClose();
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };


  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };


  const quickTimes = [
    { label: 'Morning', time: '07:00' },
    { label: 'Noon', time: '12:00' },
    { label: 'Evening', time: '18:00' },
    { label: 'Night', time: '21:00' }
  ];


  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Set Reminder
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {habitTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        <div className="space-y-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Daily Reminder
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Get notified every day
                </p>
              </div>
            </div>
            <button
              onClick={() => setReminderEnabled(!reminderEnabled)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                reminderEnabled
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  reminderEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>


          {/* Time Picker */}
          {reminderEnabled && (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Reminder Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => {
                      setReminderTime(e.target.value);
                      setError('');
                    }}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-purple-500 focus:outline-none text-lg font-bold"
                  />
                </div>
                {reminderTime && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    You'll be reminded at {formatTime(reminderTime)}
                  </p>
                )}
              </div>


              {/* Quick Time Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Quick Select
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {quickTimes.map((qt) => (
                    <button
                      key={qt.time}
                      type="button"
                      onClick={() => setReminderTime(qt.time)}
                      className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                        reminderTime === qt.time
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {qt.label}
                    </button>
                  ))}
                </div>
              </div>


              {/* Preview Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Preview notification
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      Time for: {habitTitle}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Daily at {formatTime(reminderTime)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}


          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-3">
              <p className="text-sm font-bold text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}


          {/* Info Message */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-3">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <strong>Note:</strong> Browser notifications must be enabled for reminders to work.
            </p>
          </div>


          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ReminderModal;


