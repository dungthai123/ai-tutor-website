'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarState } from '../../hooks/useSidebarState';

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
  },
  {
    id: 'proofreading',
    label: 'Proofreading',
    href: '/proofreading',
    icon: '✍️'
  },
  {
    id: 'my-notes',
    label: 'My Notes',
    href: '/notes',
    icon: '📔'
  },
  {
    id: 'test-history',
    label: 'Test History',
    href: '/history',
    icon: '🕑'
  }
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isCollapsed, isHydrated, toggleSidebar } = useSidebarState();

  // Determine sidebar width and transition behavior
  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';
  
  // Only add transition after hydration to prevent flash on navigation
  const transitionClass = isHydrated ? 'transition-all duration-300' : '';

  return (
    <aside className={`${sidebarWidth} bg-white border-r border-gray-200 h-full flex flex-col overflow-hidden ${transitionClass}`}>
      <div className="flex-1 py-4 overflow-y-auto">
        {/* Logo/Brand and Toggle Button */}
        <div className="px-6 mb-8 flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-800">AI English Tutor</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
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