import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { TodoItem } from '../types';


export function useTodos() {
  const { state, dispatchTodos } = useApp();
  const { user } = useAuth();


  useEffect(() => {
    if (!user || !user.uid) {
      dispatchTodos({ type: 'SET_TODOS', payload: [] });
      return;
    }


    const q = query(
      collection(db, 'users', user.uid, 'todos'),
      orderBy('createdAt', 'desc')
    );


    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const todosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TodoItem[];
       
        dispatchTodos({ type: 'SET_TODOS', payload: todosData });
      },
      (error) => {
        console.error('Error fetching todos:', error);
      }
    );


    return () => unsubscribe();
  }, [user, dispatchTodos]);


  return {
    todos: state.todos.todos,
    loading: state.todos.loading,
    error: state.todos.error,
    dispatch: dispatchTodos
  };
}

