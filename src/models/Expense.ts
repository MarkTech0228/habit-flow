export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: any;
  userId?: string;
  // Add other properties as needed
}