'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <main className={cn(
        'min-h-screen transition-all duration-300',
        'lg:ml-72'
      )}>
        <Header 
          title={title} 
          subtitle={subtitle}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
        
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

