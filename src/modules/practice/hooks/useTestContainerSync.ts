import { useEffect } from 'react';
import { useTestNavigationStore } from '@/lib/stores/testNavigationStore';
import { PracticeType } from '../types';
import { UseTestSessionReturn } from '../types';

interface UseTestContainerSyncProps {
  testId: string;
  testType: PracticeType;
  testSession: UseTestSessionReturn;
}

interface UseTestContainerSyncReturn {
  // Navigation store integration
  navigationStore: {
    currentQuestionIndex: number;
    nextQuestion: () => void;
    previousQuestion: () => void;
    canGoNext: () => boolean;
    canGoPrevious: () => boolean;
    isLastQuestion: () => boolean;
    getUnansweredCount: () => number;
    getProgressPercentage: () => number;
    canSubmitTest: () => boolean;
    submitTest: () => Promise<void>;
    setCurrentQuestion: (index: number) => void;
    setAnswer: (questionIndex: number, answerIndex: number) => void;
  };
  
  // Computed values
  answeredCount: number;
  progressPercentage: number;
  unansweredCount: number;
  
  // Event handlers
  handleQuestionChange: (questionIndex: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleAnswerSelected: (answer: number | string) => void;
  handleSubmitTest: () => Promise<void>;
}

/**
 * Custom hook to manage synchronization between test session and navigation store
 * Handles dual store updates and provides unified event handlers
 */
export function useTestContainerSync({
  testId,
  testType,
  testSession
}: UseTestContainerSyncProps): UseTestContainerSyncReturn {
  const { state, actions } = testSession;
  
  // Navigation store integration
  const navigationStore = useTestNavigationStore();
  const {
    initializeTest: initNavigationTest,
    setAnswer: setNavigationAnswer,
    currentQuestionIndex: navigationCurrentIndex,
    nextQuestion: navigationNext,
    previousQuestion: navigationPrevious,
    canGoNext: navigationCanGoNext,
    canGoPrevious: navigationCanGoPrevious,
    isLastQuestion: navigationIsLastQuestion,
    getUnansweredCount,
    getProgressPercentage,
    canSubmitTest,
    submitTest,
    setCurrentQuestion: setNavigationQuestion,
  } = navigationStore;

  // Calculate derived values
  const answeredCount = Object.keys(state.selectedAnswers).length;
  const progressPercentage = getProgressPercentage();
  const unansweredCount = getUnansweredCount();

  // Sync navigation store with test session state
  useEffect(() => {
    if (state.questions.length > 0 && !state.loading) {
      initNavigationTest(testId, testType, state.questions);
    }
  }, [state.questions, state.loading, testId, testType, initNavigationTest]);

  // Sync current question between stores
  useEffect(() => {
    if (navigationCurrentIndex !== state.currentPosition) {
      actions.goToQuestion(navigationCurrentIndex);
    }
  }, [navigationCurrentIndex, state.currentPosition, actions]);

  // Sync answers between stores
  useEffect(() => {
    const ans = state.selectedAnswers[state.currentPosition];
    if (ans !== undefined) {
      const ansNumber = typeof ans === 'string' ? parseInt(ans, 10) : ans;
      if (!isNaN(ansNumber)) {
        setNavigationAnswer(state.currentPosition, ansNumber);
      }
    }
  }, [state.selectedAnswers, state.currentPosition, setNavigationAnswer]);

  // Event handlers
  const handleQuestionChange = (questionIndex: number) => {
    actions.goToQuestion(questionIndex);
    setNavigationQuestion(questionIndex);
  };

  const handleNext = () => {
    navigationNext();
    actions.goToQuestion(navigationCurrentIndex + 1);
  };

  const handlePrevious = () => {
    navigationPrevious();
    actions.goToQuestion(navigationCurrentIndex - 1);
  };

  const handleAnswerSelected = (answer: number | string) => {
    // Convert string to number if needed (for numeric answers)
    const answerIndex = typeof answer === 'string' ? parseInt(answer, 10) : answer;
    actions.setAnswer(answer);
    // For navigation store, ensure we pass number
    if (!isNaN(answerIndex)) {
      setNavigationAnswer(state.currentPosition, answerIndex);
    }
  };

  const handleSubmitTest = async () => {
    await submitTest();
  };

  return {
    navigationStore: {
      currentQuestionIndex: navigationCurrentIndex,
      nextQuestion: navigationNext,
      previousQuestion: navigationPrevious,
      canGoNext: navigationCanGoNext,
      canGoPrevious: navigationCanGoPrevious,
      isLastQuestion: navigationIsLastQuestion,
      getUnansweredCount,
      getProgressPercentage,
      canSubmitTest,
      submitTest,
      setCurrentQuestion: setNavigationQuestion,
      setAnswer: setNavigationAnswer,
    },
    answeredCount,
    progressPercentage,
    unansweredCount,
    handleQuestionChange,
    handleNext,
    handlePrevious,
    handleAnswerSelected,
    handleSubmitTest,
  };
} 