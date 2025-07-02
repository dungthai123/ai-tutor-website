'use client';

import { PracticeType } from '@/modules/practice/types';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import {
  LevelSelector,
  PracticeCard
} from '@/modules/practice/components';
import { usePracticePage } from '@/modules/practice/hooks';

export default function PracticePage() {
  const { state, actions, isLoaded } = usePracticePage();

  // Show a minimal loading state while localStorage is being read
  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="max-w mx-auto py-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-6"></div>
            <div className="flex justify-center gap-3 mb-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-full w-20"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w mx-auto py-8">
        <LevelSelector
          selectedLevel={state.selectedLevel}
          onLevelChange={actions.setLevel}
        />

        {/* Practice Types Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <PracticeCard
            practiceType={PracticeType.LISTENING}
            selectedLevel={state.selectedLevel}
            topicCount={state.practiceTopics.length}
          />
          <PracticeCard
            practiceType={PracticeType.READING}
            selectedLevel={state.selectedLevel}
            topicCount={state.practiceTopics.length}
          />
        </div>
      </div>
    </MainLayout>
  );
} 