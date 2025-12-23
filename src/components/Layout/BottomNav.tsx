import React from 'react';
import { Home, List, Calendar, BarChart2 } from 'lucide-react';
import './BottomNav.css';

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'home', icon: Home, label: '홈' },
        { id: 'tasks', icon: List, label: '작업' },
        { id: 'calendar', icon: Calendar, label: '캘린더' },
        { id: 'stats', icon: BarChart2, label: '통계' },
    ];

    return (
        <nav className="bottom-nav glass-card">
            {tabs.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    className={`nav-item ${activeTab === id ? 'active' : ''}`}
                    onClick={() => setActiveTab(id)}
                >
                    <div className="icon-wrapper">
                        <Icon size={24} />
                    </div>
                    <span>{label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;
