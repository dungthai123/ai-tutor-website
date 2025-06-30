'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { ChatEntryProps } from '../../types';
import { 
  isUserMessage, 
  getSenderDisplayName, 
  formatMessageTime, 
  getMessageBubbleClasses
} from '../../utils';
import { translateMessage } from '../../services';

export function ChatEntry({ message, variant = 'default' }: ChatEntryProps) {
  const isUser = isUserMessage(message);
  const senderName = getSenderDisplayName(message);
  const formattedTime = formatMessageTime(message.timestamp);
  
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const handleTranslate = async () => {
    if (translation) {
      setShowTranslation(!showTranslation);
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translateMessage(message.message, 'english', 'chinese');
      setTranslation(result);
      setShowTranslation(true);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslation('Translation failed. Please try again.');
      setShowTranslation(true);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn('flex group', isUser ? 'justify-end' : 'justify-start')}
    >
      <div className="flex flex-col gap-2 max-w-[80%]">
        <div className="flex items-center gap-3 px-3">
          <span className={cn(
            'font-bold drop-shadow-lg',
            variant === 'compact' ? 'text-sm' : 'text-xl',
            variant === 'compact' ? 'text-gray-300' : 'text-white'
          )}>
            {senderName}
          </span>
          <span className={cn(
            'text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity',
            variant === 'compact' ? 'text-xs' : 'text-base'
          )}>
            {formattedTime}
          </span>
        </div>
        
        {/* Main message */}
        <div className={getMessageBubbleClasses(isUser, variant)}>
          {message.message}
        </div>

        {/* Translation section */}
        {showTranslation && translation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
            className={cn(
              'px-4 py-3 rounded-lg text-sm',
              'bg-blue-50 dark:bg-blue-900/20',
              'border border-blue-200 dark:border-blue-800',
              'text-blue-800 dark:text-blue-200'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="font-medium text-xs">Translation:</span>
            </div>
            <p className="leading-relaxed">{translation}</p>
          </motion.div>
        )}

        {/* Translation button */}
        <div className="flex items-center justify-end px-3">
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium',
              'bg-white/10 hover:bg-white/20 text-white',
              'backdrop-blur-sm border border-white/20',
              'transition-all duration-200 opacity-0 group-hover:opacity-100',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              variant === 'compact' && 'px-2 py-1 text-xs'
            )}
            title={translation ? (showTranslation ? 'Hide translation' : 'Show translation') : 'Translate to Chinese'}
          >
            {isTranslating ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Translating...
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {translation ? (showTranslation ? 'Hide' : 'Show') : 'Translate'}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
} 