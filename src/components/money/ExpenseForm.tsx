import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';


interface ExpenseFormProps {
  onSubmit: (data: {
    amount: number;
    category: string;
    description: string;
  }) => void;
  onClose?: () => void;
  categories: Array<{ id: string; label: string }>;
}


const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onClose, categories }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [description, setDescription] = useState('');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
   
    if (amountNum > 0 && category && description.trim()) {
      onSubmit({
        amount: amountNum,
        category,
        description: description.trim()
      });
      setAmount('');
      setDescription('');
      if (onClose) onClose();
    }
  };


  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          Add Expense
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-pink-500 focus:outline-none"
            required
          />
        </div>


        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-pink-500 focus:outline-none"
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you buy?"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-pink-500 focus:outline-none"
            required
          />
        </div>


        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </form>
    </div>
  );
};


export default ExpenseForm;




