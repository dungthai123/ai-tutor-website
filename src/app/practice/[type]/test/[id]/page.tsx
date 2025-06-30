'use client';

import { useParams, useRouter } from 'next/navigation';
import { PracticeType } from '@/modules/practice/types';
import { TestContainer } from '@/modules/practice/components';

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  
  const testType = params.type as PracticeType;
  const testId = params.id as string;

  const handleBack = () => {
    if (confirm('Are you sure you want to exit the test? Your progress will be lost.')) {
      router.push(`/practice/${testType}`);
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