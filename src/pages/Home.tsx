import { useState } from 'react';
import { Plus, TrendingUp, CalendarDays } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import TodoItem from '../components/Tasks/TodoItem';
import AddTodoModal from '../components/Tasks/AddTodoModal';
import './Home.css';

const Home = () => {
    const { todos } = useTodo();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const today = new Date();
    const dateString = today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    const todayTasks = todos.filter(t => {
        const taskDate = new Date(t.dueDate);
        return taskDate.toDateString() === today.toDateString();
    });

    // Get upcoming tasks (tomorrow onwards, not completed)
    const upcomingTasks = todos
        .filter(t => {
            const taskDate = new Date(t.dueDate);
            return taskDate > today && !t.completed;
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3);

    const completedCount = todos.filter(t => t.completed).length;
    const totalCount = todos.length;
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="home-page animate-fade-in">
            <header className="home-header">
                <div className="header-top">
                    <p className="date-text">{dateString}</p>
                    <h1 className="welcome-text">좋은 하루 되세요! 😊</h1>
                </div>

                <div className="stats-row">
                    <div className="mini-stat-card glass-card">
                        <div className="stat-icon tasks">
                            <CalendarDays size={20} />
                        </div>
                        <span className="stat-label">오늘 할 일</span>
                        <span className="stat-value">{todayTasks.length}</span>
                    </div>
                    <div className="mini-stat-card glass-card">
                        <div className="stat-icon rate">
                            <TrendingUp size={20} />
                        </div>
                        <span className="stat-label">완료율</span>
                        <span className="stat-value">{completionRate}%</span>
                    </div>
                </div>
            </header>

            <section className="task-section">
                <div className="section-header">
                    <h2>오늘 할 일</h2>
                    <span className="task-count">{todayTasks.length}개</span>
                </div>

                {todayTasks.length > 0 ? (
                    <div className="task-list">
                        {todayTasks.map(todo => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state glass-card">
                        <p>오늘 할 일이 없어요.<br />여유로운 하루 되세요! ☕</p>
                    </div>
                )}
            </section>

            {upcomingTasks.length > 0 && (
                <section className="upcoming-section">
                    <h2>📅 다가오는 일정</h2>
                    <div className="task-list">
                        {upcomingTasks.map(todo => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))}
                    </div>
                </section>
            )}

            <button
                className="fab-button primary-gradient"
                onClick={() => setIsModalOpen(true)}
                aria-label="새 할 일 추가"
            >
                <Plus size={32} color="white" />
            </button>

            <AddTodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Home;
