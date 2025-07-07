import { useCallback } from 'react';
import { textToSpeechService } from '../../services/audio/text-to-speech.service';
import { audioPlayerService } from '../../services/audio/audio-player.service';
import { useAudioStore } from '../storage/audio-store';

export const useTextToSpeech = () => {
  const { setCurrentAudioUrl, setCurrentMessageId } = useAudioStore();

  const playTTS = useCallback(
    async (text: string, speechRate: number = 1.0, messageId?: number) => {
      try {
        const blob = await textToSpeechService.generateSpeech(text, speechRate);
        
        if (messageId) {
          setCurrentMessageId(messageId);
        }
        
        await audioPlayerService.playBlob(blob);
      } catch (error) {
        console.error('Failed to play TTS:', error);
        throw error;
      }
    },
    [setCurrentMessageId]
  );

  const generateTTSUrl = useCallback(
    async (text: string, speechRate: number = 1.0): Promise<string> => {
      try {
        return await textToSpeechService.generateSpeechUrl(text, speechRate);
      } catch (error) {
        console.error('Failed to generate TTS URL:', error);
        throw error;
      }
    },
    []
  );

  const getCachedTTSUrl = useCallback(
    async (text: string, speechRate: number = 1.0): Promise<string> => {
      try {
        return await textToSpeechService.getCachedSpeechUrl(text, speechRate);
      } catch (error) {
        console.error('Failed to get cached TTS URL:', error);
        throw error;
      }
    },
    []
  );

  const playTTSFromUrl = useCallback(
    async (url: string, messageId?: number) => {
      try {
        if (messageId) {
          setCurrentMessageId(messageId);
        }
        
        setCurrentAudioUrl(url);
        await audioPlayerService.play(url);
      } catch (error) {
        console.error('Failed to play TTS from URL:', error);
        throw error;
      }
    },
    [setCurrentAudioUrl, setCurrentMessageId]
  );

  const stopTTS = useCallback(async () => {
    try {
      await audioPlayerService.stop();
      setCurrentAudioUrl(null);
      setCurrentMessageId(null);
    } catch (error) {
      console.error('Failed to stop TTS:', error);
    }
  }, [setCurrentAudioUrl, setCurrentMessageId]);

  const pauseTTS = useCallback(async () => {
    try {
      await audioPlayerService.pause();
    } catch (error) {
      console.error('Failed to pause TTS:', error);
    }
  }, []);

  const resumeTTS = useCallback(async () => {
    try {
      await audioPlayerService.resume();
    } catch (error) {
      console.error('Failed to resume TTS:', error);
    }
  }, []);

  const clearTTSCache = useCallback(() => {
    textToSpeechService.clearCache();
  }, []);

  return {
    playTTS,
    generateTTSUrl,
    getCachedTTSUrl,
    playTTSFromUrl,
    stopTTS,
    pauseTTS,
    resumeTTS,
    clearTTSCache,
  };
}; 