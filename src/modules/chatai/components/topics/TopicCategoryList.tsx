'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TopicCard } from './TopicCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ChatGPTModel, TopicDetail } from '../../types';

interface TopicCategoryListProps {
  categories: ChatGPTModel[];
  selectedIndex: number;
  onCategorySelect: (index: number) => void;
  onTopicSelect: (topic: TopicDetail) => void;
  selectedTopic: TopicDetail | null;
  isLoading: boolean;
  onLoadTopicDetails: (conversationId: string) => void;
}

export const TopicCategoryList: React.FC<TopicCategoryListProps> = ({
  categories,
  selectedIndex,
  onCategorySelect,
  onTopicSelect,
  selectedTopic,
  isLoading,
  onLoadTopicDetails
}) => {
  const selectedCategory = categories[selectedIndex];

  // Load topic details when category is selected and topics are empty
  useEffect(() => {
    if (selectedCategory && selectedCategory.topicDetails.length === 0) {
      onLoadTopicDetails(selectedCategory.conversationId);
    }
  }, [selectedCategory, onLoadTopicDetails]);

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No categories available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Selector */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Choose a Category ({categories.length} available)
        </h2>
        
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {categories.map((category, index) => (
            <button
              key={category.conversationId}
              onClick={() => onCategorySelect(index)}
              className={`px-6 py-3 rounded-full border-2 transition-all duration-200 whitespace-nowrap flex-shrink-0 font-medium ${
                selectedIndex === index
                  ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-200'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span className="flex items-center gap-2">
                {category.name}
                {category.topicDetails.length > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedIndex === index 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.topicDetails.length}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      {selectedCategory && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Topics in &ldquo;{selectedCategory.name}&rdquo;
          </h3>
          
          <div className="relative min-h-[300px]">
            {/* Loading overlay */}
            {isLoading && selectedCategory.topicDetails.length === 0 && (
              <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <LoadingSpinner message="Loading topics..." />
              </div>
            )}
            
            {/* Topics grid */}
            {selectedCategory.topicDetails.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
                  isLoading ? 'opacity-50' : 'opacity-100'
                }`}
              >
                {selectedCategory.topicDetails.map((topic, topicIndex) => (
                  <motion.div
                    key={topic.topicId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: topicIndex * 0.1, duration: 0.3 }}
                  >
                                      <TopicCard
                    topic={topic}
                    isSelected={selectedTopic?.topicId === topic.topicId}
                    onSelect={() => {
                      // Validate topic before selection
                      if (topic && topic.topicId !== undefined && topic.topicId !== null) {
                        onTopicSelect(topic);
                      } else {
                        console.warn('Cannot select invalid topic:', topic);
                      }
                    }}
                  />
                  </motion.div>
                ))}
              </motion.div>
            ) : !isLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No topics available</div>
                <p className="text-gray-500">
                  This category doesn&apos;t have any topics yet.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}; 