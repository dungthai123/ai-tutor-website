'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Start loading when pathname changes
    setIsLoading(true);
    
    // Set a timer to stop loading after a short delay
    // This gives time for the new page to mount and render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // 300ms should be enough for most page transitions

    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [pathname]);

  return { isLoading };
} 