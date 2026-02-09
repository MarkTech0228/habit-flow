import React, { useState } from 'react';

// 🎓 ONBOARDING FLOW COMPONENT
const OnboardingFlow = ({
  onComplete,
  isDark,
  isGreen,
  isLgbt
}: {
  onComplete: () => void;
  isDark: boolean;
  isGreen: boolean;
  isLgbt: boolean;
}) => {
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState('');
  const [selectedHabit, setSelectedHabit] = useState('');

  const steps = [
    {
      title: "Welcome to HabitFlow! 🎉",
      description: "Your all-in-one platform for habits, tasks, and money management",
      emoji: "👋",
      action: null
    },
    {
      title: "Set Your Daily Budget 💰",
      description: "How much can you spend each day?",
      emoji: "💵",
      action: (
        <div className="w-full">
          <input
            type="number"
            step="0.01"
            placeholder="e.g., 50.00"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition font-bold text-2xl text-center ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-white focus:border-green-400'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-green-500'
            }`}
            autoFocus
          />
        </div>
      )
    },
    {
      title: "Quick Start Habit 🎯",
      description: "Choose a habit to track (or skip)",
      emoji: "🚀",
      action: (
        <div className="grid grid-cols-2 gap-3 w-full">
          {['Workout', 'Meditate', 'Read', 'Study'].map(habit => (
            <button
              key={habit}
              onClick={() => setSelectedHabit(habit)}
              className={`p-4 rounded-xl border-2 font-bold transition ${
                selectedHabit === habit
                  ? (isDark
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-green-600 border-green-600 text-white'
                    )
                  : (isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    )
              }`}
            >
              {habit}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "You're All Set! ✅",
      description: "Start building better habits today",
      emoji: "🎊",
      action: null
    }
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-pop ${
        isDark ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white border-2 border-slate-100'
      }`}>
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                idx <= step
                  ? (isGreen ? 'bg-green-500' : isLgbt ? 'bg-indigo-500' : 'bg-pink-500')
                  : (isDark ? 'bg-slate-700' : 'bg-slate-200')
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">{currentStep.emoji}</div>
          <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currentStep.title}
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {currentStep.description}
          </p>
        </div>

        {/* Action Area */}
        {currentStep.action && (
          <div className="mb-8 flex justify-center">
            {currentStep.action}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && step < steps.length - 1 && (
            <button
              onClick={handleSkip}
              className={`flex-1 px-6 py-4 rounded-2xl font-bold transition ${
                isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step === 1 && !budget}
            className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white transition shadow-lg ${
              isDark
                ? (isGreen ? 'bg-green-500 hover:bg-green-400' : isLgbt ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90' : 'bg-pink-500 hover:bg-pink-400')
                : (isGreen ? 'bg-green-600 hover:bg-green-700' : isLgbt ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90' : 'bg-pink-600 hover:bg-pink-700')
            } ${step === 1 && !budget ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLastStep ? "Let's Go!" : 'Continue'}
          </button>
        </div>

        {/* Step Counter */}
        <p className={`text-center mt-6 text-sm font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          Step {step + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
};

export default OnboardingFlow;