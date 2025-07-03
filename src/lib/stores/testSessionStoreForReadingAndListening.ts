import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  PracticeTopicModel, 
  QuizModel, 
  TestOptions, 
  HistoryModel,
  QuizStats,
  HSKLevel,
  TestScore,
  PracticeType
} from '@/modules/practice/types';

export type FontSize = 'small' | 'medium' | 'large';

export interface QuestionStatus {
  index: number;
  isAnswered: boolean;
  isCurrent: boolean;
  isReviewed: boolean;
  selectedAnswer?: number;
}

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
}

const getTimerDuration = (level: HSKLevel): number => {
  // HSK4-6: 40 minutes, HSK1-3: 30 minutes
  return (level === HSKLevel.HSK4 || level === HSKLevel.HSK5 || level === HSKLevel.HSK6) 
    ? 2400 // 40 minutes in seconds
    : 1800; // 30 minutes in seconds
};

export const useTestSessionStoreForReadingAndListening = create<TestSessionStateForReadingAndListening>()(
  devtools(
    (set, get) => ({
      // Initial state
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

        const totalTime = getTimerDuration(topicModel.level);
        
        set({
          testId,
          testType,
          topicModel,
          quizList,
          currentPosition: 0,
          selectedAnswers: {},
          historyMap: {},
          currentTime: 0,
          totalTime,
          isTimerRunning: false,
          right: 0,
          wrong: 0,
          skip: 0,
          score: 0,
          isCompleted: false,
          isLoading: false,
          isShowTranslation: false,
          isShowExplanation: false,
          isShowTranscript: false,
          isAnswerSelected: false,
          isShowAnswerFeedback: false,
          isAnswerCorrect: false,
          fontSize: 'small' as FontSize,
          showAnswerAfterEach: options.showAnswerAfterEach ?? true,
          typeOfQuestion: options.typeOfQuestion,
          resume: options.resume ?? false,
          isReview: options.isReview ?? false,
          isNavigationPanelOpen: false,
          showQuestionPalette: false,
          reviewedQuestions: new Set(),
          isReadyToSubmit: false,
          showSubmitConfirmation: false,
          isSubmitting: false,
        });
      },
      
      resetTest: () => {
        set({
          testId: null,
          testType: null,
          topicModel: null,
          quizList: [],
          currentPosition: 0,
          selectedAnswers: {},
          historyMap: {},
          currentTime: 0,
          isTimerRunning: false,
          right: 0,
          wrong: 0,
          skip: 0,
          score: 0,
          isCompleted: false,
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
          isReadyToSubmit: false,
          showSubmitConfirmation: false,
          isSubmitting: false,
        });
      },
      
      completeTest: () => {
        set({
          isCompleted: true,
          isTimerRunning: false
        });
      },
      
      // Actions - Answer management
      setAnswer: (answerIndex) => {
        const state = get();
        const currentQuestion = state.getCurrentQuestion();
        
        if (!currentQuestion) return;
        
        const isCorrect = answerIndex === parseInt(currentQuestion.correctAnswer) - 1;
        
        set({
          selectedAnswers: {
            ...state.selectedAnswers,
            [state.currentPosition]: answerIndex
          },
          isAnswerSelected: true,
          isAnswerCorrect: isCorrect,
          isShowAnswerFeedback: state.showAnswerAfterEach
        });
        
        // Update history
        const historyEntry: HistoryModel = {
          type: isCorrect ? QuizStats.CORRECT : QuizStats.WRONG,
          completedAt: new Date(),
          quizData: currentQuestion
        };
        
        set({
          historyMap: {
            ...state.historyMap,
            [currentQuestion.id]: historyEntry
          }
        });
      },
      
      setAnswerByIndex: (questionIndex, answerIndex) => {
        const { selectedAnswers } = get();
        set({
          selectedAnswers: {
            ...selectedAnswers,
            [questionIndex]: answerIndex
          }
        });
      },
      
      removeAnswer: (questionIndex) => {
        const { selectedAnswers } = get();
        const newAnswers = { ...selectedAnswers };
        delete newAnswers[questionIndex];
        set({ selectedAnswers: newAnswers });
      },
      
      // Actions - Navigation
      nextQuestion: () => {
        const state = get();
        const nextPosition = state.currentPosition + 1;
        
        if (nextPosition >= state.quizList.length) {
          state.completeTest();
          return;
        }
        
        // Update score based on current answer
        if (state.isAnswerSelected) {
          const newRight = state.isAnswerCorrect ? state.right + 1 : state.right;
          const newWrong = !state.isAnswerCorrect ? state.wrong + 1 : state.wrong;
          
          set({
            right: newRight,
            wrong: newWrong
          });
        } else {
          // Skipped question
          set({
            skip: state.skip + 1
          });
        }
        
        const nextAnswer = state.selectedAnswers[nextPosition];
        
        set({
          currentPosition: nextPosition,
          isAnswerSelected: nextAnswer !== undefined,
          isAnswerCorrect: false,
          isShowAnswerFeedback: false,
          isShowExplanation: false,
          isShowTranscript: false
        });
      },
      
      previousQuestion: () => {
        const state = get();
        if (state.currentPosition > 0) {
          const prevPosition = state.currentPosition - 1;
          const prevAnswer = state.selectedAnswers[prevPosition];
          
          set({
            currentPosition: prevPosition,
            isAnswerSelected: prevAnswer !== undefined,
            isShowAnswerFeedback: false,
            isShowExplanation: false,
            isShowTranscript: false
          });
        }
      },
      
      goToQuestion: (index) => {
        const state = get();
        if (index >= 0 && index < state.quizList.length) {
          const answer = state.selectedAnswers[index];
          
          set({
            currentPosition: index,
            isAnswerSelected: answer !== undefined,
            isShowAnswerFeedback: false,
            isShowExplanation: false,
            isShowTranscript: false
          });
        }
      },
      
      markQuestionAsReviewed: (questionIndex) => {
        const { reviewedQuestions } = get();
        const newReviewed = new Set(reviewedQuestions);
        newReviewed.add(questionIndex);
        set({ reviewedQuestions: newReviewed });
      },
      
      // Actions - UI toggles
      toggleTranslation: () => {
        set(state => ({
          isShowTranslation: !state.isShowTranslation
        }));
      },
      
      toggleExplanation: () => {
        set(state => ({
          isShowExplanation: !state.isShowExplanation
        }));
      },
      
      toggleTranscript: () => {
        set(state => ({
          isShowTranscript: !state.isShowTranscript
        }));
      },
      
      setFontSize: (size: FontSize) => {
        set({ fontSize: size });
      },
      
      toggleNavigationPanel: () => {
        set(state => ({ isNavigationPanelOpen: !state.isNavigationPanelOpen }));
      },
      
      toggleQuestionPalette: () => {
        set(state => ({ showQuestionPalette: !state.showQuestionPalette }));
      },
      
      // Actions - Timer
      startTimer: () => {
        set({ isTimerRunning: true });
      },
      
      pauseTimer: () => {
        set({ isTimerRunning: false });
      },
      
      updateTimer: () => {
        const state = get();
        if (state.isTimerRunning && !state.isCompleted) {
          const newTime = state.currentTime + 1;
          
          if (newTime >= state.totalTime) {
            state.completeTest();
          } else {
            set({ currentTime: newTime });
          }
        }
      },
      
      // Actions - Submission
      setShowSubmitConfirmation: (show) => {
        set({ showSubmitConfirmation: show });
      },
      
      submitTest: async () => {
        const state = get();
        set({ isSubmitting: true });
        
        try {
          // Simulate submission
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          console.log('Test submitted:', {
            testId: state.testId,
            testType: state.testType,
            answers: state.selectedAnswers,
            totalQuestions: state.quizList.length,
            answeredQuestions: Object.keys(state.selectedAnswers).length
          });
          
          set({ 
            isSubmitting: false,
            showSubmitConfirmation: false,
            isReadyToSubmit: true 
          });
        } catch (error) {
          console.error('Failed to submit test:', error);
          set({ isSubmitting: false });
        }
      },
      
      // Getters - Question info
      getCurrentQuestion: () => {
        const state = get();
        return state.quizList[state.currentPosition] || null;
      },
      
      getAnswerForCurrentQuestion: () => {
        const state = get();
        return state.selectedAnswers[state.currentPosition];
      },
      
      isLastQuestion: () => {
        const state = get();
        return state.currentPosition >= state.quizList.length - 1;
      },
      
      isFirstQuestion: () => {
        const state = get();
        return state.currentPosition === 0;
      },
      
      // Getters - Progress and stats
      getProgress: () => {
        const state = get();
        const current = state.currentPosition + 1;
        const total = state.quizList.length;
        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
        
        return { current, total, percentage };
      },
      
      getQuestionStatus: (index) => {
        const state = get();
        return {
          index,
          isAnswered: index in state.selectedAnswers,
          isCurrent: index === state.currentPosition,
          isReviewed: state.reviewedQuestions.has(index),
          selectedAnswer: state.selectedAnswers[index]
        };
      },
      
      getAllQuestionStatuses: () => {
        const state = get();
        return state.quizList.map((_, index) => state.getQuestionStatus(index));
      },
      
      getAnsweredCount: () => {
        const { selectedAnswers } = get();
        return Object.keys(selectedAnswers).length;
      },
      
      getUnansweredCount: () => {
        const { quizList, selectedAnswers } = get();
        return quizList.length - Object.keys(selectedAnswers).length;
      },
      
      getReviewedCount: () => {
        const { reviewedQuestions } = get();
        return reviewedQuestions.size;
      },
      
      getProgressPercentage: () => {
        const { quizList, selectedAnswers } = get();
        if (quizList.length === 0) return 0;
        return Math.round((Object.keys(selectedAnswers).length / quizList.length) * 100);
      },
      
      // Getters - Navigation helpers
      canSubmitTest: () => {
        const { quizList, selectedAnswers } = get();
        return quizList.length > 0 && Object.keys(selectedAnswers).length === quizList.length;
      },
      
      canGoNext: () => {
        const { currentPosition, quizList } = get();
        return currentPosition < quizList.length - 1;
      },
      
      canGoPrevious: () => {
        const { currentPosition } = get();
        return currentPosition > 0;
      },
      
      getNextUnansweredQuestion: () => {
        const { quizList, selectedAnswers, currentPosition } = get();
        
        // Look for unanswered questions starting from current + 1
        for (let i = currentPosition + 1; i < quizList.length; i++) {
          if (!(i in selectedAnswers)) {
            return i;
          }
        }
        
        // Look for unanswered questions from the beginning
        for (let i = 0; i <= currentPosition; i++) {
          if (!(i in selectedAnswers)) {
            return i;
          }
        }
        
        return null;
      },
      
      getPreviousUnansweredQuestion: () => {
        const { quizList, selectedAnswers, currentPosition } = get();
        
        // Look for unanswered questions starting from current - 1
        for (let i = currentPosition - 1; i >= 0; i--) {
          if (!(i in selectedAnswers)) {
            return i;
          }
        }
        
        // Look for unanswered questions from the end
        for (let i = quizList.length - 1; i >= currentPosition; i--) {
          if (!(i in selectedAnswers)) {
            return i;
          }
        }
        
        return null;
      },
      
      // Getters - Score
      calculateScore: (): TestScore => {
        const state = get();
        const total = state.quizList.length;
        const correct = state.right;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        
        return {
          correct,
          total,
          percentage,
          right: state.right,
          wrong: state.wrong,
          skip: state.skip,
          score: percentage
        };
      }
    }),
    {
      name: 'test-session-store-reading-listening'
    }
  )
); 