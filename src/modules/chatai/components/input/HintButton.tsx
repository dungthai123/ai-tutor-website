import React from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/modules/chatai/utils';

interface HintButtonProps {
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function HintButton({ 
  isActive = false, 
  disabled = false, 
  onClick, 
  className 
}: HintButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'absolute right-20 bottom-4',
        'px-4 py-2 rounded-full text-sm font-medium',
        'bg-blue-100 text-blue-600 hover:bg-blue-200',
        'transition-all duration-200 shadow-sm',
        isActive && 'bg-blue-500 text-white',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {isActive ? (
        <HelpCircle className="h-4 w-4" />
      ) : (
        'Help me reply'
      )}
    </button>
  );
} 