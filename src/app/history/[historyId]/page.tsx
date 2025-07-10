'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HistoryService } from '@/modules/practice/services/history.service';
import { TestHistoryItem } from '@/modules/practice/types';
import { TestContainer } from '@/modules/practice/components/test/TestContainer';
import { LoadingState } from '@/modules/practice/components';

export default function TestReviewPage() {
  const params = useParams();
  const router = useRouter();
  const historyId = params.historyId as string;

  const [historyItem, setHistoryItem] = useState<TestHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const item = HistoryService.getTestResultByHistoryId(historyId);
    setHistoryItem(item || null);
    setLoading(false);
  }, [historyId]);

  const handleBackToHistory = () => {
    router.push('/history');
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!historyItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Test history not found.</p>
          <button 
            onClick={handleBackToHistory}
            className="text-blue-600 hover:underline"
          >
            Back to history
          </button>
        </div>
      </div>
    );
  }

  return (
    <TestContainer
      testType={historyItem.testType}
      testId={historyItem.testId}
      onBack={handleBackToHistory}
      mode="review"
      historyData={historyItem}
    />
  );
} 