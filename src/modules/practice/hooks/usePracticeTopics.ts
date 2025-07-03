import { useState, useEffect } from 'react';
import { HSKLevel, PracticeType, PracticeTopicModel } from '../types';
import { PracticeService } from '../services';

export function usePracticeTopics(practiceType: PracticeType, level: HSKLevel) {
  const [topics, setTopics] = useState<PracticeTopicModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const filteredTopics = await PracticeService.fetchTopicsByType(practiceType, level);
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