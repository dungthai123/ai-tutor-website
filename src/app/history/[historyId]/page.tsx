'use client';

import { useParams } from 'next/navigation';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { useEffect, useState } from 'react';
import { HistoryService } from '@/modules/practice/services/history.service';
import { TestHistoryItem } from '@/modules/practice/types';
import { LoadingState } from '@/modules/practice/components';
import Link from 'next/link';

export default function TestReviewPage() {
  const params = useParams();
  const historyId = params.historyId as string;

  const [historyItem, setHistoryItem] = useState<TestHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const item = HistoryService.getTestResultByHistoryId(historyId);
    setHistoryItem(item || null);
    setLoading(false);
  }, [historyId]);

  if (loading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  if (!historyItem) {
    return (
      <MainLayout>
        <div className="py-16 text-center">
          <p className="text-gray-600 mb-4">Test history not found.</p>
          <Link href="/history" className="text-blue-600 hover:underline">Back to history</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          {historyItem.topic.title}
        </h2>
        <div className="text-center mb-8">
          <span className="text-lg font-medium mr-2">Score:</span>
          <span className="text-lg font-bold">
            {historyItem.score.percentage}% ({historyItem.score.correct}/{historyItem.score.total})
          </span>
        </div>

        {/* Questions review */}
        <div className="space-y-6">
          {historyItem.questions.map((q, idx) => {
            const userAnswer = historyItem.selectedAnswers[idx];
            const isCorrect = typeof userAnswer === 'number'
              ? (userAnswer === parseInt(q.correctAnswer, 10) - 1)
              : (typeof userAnswer === 'string' && userAnswer.trim() === q.correctAnswer?.trim());

            return (
              <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">Question {idx + 1}</h3>
                  <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{q.question || '—'}</p>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
} 