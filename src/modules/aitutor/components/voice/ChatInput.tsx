'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/utils/helpers';
import { ChatInputProps } from '../../types';
import { validateMessage, getChatInputClasses, getButtonClasses } from '../../utils';

export function ChatInput({ 
  onSend, 
  disabled = false, 
  variant = 'default' 
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateMessage(message) && !disabled) {
      onSend(message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const isDisabled = disabled || !validateMessage(message);

  return (
    <form
      onSubmit={handleSubmit}
      className={getChatInputClasses(variant)}
    >
      <input
        ref={inputRef}
        type="text"
        className={cn(
          'flex-1 focus:outline-none placeholder-gray-400 bg-transparent text-white',
          variant === 'compact' ? 'text-sm' : 'text-xl font-medium'
        )}
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={isDisabled}
        className={cn(
          getButtonClasses('primary', isDisabled),
          variant === 'compact' && 'px-4 py-2 text-sm'
        )}
      >
        Send
      </button>
    </form>
  );
} 