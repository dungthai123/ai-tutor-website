import { useState, useCallback } from 'react';
import { SpeakingHelperRequest, SpeakingHelperResponse } from '../../types';

interface UseSpeakingHelperReturn {
  result: SpeakingHelperResponse | null;
  loading: boolean;
  error: string | null;
  generateSpeakingHelp: (request: SpeakingHelperRequest) => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

export function useSpeakingHelper(): UseSpeakingHelperReturn {
  const [result, setResult] = useState<SpeakingHelperResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSpeakingHelp = useCallback(async (request: SpeakingHelperRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/speaking-helper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        throw new Error(data.message || 'Failed to generate speaking help');
      }
    } catch (err) {
      console.error('Error generating speaking help:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    result,
    loading,
    error,
    generateSpeakingHelp,
    reset,
    clearError,
  };
} 