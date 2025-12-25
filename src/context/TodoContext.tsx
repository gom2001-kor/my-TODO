import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode, FC } from 'react';
import type { Todo, CategoryType } from '../types/todo';

interface TodoContextType {
    todos: Todo[];
    addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => void;
    updateTodo: (id: string, updates: Partial<Todo>) => void;
    deleteTodo: (id: string) => void;
    toggleTodo: (id: string) => void;
    filter: CategoryType | 'all';
    setFilter: (filter: CategoryType | 'all') => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem('my-todo-list');
        return saved ? JSON.parse(saved) : [];
    });
    const [filter, setFilter] = useState<CategoryType | 'all'>('all');

    useEffect(() => {
        localStorage.setItem('my-todo-list', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
        const newTodo: Todo = {
            ...todoData,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            completed: false,
        };
        setTodos((prev) => [newTodo, ...prev]);
    };

    const updateTodo = (id: string, updates: Partial<Todo>) => {
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    };

    const deleteTodo = (id: string) => {
        setTodos((prev) => prev.filter((t) => t.id !== id));
    };

    const toggleTodo = (id: string) => {
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
    };

    return (
        <TodoContext.Provider value={{ todos, addTodo, updateTodo, deleteTodo, toggleTodo, filter, setFilter }}>
            {children}
        </TodoContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTodo = () => {
    const context = useContext(TodoContext);
    if (!context) throw new Error('useTodo must be used within a TodoProvider');
    return context;
};
