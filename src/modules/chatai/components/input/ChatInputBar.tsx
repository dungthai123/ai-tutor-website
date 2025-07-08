import React from 'react';
import { cn } from '@/modules/chatai/utils';

interface ChatInputBarProps {
  children: React.ReactNode;
  className?: string;
}

export function ChatInputBar({ children, className }: ChatInputBarProps) {
  return (
    <div className={cn(
      'relative h-28 border-t border-gray-200 z-20',
      'pb-[env(safe-area-inset-bottom)]',
      className
    )}>
      <div className="relative h-full w-full">
        {children}
      </div>
    </div>
  );
} 