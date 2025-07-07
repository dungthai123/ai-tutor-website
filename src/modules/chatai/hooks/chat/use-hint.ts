'use client';

import { useCallback, useState } from 'react';
import { useChatStore } from '../storage/chat-store';
import { chatApiService } from '../../services';
import { JiebaCollection } from '../../types';
import { errorUtils } from '../../utils';

interface UseHintState {
  isLoadingHint: boolean;
  error: string | null;
  hintHistory: JiebaCollection[];
}

export function useHint() {
  const chatStore = useChatStore();
  const [state, setState] = useState<UseHintState>({
    isLoadingHint: false,
    error: null,
    hintHistory: [],
  });

  const setLoadingHint = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoadingHint: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const addToHintHistory = useCallback((hint: JiebaCollection) => {
    setState(prev => ({
      ...prev,
      hintHistory: [...prev.hintHistory, hint],
    }));
  }, []);

  // Get hint from AI
  const getHint = useCallback(async (customMessage?: string): Promise<JiebaCollection | null> => {
    if (!chatStore.topicDetail || !chatStore.conversationId) {
      setError('No active conversation found');
      return null;
    }

    setLoadingHint(true);
    setError(null);

    try {
      // Use custom message or get the last message from conversation
      const lastMessage = customMessage || 
        (chatStore.messages.length > 0 ? chatStore.messages[chatStore.messages.length - 1].content.original : '');

      const response = await chatApiService.getHint({
        conversationId: chatStore.conversationId,
        topicId: chatStore.topicDetail.topicId,
        chatSessionId: 'temp-session-id', // This should come from the chat hook
        message: lastMessage,
      });

      if (response.success && response.data) {
        addToHintHistory(response.data);
        chatStore.setHintMessage(response.data);
        return response.data;
      } else {
        setError(response.error || 'Failed to get hint');
        return null;
      }
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return null;
    } finally {
      setLoadingHint(false);
    }
  }, [chatStore, setLoadingHint, setError, addToHintHistory]);

  // Show hint bubble
  const showHint = useCallback(async (customMessage?: string) => {
    if (!chatStore.isOpenHint) {
      chatStore.toggleHint();
    }

    return await getHint(customMessage);
  }, [chatStore, getHint]);

  // Hide hint bubble
  const hideHint = useCallback(() => {
    if (chatStore.isOpenHint) {
      chatStore.toggleHint();
    }
    chatStore.setHintMessage(null);
  }, [chatStore]);

  // Use hint as message
  const useHintAsMessage = useCallback(() => {
    if (chatStore.hintMessage) {
      // This would typically call sendMessage from useChat
      // For now, we'll just hide the hint
      hideHint();
      return chatStore.hintMessage.original;
    }
    return null;
  }, [chatStore.hintMessage, hideHint]);

  // Get random hint from history
  const getRandomHintFromHistory = useCallback((): JiebaCollection | null => {
    if (state.hintHistory.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * state.hintHistory.length);
    return state.hintHistory[randomIndex];
  }, [state.hintHistory]);

  // Clear hint history
  const clearHintHistory = useCallback(() => {
    setState(prev => ({ ...prev, hintHistory: [] }));
  }, []);

  // Get hint suggestions based on topic
  const getTopicBasedHints = useCallback((): string[] => {
    if (!chatStore.topicDetail) return [];

    // Generate contextual hints based on topic tasks
    const hints = chatStore.topicDetail.tasks.map((task) => 
      `Try asking about: ${task}`
    );

    // Add some general conversation starters
    hints.push(
      "Can you tell me more about this?",
      "What do you think about...?",
      "How would you explain...?",
      "Could you give me an example?"
    );

    return hints;
  }, [chatStore.topicDetail]);

  // Check if hint is available
  const isHintAvailable = useCallback((): boolean => {
    return !!(chatStore.topicDetail && chatStore.conversationId && chatStore.messages.length > 0);
  }, [chatStore.topicDetail, chatStore.conversationId, chatStore.messages.length]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    // State
    isLoadingHint: state.isLoadingHint,
    error: state.error,
    hintHistory: state.hintHistory,
    currentHint: chatStore.hintMessage,
    isHintOpen: chatStore.isOpenHint,

    // Actions
    getHint,
    showHint,
    hideHint,
    useHintAsMessage,
    clearHintHistory,
    clearError,

    // Utilities
    getRandomHintFromHistory,
    getTopicBasedHints,
    isHintAvailable,
  };
} 