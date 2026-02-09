import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    balance: number;
    interestRate: number;
    minimumPayment: number;
    type: 'credit_card' | 'student_loan' | 'mortgage' | 'personal_loan' | 'other';
    dueDay: number;
  }) => void;
  currencySymbol: string;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}

const AddDebtModal: React.FC<AddDebtModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  currencySymbol,
  isDark,
  isGreen,
  isLgbt
}) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [type, setType] = useState<'credit_card' | 'student_loan' | 'mortgage' | 'personal_loan' | 'other'>('credit_card');
  const [dueDay, setDueDay] = useState('1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    const balanceNum = parseFloat(balance);
    const interestNum = parseFloat(interestRate);
    const minPaymentNum = parseFloat(minimumPayment);
    const dueDayNum = parseInt(dueDay);
   
    if (isNaN(balanceNum) || isNaN(interestNum) || isNaN(minPaymentNum) || isNaN(dueDayNum)) {
      alert('Please fill in all fields with valid numbers');
      return;
    }
   
    if (dueDayNum < 1 || dueDayNum > 31) {
      alert('Due day must be between 1 and 31');
      return;
    }
   
    onAdd({
      name: name.trim(),
      balance: balanceNum,
      interestRate: interestNum,
      minimumPayment: minPaymentNum,
      type,
      dueDay: dueDayNum
    });
   
    // Reset form
    setName('');
    setBalance('');
    setInterestRate('');
    setMinimumPayment('');
    setType('credit_card');
    setDueDay('1');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl p-6 ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Add Debt 💳
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Debt Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Credit Card, Student Loan"
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Balance ({currencySymbol}) *
              </label>
              <input
                type="number"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="5000.00"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Interest Rate (%) *
              </label>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="18.99"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Min. Payment ({currencySymbol}) *
              </label>
              <input
                type="number"
                step="0.01"
                value={minimumPayment}
                onChange={(e) => setMinimumPayment(e.target.value)}
                placeholder="150.00"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Due Day *
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                placeholder="15"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Debt Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="credit_card">Credit Card</option>
              <option value="student_loan">Student Loan</option>
              <option value="mortgage">Mortgage</option>
              <option value="personal_loan">Personal Loan</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
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
              type="submit"
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition ${
                isDark
                  ? (isGreen ? 'bg-green-500 hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400')
                  : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
              }`}
            >
              Add Debt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDebtModal;