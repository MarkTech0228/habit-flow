import React from 'react';
import { Plus, Trash2, Receipt } from 'lucide-react';

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextPaymentDate: string;
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  isActive: boolean;
  notes?: string;
  createdAt: any;
}

interface RecurringExpenseSummary {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  total: number;
  count: number;
}

interface RecurringExpensesSectionProps {
  recurringExpenses: RecurringExpense[];
  currencySymbol: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
  onAddRecurring: () => void;
  onToggleActive: (expenseId: string, isActive: boolean) => void;
  onDeleteRecurring: (expenseId: string) => void;
  onEditRecurring: (expense: RecurringExpense) => void;
}

const RecurringExpensesSection: React.FC<RecurringExpensesSectionProps> = ({
  recurringExpenses,
  currencySymbol,
  isDark,
  isGreen,
  isLgbt,
  onAddRecurring,
  onToggleActive,
  onDeleteRecurring,
  onEditRecurring
}) => {
  // Calculate summary
  const summary: RecurringExpenseSummary = recurringExpenses
    .filter(exp => exp.isActive)
    .reduce((acc, exp) => {
      const monthlyAmount = (() => {
        switch (exp.frequency) {
          case 'daily': return exp.amount * 30;
          case 'weekly': return exp.amount * 4;
          case 'monthly': return exp.amount;
          case 'yearly': return exp.amount / 12;
          default: return 0;
        }
      })();

      return {
        daily: acc.daily + (exp.frequency === 'daily' ? exp.amount : 0),
        weekly: acc.weekly + (exp.frequency === 'weekly' ? exp.amount : 0),
        monthly: acc.monthly + (exp.frequency === 'monthly' ? exp.amount : 0),
        yearly: acc.yearly + (exp.frequency === 'yearly' ? exp.amount : 0),
        total: acc.total + monthlyAmount,
        count: acc.count + 1
      };
    }, { daily: 0, weekly: 0, monthly: 0, yearly: 0, total: 0, count: 0 });

  const getDaysUntilPayment = (nextPaymentDate: string) => {
    const today = new Date();
    const payment = new Date(nextPaymentDate);
    const diffTime = payment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '📅';
      case 'weekly': return '📆';
      case 'monthly': return '🗓️';
      case 'yearly': return '🎯';
      default: return '💰';
    }
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
            <Receipt className={`w-6 h-6 ${
              isDark 
                ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
            }`} />
          </div>
          <div>
            <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Recurring Expenses
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Subscriptions & regular bills
            </p>
          </div>
        </div>
        <button
          onClick={onAddRecurring}
          className={`p-2 rounded-xl transition ${
            isDark 
              ? (isGreen ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : isLgbt ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30')
              : (isGreen ? 'bg-green-100 text-green-700 hover:bg-green-200' : isLgbt ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-pink-100 text-pink-700 hover:bg-pink-200')
          }`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-white'}`}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Monthly Total
          </div>
          <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currencySymbol}{summary.total.toFixed(2)}
          </div>
          <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            {summary.count} active {summary.count === 1 ? 'subscription' : 'subscriptions'}
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-white'}`}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Yearly Cost
          </div>
          <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currencySymbol}{(summary.total * 12).toFixed(2)}
          </div>
          <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            Total annual expense
          </div>
        </div>
      </div>

      {/* Recurring Expenses List */}
      {recurringExpenses.length === 0 ? (
        <div className="text-center py-8">
          <Receipt className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            No recurring expenses yet
          </p>
          <button
            onClick={onAddRecurring}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              isDark 
                ? (isGreen ? 'bg-green-500 text-white hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white hover:opacity-90' : 'bg-pink-500 text-white hover:bg-pink-400')
                : (isGreen ? 'bg-green-600 text-white hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:opacity-90' : 'bg-pink-600 text-white hover:bg-pink-700')
            }`}
          >
            Add Your First Subscription
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recurringExpenses
            .sort((a, b) => getDaysUntilPayment(a.nextPaymentDate) - getDaysUntilPayment(b.nextPaymentDate))
            .map((expense) => {
              const daysUntil = getDaysUntilPayment(expense.nextPaymentDate);
              const isUpcoming = daysUntil <= 7 && daysUntil >= 0;
              const isOverdue = daysUntil < 0;

              return (
                <div
                  key={expense.id}
                  className={`p-4 rounded-xl border-2 transition ${
                    !expense.isActive
                      ? (isDark ? 'bg-slate-800/30 border-slate-700 opacity-50' : 'bg-slate-50 border-slate-200 opacity-50')
                      : isOverdue
                      ? (isDark ? 'bg-red-900/20 border-red-500/50' : 'bg-red-50 border-red-300')
                      : isUpcoming
                      ? (isDark ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-yellow-50 border-yellow-300')
                      : (isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-white border-slate-200')
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {expense.name}
                        </h4>
                        <span className="text-xl">{getFrequencyIcon(expense.frequency)}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {expense.category}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {expense.frequency}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {currencySymbol}{expense.amount.toFixed(2)}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        per {expense.frequency === 'yearly' ? 'year' : expense.frequency === 'monthly' ? 'month' : 'week'}
                      </div>
                    </div>
                  </div>

                  {/* Next Payment Info */}
                  <div className={`p-3 rounded-lg mb-3 ${
                    isOverdue
                      ? (isDark ? 'bg-red-900/30' : 'bg-red-100')
                      : isUpcoming
                      ? (isDark ? 'bg-yellow-900/30' : 'bg-yellow-100')
                      : (isDark ? 'bg-slate-800' : 'bg-slate-100')
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${
                        isOverdue
                          ? 'text-red-500'
                          : isUpcoming
                          ? 'text-yellow-600'
                          : (isDark ? 'text-slate-400' : 'text-slate-600')
                      }`}>
                        {isOverdue ? '⚠️ Overdue' : isUpcoming ? '🔔 Coming Soon' : '📅 Next Payment'}
                      </span>
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {new Date(expense.nextPaymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {!isOverdue && ` (${daysUntil} ${daysUntil === 1 ? 'day' : 'days'})`}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onToggleActive(expense.id, !expense.isActive)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition ${
                        expense.isActive
                          ? (isDark ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700')
                          : (isDark 
                              ? (isGreen ? 'bg-green-500 hover:bg-green-400 text-white' : isLgbt ? 'bg-indigo-500 hover:bg-indigo-400 text-white' : 'bg-pink-500 hover:bg-pink-400 text-white')
                              : (isGreen ? 'bg-green-600 hover:bg-green-700 text-white' : isLgbt ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-pink-600 hover:bg-pink-700 text-white')
                            )
                      }`}
                    >
                      {expense.isActive ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => onEditRecurring(expense)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                        isDark ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${expense.name}"?`)) {
                          onDeleteRecurring(expense.id);
                        }
                      }}
                      className={`p-2 rounded-lg transition ${
                        isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default RecurringExpensesSection;