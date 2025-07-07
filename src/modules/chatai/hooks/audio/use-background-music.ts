import { useCallback, useEffect, useRef } from 'react';
import { useAudioStore } from '../storage/audio-store';
import { useSettingsStore } from '../storage/settings-store';

export const useBackgroundMusic = () => {
  const {
    backgroundMusicState,
    setBackgroundMusicState,
    toggleBackgroundMusic: toggleStore,
    setBackgroundVolume,
  } = useAudioStore();

  const { isMusicBackgroundTurnOn } = useSettingsStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current && backgroundMusicState.currentTrack) {
      audioRef.current = new Audio(backgroundMusicState.currentTrack);
      audioRef.current.loop = true;
      audioRef.current.volume = backgroundMusicState.volume;

      // Handle audio events
      audioRef.current.addEventListener('canplay', () => {
        if (isMusicBackgroundTurnOn && backgroundMusicState.isEnabled) {
          audioRef.current?.play().catch(console.error);
        }
      });

      audioRef.current.addEventListener('play', () => {
        setBackgroundMusicState({ isPlaying: true });
      });

      audioRef.current.addEventListener('pause', () => {
        setBackgroundMusicState({ isPlaying: false });
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Background music error:', e);
        setBackgroundMusicState({ isPlaying: false });
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [backgroundMusicState.currentTrack, backgroundMusicState.isEnabled, backgroundMusicState.volume, isMusicBackgroundTurnOn, setBackgroundMusicState]);

  const playBackgroundMusic = useCallback(() => {
    if (audioRef.current && isMusicBackgroundTurnOn && backgroundMusicState.isEnabled && backgroundMusicState.currentTrack) {
      audioRef.current.play().catch(console.error);
    }
  }, [isMusicBackgroundTurnOn, backgroundMusicState.isEnabled, backgroundMusicState.currentTrack]);

  const pauseBackgroundMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resumeBackgroundMusic = useCallback(() => {
    if (audioRef.current && isMusicBackgroundTurnOn && backgroundMusicState.isEnabled && backgroundMusicState.currentTrack) {
      // Small delay to prevent audio conflicts
      setTimeout(() => {
        audioRef.current?.play().catch(console.error);
      }, 200);
    }
  }, [isMusicBackgroundTurnOn, backgroundMusicState.isEnabled, backgroundMusicState.currentTrack]);

  const toggleBackgroundMusic = useCallback(() => {
    if (backgroundMusicState.isPlaying) {
      pauseBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
    toggleStore();
  }, [backgroundMusicState.isPlaying, pauseBackgroundMusic, playBackgroundMusic, toggleStore]);

  const setVolume = useCallback(
    (volume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      if (audioRef.current) {
        audioRef.current.volume = clampedVolume;
      }
      setBackgroundVolume(clampedVolume);
    },
    [setBackgroundVolume]
  );

  const changeTrack = useCallback(
    (trackUrl: string) => {
      if (!trackUrl) {
        // If trackUrl is empty, just update state and don't create audio element
        setBackgroundMusicState({ currentTrack: trackUrl, isPlaying: false });
        return;
      }

      if (audioRef.current) {
        const wasPlaying = !audioRef.current.paused;
        audioRef.current.pause();
        audioRef.current.src = trackUrl;
        
        setBackgroundMusicState({ currentTrack: trackUrl });
        
        if (wasPlaying && isMusicBackgroundTurnOn) {
          audioRef.current.play().catch(console.error);
        }
      } else {
        // Create new audio element if none exists
        audioRef.current = new Audio(trackUrl);
        audioRef.current.loop = true;
        audioRef.current.volume = backgroundMusicState.volume;
        setBackgroundMusicState({ currentTrack: trackUrl });
      }
    },
    [isMusicBackgroundTurnOn, setBackgroundMusicState, backgroundMusicState.volume]
  );

  const muteBackgroundMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0;
    }
  }, []);

  const unmuteBackgroundMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.volume = backgroundMusicState.volume;
    }
  }, [backgroundMusicState.volume]);

  // Auto-manage based on settings
  useEffect(() => {
    if (!isMusicBackgroundTurnOn && backgroundMusicState.isPlaying) {
      pauseBackgroundMusic();
    } else if (isMusicBackgroundTurnOn && backgroundMusicState.isEnabled && !backgroundMusicState.isPlaying) {
      playBackgroundMusic();
    }
  }, [isMusicBackgroundTurnOn, backgroundMusicState.isEnabled, backgroundMusicState.isPlaying, pauseBackgroundMusic, playBackgroundMusic]);

  return {
    // State
    isPlaying: backgroundMusicState.isPlaying,
    isEnabled: backgroundMusicState.isEnabled,
    volume: backgroundMusicState.volume,
    currentTrack: backgroundMusicState.currentTrack,

    // Actions
    playBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    toggleBackgroundMusic,
    setVolume,
    changeTrack,
    muteBackgroundMusic,
    unmuteBackgroundMusic,
  };
}; 