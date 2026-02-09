import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../../constants/expenseCategories';
import { useTheme } from '../../context/ThemeContext';

// 🆕 PHASE 1: Edit Budget Limits Modal
// LOCATION: Add this modal component near your other modals

interface EditBudgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryBudgets: Record<string, number>;
  onUpdateBudget: (category: string, limit: number) => void;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
  currencySymbol: string;
  setCategoryBudgets: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const EditBudgetsModal: React.FC<EditBudgetsModalProps> = ({
  isOpen,
  onClose,
  categoryBudgets,
  onUpdateBudget,
  isDark,
  isGreen,
  isLgbt,
  currencySymbol,
  setCategoryBudgets
}) => {
  const [tempBudgets, setTempBudgets] = useState<Record<string, string>>({});
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      const budgetStrings: Record<string, string> = {};
      EXPENSE_CATEGORIES.forEach((category: { label: string }) => {
        budgetStrings[category.label] = (categoryBudgets[category.label] || 0).toString();
      });
      setTempBudgets(budgetStrings);
    }
  }, [isOpen, categoryBudgets]);

  if (!isOpen) return null;

  const handleSave = () => {
    Object.entries(tempBudgets).forEach(([category, value]) => {
      const limit = parseFloat(value) || 0;
      if (limit !== categoryBudgets[category]) {
        onUpdateBudget(category, limit);
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-2xl p-6 my-8 ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Edit Budget Limits 💰
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Set monthly spending limits for each category
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-96 overflow-y-auto pr-2">
          {EXPENSE_CATEGORIES.map((category: { id: string; label: string; icon: any; color: string }) => (
            <div key={category.id} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <category.icon className="w-4 h-4" style={{ color: category.color }} />
                <span>{category.label}</span>
              </label>
              <input
                type="number"
                placeholder="Enter monthly budget"
                value={categoryBudgets[category.label] || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setCategoryBudgets({
                    ...categoryBudgets,
                    [category.label]: value
                  });
                }}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          ))}
        </div>

        <div className={`p-4 rounded-xl mb-6 ${
          isDark
            ? (isGreen ? 'bg-green-500/10 border border-green-500/30' : isLgbt ? 'bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-indigo-500/30' : 'bg-pink-500/10 border border-pink-500/30')
            : (isGreen ? 'bg-green-50 border border-green-200' : isLgbt ? 'bg-gradient-to-r from-red-50 to-blue-50 border border-indigo-200' : 'bg-pink-50 border border-pink-200')
        }`}>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            💡 <strong>Tip:</strong> Set realistic monthly limits for each category. You'll get alerts when you reach 80% of your budget.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 px-4 py-3 rounded-xl font-bold transition ${
              isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition ${
              isDark
                ? (isGreen ? 'bg-green-500 hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400')
                : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
            }`}
          >
            Save Budgets
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBudgetsModal;