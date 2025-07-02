import { useState, useCallback, useEffect } from 'react';
import { HSKLevel } from '../types';
import { PracticeService } from '../services';
import { UsePracticePageReturn, PracticePageState } from '../types';
import { useLevelPersistence } from './useLevelPersistence';

/**
 * Custom hook for managing the practice page state and logic
 */
export function usePracticePage(): UsePracticePageReturn {
  const { selectedLevel, setLevel: setPersistentLevel, isLoaded } = useLevelPersistence();
  
  const [state, setState] = useState<PracticePageState>({
    selectedLevel,
    practiceTopics: [],
    loading: false,
    error: null
  });

  // Update state when persistent level changes
  useEffect(() => {
    setState(prev => ({ ...prev, selectedLevel }));
  }, [selectedLevel]);

  // Set level and persist it
  const setLevel = useCallback((level: HSKLevel) => {
    setState(prev => ({ ...prev, selectedLevel: level }));
    setPersistentLevel(level);
  }, [setPersistentLevel]);

  // Refresh topics for current level (if needed for error recovery)
  const refreshTopics = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const topicsResponse = await PracticeService.fetchPracticeTopics(state.selectedLevel);
      
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
  }, [state.selectedLevel]);

  return {
    state,
    actions: {
      setLevel,
      refreshTopics
    },
    isLoaded
  };
} 