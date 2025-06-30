'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { ChatEntryProps } from '../../types';
import { 
  isUserMessage, 
  getSenderDisplayName, 
  formatMessageTime, 
  getMessageBubbleClasses
} from '../../utils';

export function ChatEntry({ message, variant = 'default' }: ChatEntryProps) {
  const isUser = isUserMessage(message);
  const senderName = getSenderDisplayName(message);
  const formattedTime = formatMessageTime(message.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn('flex group', isUser ? 'justify-end' : 'justify-start')}
    >
      <div className="flex flex-col gap-1 max-w-[80%]">
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
        <div className={getMessageBubbleClasses(isUser, variant)}>
          {message.message}
        </div>
      </div>
    </motion.div>
  );
} 