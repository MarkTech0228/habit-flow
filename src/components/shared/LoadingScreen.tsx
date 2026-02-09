import { useTheme } from '../../context/ThemeContext';


export const LoadingScreen = () => {
  const { theme, accent } = useTheme();
  const isDark = theme === 'dark';


  const getBgClass = () => {
    if (accent === 'green') return isDark ? 'bg-slate-900' : 'bg-green-50';
    if (accent === 'lgbt') return isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-red-50 to-blue-50';
    return isDark ? 'bg-slate-900' : 'bg-pink-50';
  };


  const getSpinnerClass = () => {
    if (accent === 'green') return 'bg-green-600 shadow-green-200';
    if (accent === 'lgbt') return 'bg-gradient-to-br from-red-500 to-blue-500 shadow-indigo-200';
    return 'bg-pink-600 shadow-pink-200';
  };


  const getTextClass = () => {
    if (isDark) return 'text-white';
    if (accent === 'green') return 'text-green-900';
    if (accent === 'lgbt') return 'text-indigo-900';
    return 'text-pink-900';
  };


  return (
    <div className={`min-h-screen flex items-center justify-center ${getBgClass()}`}>
      <div className="flex flex-col items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl animate-spin shadow-lg ${getSpinnerClass()}`} />
        <p className={`font-bold text-lg animate-pulse ${getTextClass()}`}>
          Loading HabitFlow...
        </p>
      </div>
    </div>
  );
};




