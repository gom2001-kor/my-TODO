import { useTodo } from '../context/TodoContext';
import TodoItem from '../components/Tasks/TodoItem';
import { AlertTriangle } from 'lucide-react';
import './Overdue.css';

const Overdue = () => {
    const { todos } = useTodo();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get overdue tasks (past due date and not completed)
    const overdueTasks = todos
        .filter(t => {
            const taskDate = new Date(t.dueDate);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate < today && !t.completed;
        })
        .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    // Group by date
    const groupedTasks: Record<string, typeof overdueTasks> = {};
    overdueTasks.forEach(task => {
        if (!groupedTasks[task.dueDate]) {
            groupedTasks[task.dueDate] = [];
        }
        groupedTasks[task.dueDate].push(task);
    });

    return (
        <div className="overdue-page animate-fade-in">
            <header className="overdue-header">
                <div className="header-icon">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h1>미완료 할 일</h1>
                    <p className="subtitle">기한이 지난 {overdueTasks.length}개의 할 일이 있습니다</p>
                </div>
            </header>

            {overdueTasks.length > 0 ? (
                <div className="overdue-list">
                    {Object.entries(groupedTasks).map(([dateStr, tasks]) => (
                        <div key={dateStr} className="date-group">
                            <div className="date-label">{formatDate(dateStr)}</div>
                            {tasks.map(todo => (
                                <TodoItem key={todo.id} todo={todo} />
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state glass-card">
                    <div className="empty-icon">🎉</div>
                    <p>미완료된 할 일이 없습니다!</p>
                    <span>모든 일정을 잘 처리하셨네요.</span>
                </div>
            )}
        </div>
    );
};

export default Overdue;
