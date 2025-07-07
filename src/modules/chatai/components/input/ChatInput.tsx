"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Keyboard, Send, HelpCircle } from 'lucide-react';
import { VoiceRecorder } from '../audio/VoiceRecorder';
import { useSpeechToText } from '../../hooks/audio/use-speech-to-text';
import { useChat } from '../../hooks/chat/use-chat';
import { useChatStore } from '../../hooks/storage/chat-store';
import { cn } from '../../utils';

interface ChatInputProps {
  placeholder?: string;
  disabled?: boolean;
  showHintButton?: boolean;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = "Type your message...",
  disabled = false,
  showHintButton = true,
  className,
}) => {
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { transcribeAudio, isTranscribing } = useSpeechToText();
  const { sendMessage, getHint, submitHint } = useChat();
  const { 
    isAwaitingResponse, 
    isOpenHint, 
    hintMessage, 
    isShowKeyboard,
    toggleKeyboard 
  } = useChatStore();

  const handleSendText = useCallback(async () => {
    console.log('📝 ChatInput handleSendText called with:', { 
      textInput, 
      textInputLength: textInput.length,
      disabled, 
      isAwaitingResponse 
    });
    
    if (!textInput.trim() || disabled || isAwaitingResponse) {
      console.warn('⚠️ Cannot send message:', { 
        hasText: !!textInput.trim(), 
        disabled, 
        isAwaitingResponse 
      });
      return;
    }
    
    try {
      console.log('🚀 Sending message from ChatInput:', textInput.trim());
      await sendMessage(textInput.trim());
      console.log('✅ Message sent successfully, clearing input');
      setTextInput('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('💥 Failed to send message:', error);
    }
  }, [textInput, disabled, isAwaitingResponse, sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  }, [handleSendText]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, []);

  const handleVoiceRecordingComplete = useCallback(async (audioBlob: Blob, audioUrl: string) => {
    console.log('🎤 Voice recording completed, starting transcription...');
    try {
      const transcription = await transcribeAudio(audioBlob);
      if (transcription) {
        console.log('✅ Transcription successful:', transcription);
        await sendMessage(transcription, audioUrl);
        console.log('📨 Message sent successfully');
      }
    } catch (error) {
      console.error('Failed to transcribe and send audio:', error);
    }
  }, [transcribeAudio, sendMessage]);

  const handleRecordingStart = useCallback(() => {
    setIsRecording(true);
  }, []);

  const handleRecordingStop = useCallback(() => {
    setIsRecording(false);
  }, []);

  const toggleInputMode = useCallback(() => {
    setInputMode(prev => prev === 'text' ? 'voice' : 'text');
  }, []);

  const handleHintRequest = useCallback(async () => {
    if (isOpenHint) {
      // If hint is already open, close it
      return;
    }
    
    try {
      await getHint();
    } catch (error) {
      console.error('Failed to get hint:', error);
    }
  }, [isOpenHint, getHint]);

  const handleSubmitHint = useCallback(() => {
    console.log('💡 ChatInput handleSubmitHint called');
    submitHint();
  }, [submitHint]);

  const handleKeyboardToggle = useCallback(() => {
    toggleKeyboard();
    if (!isShowKeyboard) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isShowKeyboard, toggleKeyboard]);



  return (
    <div className={cn('space-y-4', className)}>
      {/* Hint Bubble */}
      <AnimatePresence>
        {isOpenHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-blue-500 rounded-2xl p-4 mx-12 text-white relative"
          >
            {hintMessage ? (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p>{hintMessage.original}</p>
                  {hintMessage.segments && hintMessage.segments.length > 0 && (
                    <div className="mt-2 text-sm text-blue-100">
                      {hintMessage.segments.map((segment, index) => (
                        <span key={index} className="mr-2">
                          {segment.word}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSubmitHint}
                  className="ml-3 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                <span className="ml-2">Getting hint...</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Button Row */}
      {showHintButton && (
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            {isOpenHint && hintMessage && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleSubmitHint}
                className="p-2 bg-blue-500 text-white rounded-full shadow-lg"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            )}

            <button
              onClick={handleHintRequest}
              disabled={disabled || isAwaitingResponse}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isOpenHint
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200',
                (disabled || isAwaitingResponse) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isOpenHint ? (
                <HelpCircle className="h-4 w-4" />
              ) : (
                'Help me reply'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="flex items-end gap-3">
        {/* Mode Toggle Button */}
        <button
          onClick={inputMode === 'text' ? toggleInputMode : handleKeyboardToggle}
          disabled={disabled || isRecording || isAwaitingResponse}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={inputMode === 'text' ? 'Switch to voice input' : 'Switch to text input'}
        >
          {inputMode === 'text' ? (
            <Mic className="h-5 w-5" />
          ) : (
            <Keyboard className="h-5 w-5" />
          )}
        </button>

        {/* Input Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {inputMode === 'text' ? (
              <motion.div
                key="text-input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-end gap-2"
              >
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={textInput}
                    onChange={handleTextareaChange}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    disabled={disabled || isAwaitingResponse}
                    className="w-full min-h-[48px] max-h-[120px] resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    rows={1}
                  />
                  
                  {/* Send Button */}
                  <button
                    onClick={handleSendText}
                    disabled={!textInput.trim() || disabled || isAwaitingResponse}
                    className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="voice-input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <VoiceRecorder
                  onRecordingComplete={handleVoiceRecordingComplete}
                  onRecordingStart={handleRecordingStart}
                  onRecordingStop={handleRecordingStop}
                  showPlayback={false}
                  autoReset={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Status Indicators */}
      {(isTranscribing || isRecording || isAwaitingResponse) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center justify-center gap-2 text-sm text-gray-600"
        >
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span>
            {isRecording 
              ? 'Recording...' 
              : isTranscribing 
              ? 'Processing speech...' 
              : 'AI is thinking...'}
          </span>
        </motion.div>
      )}
    </div>
  );
}; 