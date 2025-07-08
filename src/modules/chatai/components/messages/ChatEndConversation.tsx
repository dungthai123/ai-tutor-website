import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { ConversationFeedback } from '../../types';
import { useChat } from '../../hooks/chat/use-chat';
import { FeedbackResults } from '../feedback';

interface ChatEndConversationProps {
  isEndConversation: boolean;
  onBack: () => void;
}

export function ChatEndConversation({ isEndConversation, onBack }: ChatEndConversationProps) {
  const [feedbackResults, setFeedbackResults] = useState<ConversationFeedback | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { getConversationFeedback, isGeneratingFeedback } = useChat();

  if (!isEndConversation) return null;

  const handleGetFeedback = async () => {
    try {
      const feedback = await getConversationFeedback();
      if (feedback) {
        setFeedbackResults(feedback);
        setShowFeedbackModal(true);
      }
    } catch (error) {
      console.error('Failed to get feedback:', error);
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedbackModal(false);
  };

  return (
    <>
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
          <p className="text-gray-600 mb-6">
            Great job! Your conversation has been saved.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            {/* AI Feedback Button */}
            <button
              onClick={handleGetFeedback}
              disabled={isGeneratingFeedback}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingFeedback ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating Feedback...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Get AI Feedback
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              onClick={onBack}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Topics
            </button>
          </div>
        </div>
      </motion.div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && feedbackResults && (
          <FeedbackResults
            feedback={feedbackResults}
            onClose={handleCloseFeedback}
          />
        )}
      </AnimatePresence>
    </>
  );
} 