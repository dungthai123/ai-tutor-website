'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TopicCategoryList } from './TopicCategoryList';
import { TopicHeader } from './TopicHeader';
import { SuggestionWidget } from './SuggestionWidget';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { useTopics } from '../../hooks/topics/useTopics';
import { TopicDetail } from '../../types';

interface TopicSelectionViewProps {
  onTopicSelect?: (conversationId: string, topicId: number, topicData: TopicDetail) => void;
  className?: string;
}

export const TopicSelectionView: React.FC<TopicSelectionViewProps> = ({
  onTopicSelect,
  className = ''
}) => {
  const router = useRouter();
  const {
    categories,
    selectedCategoryIndex,
    isLoading,
    error,
    setSelectedCategory,
    fetchTopics,
    fetchTopicDetails,
    getSuggestedTopic
  } = useTopics();

  const [selectedTopic, setSelectedTopic] = useState<TopicDetail | null>(null);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleCategorySelect = (categoryIndex: number) => {
    setSelectedCategory(categoryIndex);
    setSelectedTopic(null);
  };

  const handleTopicSelect = (topic: TopicDetail) => {
    // Validate topic data before proceeding
    if (!topic || topic.topicId === undefined || topic.topicId === null) {
      console.error('Invalid topic selected:', topic);
      return;
    }

    setSelectedTopic(topic);
    
    if (onTopicSelect && categories[selectedCategoryIndex]) {
      onTopicSelect(
        categories[selectedCategoryIndex].conversationId,
        topic.topicId,
        topic
      );
    } else {
      // Navigate to preparation page
      const conversationId = categories[selectedCategoryIndex]?.conversationId;
      if (conversationId) {
        const params = new URLSearchParams({
          topicId: topic.topicId.toString(),
          categoryId: conversationId,
          title: topic.title || '',
          description: topic.description || '',
          tasks: JSON.stringify(topic.tasks || []),
        });
        
        if (topic.image) {
          params.append('image', topic.image);
        }
        
        router.push(`/chatai/preparation?${params.toString()}`);
      }
    }
  };

  const handleSuggestionSelect = (suggestion: TopicDetail) => {
    // Find the category that contains this topic
    const categoryIndex = categories.findIndex(category =>
      category.topicDetails.some(topic => topic.topicId === suggestion.topicId)
    );
    
    if (categoryIndex !== -1) {
      setSelectedCategory(categoryIndex);
      handleTopicSelect(suggestion);
    }
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <LoadingSpinner message="Loading conversation topics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <ErrorMessage 
          error={error} 
          onRetry={fetchTopics}
          title="Failed to Load Topics"
        />
      </div>
    );
  }

  const suggestedTopic = getSuggestedTopic();

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <TopicHeader />

      {/* Suggestion Widget */}
      {suggestedTopic && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SuggestionWidget
            topic={suggestedTopic}
            onSelect={() => handleSuggestionSelect(suggestedTopic)}
          />
        </motion.div>
      )}

      {/* Category List and Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TopicCategoryList
          categories={categories}
          selectedIndex={selectedCategoryIndex}
          onCategorySelect={handleCategorySelect}
          onTopicSelect={handleTopicSelect}
          selectedTopic={selectedTopic}
          isLoading={isLoading}
          onLoadTopicDetails={fetchTopicDetails}
        />
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          🎯 How Chat AI Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Choose Topic</h4>
            <p className="text-sm text-gray-600">
              Select a conversation topic that interests you from various categories
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold text-lg">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Start Chatting</h4>
            <p className="text-sm text-gray-600">
              Use text or voice to communicate naturally with the AI assistant
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold text-lg">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Get Feedback</h4>
            <p className="text-sm text-gray-600">
              Receive instant feedback, pronunciation scores, and improvement suggestions
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 