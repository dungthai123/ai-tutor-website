import React from 'react';
import { Mic } from 'lucide-react';
import { cn } from '@/modules/chatai/utils';

interface RecordButtonProps {
  isRecording?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function RecordButton({ 
  isRecording = false, 
  disabled = false, 
  onClick, 
  className 
}: RecordButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
        'h-16 w-16 rounded-full flex items-center justify-center',
        'shadow-lg transition-all duration-200',
        isRecording 
          ? 'bg-red-500 text-white animate-pulse' 
          : 'bg-blue-500 text-white hover:bg-blue-600',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <Mic className="h-6 w-6" />
    </button>
  );
} 