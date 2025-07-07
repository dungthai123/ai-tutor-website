'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mic, Volume2, Star } from 'lucide-react';

export const TopicHeader: React.FC = () => {
  return (
    <div className="text-center space-y-8">
      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          🤖 Chat AI Assistant
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Practice conversations with AI in various topics. Improve your speaking, 
          get pronunciation feedback, and enhance your communication skills.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
      >
        <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
          <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Smart Conversations</h3>
          <p className="text-sm text-gray-600">
            Engage in natural conversations with AI
          </p>
        </div>
        
        <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
          <Mic className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Voice Interaction</h3>
          <p className="text-sm text-gray-600">
            Speak naturally and get real-time feedback
          </p>
        </div>
        
        <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
          <Volume2 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Text-to-Speech</h3>
          <p className="text-sm text-gray-600">
            Listen to perfect pronunciation
          </p>
        </div>
        
        <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-100">
          <Star className="h-8 w-8 text-orange-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">AI Feedback</h3>
          <p className="text-sm text-gray-600">
            Get instant improvement suggestions
          </p>
        </div>
      </motion.div>
    </div>
  );
}; 