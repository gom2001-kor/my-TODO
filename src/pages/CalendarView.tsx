import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import TodoItem from '../components/Tasks/TodoItem';
import './CalendarView.css';

const CalendarView: React.FC = () => {
    const { todos } = useTodo();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const tasksForSelectedDate = todos.filter(t => isSameDay(new Date(t.dueDate), selectedDate));

    const getDayTasks = (day: Date) => todos.filter(t => isSameDay(new Date(t.dueDate), day));

    return (
        <div className="calendar-page animate-fade-in">
            <header className="calendar-header">
                <h1>캘린더</h1>
                <div className="month-selector">
                    <button onClick={prevMonth} className="nav-btn"><ChevronLeft /></button>
                    <h2>{format(currentMonth, 'yyyy년 MM월')}</h2>
                    <button onClick={nextMonth} className="nav-btn"><ChevronRight /></button>
                </div>
            </header>

            <div className="calendar-grid glass-card">
                <div className="week-days">
                    {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                        <div key={d} className="week-day">{d}</div>
                    ))}
                </div>
                <div className="days-container">
                    {calendarDays.map((day, idx) => {
                        const dayTasks = getDayTasks(day);
                        const isToday = isSameDay(day, new Date());
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, monthStart);

                        return (
                            <div
                                key={idx}
                                className={`day-cell ${!isCurrentMonth ? 'outside' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                onClick={() => setSelectedDate(day)}
                            >
                                <span className="day-number">{format(day, 'd')}</span>
                                <div className="task-dots">
                                    {dayTasks.slice(0, 3).map((_, i) => (
                                        <div key={i} className="task-dot"></div>
                                    ))}
                                    {dayTasks.length > 3 && <div className="task-dot-more"></div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={`selected-date-tasks ${tasksForSelectedDate.length > 0 ? 'has-tasks' : ''}`}>
                <div className="section-header">
                    <h3>{format(selectedDate, 'M월 d일')} 할 일</h3>
                    <span className="count">{tasksForSelectedDate.length}개</span>
                </div>

                <div className="task-list">
                    {tasksForSelectedDate.length > 0 ? (
                        tasksForSelectedDate.map(todo => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))
                    ) : (
                        <div className="empty-date-state glass-card">
                            <p>기록된 할 일이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
