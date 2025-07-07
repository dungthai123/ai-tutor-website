import { useCallback, useRef, useEffect } from 'react';
import { useAudioStore } from '../storage/audio-store';

export const useAudioRecorder = () => {
  const {
    recorderState,
    setRecorderState,
    startRecording: startRecordingStore,
    stopRecording: stopRecordingStore,
    resetRecorder,
  } = useAudioStore();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // Choose the best available audio format
      const mimeType = MediaRecorder.isTypeSupported('audio/mp4;codecs=mp4a.40.2')
        ? 'audio/mp4;codecs=mp4a.40.2'
        : MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        console.log('🎬 MediaRecorder stopped, processing audio...');
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        console.log('📦 Audio blob created:', { size: audioBlob.size, type: audioBlob.type });

        setRecorderState({
          audioBlob,
          audioUrl,
          isRecording: false,
          isProcessing: false,
        });

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      // Handle errors
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setRecorderState({ 
          isRecording: false, 
          isProcessing: false 
        });
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      startRecordingStore();

      // Start timer
      let currentTime = 0;
      timerRef.current = setInterval(() => {
        currentTime += 1;
        setRecorderState({
          recordingTime: currentTime,
        });
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      setRecorderState({ 
        isRecording: false, 
        isProcessing: false 
      });
      throw error;
    }
  }, [setRecorderState, startRecordingStore]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recorderState.isRecording) {
      setRecorderState({ isProcessing: true });
      mediaRecorderRef.current.stop();
      stopRecordingStore();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [recorderState.isRecording, setRecorderState, stopRecordingStore]);

  const clearRecording = useCallback(() => {
    if (recorderState.audioUrl) {
      URL.revokeObjectURL(recorderState.audioUrl);
    }

    resetRecorder();
    chunksRef.current = [];
  }, [recorderState.audioUrl, resetRecorder]);

  const getUniqueFileName = useCallback(() => {
    const timestamp = Date.now();
    return `recording_${timestamp}.m4a`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recorderState.audioUrl) {
        URL.revokeObjectURL(recorderState.audioUrl);
      }
    };
  }, [recorderState.audioUrl]);

  return {
    // State
    state: recorderState,
    isRecording: recorderState.isRecording,
    recordingTime: recorderState.recordingTime,
    audioBlob: recorderState.audioBlob,
    audioUrl: recorderState.audioUrl,
    isProcessing: recorderState.isProcessing,

    // Actions
    startRecording,
    stopRecording,
    clearRecording,
    getUniqueFileName,
  };
}; 