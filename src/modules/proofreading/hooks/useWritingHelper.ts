'use client';

import { useState, useCallback } from 'react';
import { WritingHelperRequest, WritingHelperState } from '../types';

export function useWritingHelper() {
  const [state, setState] = useState<WritingHelperState>({
    loading: false,
    error: null,
    result: null
  });

  const generateHelp = useCallback(async (request: WritingHelperRequest) => {
    console.log('[USE_WRITING_HELPER] Generating help for:', request);
    
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const response = await fetch('/api/writing-helper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate writing help');
      }

      const parsedResult = await response.json();
      console.log('[USE_WRITING_HELPER] API response:', parsedResult);

      setState(prev => ({
        ...prev,
        loading: false,
        result: parsedResult
      }));

    } catch (error) {
      console.error('[USE_WRITING_HELPER] Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      result: null
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    ...state,
    generateHelp,
    reset,
    clearError
  };
} 