'use client';

import { useCallback, useState } from 'react';
import { chatApiService } from '../../services';
import { 
  ChatApiRequest, 
  InitialMessageRequest, 
  HintRequest, 
  ImproveMessageRequest, 
  FeedbackRequest
} from '../../types';
import { JiebaCollection, ImprovedChineseFeedback, ConversationFeedback, ChatGPTModel } from '../../types';
import { errorUtils } from '../../utils';

interface UseChatApiState {
  isLoading: boolean;
  error: string | null;
}

export function useChatApi() {
  const [state, setState] = useState<UseChatApiState>({
    isLoading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  // Fetch topics
  const fetchTopics = useCallback(async (): Promise<ChatGPTModel[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await chatApiService.fetchTopics();
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'Failed to fetch topics');
        return null;
      }
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Fetch topic by ID
  const fetchTopicById = useCallback(async (id: string): Promise<ChatGPTModel | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await chatApiService.fetchTopicById(id);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'Failed to fetch topic');
        return null;
      }
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Send initial message
  const sendInitialMessage = useCallback(async (request: InitialMessageRequest): Promise<JiebaCollection | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await chatApiService.initialMessage(request);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'Failed to send initial message');
        return null;
      }
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Send message
  const sendMessage = useCallback(async (request: ChatApiRequest): Promise<JiebaCollection | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await chatApiService.sendMessage(request);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'Failed to send message');
        return null;
      }
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Get hint
  const getHint = useCallback(async (request: HintRequest): Promise<JiebaCollection | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await chatApiService.getHint(request);
      
      if (response.success && response.data) {
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
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Improve message
  const improveMessage = useCallback(async (request: ImproveMessageRequest): Promise<ImprovedChineseFeedback | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await chatApiService.improveMessage(request);
      
      if (response.success && response.data) {
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
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Get feedback
  const getFeedback = useCallback(async (request: FeedbackRequest): Promise<ConversationFeedback | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await chatApiService.getFeedback(request);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'Failed to get feedback');
        return null;
      }
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    fetchTopics,
    fetchTopicById,
    sendInitialMessage,
    sendMessage,
    getHint,
    improveMessage,
    getFeedback,
    clearError,
  };
} 