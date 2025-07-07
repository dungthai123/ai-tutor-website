'use client';

import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { TopicSelectionView } from '@/modules/chatai/components/topics';
import { TopicDetail } from '@/modules/chatai/types';
import { useTopicNavigation } from '@/modules/chatai/hooks/topics';

export default function ChatAIPage() {
  const { navigateToTopicPreparation } = useTopicNavigation();

  const handleTopicSelect = (conversationId: string, topicId: number, topicData: TopicDetail) => {
    // Validate topic data before navigation
    if (!topicData || topicId === undefined || topicId === null) {
      console.error('Invalid topic data received:', { conversationId, topicId, topicData });
      alert('Sorry, this topic is not available yet. Please try another topic.');
      return;
    }

    // Navigate to preparation page with topic details and categoryId
    navigateToTopicPreparation(topicData, conversationId);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TopicSelectionView onTopicSelect={handleTopicSelect} />
      </div>
    </MainLayout>
  );
} 