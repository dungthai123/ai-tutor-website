'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { HSKLevel, PracticeType } from '@/modules/practice/types';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { LoadingState } from '@/modules/practice/components';
import {
  PracticeTypeHeader,
  TopicsList
} from '@/modules/practice/components';
import { usePracticeTopics } from '@/modules/practice/hooks/usePracticeTopics';

export default function PracticeTypePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const practiceType = params.type as PracticeType;
  const level = (searchParams.get('level') as HSKLevel) || HSKLevel.HSK1;

  const { topics, loading } = usePracticeTopics(practiceType, level);

  if (loading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w mx-auto py-8 ">
        <PracticeTypeHeader 
          practiceType={practiceType} 
          level={level} 
        />

        <TopicsList 
          topics={topics} 
          practiceType={practiceType} 
          level={level} 
        />
      </div>
    </MainLayout>
  );
} 