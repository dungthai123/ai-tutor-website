'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopicPreparationView } from '@/modules/chatai/components/topics';
import { useTopicNavigation } from '@/modules/chatai/hooks/topics';
import { TopicDetail } from '@/modules/chatai/types';
import { LoadingSpinner } from '@/modules/chatai/components/ui';

function TopicPreparationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { navigateToChat, navigateBack } = useTopicNavigation();
  
  const [topicDetail, setTopicDetail] = useState<TopicDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Parse topic details from search params
    const topicId = searchParams.get('topicId');
    const categoryId = searchParams.get('categoryId');
    const title = searchParams.get('title');
    const description = searchParams.get('description');
    const tasksParam = searchParams.get('tasks');
    const image = searchParams.get('image');

    if (topicId && categoryId && title && description && tasksParam) {
      try {
        const tasks = JSON.parse(tasksParam);
        const topic: TopicDetail = {
          topicId: parseInt(topicId),
          title,
          description,
          prompt: description, // Use description as prompt for now
          image: image || '', // Default to empty string if no image
          tasks,
        };
        setTopicDetail(topic);
      } catch (error) {
        console.error('Failed to parse topic details:', error);
        // Redirect back to topic selection if parsing fails
        router.push('/chatai');
      }
    } else {
      console.error('Missing required parameters:', { topicId, categoryId, title, description, tasksParam });
      // Redirect back to topic selection if required params are missing
      router.push('/chatai');
    }
    
    setIsLoading(false);
  }, [searchParams, router]);

  const handleStartChat = () => {
    if (topicDetail) {
      const categoryId = searchParams.get('categoryId');
      
      if (!categoryId) {
        console.error('Category ID is missing');
        alert('Unable to start chat. Please try selecting the topic again.');
        return;
      }

      // Generate a unique conversation ID for the URL path
      const conversationId = `chat_${Date.now()}_${topicDetail.topicId}`;
      
      // Navigate to chat with proper parameters
      navigateToChat(conversationId, topicDetail, categoryId);
    }
  };

  const handleBack = () => {
    navigateBack();
  };

  return (
    <TopicPreparationView
      topicDetail={topicDetail}
      onStartChat={handleStartChat}
      onBack={handleBack}
      isLoading={isLoading}
    />
  );
}

export default function TopicPreparationPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading preparation page..." />}>
      <TopicPreparationContent />
    </Suspense>
  );
} 