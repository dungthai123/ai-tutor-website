import React from 'react';
import { Sidebar } from './Sidebar';
import { FloatingActions } from '../ui/overlays/FloatingActions';

interface MainLayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  showFloatingActions?: boolean;
  user?: {
    name: string;
    avatar?: string;
    subscription: 'free' | 'pro';
  };
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  rightPanel, 
  showFloatingActions = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-secondary">
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 px-6 overflow-auto">
          {children}
        </main>
        
        {/* Right Panel (Optional) */}
        {rightPanel && (
          <aside className="w-80 bg-background-card border-l border-border-subtle p-6 overflow-y-auto">
            {rightPanel}
          </aside>
        )}
      </div>

      {/* Floating Actions */}
      {showFloatingActions && <FloatingActions />}
    </div>
  );
}; 