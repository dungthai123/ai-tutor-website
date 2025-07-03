import { useEffect } from 'react';
import { useTestSessionStoreForReadingAndListening } from '@/lib/stores/testSessionStoreForReadingAndListening';
import { PracticeType } from '../types';
import { UseTestSessionReturn } from '../types';

interface UseTestContainerSyncProps {
  testId: string;
  testType: PracticeType;
  testSession: UseTestSessionReturn;
}

interface UseTestContainerSyncReturn {
  // Session store integration
  sessionStore: {
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
    goToQuestion: (index: number) => void;
    setAnswerByIndex: (questionIndex: number, answerIndex: number) => void;
  };
  
  // Computed values
  answeredCount: number;
  progressPercentage: number;
  unansweredCount: number;
  
  // Event handlers
  handleQuestionChange: (questionIndex: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleAnswerSelected: (answerIndex: number) => void;
  handleSubmitTest: () => Promise<void>;
}

/**
 * Custom hook to manage synchronization between test session and unified session store
 * Handles dual store updates and provides unified event handlers
 */
export function useTestContainerSync({
  testId,
  testType,
  testSession
}: UseTestContainerSyncProps): UseTestContainerSyncReturn {
  const { state, actions } = testSession;
  
  // Session store integration
  const sessionStore = useTestSessionStoreForReadingAndListening();
  const {
    initTest: initSessionTest,
    setAnswerByIndex: setSessionAnswer,
    currentPosition: sessionCurrentIndex,
    nextQuestion: sessionNext,
    previousQuestion: sessionPrevious,
    canGoNext: sessionCanGoNext,
    canGoPrevious: sessionCanGoPrevious,
    isLastQuestion: sessionIsLastQuestion,
    getUnansweredCount,
    getProgressPercentage,
    canSubmitTest,
    submitTest,
    goToQuestion: setSessionQuestion,
  } = sessionStore;

  // Calculate derived values
  const answeredCount = Object.keys(state.selectedAnswers).length;
  const progressPercentage = getProgressPercentage();
  const unansweredCount = getUnansweredCount();

  // Sync session store with test session state
  useEffect(() => {
    if (state.questions.length > 0 && !state.loading && state.topic) {
      initSessionTest(testId, testType, state.topic, state.questions);
    }
  }, [state.questions, state.loading, state.topic, testId, testType, initSessionTest]);

  // Sync current question between stores
  useEffect(() => {
    if (sessionCurrentIndex !== state.currentPosition) {
      actions.goToQuestion(sessionCurrentIndex);
    }
  }, [sessionCurrentIndex, state.currentPosition, actions]);

  // Sync answers between stores
  useEffect(() => {
    if (state.selectedAnswers[state.currentPosition] !== undefined) {
      setSessionAnswer(state.currentPosition, state.selectedAnswers[state.currentPosition]);
    }
  }, [state.selectedAnswers, state.currentPosition, setSessionAnswer]);

  // Event handlers
  const handleQuestionChange = (questionIndex: number) => {
    actions.goToQuestion(questionIndex);
    setSessionQuestion(questionIndex);
  };

  const handleNext = () => {
    sessionNext();
    actions.goToQuestion(sessionCurrentIndex + 1);
  };

  const handlePrevious = () => {
    sessionPrevious();
    actions.goToQuestion(sessionCurrentIndex - 1);
  };

  const handleAnswerSelected = (answerIndex: number) => {
    actions.setAnswer(answerIndex);
    setSessionAnswer(state.currentPosition, answerIndex);
  };

  const handleSubmitTest = async () => {
    await submitTest();
  };

  return {
    sessionStore: {
      currentQuestionIndex: sessionCurrentIndex,
      nextQuestion: sessionNext,
      previousQuestion: sessionPrevious,
      canGoNext: sessionCanGoNext,
      canGoPrevious: sessionCanGoPrevious,
      isLastQuestion: sessionIsLastQuestion,
      getUnansweredCount,
      getProgressPercentage,
      canSubmitTest,
      submitTest,
      goToQuestion: setSessionQuestion,
      setAnswerByIndex: setSessionAnswer,
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