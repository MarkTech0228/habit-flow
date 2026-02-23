// src/constants/habits.ts
// Moved from App.tsx lines 1573-1834 and 2214-2310
import {
  Coffee, Book, Dumbbell, Droplet, Brain,
  Pill, Home, Briefcase, Music, Target,
} from 'lucide-react';
import type { HabitIcon, HabitThemeData } from '../types';

// ── Icon options ───────────────────────────────────────────
export const HABIT_ICONS: HabitIcon[] = [
  { name: 'Coffee',    icon: Coffee    },
  { name: 'Book',      icon: Book      },
  { name: 'Dumbbell',  icon: Dumbbell  },
  { name: 'Droplet',   icon: Droplet   },
  { name: 'Brain',     icon: Brain     },
  { name: 'Pill',      icon: Pill      },
  { name: 'Home',      icon: Home      },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Music',     icon: Music     },
  { name: 'Target',    icon: Target    },
];

// ── Habit colour themes ────────────────────────────────────
export const HABIT_THEMES_PINK: HabitThemeData[] = [
  { name: 'Pink',    light: { bg: 'bg-pink-50',    border: 'border-pink-200',    text: 'text-pink-900',    icon: 'text-pink-700',    hover: 'hover:bg-pink-100',    check: 'bg-pink-600',    gradient: 'from-pink-500 to-rose-500'    }, dark: { bg: 'bg-pink-900/20',    border: 'border-pink-500/30',    text: 'text-pink-100',    icon: 'text-pink-300',    hover: 'hover:bg-pink-900/40',    check: 'bg-pink-400',    gradient: 'from-pink-400 to-rose-400'    } },
  { name: 'Rose',    light: { bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-900',    icon: 'text-rose-700',    hover: 'hover:bg-rose-100',    check: 'bg-rose-600',    gradient: 'from-rose-500 to-pink-500'    }, dark: { bg: 'bg-rose-900/20',    border: 'border-rose-500/30',    text: 'text-rose-100',    icon: 'text-rose-300',    hover: 'hover:bg-rose-900/40',    check: 'bg-rose-400',    gradient: 'from-rose-400 to-pink-400'    } },
  { name: 'Fuchsia', light: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-900', icon: 'text-fuchsia-700', hover: 'hover:bg-fuchsia-100', check: 'bg-fuchsia-600', gradient: 'from-fuchsia-500 to-purple-500' }, dark: { bg: 'bg-fuchsia-900/20', border: 'border-fuchsia-500/30', text: 'text-fuchsia-100', icon: 'text-fuchsia-300', hover: 'hover:bg-fuchsia-900/40', check: 'bg-fuchsia-400', gradient: 'from-fuchsia-400 to-purple-400' } },
  { name: 'Purple',  light: { bg: 'bg-purple-50',  border: 'border-purple-200',  text: 'text-purple-900',  icon: 'text-purple-700',  hover: 'hover:bg-purple-100',  check: 'bg-purple-600',  gradient: 'from-purple-500 to-indigo-500'  }, dark: { bg: 'bg-purple-900/20',  border: 'border-purple-500/30',  text: 'text-purple-100',  icon: 'text-purple-300',  hover: 'hover:bg-purple-900/40',  check: 'bg-purple-400',  gradient: 'from-purple-400 to-indigo-400'  } },
  { name: 'Violet',  light: { bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-900',  icon: 'text-violet-700',  hover: 'hover:bg-violet-100',  check: 'bg-violet-600',  gradient: 'from-violet-500 to-purple-500'  }, dark: { bg: 'bg-violet-900/20',  border: 'border-violet-500/30',  text: 'text-violet-100',  icon: 'text-violet-300',  hover: 'hover:bg-violet-900/40',  check: 'bg-violet-400',  gradient: 'from-violet-400 to-purple-400'  } },
];

export const HABIT_THEMES_GREEN: HabitThemeData[] = [
  { name: 'Green',   light: { bg: 'bg-green-50',   border: 'border-green-200',   text: 'text-green-900',   icon: 'text-green-700',   hover: 'hover:bg-green-100',   check: 'bg-green-600',   gradient: 'from-green-500 to-emerald-500'   }, dark: { bg: 'bg-green-900/20',   border: 'border-green-500/30',   text: 'text-green-100',   icon: 'text-green-300',   hover: 'hover:bg-green-900/40',   check: 'bg-green-400',   gradient: 'from-green-400 to-emerald-400'   } },
  { name: 'Emerald', light: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: 'text-emerald-700', hover: 'hover:bg-emerald-100', check: 'bg-emerald-600', gradient: 'from-emerald-500 to-teal-500'    }, dark: { bg: 'bg-emerald-900/20', border: 'border-emerald-500/30', text: 'text-emerald-100', icon: 'text-emerald-300', hover: 'hover:bg-emerald-900/40', check: 'bg-emerald-400', gradient: 'from-emerald-400 to-teal-400'    } },
  { name: 'Teal',    light: { bg: 'bg-teal-50',    border: 'border-teal-200',    text: 'text-teal-900',    icon: 'text-teal-700',    hover: 'hover:bg-teal-100',    check: 'bg-teal-600',    gradient: 'from-teal-500 to-cyan-500'      }, dark: { bg: 'bg-teal-900/20',    border: 'border-teal-500/30',    text: 'text-teal-100',    icon: 'text-teal-300',    hover: 'hover:bg-teal-900/40',    check: 'bg-teal-400',    gradient: 'from-teal-400 to-cyan-400'      } },
  { name: 'Cyan',    light: { bg: 'bg-cyan-50',    border: 'border-cyan-200',    text: 'text-cyan-900',    icon: 'text-cyan-700',    hover: 'hover:bg-cyan-100',    check: 'bg-cyan-600',    gradient: 'from-cyan-500 to-sky-500'       }, dark: { bg: 'bg-cyan-900/20',    border: 'border-cyan-500/30',    text: 'text-cyan-100',    icon: 'text-cyan-300',    hover: 'hover:bg-cyan-900/40',    check: 'bg-cyan-400',    gradient: 'from-cyan-400 to-sky-400'       } },
  { name: 'Sky',     light: { bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-900',     icon: 'text-sky-700',     hover: 'hover:bg-sky-100',     check: 'bg-sky-600',     gradient: 'from-sky-500 to-blue-500'       }, dark: { bg: 'bg-sky-900/20',     border: 'border-sky-500/30',     text: 'text-sky-100',     icon: 'text-sky-300',     hover: 'hover:bg-sky-900/40',     check: 'bg-sky-400',     gradient: 'from-sky-400 to-blue-400'       } },
];

export const HABIT_THEMES_RAINBOW: HabitThemeData[] = [
  { name: 'Red',    light: { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-900',    icon: 'text-red-600',    hover: 'hover:bg-red-100',    check: 'bg-red-500',    gradient: 'from-red-500 to-orange-500'     }, dark: { bg: 'bg-red-900/20',    border: 'border-red-500/30',    text: 'text-red-100',    icon: 'text-red-400',    hover: 'hover:bg-red-900/40',    check: 'bg-red-500',    gradient: 'from-red-600 to-orange-600'     } },
  { name: 'Orange', light: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', icon: 'text-orange-600', hover: 'hover:bg-orange-100', check: 'bg-orange-500', gradient: 'from-orange-500 to-amber-500'    }, dark: { bg: 'bg-orange-900/20', border: 'border-orange-500/30', text: 'text-orange-100', icon: 'text-orange-400', hover: 'hover:bg-orange-900/40', check: 'bg-orange-500', gradient: 'from-orange-600 to-amber-600'    } },
  { name: 'Yellow', light: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', icon: 'text-yellow-600', hover: 'hover:bg-yellow-100', check: 'bg-yellow-500', gradient: 'from-yellow-400 to-lime-500'     }, dark: { bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', text: 'text-yellow-100', icon: 'text-yellow-400', hover: 'hover:bg-yellow-900/40', check: 'bg-yellow-500', gradient: 'from-yellow-600 to-lime-600'     } },
  { name: 'Green',  light: { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-900',  icon: 'text-green-600',  hover: 'hover:bg-green-100',  check: 'bg-green-500',  gradient: 'from-green-500 to-emerald-500'   }, dark: { bg: 'bg-green-900/20',  border: 'border-green-500/30',  text: 'text-green-100',  icon: 'text-green-400',  hover: 'hover:bg-green-900/40',  check: 'bg-green-500',  gradient: 'from-green-600 to-emerald-600'   } },
  { name: 'Blue',   light: { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-900',   icon: 'text-blue-600',   hover: 'hover:bg-blue-100',   check: 'bg-blue-500',   gradient: 'from-blue-500 to-indigo-500'     }, dark: { bg: 'bg-blue-900/20',   border: 'border-blue-500/30',   text: 'text-blue-100',   icon: 'text-blue-400',   hover: 'hover:bg-blue-900/40',   check: 'bg-blue-500',   gradient: 'from-blue-600 to-indigo-600'     } },
  { name: 'Purple', light: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', icon: 'text-purple-600', hover: 'hover:bg-purple-100', check: 'bg-purple-500', gradient: 'from-purple-500 to-fuchsia-500'  }, dark: { bg: 'bg-purple-900/20', border: 'border-purple-500/30', text: 'text-purple-100', icon: 'text-purple-400', hover: 'hover:bg-purple-900/40', check: 'bg-purple-500', gradient: 'from-purple-600 to-fuchsia-600'  } },
];

// ── Habit templates ────────────────────────────────────────
export interface HabitTemplate {
  title: string;
  icon: string;
  colorTheme: string;
  category: 'student' | 'adult' | 'health' | 'productivity';
  description: string;
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // Student
  { title: 'Study Session',         icon: 'Book',      colorTheme: 'Blue',   category: 'student',      description: 'Daily focused study time'        },
  { title: 'Review Lecture Notes',  icon: 'Brain',     colorTheme: 'Purple', category: 'student',      description: "Go over today's class material"  },
  { title: 'Practice Problems',     icon: 'Target',    colorTheme: 'Teal',   category: 'student',      description: 'Solve practice questions'        },
  { title: 'Read Textbook Chapter', icon: 'Book',      colorTheme: 'Cyan',   category: 'student',      description: 'Daily reading assignment'        },
  // Health & Fitness
  { title: 'Morning Workout',       icon: 'Dumbbell',  colorTheme: 'Green',  category: 'health',       description: 'Start your day with exercise'    },
  { title: 'Drink 8 Glasses Water', icon: 'Droplet',   colorTheme: 'Cyan',   category: 'health',       description: 'Stay hydrated throughout the day'},
  { title: 'Meditation',            icon: 'Brain',     colorTheme: 'Purple', category: 'health',       description: '10 minutes of mindfulness'       },
  { title: 'Take Vitamins',         icon: 'Pill',      colorTheme: 'Orange', category: 'health',       description: 'Daily supplements routine'       },
  // Productivity
  { title: 'Wake Up Early',         icon: 'Coffee',    colorTheme: 'Rose',   category: 'productivity', description: 'Rise before 7 AM'               },
  { title: 'Morning Journaling',    icon: 'Book',      colorTheme: 'Violet', category: 'productivity', description: 'Reflect and plan your day'       },
  { title: 'No Phone Before 9 AM',  icon: 'Target',    colorTheme: 'Red',    category: 'productivity', description: 'Start day distraction-free'      },
  { title: 'Plan Tomorrow',         icon: 'Briefcase', colorTheme: 'Sky',    category: 'productivity', description: 'Evening planning session'        },
  // Adult / Career
  { title: 'Learn New Skill',       icon: 'Brain',     colorTheme: 'Emerald',category: 'adult',        description: '30 mins of professional development'},
  { title: 'Network with 1 Person', icon: 'Briefcase', colorTheme: 'Blue',   category: 'adult',        description: 'Expand your professional circle' },
  { title: 'Side Project Work',     icon: 'Target',    colorTheme: 'Fuchsia',category: 'adult',        description: '1 hour on personal projects'     },
  { title: 'Clean Workspace',       icon: 'Home',      colorTheme: 'Green',  category: 'adult',        description: 'Organize your environment'       },
];

// ── Achievement definitions ────────────────────────────────
export const ACHIEVEMENT_DEFINITIONS = [
  { id: 'first-habit',        title: 'Getting Started',  description: 'Create your first habit',               icon: '🎯', category: 'habits'     as const, requirement: 1,   reward: 'Welcome to HabitFlow!'            },
  { id: 'habit-master',       title: 'Habit Master',     description: 'Create 10 habits',                      icon: '🎓', category: 'habits'     as const, requirement: 10,  reward: "You're building a better life!"   },
  { id: 'week-warrior',       title: '7 Day Warrior',    description: 'Maintain a 7-day streak',               icon: '🔥', category: 'streak'     as const, requirement: 7,   reward: 'One week strong!'                 },
  { id: 'month-master',       title: 'Monthly Master',   description: 'Maintain a 30-day streak',              icon: '⭐', category: 'streak'     as const, requirement: 30,  reward: 'Consistency is key!'              },
  { id: 'century-club',       title: 'Century Club',     description: 'Reach a 100-day streak',                icon: '💯', category: 'streak'     as const, requirement: 100, reward: "You're unstoppable!"             },
  { id: 'first-budget',       title: 'Budget Beginner',  description: 'Set your first daily budget',           icon: '💰', category: 'money'      as const, requirement: 1,   reward: 'Taking control of your finances!' },
  { id: 'money-saver',        title: 'Money Saver',      description: 'Save 20% of your budget for a week',   icon: '🏦', category: 'money'      as const, requirement: 7,   reward: 'Smart spending pays off!'         },
  { id: 'budget-boss',        title: 'Budget Boss',      description: 'Stay under budget for 30 days',        icon: '👑', category: 'money'      as const, requirement: 30,  reward: "You're in complete control!"     },
  { id: 'hundred-completions',title: 'Centurion',        description: 'Complete 100 total habits',             icon: '🎖️',category: 'milestone'  as const, requirement: 100, reward: "You're a completion machine!"    },
  { id: 'perfect-week',       title: 'Perfect Week',     description: 'Complete all habits for 7 days straight',icon:'✨', category: 'milestone'  as const, requirement: 7,   reward: 'Absolute dedication!'             },
];