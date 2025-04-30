'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { ReactNode, useState, useEffect } from 'react';

interface LayoutWithConditionalSidebarProps {
  children: ReactNode;
}

export function LayoutWithConditionalSidebar({ children }: LayoutWithConditionalSidebarProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Don't show sidebar on landing page (root path) or dashboard paths
  const showSidebar = pathname !== '/' && !pathname.startsWith('/dashboard');

  // Function to handle sidebar collapse state
  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Listen for sidebar collapse events
  useEffect(() => {
    const handleStorageChange = () => {
      const sidebarState = localStorage.getItem('sidebar-collapsed');
      setIsSidebarCollapsed(sidebarState === 'true');
    };

    // Check initial state
    handleStorageChange();

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sidebar-state-change', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebar-state-change', handleStorageChange as EventListener);
    };
  }, []);
  
  return (
    <div className="h-full relative">
      {showSidebar && (
        <div className={`hidden h-full md:flex ${isSidebarCollapsed ? 'md:w-16' : 'md:w-72'} md:flex-col md:fixed md:inset-y-0 z-[80] transition-all duration-300`}>
          <Sidebar onCollapseChange={handleSidebarCollapse} />
        </div>
      )}
      <main className={showSidebar ? (isSidebarCollapsed ? 'md:pl-16' : 'md:pl-72') : ''} style={{ transition: 'padding-left 0.3s ease' }}>
        {children}
      </main>
    </div>
  );
}
