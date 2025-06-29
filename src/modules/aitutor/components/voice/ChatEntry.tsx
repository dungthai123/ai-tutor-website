'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { type ReceivedChatMessage } from '@livekit/components-react';
import { cn } from '@/utils/helpers';
import { formatMessageTime, isUserMessage, getSenderDisplayName } from '../../utils';

interface ChatEntryProps {
  message: ReceivedChatMessage;
  variant?: 'default' | 'compact';
}

export function ChatEntry({ message, variant = 'default' }: ChatEntryProps) {
  const isUser = isUserMessage(message);
  const timeDisplay = formatMessageTime(message.timestamp);
  const senderName = getSenderDisplayName(isUser);

  const styles = {
    default: {
      container: cn('flex group', isUser ? 'justify-end' : 'justify-start'),
      content: 'flex flex-col gap-1 max-w-[80%]',
      header: 'flex items-center gap-3 px-3',
      senderName: 'text-xl font-bold text-white drop-shadow-lg',
      timestamp: 'text-base text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity',
      bubble: cn(
        'rounded-[20px] px-8 py-5 text-xl font-semibold shadow-2xl',
        isUser
          ? 'bg-gradient-to-r from-primary-green to-green-500 text-white ml-auto'
          : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white mr-auto'
      )
    },
    compact: {
      container: cn('flex mb-4', isUser ? 'justify-end' : 'justify-start'),
      content: 'flex flex-col gap-1 max-w-[85%]',
      header: 'flex items-center gap-2 px-2',
      senderName: 'text-sm font-medium text-gray-300',
      timestamp: 'text-xs text-gray-500',
      bubble: cn(
        'rounded-2xl px-4 py-3 text-sm shadow-lg',
        isUser
          ? 'bg-accent-primary text-text-primary ml-auto'
          : 'bg-gray-700 text-white mr-auto border border-gray-600'
      )
    }
  };

  const currentStyles = styles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={currentStyles.container}
    >
      <div className={currentStyles.content}>
        <div className={currentStyles.header}>
          <span className={currentStyles.senderName}>
            {senderName}
          </span>
          <span className={currentStyles.timestamp}>
            {timeDisplay}
          </span>
        </div>
        <div className={currentStyles.bubble}>
          {message.message}
        </div>
      </div>
    </motion.div>
  );
} 