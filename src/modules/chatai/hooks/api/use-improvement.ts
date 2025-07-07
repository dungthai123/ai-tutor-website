'use client';

import { useCallback, useState } from 'react';
import { chatApiService } from '../../services';
import { ImprovedChineseFeedback } from '../../types';
import { errorUtils } from '../../utils';

interface UseImprovementState {
  isImproving: boolean;
  error: string | null;
  improvements: Record<number, ImprovedChineseFeedback>;
}

export function useImprovement() {
  const [state, setState] = useState<UseImprovementState>({
    isImproving: false,
    error: null,
    improvements: {},
  });

  const setImproving = useCallback((improving: boolean) => {
    setState(prev => ({ ...prev, isImproving: improving }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setImprovement = useCallback((messageId: number, improvement: ImprovedChineseFeedback) => {
    setState(prev => ({
      ...prev,
      improvements: {
        ...prev.improvements,
        [messageId]: improvement,
      },
    }));
  }, []);

  // Improve message
  const improveMessage = useCallback(async (
    messageId: number,
    conversationId: string,
    topicId: number,
    chatSessionId: string,
    question: string,
    answer: string
  ): Promise<ImprovedChineseFeedback | null> => {
    // Check cache first
    if (state.improvements[messageId]) {
      return state.improvements[messageId];
    }

    setImproving(true);
    setError(null);

    try {
      const response = await chatApiService.improveMessage({
        conversationId,
        topicId,
        chatSessionId,
        question,
        answer,
      });
      
      if (response.success && response.data) {
        setImprovement(messageId, response.data);
        return response.data;
      } else {
        setError(response.error || 'Failed to improve message');
        return null;
      }
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return null;
    } finally {
      setImproving(false);
    }
  }, [state.improvements, setImproving, setError, setImprovement]);

  // Get cached improvement
  const getCachedImprovement = useCallback((messageId: number): ImprovedChineseFeedback | null => {
    return state.improvements[messageId] || null;
  }, [state.improvements]);

  // Check if message is perfect (no improvement needed)
  const isMessagePerfect = useCallback((messageId: number): boolean => {
    const improvement = state.improvements[messageId];
    return improvement?.isPerfect || false;
  }, [state.improvements]);

  // Get improvement suggestions for a message
  const getImprovementSuggestions = useCallback((messageId: number): {
    improvedText: string;
    feedback: string;
    isPerfect: boolean;
  } | null => {
    const improvement = state.improvements[messageId];
    if (!improvement) return null;

    return {
      improvedText: improvement.improvedFeedback,
      feedback: improvement.commentFeedback,
      isPerfect: improvement.isPerfect,
    };
  }, [state.improvements]);

  // Clear improvement cache
  const clearImprovementCache = useCallback(() => {
    setState(prev => ({ ...prev, improvements: {} }));
  }, []);

  // Clear specific improvement
  const clearImprovement = useCallback((messageId: number) => {
    setState(prev => {
      const newImprovements = { ...prev.improvements };
      delete newImprovements[messageId];
      return { ...prev, improvements: newImprovements };
    });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    // State
    isImproving: state.isImproving,
    error: state.error,
    improvements: state.improvements,

    // Actions
    improveMessage,
    getCachedImprovement,
    isMessagePerfect,
    getImprovementSuggestions,
    clearImprovementCache,
    clearImprovement,
    clearError,
  };
} 