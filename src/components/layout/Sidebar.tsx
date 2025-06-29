'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'voice-practice',
    label: 'Practice với AI',
    href: '/aitutor',
    icon: '🎯'
  },
  {
    id: 'hsk-practice',
    label: 'HSK Practice',
    href: '/practice',
    icon: '📚'
  }
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-background-primary border-r border-border-subtle h-[calc(100vh-6rem)] flex flex-col mt-6 ml-6 rounded-xl transition-all duration-300`}>
      <div className="py-4">
        {/* Logo/Brand and Toggle Button */}
        <div className="px-6 mb-8 flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-text-primary">AI English Tutor</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-background-hover transition-colors text-text-secondary hover:text-text-primary"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="text-lg">
              {isCollapsed ? '→' : '←'}
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon && <span className="text-2xl">{item.icon}</span>}
                {!isCollapsed && <span className="text-base">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}; 