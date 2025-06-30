'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '../stores/useChatStore';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { cn } from '@/utils/helpers';

interface ChatWindowProps {
  className?: string;
}

export function ChatWindow({ className }: ChatWindowProps) {
  const { isOpen, toggleChat } = useChatStore();
  const { messages, isLoading, sendMessage, resetChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Don't render if chat is closed
  if (!isOpen) return null;

  const hasMessages = messages.length > 0;

  return (
    <div
      className={cn(
        // Layout & Positioning
        'fixed bottom-20 right-6 z-40',
        'w-96 h-[800px]',
        'flex flex-col',
        // Styling
        'bg-white dark:bg-gray-900',
        'border border-gray-200 dark:border-gray-700',
        'rounded-lg shadow-2xl',
        // Animation
        'transform transition-all duration-200 ease-in-out',
        'animate-in slide-in-from-bottom-5 fade-in-0',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {/* AI Avatar */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              AI Learning Assistant
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isLoading ? 'Thinking...' : 'Online'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {hasMessages && (
            <button
              onClick={resetChat}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              title="Clear chat"
              aria-label="Clear chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}

          <button
            onClick={toggleChat}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            title="Close chat"
            aria-label="Close chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {!hasMessages ? (
          // Welcome message
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Welcome! I&apos;m here to help
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Ask me about English learning, HSK preparation, grammar, or vocabulary.
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
              💡 Try: &quot;How can I improve my vocabulary?&quot;
            </div>
          </div>
        ) : (
          // Messages list
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start mb-4 animate-in fade-in-0 slide-in-from-left-2">
                <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div 
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
                        style={{ animationDelay: '0ms' }}
                      />
                      <div 
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
                        style={{ animationDelay: '150ms' }}
                      />
                      <div 
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
        placeholder="Ask me about language learning..."
      />
    </div>
  );
} 