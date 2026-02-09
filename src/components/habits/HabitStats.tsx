import React from 'react';
import { Trophy, Flame, TrendingUp, Target } from 'lucide-react';


interface HabitStatsProps {
  totalHabits: number;
  completedToday: number;
  longestStreak: number;
  totalCompletions: number;
}


const HabitStats: React.FC<HabitStatsProps> = ({
  totalHabits,
  completedToday,
  longestStreak,
  totalCompletions
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
        <Target className="w-8 h-8 mb-2 opacity-80" />
        <p className="text-3xl font-black mb-1">{totalHabits}</p>
        <p className="text-sm opacity-90">Total Habits</p>
      </div>


      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg">
        <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
        <p className="text-3xl font-black mb-1">{completedToday}</p>
        <p className="text-sm opacity-90">Done Today</p>
      </div>


      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg">
        <Flame className="w-8 h-8 mb-2 opacity-80" />
        <p className="text-3xl font-black mb-1">{longestStreak}</p>
        <p className="text-sm opacity-90">Best Streak</p>
      </div>


      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
        <Trophy className="w-8 h-8 mb-2 opacity-80" />
        <p className="text-3xl font-black mb-1">{totalCompletions}</p>
        <p className="text-sm opacity-90">All Time</p>
      </div>
    </div>
  );
};


export default HabitStats;




