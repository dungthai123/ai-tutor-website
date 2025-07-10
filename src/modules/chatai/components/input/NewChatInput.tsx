'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ChatInputBar } from './ChatInputBar';
import { RecordButton } from './RecordButton';
import { KeyboardToggle } from './KeyboardToggle';
import { HintButton } from './HintButton';
import { TextInput } from './TextInput';
import { HintBubble } from '../messages/HintBubble';
import { useAudioRecorder } from '../../hooks/audio/use-audio-recorder';
import { useSpeechToText } from '../../hooks/audio/use-speech-to-text';
import { useChat } from '../../hooks/chat/use-chat';
import { useChatStore } from '../../hooks/storage/chat-store';
import { useSpeechToTextContext } from '../../contexts/SpeechToTextContext';

export function NewChatInput() {
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');
  
  const { 
    state: recorderState, 
    startRecording, 
    stopRecording, 
    clearRecording 
  } = useAudioRecorder();
  
  const { transcribeAudio } = useSpeechToText();
  const { sendMessage, getHint, submitHint } = useChat();
  const { 
    isAwaitingResponse, 
    isOpenHint, 
    hintMessage 
  } = useChatStore();
  
  // Speech-to-text tracking
  const { markAsSpeechToText } = useSpeechToTextContext();

  const handleSendText = useCallback(async () => {
    if (!textInput.trim() || isAwaitingResponse) return;
    
    try {
      await sendMessage(textInput.trim());
      setTextInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [textInput, isAwaitingResponse, sendMessage]);

  const handleRecordButtonClick = useCallback(async () => {
    if (inputMode !== 'voice') return;
    
    if (recorderState.isRecording) {
      // Stop recording
      console.log('🛑 Stopping recording...');
      stopRecording();
    } else {
      // Start recording
      console.log('🎤 Starting recording...');
      try {
        await startRecording();
      } catch (error) {
        console.error('Failed to start recording:', error);
      }
    }
  }, [inputMode, recorderState.isRecording, startRecording, stopRecording]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle spacebar in voice mode and when not awaiting response
      if (event.code === 'Space' && inputMode === 'voice' && !isAwaitingResponse) {
        // Prevent default spacebar behavior (scrolling)
        event.preventDefault();
        
        // Don't trigger if user is typing in an input field
        const activeElement = document.activeElement;
        if (activeElement && (
          activeElement.tagName === 'INPUT' || 
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true'
        )) {
          return;
        }
        
        // Toggle recording
        handleRecordButtonClick();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputMode, isAwaitingResponse, handleRecordButtonClick]);

  // Handle recording completion
  React.useEffect(() => {
    if (!recorderState.isRecording && recorderState.audioBlob && recorderState.audioUrl) {
      console.log('🎯 Recording completed, processing...');
      
      const processRecording = async () => {
        try {
          const transcription = await transcribeAudio(recorderState.audioBlob!);
          if (transcription) {
            console.log('✅ Transcription successful:', transcription);
            
            // Mark this message as coming from speech-to-text
            markAsSpeechToText(transcription);
            
            await sendMessage(transcription, recorderState.audioUrl!);
            
            // Clear recording after successful send
            setTimeout(() => {
              clearRecording();
            }, 1000);
          }
        } catch (error) {
          console.error('Failed to transcribe and send audio:', error);
          // Clear recording on error to reset states
          clearRecording();
        }
      };
      
      processRecording();
    }
  }, [recorderState.isRecording, recorderState.audioBlob, recorderState.audioUrl, transcribeAudio, sendMessage, clearRecording, markAsSpeechToText]);

  const handleKeyboardToggle = useCallback(() => {
    setInputMode(prev => prev === 'voice' ? 'text' : 'voice');
  }, []);

  const handleHintRequest = useCallback(async () => {
    if (isOpenHint) return;
    
    try {
      await getHint();
    } catch (error) {
      console.error('Failed to get hint:', error);
    }
  }, [isOpenHint, getHint]);

  const handleSubmitHint = useCallback(() => {
    submitHint();
  }, [submitHint]);

  return (
    <ChatInputBar>
      {/* Hint Bubble */}
      <HintBubble
        isVisible={isOpenHint}
        hintMessage={hintMessage}
        onSubmit={handleSubmitHint}
      />

      {/* Text Input */}
      <TextInput
        value={textInput}
        onChange={setTextInput}
        onSend={handleSendText}
        disabled={isAwaitingResponse}
        isVisible={inputMode === 'text'}
      />

      {/* Record Button (center) */}
      <RecordButton
        isRecording={recorderState.isRecording}
        disabled={isAwaitingResponse || inputMode === 'text'}
        onClick={handleRecordButtonClick}
      />

      {/* Keyboard Toggle (bottom-right) */}
      <KeyboardToggle
        isActive={inputMode === 'text'}
        disabled={isAwaitingResponse}
        onClick={handleKeyboardToggle}
      />

      {/* Hint Button (bottom-right, next to keyboard) */}
      <HintButton
        isActive={isOpenHint}
        disabled={isAwaitingResponse}
        onClick={handleHintRequest}
      />
    </ChatInputBar>
  );
} 