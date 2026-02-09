import React, { useState } from 'react';
import { Trophy, Plus, Trash2 } from 'lucide-react';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: any;
}

interface SavingsGoalsSectionProps {
  goals: SavingsGoal[];
  currencySymbol: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
  onAddGoal: () => void;
  onUpdateProgress: (goalId: string, amount: number) => void;
  onDeleteGoal: (goalId: string) => void;
}

const SavingsGoalsSection: React.FC<SavingsGoalsSectionProps> = ({
  goals,
  currencySymbol,
  isDark,
  isGreen,
  isLgbt,
  onAddGoal,
  onUpdateProgress,
  onDeleteGoal
}) => {
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState<string>('');

  const handleAddProgress = (goalId: string) => {
    const amount = parseFloat(addAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdateProgress(goalId, amount);
      setEditingGoal(null);
      setAddAmount('');
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className={`p-6 rounded-2xl border-2 ${
      isDark 
        ? (isGreen ? 'bg-slate-800/50 border-green-900/50' : isLgbt ? 'bg-slate-800/50 border-indigo-900/50' : 'bg-slate-800/50 border-pink-900/50')
        : (isGreen ? 'bg-green-50 border-green-200' : isLgbt ? 'bg-gradient-to-br from-red-50 to-blue-50 border-indigo-200' : 'bg-pink-50 border-pink-200')
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark 
              ? (isGreen ? 'bg-green-500/20' : isLgbt ? 'bg-gradient-to-br from-red-500/20 to-blue-500/20' : 'bg-pink-500/20')
              : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-br from-red-100 to-blue-100' : 'bg-pink-100')
          }`}>
            <Trophy className={`w-6 h-6 ${
              isDark 
                ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
            }`} />
          </div>
          <div>
            <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Savings Goals
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Track your financial targets
            </p>
          </div>
        </div>
        <button
          onClick={onAddGoal}
          className={`p-2 rounded-xl transition ${
            isDark 
              ? (isGreen ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : isLgbt ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30')
              : (isGreen ? 'bg-green-100 text-green-700 hover:bg-green-200' : isLgbt ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-pink-100 text-pink-700 hover:bg-pink-200')
          }`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            No savings goals yet. Start building your future!
          </p>
          <button
            onClick={onAddGoal}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              isDark 
                ? (isGreen ? 'bg-green-500 text-white hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white hover:opacity-90' : 'bg-pink-500 text-white hover:bg-pink-400')
                : (isGreen ? 'bg-green-600 text-white hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:opacity-90' : 'bg-pink-600 text-white hover:bg-pink-700')
            }`}
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            const daysLeft = getDaysRemaining(goal.deadline);
            const isComplete = percentage >= 100;

            return (
              <div 
                key={goal.id}
                className={`p-4 rounded-xl border-2 transition ${
                  isComplete
                    ? isDark 
                      ? (isGreen ? 'bg-green-500/20 border-green-500/50' : isLgbt ? 'bg-gradient-to-r from-red-500/20 to-blue-500/20 border-indigo-500/50' : 'bg-pink-500/20 border-pink-500/50')
                      : (isGreen ? 'bg-green-100 border-green-300' : isLgbt ? 'bg-gradient-to-r from-red-100 to-blue-100 border-indigo-300' : 'bg-pink-100 border-pink-300')
                    : isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {goal.name}
                      </h4>
                      {isComplete && <span className="text-xl">🎉</span>}
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today!' : `${Math.abs(daysLeft)} days overdue`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${goal.name}"?`)) {
                        onDeleteGoal(goal.id);
                      }
                    }}
                    className={`p-2 rounded-lg transition ${
                      isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Progress
                    </span>
                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {currencySymbol}{goal.currentAmount.toFixed(2)} / {currencySymbol}{goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className={`h-3 rounded-full overflow-hidden ${
                    isDark ? 'bg-slate-600' : 'bg-slate-200'
                  }`}>
                    <div
                      className={`h-full transition-all duration-500 ${
                        isComplete
                          ? isGreen ? 'bg-green-500' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500' : 'bg-pink-500'
                          : isGreen ? 'bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-400 to-blue-400' : 'bg-pink-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {percentage.toFixed(0)}% complete
                  </p>
                </div>

                {!isComplete && (
                  <div className="flex gap-2">
                    {editingGoal === goal.id ? (
                      <>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                          placeholder="Amount"
                          className={`flex-1 px-3 py-2 rounded-lg border-2 outline-none ${
                            isDark 
                              ? 'bg-slate-800 border-slate-600 text-white' 
                              : 'bg-white border-slate-200 text-slate-900'
                          }`}
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddProgress(goal.id)}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            isDark 
                              ? (isGreen ? 'bg-green-500 text-white hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white hover:opacity-90' : 'bg-pink-500 text-white hover:bg-pink-400')
                              : (isGreen ? 'bg-green-600 text-white hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:opacity-90' : 'bg-pink-600 text-white hover:bg-pink-700')
                          }`}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setEditingGoal(null);
                            setAddAmount('');
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            isDark ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingGoal(goal.id)}
                        className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                          isDark 
                            ? (isGreen ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : isLgbt ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30')
                            : (isGreen ? 'bg-green-100 text-green-700 hover:bg-green-200' : isLgbt ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-pink-100 text-pink-700 hover:bg-pink-200')
                        }`}
                      >
                        Add Progress
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavingsGoalsSection;