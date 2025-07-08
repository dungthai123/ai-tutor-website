'use client';

import { useParams, useRouter } from 'next/navigation';
import { PracticeType } from '@/modules/practice/types';
import { useEffect } from 'react';

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  
  const testType = params.type as PracticeType;
  const testId = params.id as string;

  // Redirect to intro page
  useEffect(() => {
    router.replace(`/practice/${testType}/test/${testId}/intro`);
  }, [router, testType, testId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to test introduction...</p>
      </div>
    </div>
  );
} 