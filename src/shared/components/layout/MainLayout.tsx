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
    <div className="h-screen flex bg-background-secondary overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 px-6 py-8 overflow-y-auto">
          {children}
        </div>
      </main>
      
      {/* Right Panel (Optional) */}
      {rightPanel && (
        <aside className="w-80 bg-background-card border-l border-border-subtle h-full overflow-hidden">
          <div className="p-6 h-full overflow-y-auto">
            {rightPanel}
          </div>
        </aside>
      )}

      {/* Floating Actions */}
      {showFloatingActions && <FloatingActions />}
    </div>
  );
}; 