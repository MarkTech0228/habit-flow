import {
  Coffee,
  Book,
  Dumbbell,
  Droplet,
  Brain,
  Pill,
  Home,
  Briefcase,
  Music,
  Target,
  Heart,
  Sun,
  Moon,
  Zap,
  Flame,
  Trophy,
  Sparkles,
} from 'lucide-react';


export const HABIT_ICONS = [
  { id: 'coffee', icon: Coffee, label: 'Coffee' },
  { id: 'book', icon: Book, label: 'Book' },
  { id: 'dumbbell', icon: Dumbbell, label: 'Exercise' },
  { id: 'droplet', icon: Droplet, label: 'Water' },
  { id: 'brain', icon: Brain, label: 'Learning' },
  { id: 'pill', icon: Pill, label: 'Medicine' },
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'briefcase', icon: Briefcase, label: 'Work' },
  { id: 'music', icon: Music, label: 'Music' },
  { id: 'target', icon: Target, label: 'Goal' },
  { id: 'heart', icon: Heart, label: 'Health' },
  { id: 'sun', icon: Sun, label: 'Morning' },
  { id: 'moon', icon: Moon, label: 'Evening' },
  { id: 'zap', icon: Zap, label: 'Energy' },
  { id: 'flame', icon: Flame, label: 'Fire' },
  { id: 'trophy', icon: Trophy, label: 'Achievement' },
  { id: 'sparkles', icon: Sparkles, label: 'Magic' },
] as const;


export const getHabitIconById = (id: string) => {
  return HABIT_ICONS.find((h) => h.id === id) || HABIT_ICONS[0];
};


export const getHabitIconComponent = (id: string) => {
  return getHabitIconById(id).icon;
};

