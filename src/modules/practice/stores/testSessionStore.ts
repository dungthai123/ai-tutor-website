import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  PracticeTopicModel, 
  QuizModel, 
  TestOptions, 
  HistoryModel,
  TestScore,
  PracticeType,
  HSKLevel
} from '../types';
import { useTimerStore } from './timerStore';
import { useNavigationStore, QuestionStatus } from './navigationStore';
import { useUIStateStore, FontSize } from './uiStateStore';
import { useSubmissionStore } from './submissionStore';

// Re-export types for backward compatibility
export type { FontSize, QuestionStatus };

interface TestSessionStateForReadingAndListening {
  // Test data
  testId: string | null;
  testType: PracticeType | null;
  topicModel: PracticeTopicModel | null;
  quizList: QuizModel[];
  currentPosition: number;
  selectedAnswers: Record<number, number>;
  
  // Test settings
  showAnswerAfterEach: boolean;
  typeOfQuestion?: string;
  resume: boolean;
  isReview: boolean;
  
  // Answer tracking
  historyMap: Record<string, HistoryModel>;
  
  // UI state - Question content toggles
  isShowTranslation: boolean;
  isShowExplanation: boolean;
  isShowTranscript: boolean;
  isAnswerSelected: boolean;
  isShowAnswerFeedback: boolean;
  isAnswerCorrect: boolean;
  fontSize: FontSize;
  
  // UI state - Navigation
  isNavigationPanelOpen: boolean;
  showQuestionPalette: boolean;
  reviewedQuestions: Set<number>;
  
  // Timer
  currentTime: number;
  totalTime: number;
  isTimerRunning: boolean;
  
  // Score tracking
  right: number;
  wrong: number;
  skip: number;
  score: number;
  
  // Loading and completion states
  isLoading: boolean;
  isCompleted: boolean;
  
  // Submission state
  isReadyToSubmit: boolean;
  showSubmitConfirmation: boolean;
  isSubmitting: boolean;
  
  // Actions - Test management
  initTest: (testId: string, testType: PracticeType, topicModel: PracticeTopicModel, quizList: QuizModel[], options?: Partial<TestOptions>) => void;
  resetTest: () => void;
  completeTest: () => void;
  
  // Actions - Answer management
  setAnswer: (answerIndex: number) => void;
  setAnswerByIndex: (questionIndex: number, answerIndex: number) => void;
  removeAnswer: (questionIndex: number) => void;
  
  // Actions - Navigation
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  markQuestionAsReviewed: (questionIndex: number) => void;
  
  // Actions - UI toggles
  toggleTranslation: () => void;
  toggleExplanation: () => void;
  toggleTranscript: () => void;
  setFontSize: (size: FontSize) => void;
  toggleNavigationPanel: () => void;
  toggleQuestionPalette: () => void;
  
  // Actions - Timer
  startTimer: () => void;
  pauseTimer: () => void;
  updateTimer: () => void;
  
  // Actions - Submission
  setShowSubmitConfirmation: (show: boolean) => void;
  submitTest: () => Promise<void>;
  
  // Getters - Question info
  getCurrentQuestion: () => QuizModel | null;
  getAnswerForCurrentQuestion: () => number | undefined;
  isLastQuestion: () => boolean;
  isFirstQuestion: () => boolean;
  
  // Getters - Progress and stats
  getProgress: () => { current: number; total: number; percentage: number };
  getQuestionStatus: (index: number) => QuestionStatus;
  getAllQuestionStatuses: () => QuestionStatus[];
  getAnsweredCount: () => number;
  getUnansweredCount: () => number;
  getReviewedCount: () => number;
  getProgressPercentage: () => number;
  
  // Getters - Navigation helpers
  canSubmitTest: () => boolean;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
  getNextUnansweredQuestion: () => number | null;
  getPreviousUnansweredQuestion: () => number | null;
  
  // Getters - Score
  calculateScore: () => TestScore;
  
  // Internal methods
  syncFromStores: () => void;
}

export const useTestSessionStoreForReadingAndListening = create<TestSessionStateForReadingAndListening>()(
  devtools(
    (set, get) => {
      return {
        // Initial state - delegated to individual stores
        testId: null,
        testType: null,
        topicModel: null,
        quizList: [],
        currentPosition: 0,
        selectedAnswers: {},
        showAnswerAfterEach: true,
        typeOfQuestion: undefined,
        resume: false,
        isReview: false,
        historyMap: {},
        isShowTranslation: false,
        isShowExplanation: false,
        isShowTranscript: false,
        isAnswerSelected: false,
        isShowAnswerFeedback: false,
        isAnswerCorrect: false,
        fontSize: 'small' as FontSize,
        isNavigationPanelOpen: false,
        showQuestionPalette: false,
        reviewedQuestions: new Set(),
        currentTime: 0,
        totalTime: 1800,
        isTimerRunning: false,
        right: 0,
        wrong: 0,
        skip: 0,
        score: 0,
        isLoading: false,
        isCompleted: false,
        isReadyToSubmit: false,
        showSubmitConfirmation: false,
        isSubmitting: false,
        
        // Actions - Test management
        initTest: (testId, testType, topicModel, quizList, options = {}) => {
          if (!topicModel || !quizList || quizList.length === 0) {
            console.error('Invalid test data provided to initTest');
            return;
          }

          // Initialize sub-stores
          useTimerStore.getState().initTimer(topicModel.level);
          useNavigationStore.getState().initNavigation(quizList);
          useUIStateStore.getState().resetUIState();
          useSubmissionStore.getState().resetScore();
          useSubmissionStore.getState().clearHistory();
          
          set({
            testId,
            testType,
            topicModel,
            quizList,
            showAnswerAfterEach: options.showAnswerAfterEach ?? true,
            typeOfQuestion: options.typeOfQuestion,
            resume: options.resume ?? false,
            isReview: options.isReview ?? false,
          });
          
          // Sync initial state from stores
          get().syncFromStores();
        },
        
                 resetTest: () => {
           useTimerStore.getState().resetTimer(HSKLevel.HSK1);
           useNavigationStore.getState().resetNavigation();
           useUIStateStore.getState().resetUIState();
           useSubmissionStore.getState().resetScore();
           useSubmissionStore.getState().clearHistory();
          
          set({
            testId: null,
            testType: null,
            topicModel: null,
            quizList: [],
            showAnswerAfterEach: true,
            typeOfQuestion: undefined,
            resume: false,
            isReview: false,
          });
          
          get().syncFromStores();
        },
        
        completeTest: () => {
          useTimerStore.getState().pauseTimer();
          useUIStateStore.getState().setCompleted(true);
          get().syncFromStores();
        },
        
        // Actions - Answer management
        setAnswer: (answerIndex) => {
          const state = get();
          const currentQuestion = useNavigationStore.getState().getCurrentQuestion();
          
          if (!currentQuestion) return;
          
          const isCorrect = answerIndex === parseInt(currentQuestion.correctAnswer) - 1;
          
          // Update navigation store
          useNavigationStore.getState().setAnswer(state.currentPosition, answerIndex);
          
          // Update UI store
          useUIStateStore.getState().setAnswerSelected(true, isCorrect);
          useUIStateStore.getState().setShowAnswerFeedback(state.showAnswerAfterEach);
          
          // Update submission store
          useSubmissionStore.getState().addToHistory(currentQuestion.id, isCorrect, currentQuestion);
          
          get().syncFromStores();
        },
        
        setAnswerByIndex: (questionIndex, answerIndex) => {
          useNavigationStore.getState().setAnswer(questionIndex, answerIndex);
          get().syncFromStores();
        },
        
        removeAnswer: (questionIndex) => {
          useNavigationStore.getState().removeAnswer(questionIndex);
          get().syncFromStores();
        },
        
        // Actions - Navigation
        nextQuestion: () => {
          const state = get();
          
          // Update score based on current answer
          if (state.isAnswerSelected) {
            useSubmissionStore.getState().updateScore(state.isAnswerCorrect);
          } else {
            useSubmissionStore.getState().updateScore(false, true); // skipped
          }
          
          useNavigationStore.getState().nextQuestion();
          useUIStateStore.getState().resetAnswerState();
          
          if (useNavigationStore.getState().isLastQuestion()) {
            get().completeTest();
          }
          
          get().syncFromStores();
        },
        
        previousQuestion: () => {
          useNavigationStore.getState().previousQuestion();
          useUIStateStore.getState().resetAnswerState();
          get().syncFromStores();
        },
        
        goToQuestion: (index) => {
          useNavigationStore.getState().goToQuestion(index);
          useUIStateStore.getState().resetAnswerState();
          get().syncFromStores();
        },
        
        markQuestionAsReviewed: (questionIndex) => {
          useNavigationStore.getState().markQuestionAsReviewed(questionIndex);
          get().syncFromStores();
        },
        
        // Actions - UI toggles
        toggleTranslation: () => {
          useUIStateStore.getState().toggleTranslation();
          get().syncFromStores();
        },
        
        toggleExplanation: () => {
          useUIStateStore.getState().toggleExplanation();
          get().syncFromStores();
        },
        
        toggleTranscript: () => {
          useUIStateStore.getState().toggleTranscript();
          get().syncFromStores();
        },
        
        setFontSize: (size) => {
          useUIStateStore.getState().setFontSize(size);
          get().syncFromStores();
        },
        
        toggleNavigationPanel: () => {
          useNavigationStore.getState().toggleNavigationPanel();
          get().syncFromStores();
        },
        
        toggleQuestionPalette: () => {
          useNavigationStore.getState().toggleQuestionPalette();
          get().syncFromStores();
        },
        
        // Actions - Timer
        startTimer: () => {
          useTimerStore.getState().startTimer();
          get().syncFromStores();
        },
        
        pauseTimer: () => {
          useTimerStore.getState().pauseTimer();
          get().syncFromStores();
        },
        
        updateTimer: () => {
          useTimerStore.getState().updateTimer(() => get().completeTest());
          get().syncFromStores();
        },
        
        // Actions - Submission
        setShowSubmitConfirmation: (show) => {
          useSubmissionStore.getState().setShowSubmitConfirmation(show);
          get().syncFromStores();
        },
        
        submitTest: async () => {
          await useSubmissionStore.getState().submitTest();
          get().syncFromStores();
        },
        
        // Getters - Question info (delegate to navigation store)
        getCurrentQuestion: () => useNavigationStore.getState().getCurrentQuestion(),
        getAnswerForCurrentQuestion: () => useNavigationStore.getState().getAnswerForCurrentQuestion(),
        isLastQuestion: () => useNavigationStore.getState().isLastQuestion(),
        isFirstQuestion: () => useNavigationStore.getState().isFirstQuestion(),
        
        // Getters - Progress and stats (delegate to navigation store)
        getProgress: () => useNavigationStore.getState().getProgress(),
        getQuestionStatus: (index) => useNavigationStore.getState().getQuestionStatus(index),
        getAllQuestionStatuses: () => useNavigationStore.getState().getAllQuestionStatuses(),
        getAnsweredCount: () => useNavigationStore.getState().getAnsweredCount(),
        getUnansweredCount: () => useNavigationStore.getState().getUnansweredCount(),
        getReviewedCount: () => useNavigationStore.getState().getReviewedCount(),
        getProgressPercentage: () => useNavigationStore.getState().getProgressPercentage(),
        
        // Getters - Navigation helpers (delegate to navigation store)
        canGoNext: () => useNavigationStore.getState().canGoNext(),
        canGoPrevious: () => useNavigationStore.getState().canGoPrevious(),
        getNextUnansweredQuestion: () => useNavigationStore.getState().getNextUnansweredQuestion(),
        getPreviousUnansweredQuestion: () => useNavigationStore.getState().getPreviousUnansweredQuestion(),
        
        // Getters - Score (delegate to submission store)
        calculateScore: () => {
          const navState = useNavigationStore.getState();
          return useSubmissionStore.getState().calculateScore(navState.quizList.length);
        },
        
        canSubmitTest: () => {
          const navState = useNavigationStore.getState();
          const answeredCount = navState.getAnsweredCount();
          return useSubmissionStore.getState().canSubmitTest(navState.quizList.length, answeredCount);
        },
        
        // Internal sync method
        syncFromStores: () => {
          const timerState = useTimerStore.getState();
          const navState = useNavigationStore.getState();
          const uiState = useUIStateStore.getState();
          const submissionState = useSubmissionStore.getState();
          
          set({
            // Timer state
            currentTime: timerState.currentTime,
            totalTime: timerState.totalTime,
            isTimerRunning: timerState.isTimerRunning,
            
            // Navigation state
            currentPosition: navState.currentPosition,
            selectedAnswers: navState.selectedAnswers,
            reviewedQuestions: navState.reviewedQuestions,
            quizList: navState.quizList,
            isNavigationPanelOpen: navState.isNavigationPanelOpen,
            showQuestionPalette: navState.showQuestionPalette,
            
            // UI state
            isShowTranslation: uiState.isShowTranslation,
            isShowExplanation: uiState.isShowExplanation,
            isShowTranscript: uiState.isShowTranscript,
            isShowAnswerFeedback: uiState.isShowAnswerFeedback,
            isAnswerSelected: uiState.isAnswerSelected,
            isAnswerCorrect: uiState.isAnswerCorrect,
            fontSize: uiState.fontSize,
            isLoading: uiState.isLoading,
            isCompleted: uiState.isCompleted,
            
            // Submission state
            right: submissionState.right,
            wrong: submissionState.wrong,
            skip: submissionState.skip,
            score: submissionState.score,
            historyMap: submissionState.historyMap,
            isReadyToSubmit: submissionState.isReadyToSubmit,
            showSubmitConfirmation: submissionState.showSubmitConfirmation,
            isSubmitting: submissionState.isSubmitting,
          });
        }
      } as TestSessionStateForReadingAndListening;
    },
    {
      name: 'test-session-store-reading-listening'
    }
  )
); 