import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { CATEGORIES } from '../types/todo';
import TodoItem from '../components/Tasks/TodoItem';
import AddTodoModal from '../components/Tasks/AddTodoModal';
import './TaskTracker.css';

const TaskTracker = () => {
    const { todos, filter, setFilter } = useTodo();
    const [statusTab, setStatusTab] = useState<'all' | 'pending' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredTodos = todos.filter(t => {
        const matchesCategory = filter === 'all' || t.category === filter;
        const matchesStatus = statusTab === 'all' ||
            (statusTab === 'pending' && !t.completed) ||
            (statusTab === 'completed' && t.completed);
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesStatus && matchesSearch;
    });

    return (
        <div className="task-tracker animate-fade-in">
            <header className="tracker-header">
                <h1>나의 모든 할 일</h1>

                <div className="search-bar glass-card">
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="할 일 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="할 일 검색"
                    />
                </div>

                <div className="filter-scroll">
                    <button
                        className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        전체
                    </button>
                    {Object.values(CATEGORIES).map(cat => (
                        <button
                            key={cat.id}
                            className={`filter-chip ${filter === cat.id ? 'active' : ''}`}
                            onClick={() => setFilter(cat.id)}
                        >
                            <span className="filter-chip-icon">{cat.icon}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>
            </header>

            <div className="status-tabs">
                <button
                    className={statusTab === 'all' ? 'active' : ''}
                    onClick={() => setStatusTab('all')}
                >
                    전체
                </button>
                <button
                    className={statusTab === 'pending' ? 'active' : ''}
                    onClick={() => setStatusTab('pending')}
                >
                    진행 중
                </button>
                <button
                    className={statusTab === 'completed' ? 'active' : ''}
                    onClick={() => setStatusTab('completed')}
                >
                    완료됨
                </button>
            </div>

            <div className="task-list-container">
                {filteredTodos.length > 0 ? (
                    filteredTodos.map(todo => (
                        <TodoItem key={todo.id} todo={todo} />
                    ))
                ) : (
                    <div className="empty-state glass-card">
                        <p>검색 결과가 없습니다. 🔍</p>
                    </div>
                )}
            </div>

            <button
                className="tracker-fab primary-gradient"
                onClick={() => setIsModalOpen(true)}
                aria-label="새 할 일 추가"
            >
                <Plus size={28} color="white" />
            </button>

            <AddTodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default TaskTracker;
