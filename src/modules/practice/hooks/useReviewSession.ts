import { useState, useMemo } from 'react';
import { TestHistoryItem, UseTestSessionReturn, TestSessionState } from '../types';

/**
 * Custom hook for review mode - loads test data from history instead of API
 */
export function useReviewSession(historyData: TestHistoryItem): UseTestSessionReturn {
  const [state, setState] = useState<TestSessionState>({
    testId: historyData.testId,
    testType: historyData.testType,
    topic: historyData.topic,
    questions: historyData.questions,
    currentPosition: 0,
    selectedAnswers: historyData.selectedAnswers,
    timeStarted: 0,
    timeElapsed: 0,
    isCompleted: true, // Review mode is always "completed"
    score: historyData.score,
    loading: false,
    error: null
  });

  // Set answer (no-op in review mode, but needed for interface compatibility)
  const setAnswer = () => {
    // Read-only mode - no action taken
  };

  // Navigate to next question
  const nextQuestion = () => {
    setState(prev => ({
      ...prev,
      currentPosition: Math.min(prev.currentPosition + 1, prev.questions.length - 1)
    }));
  };

  // Navigate to previous question
  const previousQuestion = () => {
    setState(prev => ({
      ...prev,
      currentPosition: Math.max(0, prev.currentPosition - 1)
    }));
  };

  // Go to specific question
  const goToQuestion = (index: number) => {
    setState(prev => {
      if (index >= 0 && index < prev.questions.length) {
        return {
          ...prev,
          currentPosition: index
        };
      }
      return prev;
    });
  };

  // Complete test (no-op in review mode)
  const completeTest = () => {
    // Already completed
  };

  // Reset test (no-op in review mode)
  const resetTest = () => {
    // No reset in review mode
  };

  // Cleanup test (no-op in review mode, but needed for interface compatibility)
  const cleanupTest = () => {
    // No cleanup needed in review mode since no timer is running
  };

  // Computed values
  const computed = useMemo(() => {
    const currentQuestion = state.questions[state.currentPosition] || null;
    const progress = {
      current: state.currentPosition + 1,
      total: state.questions.length,
      percentage: state.questions.length > 0 
        ? Math.round(((state.currentPosition + 1) / state.questions.length) * 100)
        : 0
    };
    
    return {
      currentQuestion,
      progress,
      canGoNext: state.currentPosition < state.questions.length - 1,
      canGoPrevious: state.currentPosition > 0,
      isLastQuestion: state.currentPosition === state.questions.length - 1
    };
  }, [state.questions, state.currentPosition]);

  return {
    state,
    actions: {
      setAnswer,
      nextQuestion,
      previousQuestion,
      goToQuestion,
      completeTest,
      resetTest,
      cleanupTest
    },
    computed
  };
} 