'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, Target } from 'lucide-react';
import { TopicDetail } from '../../types';

interface TopicCardProps {
  topic: TopicDetail;
  isSelected?: boolean;
  onSelect: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isSelected = false,
  onSelect
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={onSelect}
    >
      {/* Topic Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
        {topic.image && (
          <img
            src={topic.image}
            alt={topic.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        
        {/* Icon Overlay */}
        <div className="absolute top-4 right-4">
          <div className="bg-white bg-opacity-90 rounded-full p-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-4 left-4">
            <div className="bg-blue-500 rounded-full p-2">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Topic Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {topic.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {topic.description}
        </p>

        {/* Tasks Preview */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Learning Goals:</span>
          </div>
          
          <div className="space-y-1">
            {topic.tasks.slice(0, 2).map((task, index) => (
              <div key={index} className="flex items-start text-xs text-gray-600">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                <span className="line-clamp-1">{task}</span>
              </div>
            ))}
            {topic.tasks.length > 2 && (
              <div className="text-xs text-gray-500 ml-3.5">
                +{topic.tasks.length - 2} more goals
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>~15 min</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>Interactive</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            isSelected
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSelected ? 'Selected' : 'Start Conversation'}
        </button>
      </div>
    </motion.div>
  );
};