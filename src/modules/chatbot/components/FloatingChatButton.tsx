'use client';

import { useChatStore } from '../stores/useChatStore';
import { cn } from '@/utils/helpers';

interface FloatingChatButtonProps {
  className?: string;
}

export function FloatingChatButton({ className }: FloatingChatButtonProps) {
  const { isOpen, toggleChat } = useChatStore();

  return (
    <button
      onClick={toggleChat}
      className={cn(
        // Layout
        'fixed bottom-6 right-6 z-50',
        'flex items-center justify-center',
        'w-14 h-14 rounded-full',
        // Colors & Effects
        'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
        'text-white shadow-xl hover:shadow-2xl',
        'transition-all duration-200 ease-in-out',
        // Animation
        'transform hover:scale-105 active:scale-95',
        // Focus states
        'focus:outline-none focus:ring-4 focus:ring-blue-300',
        isOpen && 'bg-gray-600 hover:bg-gray-700',
        className
      )}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      title={isOpen ? 'Close chat' : 'Chat with AI assistant'}
    >
      {isOpen ? (
        // Close icon (X)
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        // Chat icon
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      )}
    </button>
  );
} 