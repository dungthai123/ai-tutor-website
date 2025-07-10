import React, { useEffect, useRef } from 'react';
import { MessageBubble } from '@/modules/chatai/components';
import { ChatMessage } from '@/modules/chatai/types';
import { useChatStore } from '@/modules/chatai/hooks';
import { useAudioStore } from '@/modules/chatai/hooks/storage/audio-store';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { isAwaitingResponse, isAwaitSpeechToText } = useChatStore();
  const { recorderState } = useAudioStore();

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
    if (isAwaitingResponse || isAwaitSpeechToText || recorderState.isRecording || recorderState.isProcessing) {
      scrollToBottom();
    }
  }, [isAwaitingResponse, isAwaitSpeechToText, recorderState.isRecording, recorderState.isProcessing]);

  // Determine if we should show user loading message
  const isUserProcessing = recorderState.isRecording || recorderState.isProcessing || isAwaitSpeechToText;

  // Get user loading message text
  const getUserLoadingText = () => {
    if (recorderState.isRecording) {
      return `Recording... ${recorderState.recordingTime || 0}s`;
    }
    if (recorderState.isProcessing) {
      return 'Processing audio...';
    }
    if (isAwaitSpeechToText) {
      return 'Converting speech to text...';
    }
    return 'Preparing message...';
  };

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto relative z-10"
    >
      <div className="px-4 py-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {/* User Loading Message */}
        {isUserProcessing && (
          <div className="flex justify-end animate-in fade-in-0 slide-in-from-right-2">
            <div className="max-w-[80%] bg-blue-500 text-white ml-12 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {getUserLoadingText()}
                </span>
                <div className="flex gap-1">
                  <div 
                    className="w-2 h-2 bg-white rounded-full animate-bounce" 
                    style={{ animationDelay: '0ms' }}
                  />
                  <div 
                    className="w-2 h-2 bg-white rounded-full animate-bounce" 
                    style={{ animationDelay: '150ms' }}
                  />
                  <div 
                    className="w-2 h-2 bg-white rounded-full animate-bounce" 
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* AI Loading Message */}
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