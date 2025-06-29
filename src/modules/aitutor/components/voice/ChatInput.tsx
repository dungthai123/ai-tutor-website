'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/utils/helpers';
import { validateMessage } from '../../utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
}

export function ChatInput({ onSend, disabled = false, variant = 'default' }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validation = validateMessage(message);
    if (validation.isValid && !disabled) {
      onSend(message.trim());
      setMessage('');
      inputRef.current?.focus();
    } else if (!validation.isValid) {
      // You could show an error message here
      console.warn('Invalid message:', validation.error);
    }
  };

  const isDisabled = disabled || message.trim().length === 0;

  const styles = {
    default: {
      container: 'flex items-center gap-4 rounded-2xl bg-gray-700 px-6 py-4 text-base shadow-lg',
      input: 'flex-1 focus:outline-none placeholder-gray-300 bg-transparent text-white text-xl font-medium',
      button: cn(
        'px-8 py-3 rounded-2xl text-base font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105',
        isDisabled 
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
          : 'bg-gradient-to-r from-primary-green to-green-500 text-white hover:shadow-lg'
      )
    },
    compact: {
      container: 'flex items-center gap-3 rounded-2xl bg-gray-800 px-4 py-3 border border-gray-600',
      input: 'flex-1 focus:outline-none placeholder-gray-400 bg-transparent text-white text-sm',
      button: cn(
        'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
        isDisabled 
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
          : 'bg-primary-green text-white hover:opacity-80'
      )
    }
  };

  const currentStyles = styles[variant];

  return (
    <form onSubmit={handleSubmit} className={currentStyles.container}>
      <input
        ref={inputRef}
        type="text"
        className={currentStyles.input}
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={isDisabled}
        className={currentStyles.button}
      >
        Send
      </button>
    </form>
  );
} 