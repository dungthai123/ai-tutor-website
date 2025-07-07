'use client';

import { useState, useCallback } from 'react';
import { ChatGPTModel, TopicDetail } from '../../types';
import { chatApiService } from '../../services';
import { errorUtils } from '../../utils';

interface UseTopicsState {
  categories: ChatGPTModel[];
  selectedCategoryIndex: number;
  isLoading: boolean;
  isStoryLoading: boolean;
  hasMoreData: boolean;
  error: string | null;
}

export function useTopics() {
  const [state, setState] = useState<UseTopicsState>({
    categories: [],
    selectedCategoryIndex: 0,
    isLoading: false,
    isStoryLoading: false,
    hasMoreData: true,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setSelectedCategory = useCallback((index: number) => {
    setState(prev => ({ ...prev, selectedCategoryIndex: index }));
  }, []);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await chatApiService.fetchTopics();
      
      if (response.success && response.data) {
        // Ensure response.data is an array
        const categories = Array.isArray(response.data) ? response.data : [];
        setState(prev => ({
          ...prev,
          categories,
          isLoading: false,
          hasMoreData: false,
        }));
      } else {
        setError(response.error || 'Failed to fetch topics');
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      setLoading(false);
    }
  }, [setLoading, setError]);

  const fetchTopicDetails = useCallback(async (conversationId: string) => {
    setState(prev => ({ ...prev, isStoryLoading: true }));

    try {
      const response = await chatApiService.fetchTopicById(conversationId);
      
      if (response.success && response.data) {
        setState(prev => {
          const updatedCategories = [...prev.categories];
          const categoryIndex = updatedCategories.findIndex(
            cat => cat.conversationId === conversationId
          );
          
          if (categoryIndex !== -1) {
            updatedCategories[categoryIndex] = response.data!;
          }
          
          return {
            ...prev,
            categories: updatedCategories,
            isStoryLoading: false,
          };
        });
      } else {
        setState(prev => ({ ...prev, isStoryLoading: false }));
      }
    } catch (error) {
      console.error('Failed to fetch topic details:', error);
      setState(prev => ({ ...prev, isStoryLoading: false }));
    }
  }, []);

  const getSuggestedTopic = useCallback((): TopicDetail | null => {
    // Get a random topic from all categories as suggestion
    const allTopics: TopicDetail[] = [];
    
    // Ensure categories is an array before using forEach
    if (Array.isArray(state.categories)) {
      state.categories.forEach(category => {
        if (Array.isArray(category.topicDetails)) {
          allTopics.push(...category.topicDetails);
        }
      });
    }

    if (allTopics.length === 0) return null;

    // Return a random topic or the first one
    const randomIndex = Math.floor(Math.random() * Math.min(allTopics.length, 5));
    return allTopics[randomIndex] || allTopics[0];
  }, [state.categories]);

  const getTopicsByCategory = useCallback((categoryIndex: number): TopicDetail[] => {
    if (categoryIndex < 0 || categoryIndex >= state.categories.length) {
      return [];
    }
    return state.categories[categoryIndex].topicDetails || [];
  }, [state.categories]);

  const findTopicById = useCallback((topicId: number): { topic: TopicDetail; categoryIndex: number } | null => {
    for (let i = 0; i < state.categories.length; i++) {
      const topic = state.categories[i].topicDetails.find(t => t.topicId === topicId);
      if (topic) {
        return { topic, categoryIndex: i };
      }
    }
    return null;
  }, [state.categories]);

  const resetSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedCategoryIndex: 0,
    }));
  }, []);

  return {
    // State
    categories: state.categories,
    selectedCategoryIndex: state.selectedCategoryIndex,
    isLoading: state.isLoading,
    isStoryLoading: state.isStoryLoading,
    hasMoreData: state.hasMoreData,
    error: state.error,

    // Actions
    setSelectedCategory,
    fetchTopics,
    fetchTopicDetails,
    resetSelection,

    // Utilities
    getSuggestedTopic,
    getTopicsByCategory,
    findTopicById,
  };
} 