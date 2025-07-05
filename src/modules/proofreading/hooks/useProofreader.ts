import { useState, useCallback } from 'react';
import { AssistantResult } from '../types';

export function useProofreader() {
  const [result, setResult] = useState<AssistantResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proofread = useCallback(async (text: string) => {
    if (!text.trim()) {
      console.log('[PROOFREAD_HOOK] Empty text provided');
      setError('Please enter some text to proofread');
      return;
    }

    console.log('[PROOFREAD_HOOK] Starting proofread for text:', text.substring(0, 100) + '...');
    setLoading(true);
    setError(null);

    try {
      console.log('[PROOFREAD_HOOK] Sending request to API...');
      const response = await fetch('/api/proofread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      console.log('[PROOFREAD_HOOK] API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[PROOFREAD_HOOK] API error:', errorData);
        throw new Error(errorData.error || 'Failed to proofread text');
      }

      const data: AssistantResult = await response.json();
      console.log('[PROOFREAD_HOOK] Received result:', data);
      setResult(data);
    } catch (err: unknown) {
      console.error('[PROOFREAD_HOOK] Error occurred:', err);
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
    proofread,
    reset,
    clearError,
  };
} 