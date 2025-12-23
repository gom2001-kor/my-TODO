import { CheckCircle, Clock, TrendingUp } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    AreaChart,
    Area
} from 'recharts';
import { useTodo } from '../context/TodoContext';
import { CATEGORIES } from '../types/todo';
import { format, startOfWeek, addDays, isSameDay, subDays } from 'date-fns';
import './Statistics.css';

const Statistics = () => {
    const { todos } = useTodo();

    // Summary data
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Weekly completion bar chart
    const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
    const weeklyData = Array.from({ length: 7 }).map((_, i) => {
        const day = addDays(startOfThisWeek, i);
        const count = todos.filter(t => t.completed && isSameDay(new Date(t.dueDate), day)).length;
        return { name: weekDays[i], count };
    });

    // Category distribution
    const categoryData = Object.values(CATEGORIES).map(cat => ({
        name: cat.label,
        count: todos.filter(t => t.category === cat.id).length,
        color: cat.color
    })).filter(d => d.count > 0);

    // Activity trend (Last 7 days)
    const trendData = Array.from({ length: 7 }).map((_, i) => {
        const day = subDays(new Date(), 6 - i);
        const dateLabel = format(day, 'MM/dd');
        const created = todos.filter(t => isSameDay(new Date(t.createdAt), day)).length;
        return { name: dateLabel, created };
    });

    return (
        <div className="stats-page animate-fade-in">
            <header className="stats-header">
                <h1>통계 대시보드</h1>
            </header>

            <div className="summary-cards">
                <div className="stat-card glass-card">
                    <div className="stat-icon completed">
                        <CheckCircle size={20} />
                    </div>
                    <span className="sc-label">완료됨</span>
                    <span className="sc-value" style={{ color: 'var(--primary)' }}>{completed}</span>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-icon pending">
                        <Clock size={20} />
                    </div>
                    <span className="sc-label">보류중</span>
                    <span className="sc-value" style={{ color: 'var(--priority-high)' }}>{pending}</span>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-icon rate">
                        <TrendingUp size={20} />
                    </div>
                    <span className="sc-label">완료율</span>
                    <span className="sc-value" style={{ color: 'var(--priority-low)' }}>{rate}%</span>
                </div>
            </div>

            <div className="chart-container glass-card">
                <h3>주간 완료 현황</h3>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={weeklyData}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(102, 126, 234, 0.08)' }}
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                                    padding: '8px 12px'
                                }}
                            />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                {weeklyData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === new Date().getDay() - 1 ? 'var(--primary)' : '#e2e8f0'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="row">
                <div className="chart-container glass-card quarter">
                    <h3>카테고리 분포</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {categoryData.length > 0 && (
                            <div className="chart-legend">
                                {categoryData.map((cat, i) => (
                                    <div key={i} className="legend-item">
                                        <span className="legend-dot" style={{ background: cat.color }}></span>
                                        <span>{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="chart-container glass-card half">
                    <h3>활동 추이</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="created"
                                    stroke="var(--primary)"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorCreated)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
