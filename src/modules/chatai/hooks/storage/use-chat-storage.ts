'use client';

import { useCallback, useState, useEffect } from 'react';
import { ChatMessage, TopicDetail } from '../../types';
import { storageUtils, errorUtils } from '../../utils';

interface ChatStorageData {
  messages: ChatMessage[];
  topicDetail: TopicDetail | null;
  conversationId: string;
  timestamp: number;
}

interface UseChatStorageState {
  isLoading: boolean;
  error: string | null;
  savedConversations: string[];
}

export function useChatStorage() {
  const [state, setState] = useState<UseChatStorageState>({
    isLoading: false,
    error: null,
    savedConversations: [],
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setSavedConversations = useCallback((conversations: string[]) => {
    setState(prev => ({ ...prev, savedConversations: conversations }));
  }, []);

  // Generate storage key for conversation
  const getStorageKey = useCallback((conversationId: string): string => {
    return `chatai_conversation_${conversationId}`;
  }, []);

  // Save conversation to localStorage
  const saveConversation = useCallback(async (
    conversationId: string,
    messages: ChatMessage[],
    topicDetail: TopicDetail | null
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const storageData: ChatStorageData = {
        messages,
        topicDetail,
        conversationId,
        timestamp: Date.now(),
      };

      const storageKey = getStorageKey(conversationId);
      localStorage.setItem(storageKey, JSON.stringify(storageData));

      // Update saved conversations list
      const savedList = getSavedConversationsList();
      if (!savedList.includes(conversationId)) {
        savedList.push(conversationId);
        localStorage.setItem('chatai_saved_conversations', JSON.stringify(savedList));
        setSavedConversations(savedList);
      }

      return true;
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(`Failed to save conversation: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getStorageKey, setSavedConversations]);

  // Load conversation from localStorage
  const loadConversation = useCallback(async (conversationId: string): Promise<ChatStorageData | null> => {
    setLoading(true);
    setError(null);

    try {
      const storageKey = getStorageKey(conversationId);
      const storedData = localStorage.getItem(storageKey);

      if (!storedData) {
        setError('Conversation not found');
        return null;
      }

      const parsedData: ChatStorageData = JSON.parse(storedData);
      
      // Validate the loaded data
      if (!parsedData.conversationId || !Array.isArray(parsedData.messages)) {
        setError('Invalid conversation data');
        return null;
      }

      return parsedData;
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(`Failed to load conversation: ${errorMessage}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getStorageKey, setError]);

  // Delete conversation from localStorage
  const deleteConversation = useCallback(async (conversationId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const storageKey = getStorageKey(conversationId);
      localStorage.removeItem(storageKey);

      // Update saved conversations list
      const savedList = getSavedConversationsList();
      const updatedList = savedList.filter(id => id !== conversationId);
      localStorage.setItem('chatai_saved_conversations', JSON.stringify(updatedList));
      setSavedConversations(updatedList);

      return true;
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(`Failed to delete conversation: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getStorageKey, setSavedConversations]);

  // Get list of saved conversations
  const getSavedConversationsList = useCallback((): string[] => {
    try {
      const stored = localStorage.getItem('chatai_saved_conversations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // Get all saved conversations with metadata
  const getAllSavedConversations = useCallback(async (): Promise<Array<{
    conversationId: string;
    topicTitle: string;
    messageCount: number;
    lastModified: number;
  }>> => {
    setLoading(true);
    setError(null);

    try {
      const conversationIds = getSavedConversationsList();
      const conversations = [];

      for (const conversationId of conversationIds) {
        try {
          const data = await loadConversation(conversationId);
          if (data) {
            conversations.push({
              conversationId: data.conversationId,
              topicTitle: data.topicDetail?.title || 'Unknown Topic',
              messageCount: data.messages.length,
              lastModified: data.timestamp,
            });
          }
        } catch {
          // Skip invalid conversations
          continue;
        }
      }

      // Sort by last modified (newest first)
      conversations.sort((a, b) => b.lastModified - a.lastModified);

      return conversations;
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(`Failed to load conversations: ${errorMessage}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getSavedConversationsList, loadConversation]);

  // Save message to current conversation
  const saveMessage = useCallback(async (
    conversationId: string,
    message: ChatMessage,
    topicDetail: TopicDetail | null
  ): Promise<boolean> => {
    try {
      // Load existing conversation
      const existingData = await loadConversation(conversationId);
      const messages = existingData ? existingData.messages : [];
      
      // Add new message
      messages.push(message);
      
      // Save updated conversation
      return await saveConversation(conversationId, messages, topicDetail);
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(`Failed to save message: ${errorMessage}`);
      return false;
    }
  }, [loadConversation, saveConversation, setError]);

  // Auto-save conversation (debounced)
  const autoSaveConversation = useCallback(async (
    conversationId: string,
    messages: ChatMessage[],
    topicDetail: TopicDetail | null
  ): Promise<void> => {
    // Simple auto-save without debouncing for now
    // In production, you might want to implement debouncing
    await saveConversation(conversationId, messages, topicDetail);
  }, [saveConversation]);

  // Export conversation as JSON
  const exportConversation = useCallback(async (conversationId: string): Promise<string | null> => {
    try {
      const data = await loadConversation(conversationId);
      if (!data) return null;

      return JSON.stringify(data, null, 2);
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(`Failed to export conversation: ${errorMessage}`);
      return null;
    }
  }, [loadConversation, setError]);

  // Import conversation from JSON
  const importConversation = useCallback(async (jsonData: string): Promise<string | null> => {
    try {
      const data: ChatStorageData = JSON.parse(jsonData);
      
      // Validate imported data
      if (!data.conversationId || !Array.isArray(data.messages)) {
        setError('Invalid conversation data format');
        return null;
      }

      // Generate new conversation ID to avoid conflicts
      const newConversationId = storageUtils.generateChatSessionId();
      
      const success = await saveConversation(newConversationId, data.messages, data.topicDetail);
      
      if (success) {
        return newConversationId;
      } else {
        return null;
      }
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(`Failed to import conversation: ${errorMessage}`);
      return null;
    }
  }, [saveConversation, setError]);

  // Clear all saved conversations
  const clearAllConversations = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const conversationIds = getSavedConversationsList();
      
      // Delete each conversation
      for (const conversationId of conversationIds) {
        const storageKey = getStorageKey(conversationId);
        localStorage.removeItem(storageKey);
      }

      // Clear the list
      localStorage.removeItem('chatai_saved_conversations');
      setSavedConversations([]);

      return true;
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(`Failed to clear conversations: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getSavedConversationsList, getStorageKey, setSavedConversations, setError]);

  // Load saved conversations list on mount
  useEffect(() => {
    const savedList = getSavedConversationsList();
    setSavedConversations(savedList);
  }, [getSavedConversationsList, setSavedConversations]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,
    savedConversations: state.savedConversations,

    // Actions
    saveConversation,
    loadConversation,
    deleteConversation,
    saveMessage,
    autoSaveConversation,
    clearAllConversations,

    // Queries
    getAllSavedConversations,
    getSavedConversationsList,

    // Import/Export
    exportConversation,
    importConversation,

    // Utilities
    clearError,
  };
} 