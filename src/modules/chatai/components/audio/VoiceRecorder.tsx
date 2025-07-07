"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Trash2 } from 'lucide-react';
import { useAudioRecorder } from '../../hooks/audio/use-audio-recorder';
import { AudioPlayer } from './AudioPlayer';
import { cn } from '../../utils';

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, audioUrl: string) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  className?: string;
  maxDuration?: number; // in seconds
  showPlayback?: boolean;
  autoReset?: boolean; // Automatically reset after completion
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
  className,
  maxDuration = 300, // 5 minutes default
  showPlayback = true,
  autoReset = false,
}) => {
  const {
    state: recorderState,
    startRecording,
    stopRecording,
    clearRecording,
  } = useAudioRecorder();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const onRecordingCompleteRef = useRef(onRecordingComplete);
  const hasCalledCompleteRef = useRef(false);

  useEffect(() => {
    // Check microphone permission
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => setHasPermission(true))
        .catch(() => setHasPermission(false));
    } else {
      setHasPermission(false);
    }
  }, []);

  useEffect(() => {
    // Auto-stop recording when max duration is reached
    if (recorderState.isRecording && recorderState.recordingTime >= maxDuration) {
      handleStopRecording();
    }
  }, [recorderState.isRecording, recorderState.recordingTime, maxDuration]);

  // Update ref when callback changes
  useEffect(() => {
    onRecordingCompleteRef.current = onRecordingComplete;
  }, [onRecordingComplete]);

  // Reset completion flag when recording starts
  useEffect(() => {
    if (recorderState.isRecording) {
      hasCalledCompleteRef.current = false;
    }
  }, [recorderState.isRecording]);

  useEffect(() => {
    // Call completion callback when recording is finished (only once per recording)
    if (!recorderState.isRecording && 
        recorderState.audioBlob && 
        recorderState.audioUrl && 
        !hasCalledCompleteRef.current) {
      console.log('🎯 Recording completed, calling completion callback...');
      hasCalledCompleteRef.current = true;
      onRecordingCompleteRef.current?.(recorderState.audioBlob, recorderState.audioUrl);
      
      // Auto-reset if enabled
      if (autoReset) {
        console.log('🔄 Auto-resetting recording state...');
        setTimeout(() => {
          clearRecording();
          setError(null);
          hasCalledCompleteRef.current = false;
        }, 1000); // Small delay to allow processing
      }
    }
  }, [recorderState.isRecording, recorderState.audioBlob, recorderState.audioUrl, autoReset]);

  const handleStartRecording = async () => {
    console.log('🎤 Starting recording...');
    if (hasPermission === false) {
      setError('Microphone permission denied. Please enable microphone access.');
      return;
    }

    setError(null);
    hasCalledCompleteRef.current = false; // Reset completion flag
    try {
      await startRecording();
      console.log('✅ Recording started successfully');
      onRecordingStart?.();
    } catch (err) {
      setError('Failed to start recording. Please check your microphone.');
      console.error('Recording start error:', err);
    }
  };

  const handleStopRecording = () => {
    console.log('⏹️ Stopping recording...');
    stopRecording();
    console.log('✅ Recording stopped');
    onRecordingStop?.();
  };

  const handleClearRecording = () => {
    console.log('🗑️ Clearing recording...');
    clearRecording();
    setError(null);
    hasCalledCompleteRef.current = false;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingProgress = (): number => {
    return maxDuration > 0 ? (recorderState.recordingTime / maxDuration) * 100 : 0;
  };

  if (hasPermission === false) {
    return (
      <div className={cn('rounded-lg bg-red-50 border border-red-200 p-4', className)}>
        <div className="flex items-center gap-3">
          <MicOff className="h-5 w-5 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-800">Microphone Access Required</p>
            <p className="text-xs text-red-600">Please enable microphone permissions to record audio.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Recording Interface */}
      <div className="rounded-lg bg-white border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* Recording Button */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={recorderState.isRecording ? handleStopRecording : handleStartRecording}
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-full transition-colors',
                recorderState.isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              )}
              whileTap={{ scale: 0.95 }}
              animate={recorderState.isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={recorderState.isRecording ? { repeat: Infinity, duration: 1 } : {}}
            >
              {recorderState.isRecording ? (
                <Square className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </motion.button>

            {/* Recording Status */}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {recorderState.isRecording ? 'Recording...' : 'Ready to Record'}
              </p>
              {recorderState.isRecording && (
                <p className="text-xs text-gray-500">
                  Tap to stop recording
                </p>
              )}
            </div>
          </div>

          {/* Time Display */}
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-gray-900">
              {formatTime(recorderState.recordingTime)}
            </div>
            {maxDuration > 0 && (
              <div className="text-xs text-gray-500">
                Max: {formatTime(maxDuration)}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar (when recording) */}
        <AnimatePresence>
          {recorderState.isRecording && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${getRecordingProgress()}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${getRecordingProgress()}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recording Visualization */}
        <AnimatePresence>
          {recorderState.isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center justify-center gap-1"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-red-500 rounded-full"
                  animate={{
                    height: [4, 20, 4],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Playback Section */}
      {showPlayback && recorderState.audioUrl && !recorderState.isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-gray-50 border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Recording Preview</h3>
            <button
              onClick={handleClearRecording}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>

          <AudioPlayer
            audioUrl={recorderState.audioUrl}
            compact={true}
          />
        </motion.div>
      )}
    </div>
  );
}; 