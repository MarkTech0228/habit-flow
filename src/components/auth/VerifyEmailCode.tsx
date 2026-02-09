import React, { useState } from 'react';
import { Shield, X } from 'lucide-react';


interface VerifyEmailCodeProps {
  onVerified: () => void;
  onBack: () => void;
  email: string;
}


const VerifyEmailCode: React.FC<VerifyEmailCodeProps> = ({ onVerified, onBack, email }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);


  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
   
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      onVerified();
    }, 1000);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 relative">
        <button
          onClick={onBack}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>


        <div className="text-center mb-8">
          <Shield className="w-12 h-12 mx-auto mb-4 text-pink-600" />
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            Verify Email
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            We sent a code to {email}
          </p>
        </div>


        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-pink-500 focus:outline-none text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>


          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>


        <div className="mt-6 text-center">
          <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400">
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};


export default VerifyEmailCode;




