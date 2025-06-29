import React from 'react';
import { Topic, Category } from '../../types';
import { TopicCard } from './TopicCard';

interface TopicGridProps {
  topics: Topic[];
  selectedTopic: Topic | null;
  selectedCategory: Category;
  onTopicSelect: (topic: Topic) => void;
}

export const TopicGrid: React.FC<TopicGridProps> = ({
  topics,
  selectedTopic,
  selectedCategory,
  onTopicSelect
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">
        Chọn chủ đề từ &ldquo;{selectedCategory.name}&rdquo;:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <TopicCard
            key={topic.topic_id}
            topic={topic}
            isSelected={selectedTopic?.topic_id === topic.topic_id}
            onSelect={onTopicSelect}
          />
        ))}
      </div>
    </div>
  );
}; 