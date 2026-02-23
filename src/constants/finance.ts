// src/constants/finance.ts
// Moved from App.tsx lines 1907–1930 and 2188–2205
import {
  Coffee, Briefcase, Music, Home, Target, Heart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';

export interface ExpenseCategory {
  id:     string;
  label:  string;
  icon:   LucideIcon;
  color:  string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'food',          label: 'Food & Drinks',     icon: Coffee,      color: 'orange'  },
  { id: 'transport',     label: 'Transportation',    icon: Briefcase,   color: 'blue'    },
  { id: 'entertainment', label: 'Entertainment',     icon: Music,       color: 'purple'  },
  { id: 'shopping',      label: 'Shopping',          icon: ShoppingBag, color: 'pink'    },
  { id: 'bills',         label: 'Bills & Utilities', icon: Home,        color: 'red'     },
  { id: 'health',        label: 'Health & Fitness',  icon: Heart,       color: 'green'   },
  { id: 'other',         label: 'Other',             icon: Target,      color: 'slate'   },
];

export const DEFAULT_CATEGORY_BUDGETS: Record<string, number> = {
  'Food & Dining':     500,
  'Transportation':    200,
  'Shopping':          300,
  'Entertainment':     150,
  'Bills & Utilities': 400,
  'Healthcare':        200,
  'Education':         300,
  'Personal Care':     100,
  'Gifts & Donations': 100,
  'Other':             200,
};

export interface Currency {
  code:   string;
  symbol: string;
  name:   string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$',  name: 'US Dollar'          },
  { code: 'EUR', symbol: '€',  name: 'Euro'               },
  { code: 'GBP', symbol: '£',  name: 'British Pound'      },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen'       },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan'       },
  { code: 'PHP', symbol: '₱',  name: 'Philippine Peso'    },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee'       },
  { code: 'KRW', symbol: '₩',  name: 'South Korean Won'   },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar'  },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar'    },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar'   },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit'  },
  { code: 'THB', symbol: '฿',  name: 'Thai Baht'          },
  { code: 'VND', symbol: '₫',  name: 'Vietnamese Dong'    },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah'  },
];