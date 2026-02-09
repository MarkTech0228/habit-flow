import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Expense } from '../types/financial';


export const useExpenses = (userId: string | undefined) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!userId || !db) {
      setLoading(false);
      return;
    }


    const expensesRef = collection(db, 'users', userId, 'expenses');
    const q = query(expensesRef, orderBy('date', 'desc'));


    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const expensesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Expense[];
       
        setExpenses(expensesData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching expenses:', err);
        setError('Failed to load expenses');
        setLoading(false);
      }
    );


    return () => unsubscribe();
  }, [userId]);


  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!userId || !db) return;


    try {
      await addDoc(collection(db, 'users', userId, 'expenses'), {
        ...expenseData,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error adding expense:', err);
      throw new Error('Failed to add expense');
    }
  };


  const updateExpense = async (expenseId: string, updates: Partial<Expense>) => {
    if (!userId || !db) return;


    try {
      const expenseRef = doc(db, 'users', userId, 'expenses', expenseId);
      await updateDoc(expenseRef, updates);
    } catch (err) {
      console.error('Error updating expense:', err);
      throw new Error('Failed to update expense');
    }
  };


  const deleteExpense = async (expenseId: string) => {
    if (!userId || !db) return;


    try {
      const expenseRef = doc(db, 'users', userId, 'expenses', expenseId);
      await deleteDoc(expenseRef);
    } catch (err) {
      console.error('Error deleting expense:', err);
      throw new Error('Failed to delete expense');
    }
  };


  // Calculate total expenses
  const getTotalExpenses = (startDate?: string, endDate?: string): number => {
    let filtered = expenses;
   
    if (startDate) {
      filtered = filtered.filter(e => e.date >= startDate);
    }
   
    if (endDate) {
      filtered = filtered.filter(e => e.date <= endDate);
    }
   
    return filtered.reduce((sum, expense) => sum + expense.amount, 0);
  };


  // Get expenses by category
  const getExpensesByCategory = (category: string): Expense[] => {
    return expenses.filter(e => e.category === category);
  };


  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    getTotalExpenses,
    getExpensesByCategory
  };
};

