import React from 'react';
import { Check, Trash2, Clock } from 'lucide-react';
import { CATEGORIES } from '../../types/todo';
import type { Todo } from '../../types/todo';
import { useTodo } from '../../context/TodoContext';
import './TodoItem.css';

interface TodoItemProps {
    todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const { toggleTodo, deleteTodo } = useTodo();
    const category = CATEGORIES[todo.category];

    return (
        <div className={`todo-item glass-card animate-fade-in ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-left">
                <button
                    className={`checkbox ${todo.completed ? 'checked' : ''}`}
                    onClick={() => toggleTodo(todo.id)}
                >
                    {todo.completed && <Check size={14} />}
                </button>
                <div className="todo-content">
                    <h3 className="todo-title">{todo.title}</h3>
                    <div className="todo-meta">
                        <span className="cat-badge" style={{ color: category.color }}>
                            {category.icon} {category.label}
                        </span>
                        <span className="time-badge">
                            <Clock size={12} /> {todo.dueTime}
                        </span>
                    </div>
                </div>
            </div>

            <div className="todo-right">
                <div className={`priority-line prio-${todo.priority}`}></div>
                <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default TodoItem;
