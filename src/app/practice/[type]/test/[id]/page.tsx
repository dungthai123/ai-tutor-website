'use client';

import { useParams, useRouter } from 'next/navigation';
import { PracticeType } from '@/modules/practice/types';
import { TestContainer } from '@/modules/practice/components';
import { useTestSession } from '@/modules/practice/hooks';

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  
  const testType = params.type as PracticeType;
  const testId = params.id as string;

  const { state } = useTestSession(testType, testId);

  const handleBack = () => {
    if (confirm('Are you sure you want to exit the test? Your progress will be lost.')) {
      const level = state.topic?.level || 'HSK1';
      router.push(`/practice/${testType}?level=${level}`);
    }
  };

  return (

      <TestContainer
        testType={testType}
        testId={testId}
        onBack={handleBack}
      />

  );
} 