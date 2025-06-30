import { useState, useEffect } from 'react';
import { Category, Topic, TopicSelectorState } from '../types';
import { TopicService } from '../services';

export const useTopicSelector = (
  selectedCategoryId?: number,
  selectedTopicId?: string
) => {
  const [state, setState] = useState<TopicSelectorState>({
    categories: [],
    topics: [],
    selectedCategory: null,
    selectedTopic: null,
    loading: false,
    error: null,
  });

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load topics when category changes
  useEffect(() => {
    if (state.selectedCategory) {
      loadTopics(state.selectedCategory.id);
    }
  }, [state.selectedCategory]);

  // Auto-select category if provided, or select first category
  useEffect(() => {
    if (state.categories.length > 0 && !state.selectedCategory) {
      if (selectedCategoryId) {
        const category = state.categories.find(cat => cat.id === selectedCategoryId);
        if (category) {
          handleCategorySelect(category);
        }
      } else {
        // Auto-select first category if none is provided
        handleCategorySelect(state.categories[0]);
      }
    }
  }, [selectedCategoryId, state.categories, state.selectedCategory]);

  // Auto-select topic if provided
  useEffect(() => {
    if (selectedTopicId && state.topics.length > 0 && !state.selectedTopic) {
      const topic = state.topics.find(t => t.topic_id === selectedTopicId);
      if (topic) {
        handleTopicSelect(topic);
      }
    }
  }, [selectedTopicId, state.topics, state.selectedTopic]);

  const loadCategories = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const result = await TopicService.fetchCategories();
    
    setState(prev => ({
      ...prev,
      loading: false,
      categories: result.categories,
      error: result.error || null,
    }));
  };

  const loadTopics = async (categoryId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const result = await TopicService.fetchTopics(categoryId);
    
    setState(prev => ({
      ...prev,
      loading: false,
      topics: result.topics,
      error: result.error || null,
    }));
  };

  const handleCategorySelect = (category: Category) => {
    setState(prev => ({
      ...prev,
      selectedCategory: category,
      selectedTopic: null,
      topics: [],
    }));
  };

  const handleTopicSelect = (topic: Topic) => {
    setState(prev => ({
      ...prev,
      selectedTopic: topic,
    }));
  };

  const resetSelection = () => {
    setState(prev => ({
      ...prev,
      selectedCategory: null,
      selectedTopic: null,
      topics: [],
    }));
  };

  return {
    ...state,
    handleCategorySelect,
    handleTopicSelect,
    resetSelection,
    loadCategories,
    loadTopics,
  };
}; 