import React, { ReactNode } from 'react';
import BottomNav from './BottomNav';

interface LayoutProps {
    children: ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
    return (
        <div className="layout-container">
            <main className="content">
                {children}
            </main>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default Layout;
