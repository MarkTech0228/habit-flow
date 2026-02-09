import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface SpendingInsight {
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  topCategory: string;
  topCategoryAmount: number;
}

interface SpendingInsightsSectionProps {
  insights: SpendingInsight;
  currencySymbol: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}

const SpendingInsightsSection: React.FC<SpendingInsightsSectionProps> = ({
  insights,
  currencySymbol,
  isDark,
  isGreen,
  isLgbt
}) => {
  const weeklyChange = insights.lastWeek > 0 
    ? ((insights.thisWeek - insights.lastWeek) / insights.lastWeek * 100).toFixed(1)
    : 0;
  
  const monthlyChange = insights.lastMonth > 0 
    ? ((insights.thisMonth - insights.lastMonth) / insights.lastMonth * 100).toFixed(1)
    : 0;

  const isWeeklyUp = Number(weeklyChange) > 0;
  const isMonthlyUp = Number(monthlyChange) > 0;

  return (
    <div className={`p-6 rounded-2xl border-2 ${
      isDark 
        ? (isGreen ? 'bg-slate-800/50 border-green-900/50' : isLgbt ? 'bg-slate-800/50 border-indigo-900/50' : 'bg-slate-800/50 border-pink-900/50')
        : (isGreen ? 'bg-green-50 border-green-200' : isLgbt ? 'bg-gradient-to-br from-red-50 to-blue-50 border-indigo-200' : 'bg-pink-50 border-pink-200')
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isDark 
            ? (isGreen ? 'bg-green-500/20' : isLgbt ? 'bg-gradient-to-br from-red-500/20 to-blue-500/20' : 'bg-pink-500/20')
            : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-br from-red-100 to-blue-100' : 'bg-pink-100')
        }`}>
          <BarChart3 className={`w-6 h-6 ${
            isDark 
              ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
              : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
          }`} />
        </div>
        <div>
          <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Spending Insights
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            How you're doing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* This Week */}
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-slate-700/50' : 'bg-white'
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            This Week
          </p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currencySymbol}{insights.thisWeek.toFixed(2)}
          </p>
          <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${
            isWeeklyUp ? 'text-red-500' : 'text-green-500'
          }`}>
            {isWeeklyUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isWeeklyUp ? '+' : ''}{weeklyChange}%</span>
          </div>
        </div>

        {/* This Month */}
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-slate-700/50' : 'bg-white'
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            This Month
          </p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currencySymbol}{insights.thisMonth.toFixed(2)}
          </p>
          <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${
            isMonthlyUp ? 'text-red-500' : 'text-green-500'
          }`}>
            {isMonthlyUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isMonthlyUp ? '+' : ''}{monthlyChange}%</span>
          </div>
        </div>
      </div>

      {/* Top Category */}
      {insights.topCategory !== 'None' && (
        <div className={`p-4 rounded-xl ${
          isDark 
            ? (isGreen ? 'bg-green-500/10 border border-green-500/30' : isLgbt ? 'bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-indigo-500/30' : 'bg-pink-500/10 border border-pink-500/30')
            : (isGreen ? 'bg-green-100' : isLgbt ? 'bg-gradient-to-r from-red-100 to-blue-100' : 'bg-pink-100')
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Top Spending Category
          </p>
          <div className="flex items-center justify-between">
            <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {insights.topCategory}
            </p>
            <p className={`font-bold ${
              isDark 
                ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
            }`}>
              {currencySymbol}{insights.topCategoryAmount.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingInsightsSection;