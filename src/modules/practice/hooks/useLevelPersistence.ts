import { useState, useEffect, useCallback } from 'react';
import { HSKLevel } from '../types';

const LEVEL_STORAGE_KEY = 'hsk-selected-level';
const DEFAULT_LEVEL = HSKLevel.HSK1;

export function useLevelPersistence() {
  const [selectedLevel, setSelectedLevel] = useState<HSKLevel>(DEFAULT_LEVEL);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load the saved level from localStorage on mount
  useEffect(() => {
    try {
      const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY);
      if (savedLevel && Object.values(HSKLevel).includes(savedLevel as HSKLevel)) {
        setSelectedLevel(savedLevel as HSKLevel);
      }
    } catch (error) {
      console.warn('Failed to load saved HSK level:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save level to localStorage whenever it changes
  const setLevel = useCallback((level: HSKLevel) => {
    setSelectedLevel(level);
    try {
      localStorage.setItem(LEVEL_STORAGE_KEY, level);
    } catch (error) {
      console.warn('Failed to save HSK level:', error);
    }
  }, []);

  return {
    selectedLevel,
    setLevel,
    isLoaded
  };
} 