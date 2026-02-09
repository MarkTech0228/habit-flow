import React from 'react';
import { Check, Trash2 } from 'lucide-react';


interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: any;
}


interface TodoListProps {
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}


const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          No todos yet. Add your first task!
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-3">
      {todos.map(todo => (
        <div
          key={todo.id}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-2 border-slate-200 dark:border-slate-700 flex items-center gap-3"
        >
          <button
            onClick={() => onToggle(todo.id)}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              todo.completed
                ? 'bg-green-600 border-green-600'
                : 'border-slate-300 dark:border-slate-600 hover:border-green-500'
            }`}
          >
            {todo.completed && <Check className="w-4 h-4 text-white" />}
          </button>


          <p className={`flex-1 ${
            todo.completed
              ? 'line-through text-slate-400 dark:text-slate-500'
              : 'text-slate-900 dark:text-white'
          }`}>
            {todo.title}
          </p>


          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      ))}
    </div>
  );
};


export default TodoList;




