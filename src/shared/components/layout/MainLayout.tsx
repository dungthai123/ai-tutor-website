import React from 'react';
import { Sidebar } from './Sidebar';
import { FloatingActions } from '../ui/overlays/FloatingActions';
import { ClientOnly } from '../common/ClientOnly';

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

/**
 * Main application layout component
 * Includes the sidebar and the main content area
 */
export function MainLayout({ children, rightPanel, showFloatingActions = true }: MainLayoutProps) {
  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <ClientOnly>
        <Sidebar />
      </ClientOnly>
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 px-6 py-8 overflow-y-auto">
          {children}
        </div>
      </main>
      {rightPanel && (
        <aside className="w-80 bg-white border-l border-gray-200 h-full overflow-hidden">
          <div className="p-6 h-full overflow-y-auto">
            {rightPanel}
          </div>
        </aside>
      )}
      {showFloatingActions && <FloatingActions />}
    </div>
  );
} 