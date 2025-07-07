'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { TopicDetail } from '../../types';

interface SuggestionWidgetProps {
  topic: TopicDetail;
  onSelect: () => void;
}

export const SuggestionWidget: React.FC<SuggestionWidgetProps> = ({
  topic,
  onSelect
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full blur-lg" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">✨ Suggested Topic</h3>
              <p className="text-blue-100 text-sm">Perfect for getting started</p>
            </div>
          </div>

          {/* Topic Content */}
          <div className="grid md:grid-cols-3 gap-6 items-center">
            {/* Topic Info */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-2xl font-bold">{topic.title}</h4>
              <p className="text-blue-100 leading-relaxed">
                {topic.description}
              </p>
              
              {/* Tasks Preview */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-200">Learning Goals:</p>
                <div className="flex flex-wrap gap-2">
                  {topic.tasks.slice(0, 3).map((task, index) => (
                    <span
                      key={index}
                      className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {task}
                    </span>
                  ))}
                  {topic.tasks.length > 3 && (
                    <span className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-medium">
                      +{topic.tasks.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center md:text-right">
              <button
                onClick={onSelect}
                className="group bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                Start Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 