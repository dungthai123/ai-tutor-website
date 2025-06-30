'use client';

import { useCallback, useRef } from 'react';
import { useChatStore } from '../stores/useChatStore';
import { ChatApiRequest, ChatApiResponse } from '../types';

export function useChat() {
  const {
    messages,
    isLoading,
    error,
    addMessage,
    setLoading,
    setError,
    clearMessages,
  } = useChatStore();

  // Prevent duplicate requests
  const processingRef = useRef<Set<string>>(new Set());

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    const messageKey = message.trim();
    if (processingRef.current.has(messageKey)) {
      return;
    }

    processingRef.current.add(messageKey);

    try {
      // Get current messages for conversation context
      const currentMessages = useChatStore.getState().messages;
      
      // Add user message and start loading
      addMessage({ role: 'user', content: messageKey });
      setLoading(true);
      setError(null);

      // Send API request
      const requestBody: ChatApiRequest = {
        message: messageKey,
        conversationHistory: currentMessages.slice(-10),
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data: ChatApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add AI response
      addMessage({ role: 'assistant', content: data.reply });

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      addMessage({ 
        role: 'assistant', 
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.` 
      });
    } finally {
      setLoading(false);
      setTimeout(() => processingRef.current.delete(messageKey), 1000);
    }
  }, [isLoading, addMessage, setLoading, setError]);

  const resetChat = useCallback(() => {
    clearMessages();
    setError(null);
  }, [clearMessages, setError]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat,
  };
} 