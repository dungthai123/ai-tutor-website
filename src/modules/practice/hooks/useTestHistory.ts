'use client';

import { useState, useEffect } from 'react';
import { TestHistoryItem } from '../types';
import { HistoryService } from '../services/history.service';

interface UseTestHistoryReturn {
  historyItems: TestHistoryItem[];
  loading: boolean;
  refresh: () => void;
}

export function useTestHistory(): UseTestHistoryReturn {
  const [historyItems, setHistoryItems] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    const items = HistoryService.getTestHistory();
    setHistoryItems(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    historyItems,
    loading,
    refresh: fetchHistory
  };
} 