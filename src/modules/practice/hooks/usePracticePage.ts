import { useState, useEffect, useCallback } from 'react';
import { HSKLevel } from '../types';
import { PracticeService } from '../services';
import { UsePracticePageReturn, PracticePageState } from '../types';

/**
 * Custom hook for managing the practice page state and logic
 */
export function usePracticePage(initialLevel: HSKLevel = HSKLevel.HSK1): UsePracticePageReturn {
  const [state, setState] = useState<PracticePageState>({
    selectedLevel: initialLevel,
    practiceTopics: [],
    loading: false,
    error: null
  });

  // Fetch practice topics for the selected level
  const fetchTopics = useCallback(async (level: HSKLevel) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const topicsResponse = await PracticeService.fetchPracticeTopics(level);
      
      // Combine all topics into a single array for the main page
      const allTopics = [...topicsResponse.listening, ...topicsResponse.reading];
      
      setState(prev => ({
        ...prev,
        practiceTopics: allTopics,
        loading: false
      }));
    } catch (error) {
      console.error('Failed to fetch practice topics:', error);
      setState(prev => ({
        ...prev,
        practiceTopics: [],
        loading: false,
        error: 'Failed to load practice topics. Please try again.'
      }));
    }
  }, []);

  // Set level and fetch topics
  const setLevel = useCallback((level: HSKLevel) => {
    setState(prev => ({ ...prev, selectedLevel: level }));
    fetchTopics(level);
  }, [fetchTopics]);

  // Refresh topics for current level
  const refreshTopics = useCallback(async () => {
    await fetchTopics(state.selectedLevel);
  }, [fetchTopics, state.selectedLevel]);

  // Load initial topics
  useEffect(() => {
    fetchTopics(initialLevel);
  }, [fetchTopics, initialLevel]);

  return {
    state,
    actions: {
      setLevel,
      refreshTopics
    }
  };
} 