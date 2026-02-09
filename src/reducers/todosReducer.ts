import { TodoItem } from '../types';


export type TodosAction =
  | { type: 'SET_TODOS'; payload: TodoItem[] }
  | { type: 'ADD_TODO'; payload: TodoItem }
  | { type: 'UPDATE_TODO'; payload: { id: string; updates: Partial<TodoItem> } }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string };


export interface TodosState {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
}


export const initialTodosState: TodosState = {
  todos: [],
  loading: false,
  error: null
};


export function todosReducer(state: TodosState, action: TodosAction): TodosState {
  switch (action.type) {
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.payload,
        loading: false
      };


    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };


    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates }
            : todo
        )
      };


    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };


    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };


    default:
      return state;
  }
}

