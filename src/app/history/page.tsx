'use client';

import { MainLayout } from '@/shared/components/layout/MainLayout';
import { LoadingState } from '@/modules/practice/components';
import { TestHistoryList } from '@/modules/practice/components';
import { useTestHistory } from '@/modules/practice/hooks/useTestHistory';
import { HistoryService } from '@/modules/practice/services/history.service';
import React from 'react';

export default function HistoryPage() {
  const { historyItems, loading, refresh } = useTestHistory();

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all test history?')) {
      HistoryService.clearHistory();
      refresh();
    }
  };

  const handleDelete = (historyId: string) => {
    if (confirm('Delete this test history entry?')) {
      HistoryService.deleteHistoryById(historyId);
      refresh();
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Test History
          </h2>
          {historyItems.length > 0 && (
            <button
              className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
              onClick={handleClear}
            >
              Clear All
            </button>
          )}
        </div>
        <TestHistoryList items={historyItems} onDelete={handleDelete} />
      </div>
    </MainLayout>
  );
} 