'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SelectedTopic } from '../../types';

interface ChatEmptyStateProps {
  selectedTopic: SelectedTopic;
  variant?: 'default' | 'compact';
}

export function ChatEmptyState({ 
  selectedTopic, 
  variant = 'default' 
}: ChatEmptyStateProps) {
  if (variant === 'compact') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center py-8"
      >
        <div className="text-4xl mb-4">🎤</div>
        <h4 className="text-lg font-semibold text-white mb-4">
          Ready to practice!
        </h4>
        <p className="text-gray-300 text-sm max-w-xs mx-auto">
          Start speaking or type a message to begin your conversation.
        </p>
        
        {/* Quick Start Tasks */}
        <div className="mt-6 space-y-2">
          <h5 className="text-white font-medium text-sm mb-3">Quick Start:</h5>
          {selectedTopic.tasks.slice(0, 2).map((task, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-gray-400 justify-center">
              <span className="w-2 h-2 bg-primary-green rounded-full"></span>
              <span className="max-w-[250px] truncate">{task}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="text-center py-12 flex-shrink-0"
    >
      <div className="text-9xl mb-8">🎤</div>
      <h4 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
        Ready to practice!
      </h4>
      <p className="text-white max-w-lg mx-auto text-xl font-medium drop-shadow-md">
        Start speaking or type a message to begin your English conversation practice with AI tutor.
      </p>
      <div className="mt-10 p-8 bg-gray-800 rounded-xl max-w-lg mx-auto border border-gray-700">
        <h5 className="font-bold text-white mb-4 text-xl">Practice Tasks:</h5>
        <div className="space-y-4">
          {selectedTopic.tasks.slice(0, 3).map((task, index) => (
            <div key={index} className="flex items-start gap-4 text-lg text-white">
              <span className="w-3 h-3 bg-primary-green rounded-full mt-2 flex-shrink-0"></span>
              <span className="font-medium">{task}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 