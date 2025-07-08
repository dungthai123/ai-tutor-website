'use client';

import { useCallback, useRef } from 'react';

export function useSpeechToTextTracker() {
  const speechToTextMessagesRef = useRef<Set<string>>(new Set());
  const processedMessagesRef = useRef<Set<string>>(new Set());

  // Mark a message as coming from speech-to-text
  const markAsSpeechToText = useCallback((messageContent: string) => {
    speechToTextMessagesRef.current.add(messageContent);
    console.log('🎤 Marked message as speech-to-text:', messageContent);
  }, []);

  // Check if a message came from speech-to-text (and mark as processed)
  const isSpeechToTextMessage = useCallback((messageContent: string): boolean => {
    const isSpeech = speechToTextMessagesRef.current.has(messageContent);
    
    if (isSpeech) {
      // Check if we've already processed this message
      if (processedMessagesRef.current.has(messageContent)) {
        console.log('🔄 Message already processed, skipping:', messageContent);
        return false;
      }
      
      // Mark as processed and remove from speech tracking
      processedMessagesRef.current.add(messageContent);
      speechToTextMessagesRef.current.delete(messageContent);
      
      console.log('✅ Speech-to-text message ready for processing:', messageContent);
      return true;
    }
    
    return false;
  }, []);

  // Clear all tracked messages (useful for cleanup)
  const clearTrackedMessages = useCallback(() => {
    speechToTextMessagesRef.current.clear();
    processedMessagesRef.current.clear();
  }, []);

  return {
    markAsSpeechToText,
    isSpeechToTextMessage,
    clearTrackedMessages,
  };
} 