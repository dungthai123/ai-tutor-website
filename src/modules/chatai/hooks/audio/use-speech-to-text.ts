import { useCallback, useState } from 'react';
import { speechToTextService } from '../../services/audio/speech-to-text.service';
import { useChatStore } from '../storage/chat-store';

interface UseSpeechToTextState {
  isTranscribing: boolean;
  error: string | null;
}

export const useSpeechToText = () => {
  const [state, setState] = useState<UseSpeechToTextState>({
    isTranscribing: false,
    error: null,
  });

  const { setAwaitSpeechToText } = useChatStore();

  const transcribeAudio = useCallback(
    async (audioBlob: Blob, language?: string): Promise<string> => {
      setState({ isTranscribing: true, error: null });
      setAwaitSpeechToText(true);

      try {
        const response = await speechToTextService.transcribeAudio(audioBlob, language);

        if (response.success && response.data) {
          setState({ isTranscribing: false, error: null });
          setAwaitSpeechToText(false);
          return response.data;
        } else {
          const errorMessage = response.error || 'Transcription failed';
          setState({ isTranscribing: false, error: errorMessage });
          setAwaitSpeechToText(false);
          throw new Error(errorMessage);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown transcription error';
        setState({ isTranscribing: false, error: errorMessage });
        setAwaitSpeechToText(false);
        throw error;
      }
    },
    [setAwaitSpeechToText]
  );

  const transcribeAudioDirect = useCallback(
    async (audioBlob: Blob, language?: string): Promise<string> => {
      setState({ isTranscribing: true, error: null });
      setAwaitSpeechToText(true);

      try {
        const response = await speechToTextService.transcribeAudioDirect(audioBlob, language);

        if (response.success && response.data) {
          setState({ isTranscribing: false, error: null });
          setAwaitSpeechToText(false);
          return response.data;
        } else {
          const errorMessage = response.error || 'Direct transcription failed';
          setState({ isTranscribing: false, error: errorMessage });
          setAwaitSpeechToText(false);
          throw new Error(errorMessage);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown transcription error';
        setState({ isTranscribing: false, error: errorMessage });
        setAwaitSpeechToText(false);
        throw error;
      }
    },
    [setAwaitSpeechToText]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setState({ isTranscribing: false, error: null });
    setAwaitSpeechToText(false);
  }, [setAwaitSpeechToText]);

  return {
    // State
    isTranscribing: state.isTranscribing,
    error: state.error,

    // Actions
    transcribeAudio,
    transcribeAudioDirect,
    clearError,
    resetState,
  };
}; 