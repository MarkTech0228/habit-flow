import { TrendingUp, CheckCircle2, Zap, Shield, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';

  const getAccentClass = () => {
    if (accent === 'green') return isDark ? 'from-green-600 to-green-400' : 'from-green-600 to-green-500';
    if (accent === 'lgbt') return 'from-red-500 via-purple-500 to-blue-500';
    return isDark ? 'from-pink-600 to-pink-400' : 'from-pink-600 to-pink-500';
  };

  const getBgClass = () => {
    if (isDark) return 'bg-slate-900';
    if (accent === 'green') return 'bg-green-50';
    if (accent === 'lgbt') return 'bg-gradient-to-br from-red-50 via-purple-50 to-blue-50';
    return 'bg-pink-50';
  };

  const getTextClass = () => {
    if (isDark) return 'text-white';
    return 'text-slate-900';
  };

  const getSubTextClass = () => {
    if (isDark) return 'text-slate-400';
    return 'text-slate-600';
  };

  const features = [
    {
      icon: CheckCircle2,
      title: 'Track Habits',
      description: 'Build consistency with daily habit tracking and streak counting',
    },
    {
      icon: Zap,
      title: 'Manage Todos',
      description: 'Stay organized with priority-based task management',
    },
    {
      icon: Shield,
      title: 'Track Money',
      description: 'Monitor expenses, income, and achieve financial goals',
    },
    {
      icon: Sparkles,
      title: 'Gamification',
      description: 'Unlock achievements and stay motivated with rewards',
    },
  ];

  return (
    <div className={`min-h-screen ${getBgClass()} transition-colors duration-300`}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${getAccentClass()} flex items-center justify-center shadow-2xl animate-bounce-slow`}>
              <TrendingUp className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Heading */}
          <h1 className={`text-6xl md:text-7xl font-black mb-6 ${getTextClass()}`}>
            Habit<span className={`bg-gradient-to-r ${getAccentClass()} bg-clip-text text-transparent`}>Flow</span>
          </h1>

          {/* Subheading */}
          <p className={`text-xl md:text-2xl mb-8 ${getSubTextClass()} font-medium`}>
            Your all-in-one app for habits, todos, and money tracking
          </p>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className={`px-12 py-5 rounded-2xl font-bold text-white text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r ${getAccentClass()}`}
          >
            Get Started Free
          </button>

          {/* Trust Badge */}
          <p className={`mt-6 text-sm ${getSubTextClass()}`}>
            ✨ No credit card required • Works offline • 100% private
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl backdrop-blur-sm border-2 transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                  : 'bg-white/80 border-slate-200 hover:bg-white'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getAccentClass()} flex items-center justify-center mb-4 shadow-lg`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className={`font-bold text-lg mb-2 ${getTextClass()}`}>{feature.title}</h3>
              <p className={`text-sm ${getSubTextClass()}`}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center mt-20">
          <p className={`text-sm ${getSubTextClass()} mb-4`}>Trusted by people who value their growth</p>
          <div className="flex justify-center items-center gap-4">
            <div className={`px-6 py-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <p className={`text-2xl font-bold ${getTextClass()}`}>99%</p>
              <p className={`text-xs ${getSubTextClass()}`}>Success Rate</p>
            </div>
            <div className={`px-6 py-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <p className={`text-2xl font-bold ${getTextClass()}`}>5★</p>
              <p className={`text-xs ${getSubTextClass()}`}>User Rating</p>
            </div>
            <div className={`px-6 py-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <p className={`text-2xl font-bold ${getTextClass()}`}>24/7</p>
              <p className={`text-xs ${getSubTextClass()}`}>Access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


