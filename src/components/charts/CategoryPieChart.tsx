import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

interface CategoryPieChartProps {
  data: { name: string; value: number }[];
  currencySymbol: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  currencySymbol,
  isDark,
  isGreen,
  isLgbt
}) => {
  // Color palette for pie slices
  const COLORS = isGreen 
    ? ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#6ee7b7']
    : isLgbt
    ? ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
    : ['#ec4899', '#f43f5e', '#f97316', '#a855f7', '#3b82f6', '#06b6d4'];

  const totalSpending = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
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
            <PieChartIcon className={`w-6 h-6 ${
              isDark 
                ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
                : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
            }`} />
          </div>
          <div>
            <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Spending Breakdown
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              By category
            </p>
          </div>
        </div>
        <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          No expenses yet. Start tracking to see your breakdown!
        </p>
      </div>
    );
  }

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
          <PieChartIcon className={`w-6 h-6 ${
            isDark 
              ? (isGreen ? 'text-green-400' : isLgbt ? 'text-indigo-400' : 'text-pink-400')
              : (isGreen ? 'text-green-600' : isLgbt ? 'text-indigo-600' : 'text-pink-600')
          }`} />
        </div>
        <div>
          <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Spending Breakdown
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Top {data.length} categories
          </p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height={300} minHeight={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number | undefined) => `${currencySymbol}${(value ?? 0).toFixed(2)}`}
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '12px',
                color: isDark ? '#ffffff' : '#000000'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category List */}
      <div className="mt-4 space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.value / totalSpending) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currencySymbol}{item.value.toFixed(2)}
                </span>
                <span className={`ml-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPieChart;