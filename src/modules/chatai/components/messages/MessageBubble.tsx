"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Volume2, Play, Sparkles } from 'lucide-react';
import { ChatMessage } from '../../types';
import { PronunciationDisplay } from '../audio/PronunciationDisplay';
import { useTextToSpeech } from '../../hooks/audio/use-text-to-speech';
import { useTranslation } from '../../hooks/api/use-translation';
import { useChatStore } from '../../hooks/storage/chat-store';
import { useSettingsStore } from '../../hooks/storage/settings-store';
import { useAudioStore } from '../../hooks/storage/audio-store';
import { cn } from '../../utils';
import { useChat } from '../../hooks/chat/use-chat';
import { TextSegmentWrapper } from '@/modules/text-segment/components/TextSegmentWrapper';

interface MessageBubbleProps {
  message: ChatMessage;
  className?: string;
  showActions?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  className,
  showActions = true,
}) => {
  const { playTTS, stopTTS } = useTextToSpeech();
  const { translateText, isTranslating } = useTranslation();
  const { selectedFontSize, isSeparateWordOn } = useSettingsStore();
  const { isTTSPlaying, currentTTSMessageId } = useAudioStore();
  const {
    showTranslatedText,
    showImprovedText,
    showPronunciationAssessment,
    setShowTranslatedText,
    setShowImprovedText,
    updateMessage,
    loadingStates,
  } = useChatStore();
  const { improveMessage } = useChat();

  // Check if this specific message is currently playing TTS
  const isThisMessagePlayingTTS = isTTSPlaying && currentTTSMessageId === message.id;

  const handlePlayTTS = async () => {
    if (isThisMessagePlayingTTS) {
      await stopTTS();
      return;
    }

    try {
      await playTTS(message.content.original, 1.0, message.id);
    } catch (error) {
      console.error('Failed to play TTS:', error);
    }
  };

  const handleTranslate = async () => {
    if (message.translate) {
      // Toggle visibility if translation already exists
      setShowTranslatedText(message.id, !showTranslatedText[message.id]);
      return;
    }

    try {
      const translation = await translateText(message.content.original);
      if (translation) {
        updateMessage(message.id, { translate: translation });
        setShowTranslatedText(message.id, true);
      }
    } catch (error) {
      console.error('Failed to translate message:', error);
    }
  };

  const handlePlayRecordedAudio = async () => {
    if (message.pathRecord) {
      try {
        const audio = new Audio(message.pathRecord);
        await audio.play();
      } catch (error) {
        console.error('Failed to play recorded audio:', error);
      }
    }
  };

  const handleImprove = async () => {
    if (message.suggestContent) {
      // Toggle visibility if improvement already exists
      setShowImprovedText(message.id, !showImprovedText[message.id]);
      return;
    }

    try {
      await improveMessage(message.id);
    } catch (error) {
      console.error('Failed to improve message:', error);
    }
  };

  const renderSegmentedText = () => {
    if (!isSeparateWordOn) {
      return <span>{message.content.original}</span>;
    }

    return (
      <TextSegmentWrapper
        text={message.content.original}
        showPinyin={true}
        className="flex flex-wrap gap-1"
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn('flex w-full', className)}
    >
      <div className="flex w-full flex-col">
        {/* Main Message Bubble */}
        <div className={cn(
          'flex w-full',
          message.isUserMessage ? 'justify-end' : 'justify-start'
        )}>
          <div className={cn(
            'relative max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
            message.isUserMessage
              ? 'bg-blue-500 text-white ml-12'
              : 'bg-white text-gray-800 mr-12 border border-gray-200'
          )}>
            {/* Message Content */}
            <div 
              className="mb-2"
              style={{ fontSize: `${selectedFontSize}px` }}
            >
              {renderSegmentedText()}
            </div>

            {/* Timestamp */}
            <div className={cn(
              'text-xs',
              message.isUserMessage ? 'text-blue-100' : 'text-gray-500'
            )}>
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>

            {/* Action Buttons */}
            {showActions && (
              <div className={cn(
                'flex items-center gap-2 mt-2',
                message.isUserMessage ? 'justify-end' : 'justify-start'
              )}>
                {/* Play Recorded Audio Button (User messages with audio) */}
                {message.isUserMessage && message.pathRecord && (
                  <button
                    onClick={handlePlayRecordedAudio}
                    className={cn(
                      'p-1 rounded-full transition-colors',
                      'hover:bg-blue-600 text-blue-100 hover:text-white'
                    )}
                    title="Play recorded audio"
                  >
                    <Play className="h-3 w-3" />
                  </button>
                )}

                {/* TTS Button */}
                <button
                  onClick={handlePlayTTS}
                  disabled={isThisMessagePlayingTTS}
                  className={cn(
                    'p-1 rounded-full transition-colors',
                    message.isUserMessage
                      ? 'hover:bg-blue-600 text-blue-100 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  )}
                  title="Play audio"
                >
                  {isThisMessagePlayingTTS ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Volume2 className="h-3 w-3" />
                  )}
                </button>

                {/* Improvement Button (User messages only) */}
                {message.isUserMessage && (
                  <button
                    onClick={handleImprove}
                    disabled={loadingStates.isImproving[message.id]}
                    className={cn(
                      'p-1 rounded-full transition-colors',
                      showImprovedText[message.id]
                        ? 'bg-green-500 text-white'
                        : 'hover:bg-blue-600 text-blue-100 hover:text-white'
                    )}
                    title="Improve message"
                  >
                    {loadingStates.isImproving[message.id] ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                  </button>
                )}

                {/* Translation Button */}
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className={cn(
                    'p-1 rounded-full transition-colors',
                    showTranslatedText[message.id]
                      ? 'bg-yellow-500 text-white'
                      : message.isUserMessage
                      ? 'hover:bg-blue-600 text-blue-100 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  )}
                  title="Translate"
                >
                  {isTranslating ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Languages className="h-3 w-3" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Translation Display */}
        <AnimatePresence>
          {showTranslatedText[message.id] && message.translate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                'mt-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200',
                message.isUserMessage ? 'ml-12' : 'mr-12'
              )}
            >
              <div className="text-sm text-yellow-800">
                <span className="font-medium">Translation:</span>
                <p className="mt-1">{message.translate}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Improvement Display */}
        <AnimatePresence>
          {showImprovedText[message.id] && message.suggestContent && message.isUserMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 ml-12 p-3 rounded-lg bg-green-50 border border-green-200"
            >
              <div className="text-sm text-green-800">
                <span className="font-medium">Suggestion:</span>
                <p className="mt-1">{message.suggestContent.improvedFeedback}</p>
                {message.suggestContent.commentFeedback && (
                  <div className="mt-2 text-xs text-green-600">
                    <span className="font-medium">Feedback:</span>
                    <p>{message.suggestContent.commentFeedback}</p>
                  </div>
                )}
                {message.suggestContent.isPerfect && (
                  <div className="mt-2 text-xs text-green-700 font-medium">
                    ✓ Perfect! No improvement needed.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pronunciation Assessment Display */}
        <AnimatePresence>
          {showPronunciationAssessment[message.id] && message.speechData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 ml-12"
            >
              <PronunciationDisplay speechData={message.speechData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 