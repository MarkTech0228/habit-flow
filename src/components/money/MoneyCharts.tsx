import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { getLastNDays } from '../../utils/dateHelpers';


interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  createdAt: any;
  receiptImage?: string;
}


interface MoneyChartsProps {
  expenses: Expense[];
  currencySymbol?: string;
  theme?: 'light' | 'dark';
}


const MoneyCharts: React.FC<MoneyChartsProps> = ({
  expenses,
  currencySymbol = '$',
  theme = 'light'
}) => {
  
  // Calculate daily spending for last 7 days
const dailySpendingData = useMemo(() => {
const last7Days = getLastNDays(7);
  
  return last7Days.map(dateString => {
    // Filter expenses for this specific date
    const dayExpenses = expenses.filter(e => e.date === dateString);
    const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Create a readable label from the date string
    const dateObj = new Date(dateString);
    const label = dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    return {
      date: label,           // "Feb 7" for display on chart
      amount: total,         // Total spending for this day
      fullDate: dateString   // "2024-02-07" for reference
    };
  });
}, [expenses]);


  // Calculate spending by category
  const categorySpendingData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
   
    expenses.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });


    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: parseFloat(amount.toFixed(2))
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);


  // Color palette for categories
  const categoryColors = [
    '#ec4899', // Pink
    '#f59e0b', // Orange
    '#10b981', // Green
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#ef4444', // Red
    '#14b8a6', // Teal
  ];


  const chartColors = {
    line: theme === 'dark' ? '#ec4899' : '#db2777',
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    text: theme === 'dark' ? '#cbd5e1' : '#475569',
    tooltip: theme === 'dark' ? '#1e293b' : '#ffffff'
  };


  return (
    <div className="space-y-6">
      {/* Daily Spending Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
          Daily Spending (Last 7 Days)
        </h3>
       
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailySpendingData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis
              dataKey="date"
              stroke={chartColors.text}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke={chartColors.text}
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${currencySymbol}${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.tooltip,
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{
                color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                fontWeight: 'bold'
              }}
             formatter={(value: number | undefined) => [`${currencySymbol}${(value ?? 0).toFixed(2)}`, 'Spent']}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={chartColors.line}
              strokeWidth={3}
              dot={{ fill: chartColors.line, r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>


      {/* Category Spending Chart */}
      {categorySpendingData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
            Spending by Category
          </h3>
         
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySpendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis
                dataKey="category"
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${currencySymbol}${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: chartColors.tooltip,
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{
                  color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                  fontWeight: 'bold'
                }}
                formatter={(value: number | undefined) => [`${currencySymbol}${(value ?? 0).toFixed(2)}`, 'Total']}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {categorySpendingData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={categoryColors[index % categoryColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}


      {/* Category Breakdown List */}
      {categorySpendingData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
            Category Breakdown
          </h3>
         
          <div className="space-y-3">
            {categorySpendingData.map((category, index) => {
              const total = categorySpendingData.reduce((sum, c) => sum + c.amount, 0);
              const percentage = total > 0 ? (category.amount / total) * 100 : 0;
             
              return (
                <div key={category.category} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                      />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {category.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        {currencySymbol}{category.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: categoryColors[index % categoryColors.length]
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


export default MoneyCharts;




