import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Expense } from '../types/financial';

export class ExpensesService {
  static async createExpense(userId: string, expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    
    const expensesRef = collection(db, 'users', userId, 'expenses');
    const docRef = await addDoc(expensesRef, {
      ...expenseData,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  }

  static async deleteExpense(userId: string, expenseId: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    
    const expenseRef = doc(db, 'users', userId, 'expenses', expenseId);
    await deleteDoc(expenseRef);
  }
}