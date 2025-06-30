'use client';

import { useState, KeyboardEvent, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/utils/helpers';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  placeholder = "Ask me anything about language learning...",
  className
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const sendingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on message content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = useCallback(() => {
    if (isLoading || sendingRef.current) return;

    const trimmed = message.trim();
    if (!trimmed) return;

    sendingRef.current = true;
    onSendMessage(trimmed);

    /* 👇 runs *after* any late onChange fired by the same Enter press */
    setTimeout(() => setMessage(''), 0);

    textareaRef.current?.focus();
    setTimeout(() => (sendingRef.current = false), 500);
  }, [message, isLoading, onSendMessage]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className={cn('flex items-end gap-2 p-3 border-t border-gray-200 dark:border-gray-700', className)}>
      {/* Message input */}
      <div className="flex-1">
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className={cn(
            // Layout
            'w-full resize-none',
            'px-3 py-2 rounded-lg',
            'min-h-[40px] max-h-[120px]',
            // Typography
            'text-sm leading-relaxed',
            // Colors
            'bg-gray-50 dark:bg-gray-700',
            'text-gray-900 dark:text-gray-100',
            'border border-gray-200 dark:border-gray-600',
            'placeholder-gray-500 dark:placeholder-gray-400',
            // Focus states
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            // Disabled state
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
          style={{
            height: 'auto',
            overflowY: message.length > 100 ? 'auto' : 'hidden'
          }}
        />
        </form>
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className={cn(
          // Layout
          'flex items-center justify-center',
          'w-10 h-10 rounded-lg',
          // Colors & Effects
          'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
          'text-white transition-colors duration-200',
          // Disabled state
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600',
          // Focus states
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        )}
        aria-label="Send message"
        title="Send message (Enter)"
      >
        {isLoading ? (
          // Loading spinner
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          // Send icon
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        )}
      </button>
    </div>
  );
} 