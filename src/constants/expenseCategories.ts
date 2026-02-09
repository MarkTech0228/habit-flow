import { Coffee, Briefcase, Music, ShoppingBag, Home, Heart, Target } from 'lucide-react';

export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food & Drinks', icon: Coffee, color: 'orange' },
  { id: 'transport', label: 'Transportation', icon: Briefcase, color: 'blue' },
  { id: 'entertainment', label: 'Entertainment', icon: Music, color: 'purple' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'pink' },
  { id: 'bills', label: 'Bills & Utilities', icon: Home, color: 'red' },
  { id: 'health', label: 'Health & Fitness', icon: Heart, color: 'green' },
  { id: 'debt_payment', label: 'Debt Payment', icon: 'CreditCard', color: 'indigo' },
  { id: 'other', label: 'Other', icon: Target, color: 'slate' }
];

export const DEFAULT_CATEGORY_BUDGETS: Record<string, number> = {
  'Food & Dining': 500,
  'Transportation': 200,
  'Shopping': 300,
  'Entertainment': 150,
  'Bills & Utilities': 400,
  'Healthcare': 200,
  'Education': 300,
  'Personal Care': 100,
  'Gifts & Donations': 100,
  'Other': 200
};