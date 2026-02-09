import { useState, FormEvent } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useTheme } from '../../context/ThemeContext';
import { Eye, EyeOff, Mail, Lock, User, TrendingUp } from 'lucide-react';
import { isValidEmail, isValidPassword } from '../../utils/validation';


interface WelcomePageProps {
  onSuccess: () => void;
}


export const WelcomePage = ({ onSuccess }: WelcomePageProps) => {
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';


  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const getAccentClass = () => {
    if (accent === 'green') return 'bg-green-600 hover:bg-green-700';
    if (accent === 'lgbt') return 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90';
    return 'bg-pink-600 hover:bg-pink-700';
  };


  const getBgClass = () => {
    if (isDark) return 'bg-slate-900';
    if (accent === 'green') return 'bg-green-50';
    if (accent === 'lgbt') return 'bg-gradient-to-br from-red-50 to-blue-50';
    return 'bg-pink-50';
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);


    if (!auth) {
      setError('Authentication not available');
      setLoading(false);
      return;
    }


    try {
      if (mode === 'signup') {
        // Validation
        if (!displayName.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        if (!isValidEmail(email)) {
          setError('Please enter a valid email');
          setLoading(false);
          return;
        }
        if (!isValidPassword(password)) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }


        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: displayName.trim() });
        onSuccess();
      } else {
        // Login
        if (!isValidEmail(email)) {
          setError('Please enter a valid email');
          setLoading(false);
          return;
        }
        if (!password) {
          setError('Please enter your password');
          setLoading(false);
          return;
        }


        await signInWithEmailAndPassword(auth, email, password);
        onSuccess();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
     
      // User-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleGuestLogin = async () => {
    if (!auth) return;
   
    setLoading(true);
    setError('');
   
    try {
      await signInAnonymously(auth);
      onSuccess();
    } catch (err: any) {
      console.error('Guest login error:', err);
      setError('Failed to sign in as guest');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={`min-h-screen ${getBgClass()} flex items-center justify-center p-4 transition-colors duration-300`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-2xl ${getAccentClass()} flex items-center justify-center shadow-xl`}>
              <TrendingUp className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
          </div>
          <h1 className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Welcome to HabitFlow
          </h1>
          <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {mode === 'signup' ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>


        {/* Form Card */}
        <div className={`rounded-3xl p-8 shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field (Sign Up Only) */}
            {mode === 'signup' && (
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 font-medium transition-all ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                    }`}
                    disabled={loading}
                  />
                </div>
              </div>
            )}


            {/* Email Field */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 font-medium transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                  }`}
                  disabled={loading}
                />
              </div>
            </div>


            {/* Password Field */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 font-medium transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>


            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border-2 border-red-500/20">
                <p className="text-red-500 text-sm font-medium">{error}</p>
              </div>
            )}


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all ${getAccentClass()} ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>


            {/* Divider */}
            <div className="relative my-6">
              <div className={`absolute inset-0 flex items-center`}>
                <div className={`w-full border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500'}`}>
                  or
                </span>
              </div>
            </div>


            {/* Guest Login */}
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold transition-all border-2 ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Continue as Guest
            </button>
          </form>


          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className={`text-sm font-medium ${
                accent === 'green'
                  ? 'text-green-600 hover:text-green-700'
                  : accent === 'lgbt'
                  ? 'text-indigo-600 hover:text-indigo-700'
                  : 'text-pink-600 hover:text-pink-700'
              }`}
            >
              {mode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>


        {/* Footer Note */}
        <p className={`text-center mt-6 text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};




