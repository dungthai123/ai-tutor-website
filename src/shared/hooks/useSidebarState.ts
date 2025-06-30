import { useState, useEffect } from 'react';

const SIDEBAR_STORAGE_KEY = 'sidebar-collapsed';

// Get initial state synchronously to prevent flash
function getInitialState(): boolean {
  if (typeof window === 'undefined') return false; // SSR default
  
  try {
    const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return savedState !== null ? JSON.parse(savedState) : false;
  } catch {
    return false;
  }
}

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(getInitialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated after mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(newState));
  };

  return {
    isCollapsed,
    isHydrated,
    toggleSidebar
  };
} 