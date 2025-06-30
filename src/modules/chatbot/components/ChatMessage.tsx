'use client';

import { ChatMessage as ChatMessageType } from '../types';
import { cn } from '@/utils/helpers';

interface ChatMessageProps {
  message: ChatMessageType;
  className?: string;
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div
        className={cn(
          // Layout
          'max-w-[80%] px-4 py-3 rounded-2xl',
          // Typography
          'text-sm leading-relaxed',
          // Colors based on role
          isUser && [
            'bg-blue-600 text-white',
            'rounded-br-sm',
          ],
          isAssistant && [
            'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'border border-gray-200 dark:border-gray-700',
            'rounded-bl-sm',
          ]
        )}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* Timestamp */}
        <div
          className={cn(
            'text-xs mt-2 opacity-70',
            isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
} 