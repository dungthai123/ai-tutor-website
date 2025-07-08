import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, MessageSquare, TrendingUp } from 'lucide-react';
import { ConversationFeedback } from '../../types';

interface FeedbackResultsProps {
  feedback: ConversationFeedback;
  onClose: () => void;
}

export function FeedbackResults({ feedback, onClose }: FeedbackResultsProps) {
  const getTaskCompletionColor = (completed: number) => {
    if (completed >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (completed >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTaskCompletionIcon = (completed: number) => {
    if (completed >= 80) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (completed >= 50) return <TrendingUp className="h-6 w-6 text-yellow-600" />;
    return <TrendingUp className="h-6 w-6 text-red-600" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Conversation Feedback</h2>
              <p className="text-blue-100">Your performance analysis</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Completion Score */}
          <div className={`p-4 rounded-xl border-2 ${getTaskCompletionColor(feedback.taskCompleted)}`}>
            <div className="flex items-center gap-3">
              {getTaskCompletionIcon(feedback.taskCompleted)}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Task Completion</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        feedback.taskCompleted >= 80 ? 'bg-green-500' :
                        feedback.taskCompleted >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(5, feedback.taskCompleted)}%` }}
                    />
                  </div>
                  <span className="font-bold text-xl">
                    {feedback.taskCompleted}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vocabulary Feedback */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-blue-900">Vocabulary Assessment</h3>
            </div>
            <p className="text-blue-800 leading-relaxed">
              {feedback.vocabularyFeedback}
            </p>
          </div>

          {/* Grammar Feedback */}
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg text-green-900">Grammar Assessment</h3>
            </div>
            <p className="text-green-800 leading-relaxed">
              {feedback.grammarFeedback}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              Continue Learning
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 