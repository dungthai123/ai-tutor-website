import React from 'react';
import { Topic, Category } from '../../types';
import { TopicCard } from './TopicCard';

interface TopicGridProps {
  topics: Topic[];
  selectedTopic: Topic | null;
  selectedCategory: Category;
  onTopicSelect: (topic: Topic) => void;
  loading?: boolean;
}

export const TopicGrid: React.FC<TopicGridProps> = ({
  topics,
  selectedTopic,
  selectedCategory,
  onTopicSelect,
  loading = false
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">
        Chọn chủ đề từ &ldquo;{selectedCategory.name}&rdquo;:
      </h3>
      
      <div className="relative min-h-[300px]">
        {/* Loading overlay with animation */}
        {loading && (
          <div className="absolute inset-0 bg-background-card/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg animate-in fade-in-0 duration-300">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-primary border-t-transparent"></div>
              <p className="text-sm text-text-secondary font-medium">Đang tải chủ đề...</p>
            </div>
          </div>
        )}
        
        {/* Topics grid with fade animation */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${
          loading ? 'opacity-30' : 'opacity-100'
        }`}>
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
    </div>
  );
}; 