import React from 'react';

interface WeeklyProgressProps {
  dates: string[];
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ dates }) => {
  // Get last 7 days
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    
    return days;
  };

  const last7Days = getLast7Days();
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="flex gap-1.5">
      {last7Days.map((date, index) => {
        const isCompleted = dates?.includes(date);
        const dayOfWeek = new Date(date).getDay();
        
        return (
          <div key={date} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                isCompleted
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
              }`}
              title={date}
            >
              {isCompleted ? '✓' : dayLabels[dayOfWeek]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyProgress;