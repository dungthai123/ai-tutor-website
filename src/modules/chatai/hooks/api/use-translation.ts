'use client';

import { useCallback, useState } from 'react';
import { chatApiService } from '../../services';
import { errorUtils } from '../../utils';

interface UseTranslationState {
  isTranslating: boolean;
  error: string | null;
  translations: Record<string, string>;
}

export function useTranslation() {
  const [state, setState] = useState<UseTranslationState>({
    isTranslating: false,
    error: null,
    translations: {},
  });

  const setTranslating = useCallback((translating: boolean) => {
    setState(prev => ({ ...prev, isTranslating: translating }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setTranslation = useCallback((key: string, translation: string) => {
    setState(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [key]: translation,
      },
    }));
  }, []);

  // Translate text
  const translateText = useCallback(async (
    text: string,
    targetLanguage: string = 'vi',
    cacheKey?: string
  ): Promise<string | null> => {
    // Check cache first
    const key = cacheKey || `${text}_${targetLanguage}`;
    if (state.translations[key]) {
      return state.translations[key];
    }

    setTranslating(true);
    setError(null);

    try {
      const response = await chatApiService.translateText(text, targetLanguage);
      
      if (response.success && response.data) {
        const translation = response.data.translatedText;
        setTranslation(key, translation);
        return translation;
      } else {
        setError(response.error || 'Failed to translate text');
        return null;
      }
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return null;
    } finally {
      setTranslating(false);
    }
  }, [state.translations, setTranslating, setError, setTranslation]);

  // Translate message with message ID as cache key
  const translateMessage = useCallback(async (
    messageId: number,
    text: string,
    targetLanguage: string = 'vi'
  ): Promise<string | null> => {
    const cacheKey = `msg_${messageId}_${targetLanguage}`;
    return translateText(text, targetLanguage, cacheKey);
  }, [translateText]);

  // Get cached translation
  const getCachedTranslation = useCallback((
    text: string,
    targetLanguage: string = 'vi',
    cacheKey?: string
  ): string | null => {
    const key = cacheKey || `${text}_${targetLanguage}`;
    return state.translations[key] || null;
  }, [state.translations]);

  // Clear translation cache
  const clearTranslationCache = useCallback(() => {
    setState(prev => ({ ...prev, translations: {} }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    // State
    isTranslating: state.isTranslating,
    error: state.error,
    translations: state.translations,

    // Actions
    translateText,
    translateMessage,
    getCachedTranslation,
    clearTranslationCache,
    clearError,
  };
} 