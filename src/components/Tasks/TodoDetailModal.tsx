import { useState } from 'react';
import type { FC } from 'react';
import { X, Calendar, Clock, AlertCircle, FileText, Edit3, Save } from 'lucide-react';
import { CATEGORIES } from '../../types/todo';
import type { Todo, CategoryType, Priority } from '../../types/todo';
import { useTodo } from '../../context/TodoContext';
import './TodoDetailModal.css';

interface TodoDetailModalProps {
    todo: Todo;
    isOpen: boolean;
    onClose: () => void;
}

const TodoDetailModal: FC<TodoDetailModalProps> = ({ todo, isOpen, onClose }) => {
    const { updateTodo } = useTodo();
    const [isEditing, setIsEditing] = useState(false);

    // Edit state
    const [title, setTitle] = useState(todo.title);
    const [category, setCategory] = useState<CategoryType>(todo.category);
    const [priority, setPriority] = useState<Priority>(todo.priority);
    const [date, setDate] = useState(todo.dueDate);
    const [time, setTime] = useState(todo.dueTime);
    const [description, setDescription] = useState(todo.description);

    if (!isOpen) return null;

    const categoryInfo = CATEGORIES[isEditing ? category : todo.category];
    const priorityLabels = {
        high: '높음',
        medium: '보통',
        low: '낮음'
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    const handleEdit = () => {
        // Reset edit state to current todo values
        setTitle(todo.title);
        setCategory(todo.category);
        setPriority(todo.priority);
        setDate(todo.dueDate);
        setTime(todo.dueTime);
        setDescription(todo.description);
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!title.trim()) return;

        updateTodo(todo.id, {
            title,
            category,
            priority,
            dueDate: date,
            dueTime: time,
            description
        });
        setIsEditing(false);
    };

    const handleClose = () => {
        setIsEditing(false);
        onClose();
    };

    return (
        <div className="detail-overlay" onClick={handleClose}>
            <div className="detail-content glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="detail-header">
                    <h2>{isEditing ? '일정 수정' : '일정 상세'}</h2>
                    <div className="header-actions">
                        {!isEditing ? (
                            <button onClick={handleEdit} className="edit-btn" type="button" aria-label="수정">
                                <Edit3 size={20} />
                            </button>
                        ) : (
                            <button onClick={handleSave} className="save-btn" type="button" aria-label="저장">
                                <Save size={20} />
                            </button>
                        )}
                        <button onClick={handleClose} className="close-btn" type="button">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="detail-body">
                    {isEditing ? (
                        // Edit Mode
                        <>
                            <div className="edit-field">
                                <label>제목</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="edit-input"
                                    autoFocus
                                />
                            </div>

                            <div className="edit-field">
                                <label>카테고리</label>
                                <div className="category-grid">
                                    {Object.values(CATEGORIES).map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            className={`cat-option ${category === cat.id ? 'active' : ''}`}
                                            onClick={() => setCategory(cat.id)}
                                        >
                                            <span>{cat.icon}</span>
                                            <span>{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="edit-row">
                                <div className="edit-field">
                                    <label>날짜</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="edit-input"
                                    />
                                </div>
                                <div className="edit-field">
                                    <label>시간</label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="edit-input"
                                    />
                                </div>
                            </div>

                            <div className="edit-field">
                                <label>우선순위</label>
                                <div className="priority-options">
                                    {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            className={`prio-option ${priority === p ? 'active' : ''} prio-${p}`}
                                            onClick={() => setPriority(p)}
                                        >
                                            {priorityLabels[p]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="edit-field">
                                <label>메모</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="edit-textarea"
                                    rows={3}
                                    placeholder="메모를 입력하세요 (선택사항)"
                                />
                            </div>
                        </>
                    ) : (
                        // View Mode
                        <>
                            <div className="detail-title-section">
                                <h3 className={todo.completed ? 'completed' : ''}>{todo.title}</h3>
                                {todo.completed && <span className="completed-badge">완료됨</span>}
                            </div>

                            <div className="detail-info-grid">
                                <div className="detail-info-item">
                                    <span className="info-icon" style={{ color: categoryInfo.color }}>
                                        {categoryInfo.icon}
                                    </span>
                                    <div className="info-content">
                                        <span className="info-label">카테고리</span>
                                        <span className="info-value">{categoryInfo.label}</span>
                                    </div>
                                </div>

                                <div className="detail-info-item">
                                    <Calendar size={18} className="info-icon" />
                                    <div className="info-content">
                                        <span className="info-label">날짜</span>
                                        <span className="info-value">{formatDate(todo.dueDate)}</span>
                                    </div>
                                </div>

                                <div className="detail-info-item">
                                    <Clock size={18} className="info-icon" />
                                    <div className="info-content">
                                        <span className="info-label">시간</span>
                                        <span className="info-value">{todo.dueTime}</span>
                                    </div>
                                </div>

                                <div className="detail-info-item">
                                    <AlertCircle size={18} className="info-icon" />
                                    <div className="info-content">
                                        <span className="info-label">우선순위</span>
                                        <span className={`info-value priority-${todo.priority}`}>
                                            {priorityLabels[todo.priority]}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {todo.description && (
                                <div className="detail-description">
                                    <div className="desc-header">
                                        <FileText size={16} />
                                        <span>메모</span>
                                    </div>
                                    <p>{todo.description}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodoDetailModal;
