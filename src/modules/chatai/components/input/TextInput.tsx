import React, { useRef, useCallback } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/modules/chatai/utils';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  isVisible?: boolean;
  className?: string;
}

export function TextInput({ 
  value, 
  onChange, 
  onSend, 
  placeholder = "Type your message...", 
  disabled = false,
  isVisible = true,
  className 
}: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }, [onSend]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`;
  }, [onChange]);

  return (
    <div className={cn(
      'absolute inset-x-4 bottom-4 flex items-end gap-2 transition-all duration-200',
      !isVisible && 'opacity-0 pointer-events-none',
      className
    )}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full min-h-[48px] max-h-[80px] resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          rows={1}
        />
        
        {/* Send Button */}
        <button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 