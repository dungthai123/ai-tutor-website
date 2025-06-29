'use client';

import { PracticeType } from '@/modules/practice/types';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import {
  LevelSelector,
  PracticeCard,
  LoadingState
} from '@/modules/practice/components';
import { usePracticePage } from '@/modules/practice/hooks';

export default function PracticePage() {
  const { state, actions } = usePracticePage();

  // Separate topics by type for display
  const listeningTopics = state.practiceTopics.filter(topic => topic.type === PracticeType.LISTENING);
  const readingTopics = state.practiceTopics.filter(topic => topic.type === PracticeType.READING);

  return (
    <MainLayout>
      <div className="max-w mx-auto py-8">
        <LevelSelector
          selectedLevel={state.selectedLevel}
          onLevelChange={actions.setLevel}
          loading={state.loading}
        />

        {/* Error State */}
        {state.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{state.error}</p>
            <button
              onClick={actions.refreshTopics}
              className="mt-2 text-red-800 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading or Practice Types */}
        {state.loading ? (
          <LoadingState />
        ) : (
          <>
            {/* Practice Types Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <PracticeCard
                practiceType={PracticeType.LISTENING}
                topicCount={listeningTopics.length}
                selectedLevel={state.selectedLevel}
              />
              <PracticeCard
                practiceType={PracticeType.READING}
                topicCount={readingTopics.length}
                selectedLevel={state.selectedLevel}
              />
            </div>

          </>
        )}
      </div>
    </MainLayout>
  );
} 