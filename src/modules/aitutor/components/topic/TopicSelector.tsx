'use client';

import React from 'react';
import { TopicSelectorProps, Topic } from '../../types';
import { useTopicSelector } from '../../hooks/useTopicSelector';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { TopicSelectorHeader } from './TopicSelectorHeader';
import { CategoryGrid } from './CategoryGrid';
import { TopicGrid } from './TopicGrid';

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  onTopicSelect,
  selectedCategoryId,
  selectedTopicId
}) => {
  const {
    categories,
    topics,
    selectedCategory,
    selectedTopic,
    loading,
    error,
    handleCategorySelect,
    handleTopicSelect,
    loadCategories,
  } = useTopicSelector(selectedCategoryId, selectedTopicId);

  const handleInternalTopicSelect = (topic: Topic) => {
    handleTopicSelect(topic);
    if (onTopicSelect && selectedCategory) {
      onTopicSelect(selectedCategory.id, topic.topic_id, {
        categoryName: selectedCategory.name,
        topicName: topic.title,
        description: topic.description,
        tasks: topic.tasks,
        imageUrl: topic.image_url
      });
    }
  };

  // Show initial loading state
  if (categories.length === 0 && !error && loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  // Show error state
  if (error) {
    return <ErrorMessage error={error} onRetry={loadCategories} />;
  }

  return (
    <div className="space-y-6">
      <TopicSelectorHeader />
      
      <CategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {selectedCategory && (
        <TopicGrid
          topics={topics}
          selectedTopic={selectedTopic}
          selectedCategory={selectedCategory}
          onTopicSelect={handleInternalTopicSelect}
          loading={loading && categories.length > 0}
        />
      )}
    </div>
  );
};

export default TopicSelector; 