'use client';

import { useRef, useEffect } from 'react';
import { useAutoScroll } from '@/modules/aitutor/hooks/useAutoScroll';
import { cn } from '@/utils/helpers';

interface ChatMessageViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  chatOpen?: boolean;
}

export const ChatMessageView = ({ className, children, chatOpen = false, ...props }: ChatMessageViewProps) => {
  const scrollContentRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useAutoScroll(scrollContentRef);

  // Scroll when chat open state changes
  useEffect(() => {
    if (scrollContentRef.current) {
      setTimeout(() => {
        scrollToBottom();
      }, 300); // Wait for animation to complete
    }
  }, [chatOpen, scrollToBottom]);

  return (
    <div 
      ref={scrollContentRef} 
      className={cn('flex flex-col overflow-y-auto scroll-smooth', className)} 
      style={{ scrollBehavior: 'smooth' }}
      {...props}
    >
      <div className="flex-1" />
      <div className={cn('space-y-4', chatOpen ? 'pb-32' : 'pb-4')}>
        {children}
      </div>
    </div>
  );
}; 