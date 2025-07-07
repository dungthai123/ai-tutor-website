"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Play, Pause, Settings } from 'lucide-react';
import { useBackgroundMusic } from '../../hooks/audio/use-background-music';
import { cn } from '../../utils';

interface BackgroundMusicProps {
  className?: string;
  compact?: boolean;
  showTrackSelection?: boolean;
}

const AVAILABLE_TRACKS: Array<{
  id: string;
  name: string;
  url: string;
}> = [
  // Audio files not currently available
  // Add audio files to /public/audios/ directory and uncomment below:
  // {
  //   id: 'default',
  //   name: 'Ambient Calm',
  //   url: '/audios/audio_background_chatgpt.mp3',
  // },
  // {
  //   id: 'nature',
  //   name: 'Nature Sounds',
  //   url: '/audios/nature_ambient.mp3',
  // },
  // {
  //   id: 'piano',
  //   name: 'Soft Piano',
  //   url: '/audios/piano_ambient.mp3',
  // },
];

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  className,
  compact = false,
  showTrackSelection = false,
}) => {
  const {
    isPlaying,
    isEnabled,
    volume,
    currentTrack,
    toggleBackgroundMusic,
    setVolume,
    changeTrack,
  } = useBackgroundMusic();

  const [showControls, setShowControls] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(currentTrack || AVAILABLE_TRACKS[0].url);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleTrackChange = (trackUrl: string) => {
    setSelectedTrack(trackUrl);
    changeTrack(trackUrl);
  };

  const getCurrentTrackName = () => {
    const track = AVAILABLE_TRACKS.find(t => t.url === currentTrack);
    return track ? track.name : 'No audio available';
  };

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <button
          onClick={toggleBackgroundMusic}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
            isPlaying && isEnabled
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          )}
          title={isPlaying ? 'Pause background music' : 'Play background music'}
        >
          {isPlaying && isEnabled ? (
            <Pause className="h-3 w-3" />
          ) : (
            <Music className="h-3 w-3" />
          )}
        </button>

        {isEnabled && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            title="Background music volume"
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Main Control Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-full transition-colors',
            isPlaying && isEnabled ? 'bg-blue-100' : 'bg-gray-100'
          )}>
            <Music className={cn(
              'h-4 w-4',
              isPlaying && isEnabled ? 'text-blue-600' : 'text-gray-600'
            )} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Background Music</h3>
            <p className="text-xs text-gray-500">
              {isEnabled ? getCurrentTrackName() : 'Disabled'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleBackgroundMusic}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
              isPlaying && isEnabled
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            )}
          >
            {isPlaying && isEnabled ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3 ml-0.5" />
            )}
          </button>

          {showTrackSelection && (
            <button
              onClick={() => setShowControls(!showControls)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <Settings className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Volume Control */}
      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleVolumeChange(volume > 0 ? 0 : 0.5)}
              className="text-gray-500 hover:text-gray-700"
            >
              {volume > 0 ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>

            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <span className="text-xs text-gray-500 w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </motion.div>
      )}

      {/* Track Selection */}
      <AnimatePresence>
        {showControls && showTrackSelection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-xs font-medium text-gray-700">Select Track</h4>
            <div className="space-y-1">
              {AVAILABLE_TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackChange(track.url)}
                  className={cn(
                    'w-full text-left px-3 py-2 text-xs rounded-md transition-colors',
                    selectedTrack === track.url
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {track.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className={cn(
          'w-2 h-2 rounded-full',
          isPlaying && isEnabled ? 'bg-green-500' : 'bg-gray-300'
        )} />
        <span>
          {isPlaying && isEnabled ? 'Playing' : 'Stopped'}
        </span>
      </div>
    </div>
  );
}; 