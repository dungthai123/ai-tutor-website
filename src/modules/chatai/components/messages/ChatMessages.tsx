import React, { useEffect, useRef } from 'react';
import { MessageBubble } from '@/modules/chatai/components';
import { ChatMessage } from '@/modules/chatai/types';
import { useChatStore } from '@/modules/chatai/hooks';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { isAwaitingResponse } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll when the component mounts
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Auto-scroll when loading state changes
  useEffect(() => {
    if (isAwaitingResponse) {
      scrollToBottom();
    }
  }, [isAwaitingResponse]);

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto relative z-10"
    >
      <div className="px-4 py-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {/* Loading Message */}
        {isAwaitingResponse && (
          <div className="flex justify-start animate-in fade-in-0 slide-in-from-left-2">
            <div className="max-w-[80%] bg-white text-gray-800 mr-12 border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
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
                <span className="text-sm text-gray-600 font-medium">
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
} 