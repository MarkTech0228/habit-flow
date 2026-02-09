import React, { useState, useEffect } from 'react';
import { X, DollarSign, Save } from 'lucide-react';


interface Currency {
  code: string;
  symbol: string;
  name: string;
}


interface AllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { dailyAllowance: number; currency: string; currencySymbol: string }) => void;
  currentAllowance: number;
  currentCurrency: string;
  currentSymbol: string;
  currencies: Currency[];
}


const AllowanceModal: React.FC<AllowanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentAllowance,
  currentCurrency,
  currentSymbol,
  currencies
}) => {
  const [allowance, setAllowance] = useState(currentAllowance.toString());
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);
  const [error, setError] = useState('');


  useEffect(() => {
    if (isOpen) {
      setAllowance(currentAllowance.toString());
      setSelectedCurrency(currentCurrency);
      setError('');
    }
  }, [isOpen, currentAllowance, currentCurrency]);


  const handleSave = () => {
    const amount = parseFloat(allowance);
   
    if (isNaN(amount) || amount < 0) {
      setError('Please enter a valid amount');
      return;
    }


    const currency = currencies.find(c => c.code === selectedCurrency);
    if (!currency) {
      setError('Please select a currency');
      return;
    }


    onSave({
      dailyAllowance: amount,
      currency: currency.code,
      currencySymbol: currency.symbol
    });


    onClose();
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };


  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Daily Allowance
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        <div className="space-y-4">
          {/* Allowance Amount */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Daily Allowance
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold">
                {currentSymbol}
              </span>
              <input
                type="number"
                step="0.01"
                value={allowance}
                onChange={(e) => {
                  setAllowance(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-green-500 focus:outline-none text-lg font-bold"
                autoFocus
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How much can you spend per day?
            </p>
          </div>


          {/* Currency Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Currency
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-green-500 focus:outline-none"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} - {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>


          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-3">
              <p className="text-sm font-bold text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}


          {/* Preview */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              Your daily budget will be:
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {currencies.find(c => c.code === selectedCurrency)?.symbol}
              {parseFloat(allowance || '0').toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              per day
            </p>
          </div>


          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AllowanceModal;






