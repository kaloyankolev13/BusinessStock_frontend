import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppStore } from '../../stores';

export default function Layout() {
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useAppStore();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={!sidebarCollapsed} 
        onClose={() => setSidebarCollapsed(true)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 