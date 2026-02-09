import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Habit } from '../types';
import { calculateStreak } from '../utils/streakCalculator';


export function useHabits() {
  const { state, dispatchHabits } = useApp();
  const { user } = useAuth();


  useEffect(() => {
    if (!user || !user.uid) {
      dispatchHabits({ type: 'SET_HABITS', payload: [] });
      return;
    }


    const q = query(
      collection(db, 'users', user.uid, 'habits'),
      orderBy('createdAt', 'desc')
    );


    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const habitsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          streak: calculateStreak(doc.data().completedDates || [])
        })) as Habit[];
       
        dispatchHabits({ type: 'SET_HABITS', payload: habitsData });
      },
      (error) => {
        console.error('Error fetching habits:', error);
      }
    );


    return () => unsubscribe();
  }, [user, dispatchHabits]);


  return {
    habits: state.habits.habits,
    loading: state.habits.loading,
    error: state.habits.error,
    dispatch: dispatchHabits
  };
}


