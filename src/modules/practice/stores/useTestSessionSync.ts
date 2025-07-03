import { useEffect, useMemo, useRef } from 'react';
import { useTimerStore } from './timerStore';
import { useNavigationStore, QuestionStatus } from './navigationStore';
import { useUIStateStore, FontSize } from './uiStateStore';
import { useSubmissionStore } from './submissionStore';
import { 
  PracticeTopicModel, 
  QuizModel, 
  TestOptions, 
  TestScore,
  PracticeType,
  HSKLevel
} from '../types';

// Re-export types for compatibility
export type { FontSize, QuestionStatus };

interface TestSessionSyncOptions {
  testId?: string;
  testType?: PracticeType;
  topicModel?: PracticeTopicModel;
  quizList?: QuizModel[];
  options?: Partial<TestOptions>;
  autoInit?: boolean;
}

/**
 * Hook that provides the same interface as useTestSessionStoreForReadingAndListening
 * but uses the new modular stores internally. This allows for backward compatibility
 * while benefiting from the refactored architecture.
 */
export function useTestSessionSync(config?: TestSessionSyncOptions) {
  const timerStore = useTimerStore();
  const navigationStore = useNavigationStore();
  const uiStateStore = useUIStateStore();
  const submissionStore = useSubmissionStore();

  // Store the previous testId to detect session changes
  const previousTestIdRef = useRef<string | null>(null);
  // Safeguard to prevent multiple resets in quick succession
  const isResettingRef = useRef<boolean>(false);

  // Auto-initialize if config is provided
  useEffect(() => {
    if (config?.autoInit && config.testId && config.testType && config.topicModel && config.quizList) {
      // Prevent multiple resets
      if (isResettingRef.current) {
        console.log('Reset already in progress, skipping to prevent update loop', { testId: config.testId });
        return;
      }
      
      // Always reset when autoInit is true to ensure a clean session
      console.log('Auto-initializing test session, resetting all stores to ensure clean state', { testId: config.testId });
      isResettingRef.current = true;
      try {
        timerStore.resetTimer(config.topicModel.level);
        navigationStore.resetNavigation();
        uiStateStore.resetUIState();
        submissionStore.resetScore();
        submissionStore.clearHistory();
      } finally {
        isResettingRef.current = false;
      }
      
      const { testId, testType, topicModel, quizList } = config;
      
      // Update the stored testId
      previousTestIdRef.current = testId;
      
      // Initialize individual stores
      timerStore.initTimer(topicModel.level);
      navigationStore.initNavigation(quizList);
      uiStateStore.resetUIState();
      submissionStore.resetScore();
      submissionStore.clearHistory();
      
      console.log('Test session auto-initialized:', {
        testId,
        testType,
        questionsCount: quizList.length,
        level: topicModel.level
      });
    }
  }, [config]); // Only depend on config, not store instances

  // Create the unified interface that mirrors the original store
  const testSessionInterface = useMemo(() => ({
    // Test data - from navigation store and config
    testId: config?.testId || null,
    testType: config?.testType || null,
    topicModel: config?.topicModel || null,
    quizList: navigationStore.quizList,
    currentPosition: navigationStore.currentPosition,
    selectedAnswers: navigationStore.selectedAnswers,
    
    // Test settings - from config and UI state
    showAnswerAfterEach: config?.options?.showAnswerAfterEach ?? true,
    typeOfQuestion: config?.options?.typeOfQuestion,
    resume: config?.options?.resume ?? false,
    isReview: config?.options?.isReview ?? false,
    
    // Answer tracking - from submission store
    historyMap: submissionStore.historyMap,
    
    // UI state - Question content toggles
    isShowTranslation: uiStateStore.isShowTranslation,
    isShowExplanation: uiStateStore.isShowExplanation,
    isShowTranscript: uiStateStore.isShowTranscript,
    isAnswerSelected: uiStateStore.isAnswerSelected,
    isShowAnswerFeedback: uiStateStore.isShowAnswerFeedback,
    isAnswerCorrect: uiStateStore.isAnswerCorrect,
    fontSize: uiStateStore.fontSize,
    
    // UI state - Navigation
    isNavigationPanelOpen: navigationStore.isNavigationPanelOpen,
    showQuestionPalette: navigationStore.showQuestionPalette,
    reviewedQuestions: navigationStore.reviewedQuestions,
    
    // Timer
    currentTime: timerStore.currentTime,
    totalTime: timerStore.totalTime,
    isTimerRunning: timerStore.isTimerRunning,
    
    // Score tracking
    right: submissionStore.right,
    wrong: submissionStore.wrong,
    skip: submissionStore.skip,
    score: submissionStore.score,
    
    // Loading and completion states
    isLoading: uiStateStore.isLoading,
    isCompleted: uiStateStore.isCompleted,
    
    // Submission state
    isReadyToSubmit: submissionStore.isReadyToSubmit,
    showSubmitConfirmation: submissionStore.showSubmitConfirmation,
    isSubmitting: submissionStore.isSubmitting,
    
    // Actions - Test management
    initTest: (testId: string, testType: PracticeType, topicModel: PracticeTopicModel, quizList: QuizModel[]) => {
      if (!topicModel || !quizList || quizList.length === 0) {
        console.error('Invalid test data provided to initTest');
        return;
      }

      // Prevent multiple resets
      if (isResettingRef.current) {
        console.log('Reset already in progress during initTest, skipping to prevent update loop', { testId });
        return;
      }

      // Explicitly reset all stores to ensure a clean session
      console.log('Initializing new test session, resetting all stores', { testId });
      isResettingRef.current = true;
      try {
        timerStore.resetTimer(topicModel.level);
        navigationStore.resetNavigation();
        uiStateStore.resetUIState();
        submissionStore.resetScore();
        submissionStore.clearHistory();
      } finally {
        isResettingRef.current = false;
      }
      
      // Initialize all stores
      timerStore.initTimer(topicModel.level);
      navigationStore.initNavigation(quizList);
      uiStateStore.resetUIState();
      submissionStore.resetScore();
      submissionStore.clearHistory();
      
      // Update the stored testId
      previousTestIdRef.current = testId;
      
      console.log('Test initialized via useTestSessionSync:', {
        testId,
        testType,
        questionsCount: quizList.length,
        level: topicModel.level
      });
    },
    
    resetTest: () => {
      timerStore.resetTimer(config?.topicModel?.level || HSKLevel.HSK1);
      navigationStore.resetNavigation();
      uiStateStore.resetUIState();
      submissionStore.resetScore();
      submissionStore.clearHistory();
    },
    
    completeTest: () => {
      timerStore.pauseTimer();
      uiStateStore.setCompleted(true);
    },
    
    // Actions - Answer management
    setAnswer: (answerIndex: number) => {
      const currentQuestion = navigationStore.getCurrentQuestion();
      if (!currentQuestion) return;
      
      const isCorrect = answerIndex === parseInt(currentQuestion.correctAnswer) - 1;
      
      // Update navigation store
      navigationStore.setAnswer(navigationStore.currentPosition, answerIndex);
      
      // Update UI store
      uiStateStore.setAnswerSelected(true, isCorrect);
      if (config?.options?.showAnswerAfterEach ?? true) {
        uiStateStore.setShowAnswerFeedback(true);
      }
      
      // Update submission store
      submissionStore.addToHistory(currentQuestion.id, isCorrect, currentQuestion);
    },
    
    setAnswerByIndex: (questionIndex: number, answerIndex: number) => {
      navigationStore.setAnswer(questionIndex, answerIndex);
    },
    
    removeAnswer: (questionIndex: number) => {
      navigationStore.removeAnswer(questionIndex);
    },
    
    // Actions - Navigation
    nextQuestion: () => {
      // Update score based on current answer
      if (uiStateStore.isAnswerSelected) {
        submissionStore.updateScore(uiStateStore.isAnswerCorrect);
      } else {
        submissionStore.updateScore(false, true); // skipped
      }
      
      navigationStore.nextQuestion();
      uiStateStore.resetAnswerState();
      
      // Check if test is complete
      if (navigationStore.isLastQuestion()) {
        timerStore.pauseTimer();
        uiStateStore.setCompleted(true);
      }
    },
    
    previousQuestion: () => {
      navigationStore.previousQuestion();
      uiStateStore.resetAnswerState();
    },
    
    goToQuestion: (index: number) => {
      navigationStore.goToQuestion(index);
      uiStateStore.resetAnswerState();
    },
    
    markQuestionAsReviewed: (questionIndex: number) => {
      navigationStore.markQuestionAsReviewed(questionIndex);
    },
    
    // Actions - UI toggles
    toggleTranslation: () => {
      uiStateStore.toggleTranslation();
    },
    
    toggleExplanation: () => {
      uiStateStore.toggleExplanation();
    },
    
    toggleTranscript: () => {
      uiStateStore.toggleTranscript();
    },
    
    setFontSize: (size: FontSize) => {
      uiStateStore.setFontSize(size);
    },
    
    toggleNavigationPanel: () => {
      navigationStore.toggleNavigationPanel();
    },
    
    toggleQuestionPalette: () => {
      navigationStore.toggleQuestionPalette();
    },
    
    // Actions - Timer
    startTimer: () => {
      timerStore.startTimer();
    },
    
    pauseTimer: () => {
      timerStore.pauseTimer();
    },
    
    updateTimer: () => {
      timerStore.updateTimer(() => {
        timerStore.pauseTimer();
        uiStateStore.setCompleted(true);
      });
    },
    
    // Actions - Submission
    setShowSubmitConfirmation: (show: boolean) => {
      submissionStore.setShowSubmitConfirmation(show);
    },
    
    submitTest: async () => {
      await submissionStore.submitTest();
    },
    
    // Getters - Question info
    getCurrentQuestion: () => navigationStore.getCurrentQuestion(),
    getAnswerForCurrentQuestion: () => navigationStore.getAnswerForCurrentQuestion(),
    isLastQuestion: () => navigationStore.isLastQuestion(),
    isFirstQuestion: () => navigationStore.isFirstQuestion(),
    
    // Getters - Progress and stats
    getProgress: () => navigationStore.getProgress(),
    getQuestionStatus: (index: number) => navigationStore.getQuestionStatus(index),
    getAllQuestionStatuses: () => navigationStore.getAllQuestionStatuses(),
    getAnsweredCount: () => navigationStore.getAnsweredCount(),
    getUnansweredCount: () => navigationStore.getUnansweredCount(),
    getReviewedCount: () => navigationStore.getReviewedCount(),
    getProgressPercentage: () => navigationStore.getProgressPercentage(),
    
    // Getters - Navigation helpers
    canSubmitTest: () => {
      const answeredCount = navigationStore.getAnsweredCount();
      return submissionStore.canSubmitTest(navigationStore.quizList.length, answeredCount);
    },
    canGoNext: () => navigationStore.canGoNext(),
    canGoPrevious: () => navigationStore.canGoPrevious(),
    getNextUnansweredQuestion: () => navigationStore.getNextUnansweredQuestion(),
    getPreviousUnansweredQuestion: () => navigationStore.getPreviousUnansweredQuestion(),
    
    // Getters - Score
    calculateScore: (): TestScore => {
      return submissionStore.calculateScore(navigationStore.quizList.length);
    }
  }), [
    timerStore,
    navigationStore,
    uiStateStore,
    submissionStore,
    config?.testId,
    config?.testType,
    config?.topicModel,
    config?.options
  ]);

  return testSessionInterface;
}

// Export a version that can be used as a drop-in replacement
export function useTestSessionStoreForReadingAndListening() {
  return useTestSessionSync();
} 