'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceAssistantControlBar } from '@livekit/components-react';
import { cn } from '@/utils/helpers';
import { ChatInput } from './ChatInput';

interface ControlBarProps {
  chatOpen: boolean;
  onChatToggle: () => void;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
}

export function ControlBar({ 
  chatOpen, 
  onChatToggle, 
  onSendMessage, 
  disabled = false,
  variant = 'default'
}: ControlBarProps) {
  
  if (variant === 'compact') {
    return (
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-between gap-4">
          {/* Chat Toggle */}
          <button
            onClick={onChatToggle}
            className={cn(
              'p-3 rounded-xl transition-all duration-200',
              chatOpen 
                ? 'bg-primary-green text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            )}
            aria-label="Toggle chat"
          >
            <span className="text-lg">💬</span>
          </button>

          {/* Voice Assistant Control Bar */}
          <div className="flex-1 max-w-sm">
            <VoiceAssistantControlBar />
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300">Connected</span>
          </div>
        </div>

        {/* Chat Input for Compact Variant */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <ChatInput 
                onSend={onSendMessage} 
                disabled={disabled} 
                variant="compact"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 border-t border-gray-700">
      {/* Chat Input - Collapsible */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5">
              <ChatInput 
                onSend={onSendMessage} 
                disabled={disabled} 
                variant="default"
              />
            </div>
            <hr className="border-gray-600 mb-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Chat Toggle */}
          <button
            onClick={onChatToggle}
            className={cn(
              'p-4 rounded-2xl transition-all duration-300 transform hover:scale-105',
              chatOpen 
                ? 'bg-gradient-to-r from-primary-green to-green-500 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            )}
            aria-label="Toggle chat"
          >
            <span className="text-xl">💬</span>
          </button>
        </div>

        {/* Voice Assistant Control Bar - Clean without extra borders */}
        <div className="flex-1 max-w-md">
          <VoiceAssistantControlBar />
        </div>
      </div>
    </div>
  );
} 