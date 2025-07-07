import React from 'react';
import { motion } from 'framer-motion';

interface ChatEndConversationProps {
  isEndConversation: boolean;
  onBack: () => void;
}

export function ChatEndConversation({ isEndConversation, onBack }: ChatEndConversationProps) {
  if (!isEndConversation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Conversation Complete!
        </h3>
        <p className="text-gray-600 mb-4">
          Great job! Your conversation has been saved.
        </p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Topics
        </button>
      </div>
    </motion.div>
  );
} 