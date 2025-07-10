import { useCallback, useRef, useEffect } from 'react';
import { useAudioStore } from '../storage/audio-store';
import { useTextToSpeech } from './use-text-to-speech';

export const useAudioRecorder = () => {
  const {
    recorderState,
    setRecorderState,
    startRecording: startRecordingStore,
    stopRecording: stopRecordingStore,
    resetRecorder,
  } = useAudioStore();

  const { stopTTS } = useTextToSpeech();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mimeTypeRef = useRef<string>('');
  const fileExtensionRef = useRef<string>('');

  const startRecording = useCallback(async () => {
    try {
      // Stop any playing TTS audio before starting recording
      console.log('🔇 Stopping TTS audio before recording...');
      await stopTTS();

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

      // Choose the best available audio format supported by OpenAI Whisper
      // Priority: webm (opus) > mp4 > wav
      let mimeType: string;
      let fileExtension: string;

      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
        fileExtension = 'webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
        fileExtension = 'm4a';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
        fileExtension = 'webm';
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
        fileExtension = 'wav';
      } else {
        // Fallback to default
        mimeType = 'audio/webm';
        fileExtension = 'webm';
      }

      // Store the format info for later use
      mimeTypeRef.current = mimeType;
      fileExtensionRef.current = fileExtension;

      console.log('🎤 Using audio format:', { mimeType, fileExtension });

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
        const audioBlob = new Blob(chunksRef.current, { type: mimeTypeRef.current });
        const audioUrl = URL.createObjectURL(audioBlob);

        console.log('📦 Audio blob created:', { 
          size: audioBlob.size, 
          type: audioBlob.type,
          extension: fileExtensionRef.current 
        });

        setRecorderState({
          audioBlob,
          audioUrl,
          isRecording: false,
          isProcessing: false,
          mimeType: mimeTypeRef.current,
          fileExtension: fileExtensionRef.current,
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
  }, [setRecorderState, startRecordingStore, stopTTS]);

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
    mimeTypeRef.current = '';
    fileExtensionRef.current = '';
  }, [recorderState.audioUrl, resetRecorder]);

  const getUniqueFileName = useCallback(() => {
    const timestamp = Date.now();
    const extension = fileExtensionRef.current || 'webm';
    return `recording_${timestamp}.${extension}`;
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