'use client';

import { useState, useCallback } from 'react';
import { TopicDetail } from '../../types';

interface UseTopicSelectionState {
  selectedTopic: TopicDetail | null;
  isTopicSelected: boolean;
}

export function useTopicSelection() {
  const [state, setState] = useState<UseTopicSelectionState>({
    selectedTopic: null,
    isTopicSelected: false,
  });

  const selectTopic = useCallback((topic: TopicDetail) => {
    setState({
      selectedTopic: topic,
      isTopicSelected: true,
    });
  }, []);

  const clearSelection = useCallback(() => {
    setState({
      selectedTopic: null,
      isTopicSelected: false,
    });
  }, []);

  const isTopicSelectedById = useCallback((topicId: number) => {
    return state.selectedTopic?.topicId === topicId;
  }, [state.selectedTopic]);

  return {
    selectedTopic: state.selectedTopic,
    isTopicSelected: state.isTopicSelected,
    selectTopic,
    clearSelection,
    isTopicSelectedById,
  };
} 