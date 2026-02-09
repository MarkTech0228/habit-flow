import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { useTheme } from '../../context/ThemeContext';
import { Layout, CheckCircle2, ListTodo, DollarSign, BarChart3, LogOut } from 'lucide-react';


interface DashboardProps {
  user: User;
  onLogout: () => void;
}


type View = 'habits' | 'todos' | 'money' | 'stats';


export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';
  const [currentView, setCurrentView] = useState<View>('habits');
  const [showOnboarding, setShowOnboarding] = useState(false);


  useEffect(() => {
    // Check if onboarding is needed
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);


  const getAccentColor = () => {
    if (accent === 'green') return 'text-green-600';
    if (accent === 'lgbt') return 'text-indigo-600';
    return 'text-pink-600';
  };


  const getBgAccentColor = () => {
    if (accent === 'green') return 'bg-green-600';
    if (accent === 'lgbt') return 'bg-gradient-to-r from-red-500 to-blue-500';
    return 'bg-pink-600';
  };


  const navItems = [
    { id: 'habits' as View, icon: CheckCircle2, label: 'Habits' },
    { id: 'todos' as View, icon: ListTodo, label: 'Todos' },
    { id: 'money' as View, icon: DollarSign, label: 'Money' },
    { id: 'stats' as View, icon: BarChart3, label: 'Stats' },
  ];


  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Top Bar */}
      <header className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${getBgAccentColor()} flex items-center justify-center`}>
              <Layout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                HabitFlow
              </h1>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Welcome, {user.displayName || 'User'}!
              </p>
            </div>
          </div>


          <button
            onClick={onLogout}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>


      {/* Navigation */}
      <nav className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-[73px] z-30`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-6 py-4 font-bold whitespace-nowrap transition-all ${
                  currentView === item.id
                    ? `${getAccentColor()} border-b-2 ${
                        accent === 'green' ? 'border-green-600' :
                        accent === 'lgbt' ? 'border-indigo-600' :
                        'border-pink-600'
                      }`
                    : isDark
                    ? 'text-slate-400 hover:text-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>


      {/* Main Content */}
<main className="max-w-7xl mx-auto px-4 py-8">
  {/* Placeholder Content */}
  <div className={`rounded-2xl p-12 text-center ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
    {(() => {
      const currentItem = navItems.find(item => item.id === currentView);
      const IconComponent = currentItem?.icon;
      
      return (
        <>
          <div className={`w-20 h-20 rounded-2xl ${getBgAccentColor()} flex items-center justify-center mx-auto mb-6`}>
            {IconComponent && <IconComponent className="w-10 h-10 text-white" />}
          </div>
          <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            This is where your {currentView} content will appear.
          </p>
          <p className={`mt-4 text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Connect this to your existing components from your original Dashboard.tsx
          </p>
        </>
      );
    })()}
  </div>
</main>


      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl p-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Welcome to HabitFlow! 🎉
            </h2>
            <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Let's get you started on your journey to better habits, organized tasks, and financial awareness!
            </p>
            <button
              onClick={() => {
                localStorage.setItem('onboardingCompleted', 'true');
                setShowOnboarding(false);
              }}
              className={`w-full py-3 rounded-xl font-bold text-white ${getBgAccentColor()}`}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
};




