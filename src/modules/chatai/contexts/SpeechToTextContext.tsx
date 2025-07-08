'use client';

import React, { createContext, useContext } from 'react';
import { useSpeechToTextTracker } from '../hooks/useSpeechToTextTracker';

interface SpeechToTextContextType {
  markAsSpeechToText: (messageContent: string) => void;
  isSpeechToTextMessage: (messageContent: string) => boolean;
  clearTrackedMessages: () => void;
}

const SpeechToTextContext = createContext<SpeechToTextContextType | undefined>(undefined);

export function SpeechToTextProvider({ children }: { children: React.ReactNode }) {
  const tracker = useSpeechToTextTracker();

  return (
    <SpeechToTextContext.Provider value={tracker}>
      {children}
    </SpeechToTextContext.Provider>
  );
}

export function useSpeechToTextContext() {
  const context = useContext(SpeechToTextContext);
  if (context === undefined) {
    throw new Error('useSpeechToTextContext must be used within a SpeechToTextProvider');
  }
  return context;
} 