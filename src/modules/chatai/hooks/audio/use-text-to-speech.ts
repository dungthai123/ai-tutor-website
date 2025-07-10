import { useCallback } from 'react';
import { textToSpeechService } from '../../services/audio/text-to-speech.service';
import { audioPlayerService } from '../../services/audio/audio-player.service';
import { useAudioStore } from '../storage/audio-store';

export const useTextToSpeech = () => {
  const { setCurrentAudioUrl, setCurrentMessageId, setTTSPlaying, resetTTS } = useAudioStore();

  const playTTS = useCallback(
    async (text: string, speechRate: number = 1.0, messageId?: number) => {
      try {
        // Set global TTS playing state
        setTTSPlaying(true, messageId);
        
        const blob = await textToSpeechService.generateSpeech(text, speechRate);
        
        if (messageId) {
          setCurrentMessageId(messageId);
        }
        
        await audioPlayerService.playBlob(blob);
        
        // Reset TTS state when playback completes
        setTTSPlaying(false);
      } catch (error) {
        console.error('Failed to play TTS:', error);
        setTTSPlaying(false);
        throw error;
      }
    },
    [setCurrentMessageId, setTTSPlaying]
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
        // Set global TTS playing state
        setTTSPlaying(true, messageId);
        
        if (messageId) {
          setCurrentMessageId(messageId);
        }
        
        setCurrentAudioUrl(url);
        await audioPlayerService.play(url);
        
        // Reset TTS state when playback completes
        setTTSPlaying(false);
      } catch (error) {
        console.error('Failed to play TTS from URL:', error);
        setTTSPlaying(false);
        throw error;
      }
    },
    [setCurrentAudioUrl, setCurrentMessageId, setTTSPlaying]
  );

  const stopTTS = useCallback(async () => {
    try {
      await audioPlayerService.stop();
      setCurrentAudioUrl(null);
      setCurrentMessageId(null);
      // Reset global TTS state
      resetTTS();
    } catch (error) {
      console.error('Failed to stop TTS:', error);
      resetTTS(); // Still reset state even if stop fails
    }
  }, [setCurrentAudioUrl, setCurrentMessageId, resetTTS]);

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