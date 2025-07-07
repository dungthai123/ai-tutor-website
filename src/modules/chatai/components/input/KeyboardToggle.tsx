import React from 'react';
import { Keyboard } from 'lucide-react';
import { cn } from '@/modules/chatai/utils';

interface KeyboardToggleProps {
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function KeyboardToggle({ 
  isActive = false, 
  disabled = false, 
  onClick, 
  className 
}: KeyboardToggleProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'absolute right-4 bottom-4',
        'h-12 w-12 rounded-full flex items-center justify-center',
        'bg-white shadow-lg transition-all duration-200',
        isActive 
          ? 'bg-blue-500 text-white' 
          : 'bg-white text-gray-600 hover:bg-gray-50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <Keyboard className="h-5 w-5" />
    </button>
  );
} 