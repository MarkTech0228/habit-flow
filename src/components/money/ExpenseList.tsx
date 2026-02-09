import React from 'react';
import { Trash2 } from 'lucide-react';


interface Expense {
 
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  createdAt: any;
  receiptImage?: string;
}




interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  currencySymbol: string;
}


const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, currencySymbol }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          No expenses yet. Track your first purchase!
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-3">
      {expenses.map(expense => (
        <div
          key={expense.id}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-2 border-slate-200 dark:border-slate-700 flex items-center justify-between"
        >
          <div className="flex-1">
            <p className="font-bold text-slate-900 dark:text-white mb-1">
              {expense.description}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {expense.category} • {new Date(expense.date).toLocaleDateString()}
            </p>
          </div>


          <div className="flex items-center gap-3">
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {currencySymbol}{expense.amount.toFixed(2)}
            </p>
            <button
              onClick={() => onDelete(expense.id)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};


export default ExpenseList;






