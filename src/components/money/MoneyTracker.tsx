import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';


interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  createdAt: any;
  receiptImage?: string;
}


interface MoneyTrackerProps {
  expenses: Expense[];
  totalSpent: number;
  dailyAllowance: number;
  currencySymbol: string;
}


const MoneyTracker: React.FC<MoneyTrackerProps> = ({
  expenses,
  totalSpent,
  dailyAllowance,
  currencySymbol
}) => {
  const remaining = dailyAllowance - totalSpent;
  const percentSpent = dailyAllowance > 0 ? (totalSpent / dailyAllowance) * 100 : 0;


  return (
    <div>
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-6 text-white mb-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">Today's Balance</p>
            <p className="text-4xl font-black">
              {currencySymbol}{remaining.toFixed(2)}
            </p>
          </div>
          <DollarSign className="w-12 h-12 opacity-80" />
        </div>


        <div className="w-full bg-white/20 rounded-full h-3 mb-2">
          <div
            className="bg-white rounded-full h-3 transition-all"
            style={{ width: `${Math.min(percentSpent, 100)}%` }}
          />
        </div>


        <div className="flex items-center justify-between text-sm">
          <span className="opacity-90">
            Spent: {currencySymbol}{totalSpent.toFixed(2)}
          </span>
          <span className="opacity-90">
            Allowance: {currencySymbol}{dailyAllowance.toFixed(2)}
          </span>
        </div>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md">
          <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {expenses.length}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Transactions
          </p>
        </div>


        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md">
          <TrendingDown className="w-8 h-8 text-red-600 mb-2" />
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {currencySymbol}{(expenses.length > 0 ? totalSpent / expenses.length : 0).toFixed(2)}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Average
          </p>
        </div>
      </div>
    </div>
  );
};


export default MoneyTracker;




