import React from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';


interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: (id: string) => void;
}


const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />
  };


  const styles = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
  };


  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border-2 shadow-lg ${styles[type]} animate-slide-up`}>
      {icons[type]}
      <p className="flex-1 text-sm font-bold text-slate-900 dark:text-white">
        {message}
      </p>
      <button
        onClick={() => onClose(id)}
        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};


export default Toast;




