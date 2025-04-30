"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Listen for sidebar collapse events
  useEffect(() => {
    const handleSidebarChange = () => {
      const sidebarState = localStorage.getItem('sidebar-collapsed');
      setIsSidebarCollapsed(sidebarState === 'true');
    };

    // Check initial state
    handleSidebarChange();

    // Listen for changes
    window.addEventListener('storage', handleSidebarChange);
    window.addEventListener('sidebar-state-change', handleSidebarChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleSidebarChange);
      window.removeEventListener('sidebar-state-change', handleSidebarChange as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onCollapseChange={setIsSidebarCollapsed} />
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-80'}`}
        id="dashboard-content"
      >
        <main className="flex-1 overflow-auto" role="main" aria-labelledby="page-heading">
          {children}
        </main>
        {/* Footer has been removed */}
      </div>
    </div>
  );
}