"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAudioStore } from '../../hooks/storage/audio-store';
import { audioPlayerService } from '../../services/audio/audio-player.service';
import { AudioState } from '../../types';
import { cn } from '../../utils';

interface AudioPlayerProps {
  audioUrl?: string;
  audioBlob?: Blob;
  className?: string;
  compact?: boolean;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  audioBlob,
  className,
  compact = false,
  autoPlay = false,
  onPlay,
  onPause,
  onEnded,
}) => {
  const { audioState, setAudioState } = useAudioStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to audio player state changes
    const unsubscribe = audioPlayerService.subscribe('audio-player', (state: AudioState) => {
      setAudioState(state);
      
      if (state.isPlaying && !audioState.isPlaying) {
        onPlay?.();
      } else if (!state.isPlaying && audioState.isPlaying) {
        onPause?.();
      }
      
      // Check if audio ended
      if (state.currentTime >= state.duration && state.duration > 0 && !state.isPlaying) {
        onEnded?.();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setAudioState, audioState.isPlaying, onPlay, onPause, onEnded]);

  useEffect(() => {
    if (autoPlay && (audioUrl || audioBlob)) {
      handlePlay();
    }
  }, [autoPlay, audioUrl, audioBlob]);

  const handlePlay = async () => {
    if (!audioUrl && !audioBlob) return;

    setIsLoading(true);
    setError(null);

    try {
      if (audioBlob) {
        await audioPlayerService.playBlob(audioBlob);
      } else if (audioUrl) {
        await audioPlayerService.play(audioUrl);
      }
    } catch (err) {
      setError('Failed to play audio');
      console.error('Audio playback error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    try {
      await audioPlayerService.pause();
    } catch (err) {
      console.error('Audio pause error:', err);
    }
  };



  const handleVolumeChange = (volume: number) => {
    audioPlayerService.setVolume(volume);
  };

  const handleSeek = (time: number) => {
    // Note: Seeking would require additional implementation in audioPlayerService
    console.log('Seek to:', time);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = audioState.duration > 0 
    ? (audioState.currentTime / audioState.duration) * 100 
    : 0;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <button
          onClick={audioState.isPlaying ? handlePause : handlePlay}
          disabled={isLoading || (!audioUrl && !audioBlob)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : audioState.isPlaying ? (
            <Pause className="h-3 w-3" />
          ) : (
            <Play className="h-3 w-3 ml-0.5" />
          )}
        </button>
        
        {audioState.duration > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>{formatTime(audioState.currentTime)}</span>
            <span>/</span>
            <span>{formatTime(audioState.duration)}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('rounded-lg bg-gray-50 p-4', className)}>
      {/* Main Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={audioState.isPlaying ? handlePause : handlePlay}
          disabled={isLoading || (!audioUrl && !audioBlob)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : audioState.isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </button>

        {/* Progress and Time */}
        <div className="flex-1">
          {/* Progress Bar */}
          <div className="mb-1">
            <div 
              className="h-2 bg-gray-200 rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                const newTime = percentage * audioState.duration;
                handleSeek(newTime);
              }}
            >
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Time Display */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(audioState.currentTime)}</span>
            <span>{formatTime(audioState.duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVolumeChange(audioState.volume > 0 ? 0 : 1)}
            className="text-gray-500 hover:text-gray-700"
          >
            {audioState.volume > 0 ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audioState.volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}; 