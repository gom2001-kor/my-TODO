import React, { useState } from 'react';
import { X, Calendar as CalIcon, Clock, AlertCircle } from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { CATEGORIES } from '../../types/todo';
import type { CategoryType, Priority } from '../../types/todo';
import './AddTodoModal.css';

interface AddTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ isOpen, onClose }) => {
    const { addTodo } = useTodo();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<CategoryType>('personal');
    const [priority, setPriority] = useState<Priority>('medium');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('09:00');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addTodo({
            title,
            description,
            category,
            priority,
            dueDate: date,
            dueTime: time,
            notifications: {
                oneHourBefore: false,
                thirtyMinBefore: false,
                tenMinBefore: true,
                onTime: true,
            },
        });

        // Reset and close
        setTitle('');
        setDescription('');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>새로운 할 일 추가</h2>
                    <button
                        onClick={onClose}
                        className="close-btn"
                        type="button"
                        aria-label="닫기"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="무엇을 해야 하나요?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="title-input"
                            autoFocus
                            aria-label="할 일 제목"
                        />
                    </div>

                    <div className="category-selector">
                        {Object.values(CATEGORIES).map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                className={`cat-btn ${category === cat.id ? 'active' : ''}`}
                                style={{ '--cat-color': cat.color } as React.CSSProperties}
                                onClick={() => setCategory(cat.id)}
                                aria-pressed={category === cat.id}
                            >
                                <span>{cat.icon}</span>
                                <span className="cat-label">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="row">
                        <div className="input-field">
                            <label htmlFor="todo-date"><CalIcon size={14} /> 날짜</label>
                            <input
                                id="todo-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="input-field">
                            <label htmlFor="todo-time"><Clock size={14} /> 시간</label>
                            <input
                                id="todo-time"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="priority-selector">
                        <label><AlertCircle size={14} /> 우선순위</label>
                        <div className="priority-btns">
                            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    className={`prio-btn ${priority === p ? 'active' : ''} prio-${p}`}
                                    onClick={() => setPriority(p)}
                                    aria-pressed={priority === p}
                                >
                                    {p === 'high' ? '높음' : p === 'medium' ? '보통' : '낮음'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="description-field">
                        <textarea
                            placeholder="메모/설명을 추가하세요 (선택사항)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            aria-label="메모/설명"
                        />
                    </div>

                    <button type="submit" className="submit-btn primary-gradient">
                        추가하기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTodoModal;
