import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Habit } from '../types';


export class HabitsService {
  static async createHabit(userId: string, habitData: Omit<Habit, 'id' | 'createdAt' | 'streak'>): Promise<Habit> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const habitsRef = collection(db, 'users', userId, 'habits');
    
    // Prepare the complete habit document
    const habitDoc = {
      ...habitData,
      createdAt: serverTimestamp(),
      streak: 0,
      completedDates: habitData.completedDates || []
    };
    
    // Add to Firestore
    const docRef = await addDoc(habitsRef, habitDoc);
    
    console.log('✅ Habit created with ID:', docRef.id);
    
    // Return the complete habit object with the new ID
    return {
      id: docRef.id,
      ...habitData,
      createdAt: new Date(),
      streak: 0,
      completedDates: habitData.completedDates || []
    } as Habit;
    
  } catch (error) {
    console.error('❌ Error creating habit:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('permission-denied')) {
        throw new Error('Permission denied. Please check your login status.');
      }
      throw new Error(`Failed to create habit: ${error.message}`);
    }
    
    throw new Error('Failed to create habit. Please try again.');
  }
}

  static async updateHabit(userId: string, habitId: string, updates: Partial<Habit>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
   
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    await updateDoc(habitRef, updates);
  }


  static async deleteHabit(userId: string, habitId: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
   
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    await deleteDoc(habitRef);
  }


  static async toggleHabitCompletion(userId: string, habitId: string, date: string, completedDates: string[]): Promise<void> {
    const isCompleted = completedDates.includes(date);
    const newDates = isCompleted
      ? completedDates.filter(d => d !== date)
      : [...completedDates, date];


    await this.updateHabit(userId, habitId, { completedDates: newDates });
  }
}
