'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const TopicSelector = dynamic(() => import('./TopicSelector'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      <span className="ml-2 text-text-secondary">Loading topics...</span>
    </div>
  )
});

interface TopicSelectionPanelProps {
  userName: string;
  onUserNameChange: (name: string) => void;
  onTopicSelect: (categoryId: number, topicId: string, topicData: {
    categoryName: string;
    topicName: string;
    description: string;
    tasks: string[];
    imageUrl?: string;
  }) => void;
}

export const TopicSelectionPanel: React.FC<TopicSelectionPanelProps> = ({
  onTopicSelect
}) => {
  return (
    <div className="h-full bg-background-card rounded-xl border border-border-subtle p-4 overflow-y-auto flex flex-col">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-lg font-bold text-text-primary mb-1">
          🎯 Chọn chủ đề
        </h2>
        <p className="text-xs text-text-secondary">
          Chọn chủ đề luyện tập
        </p>
        
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <TopicSelector onTopicSelect={onTopicSelect} />
      </div>
    </div>
  );
};

export default TopicSelectionPanel; 