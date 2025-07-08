'use client';

import { useState, useEffect, useCallback } from 'react';
import { useChatStorage } from '../storage/use-chat-storage';

interface ConversationSummary {
  conversationId: string;
  topicTitle: string;
  messageCount: number;
  lastModified: number;
}

interface UseChatHistoryState {
  conversations: ConversationSummary[];
  loading: boolean;
  error: string | null;
}

export function useChatHistory() {
  const [state, setState] = useState<UseChatHistoryState>({
    conversations: [],
    loading: false,
    error: null,
  });

  const {
    getAllSavedConversations,
    deleteConversation: deleteSavedConversation,
    clearAllConversations,
    exportConversation: exportSavedConversation,
    importConversation: importSavedConversation,
    error: storageError,
    isLoading: storageLoading,
  } = useChatStorage();

  // Set loading state
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  // Set error state
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  // Set conversations
  const setConversations = useCallback((conversations: ConversationSummary[]) => {
    setState(prev => ({ ...prev, conversations }));
  }, []);

  // Load all conversations
  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const conversations = await getAllSavedConversations();
      setConversations(conversations);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load conversations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getAllSavedConversations, setLoading, setError, setConversations]);

  // Refresh history
  const refreshHistory = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  // Delete conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      const success = await deleteSavedConversation(conversationId);
      if (success) {
        // Update local state by removing the deleted conversation
        setState(prev => ({
          ...prev,
          conversations: prev.conversations.filter(conv => conv.conversationId !== conversationId)
        }));
      }
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete conversation';
      setError(errorMessage);
      return false;
    }
  }, [deleteSavedConversation, setError]);

  // Clear all history
  const clearAllHistory = useCallback(async () => {
    try {
      const success = await clearAllConversations();
      if (success) {
        setConversations([]);
      }
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear all conversations';
      setError(errorMessage);
      return false;
    }
  }, [clearAllConversations, setError, setConversations]);

  // Export conversation
  const exportConversation = useCallback(async (conversationId: string) => {
    try {
      return await exportSavedConversation(conversationId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export conversation';
      setError(errorMessage);
      return null;
    }
  }, [exportSavedConversation, setError]);

  // Import conversation
  const importConversation = useCallback(async (jsonData: string) => {
    try {
      return await importSavedConversation(jsonData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import conversation';
      setError(errorMessage);
      return null;
    }
  }, [importSavedConversation, setError]);

  // Get conversation by ID
  const getConversationById = useCallback((conversationId: string): ConversationSummary | null => {
    return state.conversations.find(conv => conv.conversationId === conversationId) || null;
  }, [state.conversations]);

  // Get conversations by topic
  const getConversationsByTopic = useCallback((topicTitle: string): ConversationSummary[] => {
    return state.conversations.filter(conv => conv.topicTitle === topicTitle);
  }, [state.conversations]);

  // Get recent conversations
  const getRecentConversations = useCallback((limit: number = 5): ConversationSummary[] => {
    return state.conversations
      .sort((a, b) => b.lastModified - a.lastModified)
      .slice(0, limit);
  }, [state.conversations]);

  // Get conversation statistics
  const getStatistics = useCallback(() => {
    const conversations = state.conversations;
    return {
      totalConversations: conversations.length,
      totalMessages: conversations.reduce((sum, conv) => sum + conv.messageCount, 0),
      uniqueTopics: new Set(conversations.map(conv => conv.topicTitle)).size,
      averageMessagesPerConversation: conversations.length > 0 
        ? Math.round(conversations.reduce((sum, conv) => sum + conv.messageCount, 0) / conversations.length)
        : 0,
      mostActiveDay: conversations.length > 0 
        ? new Date(Math.max(...conversations.map(conv => conv.lastModified))).toDateString()
        : null,
    };
  }, [state.conversations]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Update error from storage
  useEffect(() => {
    if (storageError) {
      setError(storageError);
    }
  }, [storageError, setError]);

  // Update loading from storage
  useEffect(() => {
    if (storageLoading !== state.loading) {
      setLoading(storageLoading);
    }
  }, [storageLoading, state.loading, setLoading]);

  return {
    // State
    conversations: state.conversations,
    loading: state.loading || storageLoading,
    error: state.error || storageError,

    // Actions
    refreshHistory,
    deleteConversation,
    clearAllHistory,
    exportConversation,
    importConversation,
    loadConversations,

    // Getters
    getConversationById,
    getConversationsByTopic,
    getRecentConversations,
    getStatistics,
  };
} 