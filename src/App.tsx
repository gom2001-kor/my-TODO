import { useState, useEffect } from 'react';
import { TodoProvider, useTodo } from './context/TodoContext';
import Layout from './components/Layout/Layout';

import Home from './pages/Home';
import TaskTracker from './pages/TaskTracker';
import Overdue from './pages/Overdue';
import CalendarView from './pages/CalendarView';
import Statistics from './pages/Statistics';

import { useNotifications } from './hooks/useNotifications';

function AppContent({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const { todos } = useTodo();
  const { requestPermission } = useNotifications(todos);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'tasks': return <TaskTracker />;
      case 'overdue': return <Overdue />;
      case 'calendar': return <CalendarView />;
      case 'stats': return <Statistics />;
      default: return <Home />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <TodoProvider>
      <AppContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </TodoProvider>
  );
}

export default App;
