'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Target, Clock, MessageSquare } from 'lucide-react';
import { TopicDetail } from '../../types';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface TopicPreparationViewProps {
  topicDetail: TopicDetail | null;
  onStartChat: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export const TopicPreparationView: React.FC<TopicPreparationViewProps> = ({
  topicDetail,
  onStartChat,
  onBack,
  isLoading = false
}) => {
  if (isLoading || !topicDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading topic details..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Conversation Preparation</h1>
            <p className="text-gray-600">Get ready for your AI conversation</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Topic Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Topic Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Topic Image */}
              <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
                {topicDetail.image && (
                  <img
                    src={topicDetail.image}
                    alt={topicDetail.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {topicDetail.title}
                  </h2>
                  <p className="text-blue-100 text-lg">
                    {topicDetail.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 rounded-full p-3">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                                     <h3 className="text-xl font-semibold text-gray-900">Learning Goals</h3>
                   <p className="text-gray-600">What you&apos;ll practice in this conversation</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {topicDetail.tasks.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100"
                  >
                    <div className="bg-blue-500 rounded-full p-1 mt-1">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">{task}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Tips for Success</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 rounded-full p-1 mt-1">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">Speak naturally and don&apos;t worry about mistakes</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 rounded-full p-1 mt-1">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">Use the hint feature if you need help</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 rounded-full p-1 mt-1">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">Listen to pronunciation feedback</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 rounded-full p-1 mt-1">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">Take your time to think and respond</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-xs text-gray-600">~15-20 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Interaction</p>
                    <p className="text-xs text-gray-600">Voice & Text</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Goals</p>
                    <p className="text-xs text-gray-600">{topicDetail.tasks.length} learning objectives</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartChat}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Play className="h-6 w-6" />
              Start Conversation
            </motion.button>

            {/* Additional Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                <strong>Ready to begin?</strong> Make sure you&apos;re in a quiet environment 
                for the best voice interaction experience.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 