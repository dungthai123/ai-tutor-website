'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SettingsState } from '../../types';

interface SettingsStoreState extends SettingsState {
  // Actions
  setSeparateWordOn: (on: boolean) => void;
  setMusicBackgroundTurnOn: (on: boolean) => void;
  setSpeechRate: (rate: number) => void;
  setFontSize: (size: number) => void;
  setAutoPlayTTS: (auto: boolean) => void;
  setLanguage: (language: string) => void;
  resetSettings: () => void;
}

const defaultSettings: SettingsState = {
  isSeparateWordOn: false,
  isMusicBackgroundTurnOn: true,
  selectedSpeechRate: 1.0,
  selectedFontSize: 16.0,
  isAutoPlayTTS: true,
  language: 'vi',
};

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setSeparateWordOn: (on) => set({ isSeparateWordOn: on }),
      setMusicBackgroundTurnOn: (on) => set({ isMusicBackgroundTurnOn: on }),
      setSpeechRate: (rate) => set({ selectedSpeechRate: rate }),
      setFontSize: (size) => set({ selectedFontSize: size }),
      setAutoPlayTTS: (auto) => set({ isAutoPlayTTS: auto }),
      setLanguage: (language) => set({ language }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'chatai-settings',
    }
  )
); 