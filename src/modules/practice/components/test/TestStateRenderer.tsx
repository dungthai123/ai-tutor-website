import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';
import { TestResults } from './TestResults';
import { PracticeType, QuizModel, TestScore, HSKLevel } from '../../types';

interface TestTopic {
  title: string;
  level: HSKLevel;
}

interface TestState {
  loading: boolean;
  error: string | null;
  isCompleted: boolean;
  score: TestScore | null;
  topic: TestTopic | null;
  questions: QuizModel[];
  currentQuestion: QuizModel | null;
}

interface TestStateRendererProps {
  state: TestState;
  testType: PracticeType;
  testId: string;
  onRetry: () => void;
  onBackToTopics?: () => void;
  onViewAnswers?: () => void;
  children: React.ReactNode;
}

/**
 * Handles rendering of different test states (loading, error, completed, empty)
 * Returns null if the main content should be rendered (children)
 */
export function TestStateRenderer({
  state,
  testType,
  onRetry,
  onBackToTopics,
  onViewAnswers,
  children
}: TestStateRendererProps) {
  // Loading state
  if (state.loading) {
    return <LoadingState />;
  }

  // Error state
  if (state.error) {
    return (
      <EmptyState 
        title="Test Load Error"
        description={state.error}
        showRetry={true}
        onRetry={onRetry}
      />
    );
  }

  // Test completed - show results
  if (state.isCompleted && state.score && state.topic) {
    return (
      <TestResults 
        score={state.score} 
        testType={testType} 
        level={state.topic.level}
        testTitle={state.topic.title}
        onRetakeTest={onRetry}
        onBackToTopics={onBackToTopics || (() => {})}
        onViewAnswers={onViewAnswers || (() => {})}
      />
    );
  }

  // No questions loaded
  if (!state.currentQuestion || state.questions.length === 0) {
    return (
      <EmptyState 
        title="No Questions Available"
        description="This test doesn't have any questions available."
        showRetry={true}
        onRetry={onRetry}
      />
    );
  }

  // No topic loaded
  if (!state.topic) {
    return (
      <EmptyState 
        title="Test Configuration Error"
        description="Unable to load test configuration."
        showRetry={true}
        onRetry={onRetry}
      />
    );
  }

  // All good - render main content
  return <>{children}</>;
} 