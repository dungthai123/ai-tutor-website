import { create } from 'zustand';
import { AudioState, AudioRecorderState, BackgroundMusicState } from '../../types';

interface AudioStore {
  // Audio Player State
  audioState: AudioState;
  currentAudioUrl: string | null;
  currentMessageId: number | null;

  // Audio Recorder State
  recorderState: AudioRecorderState;

  // Background Music State
  backgroundMusicState: BackgroundMusicState;

  // TTS Global State
  isTTSPlaying: boolean;
  currentTTSMessageId: number | null;

  // Audio Player Actions
  setAudioState: (state: Partial<AudioState>) => void;
  setCurrentAudioUrl: (url: string | null) => void;
  setCurrentMessageId: (id: number | null) => void;
  resetAudioPlayer: () => void;

  // Audio Recorder Actions
  setRecorderState: (state: Partial<AudioRecorderState>) => void;
  startRecording: () => void;
  stopRecording: () => void;
  resetRecorder: () => void;

  // Background Music Actions
  setBackgroundMusicState: (state: Partial<BackgroundMusicState>) => void;
  toggleBackgroundMusic: () => void;
  setBackgroundVolume: (volume: number) => void;

  // TTS Actions
  setTTSPlaying: (playing: boolean, messageId?: number | null) => void;
  resetTTS: () => void;
}

const defaultAudioState: AudioState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,
};

const defaultRecorderState: AudioRecorderState = {
  isRecording: false,
  recordingTime: 0,
  isProcessing: false,
};

const defaultBackgroundMusicState: BackgroundMusicState = {
  isEnabled: false,
  isPlaying: false,
  volume: 0.4,
  currentTrack: '',
};

export const useAudioStore = create<AudioStore>((set) => ({
  // Initial States
  audioState: defaultAudioState,
  currentAudioUrl: null,
  currentMessageId: null,
  recorderState: defaultRecorderState,
  backgroundMusicState: defaultBackgroundMusicState,
  isTTSPlaying: false,
  currentTTSMessageId: null,

  // Audio Player Actions
  setAudioState: (state) =>
    set((prev) => ({
      audioState: { ...prev.audioState, ...state },
    })),

  setCurrentAudioUrl: (url) => set({ currentAudioUrl: url }),

  setCurrentMessageId: (id) => set({ currentMessageId: id }),

  resetAudioPlayer: () =>
    set({
      audioState: defaultAudioState,
      currentAudioUrl: null,
      currentMessageId: null,
    }),

  // Audio Recorder Actions
  setRecorderState: (state) =>
    set((prev) => ({
      recorderState: { ...prev.recorderState, ...state },
    })),

  startRecording: () =>
    set((prev) => ({
      recorderState: {
        ...prev.recorderState,
        isRecording: true,
        recordingTime: 0,
        audioBlob: undefined,
        audioUrl: undefined,
      },
    })),

  stopRecording: () =>
    set((prev) => ({
      recorderState: {
        ...prev.recorderState,
        isRecording: false,
      },
    })),

  resetRecorder: () =>
    set({
      recorderState: defaultRecorderState,
    }),

  // Background Music Actions
  setBackgroundMusicState: (state) =>
    set((prev) => ({
      backgroundMusicState: { ...prev.backgroundMusicState, ...state },
    })),

  toggleBackgroundMusic: () =>
    set((prev) => ({
      backgroundMusicState: {
        ...prev.backgroundMusicState,
        isPlaying: !prev.backgroundMusicState.isPlaying,
      },
    })),

  setBackgroundVolume: (volume) =>
    set((prev) => ({
      backgroundMusicState: {
        ...prev.backgroundMusicState,
        volume: Math.max(0, Math.min(1, volume)),
      },
    })),

  // TTS Actions
  setTTSPlaying: (playing, messageId = null) =>
    set({
      isTTSPlaying: playing,
      currentTTSMessageId: playing ? messageId : null,
    }),

  resetTTS: () =>
    set({
      isTTSPlaying: false,
      currentTTSMessageId: null,
    }),
})); 