'use client';

import { useCallback, useMemo } from 'react';
import { useChatStore } from '../storage/chat-store';
import { ChatMessage } from '../../types';
import { chatUtils } from '../../utils';

export function useChatMessages() {
  const chatStore = useChatStore();

  // Get all messages
  const messages = useMemo(() => chatStore.messages, [chatStore.messages]);

  // Get user messages only
  const userMessages = useMemo(() => 
    messages.filter(message => message.isUserMessage), 
    [messages]
  );

  // Get bot messages only
  const botMessages = useMemo(() => 
    messages.filter(message => !message.isUserMessage), 
    [messages]
  );

  // Get latest message
  const latestMessage = useMemo(() => 
    messages.length > 0 ? messages[messages.length - 1] : null, 
    [messages]
  );

  // Get message by ID
  const getMessageById = useCallback((messageId: number): ChatMessage | null => {
    return messages.find(message => message.id === messageId) || null;
  }, [messages]);

  // Search messages by content
  const searchMessages = useCallback((query: string): ChatMessage[] => {
    if (!query.trim()) return [];

    const lowercaseQuery = query.toLowerCase();
    return messages.filter(message => 
      message.content.original.toLowerCase().includes(lowercaseQuery) ||
      message.translate?.toLowerCase().includes(lowercaseQuery)
    );
  }, [messages]);

  // Get messages with translations
  const messagesWithTranslations = useMemo(() => 
    messages.filter(message => message.translate), 
    [messages]
  );

  // Get messages with improvements
  const messagesWithImprovements = useMemo(() => 
    messages.filter(message => message.suggestContent), 
    [messages]
  );

  // Get messages with audio
  const messagesWithAudio = useMemo(() => 
    messages.filter(message => message.pathRecord), 
    [messages]
  );

  // Get messages with pronunciation data
  const messagesWithPronunciation = useMemo(() => 
    messages.filter(message => message.speechData), 
    [messages]
  );

  // Get conversation statistics
  const conversationStats = useMemo(() => {
    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      botMessages: botMessages.length,
      messagesWithTranslations: messagesWithTranslations.length,
      messagesWithImprovements: messagesWithImprovements.length,
      messagesWithAudio: messagesWithAudio.length,
      messagesWithPronunciation: messagesWithPronunciation.length,
    };
  }, [
    messages.length,
    userMessages.length,
    botMessages.length,
    messagesWithTranslations.length,
    messagesWithImprovements.length,
    messagesWithAudio.length,
    messagesWithPronunciation.length,
  ]);

  // Add message with validation
  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      id: chatUtils.generateMessageId(),
      timestamp: Date.now(),
      ...message,
    };

    chatStore.addMessage(newMessage);
    return newMessage;
  }, [chatStore]);

  // Update message with validation
  const updateMessage = useCallback((messageId: number, updates: Partial<ChatMessage>) => {
    const existingMessage = getMessageById(messageId);
    if (!existingMessage) {
      console.warn(`Message with ID ${messageId} not found`);
      return false;
    }

    chatStore.updateMessage(messageId, updates);
    return true;
  }, [chatStore, getMessageById]);

  // Delete message
  const deleteMessage = useCallback((messageId: number) => {
    const messageIndex = messages.findIndex(message => message.id === messageId);
    if (messageIndex === -1) {
      console.warn(`Message with ID ${messageId} not found`);
      return false;
    }

    const newMessages = messages.filter(message => message.id !== messageId);
    chatStore.clearMessages();
    newMessages.forEach(message => chatStore.addMessage(message));
    return true;
  }, [messages, chatStore]);

  // Clear all messages
  const clearAllMessages = useCallback(() => {
    chatStore.clearMessages();
  }, [chatStore]);

  // Get message context (previous and next messages)
  const getMessageContext = useCallback((messageId: number): {
    previous: ChatMessage | null;
    current: ChatMessage | null;
    next: ChatMessage | null;
  } => {
    const messageIndex = messages.findIndex(message => message.id === messageId);
    
    if (messageIndex === -1) {
      return { previous: null, current: null, next: null };
    }

    return {
      previous: messageIndex > 0 ? messages[messageIndex - 1] : null,
      current: messages[messageIndex],
      next: messageIndex < messages.length - 1 ? messages[messageIndex + 1] : null,
    };
  }, [messages]);

  // Get messages in date range
  const getMessagesInDateRange = useCallback((startDate: Date, endDate: Date): ChatMessage[] => {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    return messages.filter(message => 
      message.timestamp >= startTime && message.timestamp <= endTime
    );
  }, [messages]);

  // Export messages as text
  const exportMessagesAsText = useCallback((): string => {
    return messages.map(message => {
      const timestamp = chatUtils.formatTimestamp(message.timestamp);
      const sender = message.isUserMessage ? 'User' : 'Bot';
      const content = message.content.original;
      const translation = message.translate ? ` (${message.translate})` : '';
      
      return `[${timestamp}] ${sender}: ${content}${translation}`;
    }).join('\n');
  }, [messages]);

  // Get message thread (conversation flow)
  const getMessageThread = useCallback((messageId: number): ChatMessage[] => {
    const messageIndex = messages.findIndex(message => message.id === messageId);
    if (messageIndex === -1) return [];

    // Return messages up to and including the specified message
    return messages.slice(0, messageIndex + 1);
  }, [messages]);

  return {
    // State
    messages,
    userMessages,
    botMessages,
    latestMessage,
    conversationStats,
    messagesWithTranslations,
    messagesWithImprovements,
    messagesWithAudio,
    messagesWithPronunciation,

    // Actions
    addMessage,
    updateMessage,
    deleteMessage,
    clearAllMessages,

    // Queries
    getMessageById,
    searchMessages,
    getMessageContext,
    getMessagesInDateRange,
    getMessageThread,

    // Utilities
    exportMessagesAsText,
  };
} 