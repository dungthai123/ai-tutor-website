'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { TopicDetail } from '../../types';

export function useTopicNavigation() {
  const router = useRouter();

  const navigateToTopicSelection = useCallback(() => {
    router.push('/chatai');
  }, [router]);

  const navigateToTopicPreparation = useCallback((topic: TopicDetail, categoryId?: string) => {
    // Validate required topic properties
    if (!topic || topic.topicId === undefined || topic.topicId === null) {
      console.error('Invalid topic data:', topic);
      return;
    }

    const params = new URLSearchParams({
      topicId: topic.topicId.toString(),
      title: topic.title || '',
      description: topic.description || '',
      tasks: JSON.stringify(topic.tasks || []),
    });
    
    if (topic.image) {
      params.append('image', topic.image);
    }
    
    if (categoryId) {
      params.append('categoryId', categoryId);
    }
    
    router.push(`/chatai/preparation?${params.toString()}`);
  }, [router]);

  const navigateToChat = useCallback((conversationId: string, topic?: TopicDetail, categoryId?: string) => {
    const params = new URLSearchParams();
    
    // Add topic information
    if (topic && topic.topicId !== undefined && topic.topicId !== null) {
      params.append('topicId', topic.topicId.toString());
      params.append('title', topic.title || '');
      params.append('description', topic.description || '');
      
      // Add topic image if available
      if (topic.image) {
        params.append('imageBackground', topic.image);
      }
    }
    
    // Add category ID - this is crucial for the chat page
    if (categoryId) {
      params.append('categoryId', categoryId);
    }
    
    // Validate that we have the required parameters
    if (!params.get('topicId') || !params.get('categoryId')) {
      console.error('Missing required parameters for chat navigation:', {
        topicId: params.get('topicId'),
        categoryId: params.get('categoryId'),
        conversationId
      });
      return;
    }
    
    router.push(`/chatai/${conversationId}?${params.toString()}`);
  }, [router]);

  const navigateBack = useCallback(() => {
    router.back();
  }, [router]);

  return {
    navigateToTopicSelection,
    navigateToTopicPreparation,
    navigateToChat,
    navigateBack,
  };
} 