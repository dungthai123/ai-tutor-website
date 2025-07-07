import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

interface HintSegment {
  word: string;
}

interface HintMessage {
  original: string;
  segments?: HintSegment[];
}

interface HintBubbleProps {
  isVisible: boolean;
  hintMessage: HintMessage | null;
  onSubmit: () => void;
}

export function HintBubble({ isVisible, hintMessage, onSubmit }: HintBubbleProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute inset-x-4 bottom-20 bg-blue-500 rounded-2xl p-4 text-white shadow-lg"
        >
          {hintMessage ? (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p>{hintMessage.original}</p>
                {hintMessage.segments && hintMessage.segments.length > 0 && (
                  <div className="mt-2 text-sm text-blue-100">
                    {hintMessage.segments.map((segment: HintSegment, index: number) => (
                      <span key={index} className="mr-2">
                        {segment.word}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={onSubmit}
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
  );
} 