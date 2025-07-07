import { AudioState, AudioPlayerEvents } from '../../types';

class AudioPlayerService {
  private audio: HTMLAudioElement | null = null;
  private listeners: Map<string, (state: AudioState) => void> = new Map();
  private eventHandlers: AudioPlayerEvents = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.setupEventListeners();
    }
  }

  private setupEventListeners() {
    if (!this.audio) return;

    this.audio.addEventListener('loadedmetadata', () => {
      this.notifyListeners();
      this.eventHandlers.onDurationChange?.(this.audio!.duration);
    });

    this.audio.addEventListener('timeupdate', () => {
      this.notifyListeners();
      this.eventHandlers.onTimeUpdate?.(this.audio!.currentTime);
    });

    this.audio.addEventListener('ended', () => {
      this.notifyListeners();
      this.eventHandlers.onEnded?.();
    });

    this.audio.addEventListener('play', () => {
      this.notifyListeners();
      this.eventHandlers.onPlay?.();
    });

    this.audio.addEventListener('pause', () => {
      this.notifyListeners();
      this.eventHandlers.onPause?.();
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      this.eventHandlers.onError?.(new Error('Audio playback failed'));
    });
  }

  private notifyListeners() {
    if (!this.audio) return;

    const state: AudioState = {
      isPlaying: !this.audio.paused,
      currentTime: this.audio.currentTime,
      duration: this.audio.duration || 0,
      volume: this.audio.volume,
      playbackRate: this.audio.playbackRate,
    };

    this.listeners.forEach((listener) => listener(state));
  }

  subscribe(id: string, listener: (state: AudioState) => void) {
    this.listeners.set(id, listener);
    return () => this.listeners.delete(id);
  }

  setEventHandlers(handlers: AudioPlayerEvents) {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  async play(src: string): Promise<void> {
    if (!this.audio) return;

    try {
      if (this.audio.src !== src) {
        this.audio.src = src;
      }
      await this.audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  async playBlob(blob: Blob): Promise<void> {
    if (!this.audio) return;

    try {
      const url = URL.createObjectURL(blob);
      this.audio.src = url;
      await this.audio.play();

      // Clean up blob URL when audio ends
      this.audio.addEventListener(
        'ended',
        () => {
          URL.revokeObjectURL(url);
        },
        { once: true }
      );
    } catch (error) {
      console.error('Failed to play audio blob:', error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    if (!this.audio) return;
    this.audio.pause();
  }

  async resume(): Promise<void> {
    if (!this.audio) return;
    try {
      await this.audio.play();
    } catch (error) {
      console.error('Failed to resume audio:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  setVolume(volume: number): void {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, volume));
    this.notifyListeners();
  }

  setPlaybackRate(rate: number): void {
    if (!this.audio) return;
    this.audio.playbackRate = rate;
    this.notifyListeners();
  }

  seekTo(time: number): void {
    if (!this.audio) return;
    this.audio.currentTime = time;
    this.notifyListeners();
  }

  getCurrentState(): AudioState {
    if (!this.audio) {
      return {
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        playbackRate: 1,
      };
    }

    return {
      isPlaying: !this.audio.paused,
      currentTime: this.audio.currentTime,
      duration: this.audio.duration || 0,
      volume: this.audio.volume,
      playbackRate: this.audio.playbackRate,
    };
  }

  dispose(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.listeners.clear();
      this.eventHandlers = {};
    }
  }
}

export const audioPlayerService = new AudioPlayerService(); 