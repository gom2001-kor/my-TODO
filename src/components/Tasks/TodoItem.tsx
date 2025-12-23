import { useState } from 'react';
import { Check, Trash2, Clock } from 'lucide-react';
import { CATEGORIES } from '../../types/todo';
import type { Todo } from '../../types/todo';
import { useTodo } from '../../context/TodoContext';
import TodoDetailModal from './TodoDetailModal';
import './TodoItem.css';

interface TodoItemProps {
    todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
    const { toggleTodo, deleteTodo } = useTodo();
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const category = CATEGORIES[todo.category];

    const handleItemClick = () => {
        setIsDetailOpen(true);
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleTodo(todo.id);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteTodo(todo.id);
    };

    return (
        <>
            <div
                className={`todo-item glass-card animate-fade-in ${todo.completed ? 'completed' : ''}`}
                onClick={handleItemClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleItemClick()}
            >
                <div className="todo-left">
                    <button
                        className={`checkbox ${todo.completed ? 'checked' : ''}`}
                        onClick={handleCheckboxClick}
                        aria-label={todo.completed ? '완료 취소' : '완료 표시'}
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
                    <button
                        className="delete-btn"
                        onClick={handleDeleteClick}
                        aria-label="삭제"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <TodoDetailModal
                todo={todo}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
            />
        </>
    );
};

export default TodoItem;
