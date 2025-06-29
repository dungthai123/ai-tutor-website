import { useState, useEffect } from 'react';
import { HSKLevel, PracticeType, PracticeTopicModel } from '../types';
import { PracticeApiService } from '@/lib/api/practice';

export function usePracticeTopics(practiceType: PracticeType, level: HSKLevel) {
  const [topics, setTopics] = useState<PracticeTopicModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const allTopics = await PracticeApiService.getHSKTestsByLevel(level);
        const filteredTopics = allTopics.filter(topic => topic.type === practiceType);
        setTopics(filteredTopics);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [practiceType, level]);

  return {
    topics,
    loading
  };
} 