import { useCallback, useState } from 'react';
import { pronunciationService } from '../../services/audio/pronunciation.service';
import { SpeechData } from '../../types';

interface UsePronunciationState {
  isAssessing: boolean;
  error: string | null;
  lastAssessment: SpeechData | null;
}

export const usePronunciation = () => {
  const [state, setState] = useState<UsePronunciationState>({
    isAssessing: false,
    error: null,
    lastAssessment: null,
  });

  const assessPronunciation = useCallback(
    async (audioBlob: Blob, referenceText: string): Promise<SpeechData | null> => {
      setState((prev) => ({ ...prev, isAssessing: true, error: null }));

      try {
        const response = await pronunciationService.assessPronunciation(audioBlob, referenceText);

        if (response.success && response.data) {
          setState({
            isAssessing: false,
            error: null,
            lastAssessment: response.data,
          });
          return response.data;
        } else {
          const errorMessage = response.error || 'Pronunciation assessment failed';
          setState((prev) => ({
            ...prev,
            isAssessing: false,
            error: errorMessage,
          }));
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown assessment error';
        setState((prev) => ({
          ...prev,
          isAssessing: false,
          error: errorMessage,
        }));
        return null;
      }
    },
    []
  );

  const calculateOverallScore = useCallback((speechData: SpeechData): number => {
    return pronunciationService.calculateOverallScore(speechData);
  }, []);

  const getPronunciationFeedback = useCallback((speechData: SpeechData): string => {
    return pronunciationService.getPronunciationFeedback(speechData);
  }, []);

  return {
    isAssessing: state.isAssessing,
    error: state.error,
    lastAssessment: state.lastAssessment,
    assessPronunciation,
    calculateOverallScore,
    getPronunciationFeedback,
  };
}; 