import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PracticeType, QuizModel } from '@/modules/practice/types';

export interface QuestionStatus {
  index: number;
  isAnswered: boolean;
  isCurrent: boolean;
  isReviewed: boolean;
  selectedAnswer?: number;
}

export interface TestNavigationState {
  // Test data
  testId: string | null;
  testType: PracticeType | null;
  questions: QuizModel[];
  currentQuestionIndex: number;
  selectedAnswers: Record<number, number>;
  
  // Navigation state
  isNavigationPanelOpen: boolean;
  reviewedQuestions: Set<number>;
  
  // Submission state
  isReadyToSubmit: boolean;
  showSubmitConfirmation: boolean;
  isSubmitting: boolean;
  
  // UI state
  showQuestionPalette: boolean;
  
  // Actions
  initializeTest: (testId: string, testType: PracticeType, questions: QuizModel[]) => void;
  setCurrentQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setAnswer: (questionIndex: number, answerIndex: number) => void;
  removeAnswer: (questionIndex: number) => void;
  markQuestionAsReviewed: (questionIndex: number) => void;
  toggleNavigationPanel: () => void;
  toggleQuestionPalette: () => void;
  setShowSubmitConfirmation: (show: boolean) => void;
  submitTest: () => Promise<void>;
  resetTest: () => void;
  
  // Getters
  getQuestionStatus: (index: number) => QuestionStatus;
  getAllQuestionStatuses: () => QuestionStatus[];
  getAnsweredCount: () => number;
  getUnansweredCount: () => number;
  getReviewedCount: () => number;
  getProgressPercentage: () => number;
  canSubmitTest: () => boolean;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
  isLastQuestion: () => boolean;
  getNextUnansweredQuestion: () => number | null;
  getPreviousUnansweredQuestion: () => number | null;
}

export const useTestNavigationStore = create<TestNavigationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      testId: null,
      testType: null,
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswers: {},
      isNavigationPanelOpen: false,
      reviewedQuestions: new Set(),
      isReadyToSubmit: false,
      showSubmitConfirmation: false,
      isSubmitting: false,
      showQuestionPalette: false,
      
      // Actions
      initializeTest: (testId, testType, questions) => {
        set({
          testId,
          testType,
          questions,
          currentQuestionIndex: 0,
          selectedAnswers: {},
          reviewedQuestions: new Set(),
          isNavigationPanelOpen: false,
          isReadyToSubmit: false,
          showSubmitConfirmation: false,
          isSubmitting: false,
          showQuestionPalette: false,
        });
      },
      
      setCurrentQuestion: (index) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          set({ currentQuestionIndex: index });
        }
      },
      
      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        if (currentQuestionIndex < questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },
      
      previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },
      
      setAnswer: (questionIndex, answerIndex) => {
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
      
      markQuestionAsReviewed: (questionIndex) => {
        const { reviewedQuestions } = get();
        const newReviewed = new Set(reviewedQuestions);
        newReviewed.add(questionIndex);
        set({ reviewedQuestions: newReviewed });
      },
      
      toggleNavigationPanel: () => {
        set(state => ({ isNavigationPanelOpen: !state.isNavigationPanelOpen }));
      },
      
      toggleQuestionPalette: () => {
        set(state => ({ showQuestionPalette: !state.showQuestionPalette }));
      },
      
      setShowSubmitConfirmation: (show) => {
        set({ showSubmitConfirmation: show });
      },
      
      submitTest: async () => {
        const state = get();
        set({ isSubmitting: true });
        
        try {
          // Here you would typically call an API to submit the test
          // For now, we'll simulate the submission
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          console.log('Test submitted:', {
            testId: state.testId,
            testType: state.testType,
            answers: state.selectedAnswers,
            totalQuestions: state.questions.length,
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
      
      resetTest: () => {
        set({
          testId: null,
          testType: null,
          questions: [],
          currentQuestionIndex: 0,
          selectedAnswers: {},
          reviewedQuestions: new Set(),
          isNavigationPanelOpen: false,
          isReadyToSubmit: false,
          showSubmitConfirmation: false,
          isSubmitting: false,
          showQuestionPalette: false,
        });
      },
      
      // Getters
      getQuestionStatus: (index) => {
        const state = get();
        return {
          index,
          isAnswered: index in state.selectedAnswers,
          isCurrent: index === state.currentQuestionIndex,
          isReviewed: state.reviewedQuestions.has(index),
          selectedAnswer: state.selectedAnswers[index]
        };
      },
      
      getAllQuestionStatuses: () => {
        const { questions } = get();
        return questions.map((_, index) => get().getQuestionStatus(index));
      },
      
      getAnsweredCount: () => {
        const { selectedAnswers } = get();
        return Object.keys(selectedAnswers).length;
      },
      
      getUnansweredCount: () => {
        const { questions, selectedAnswers } = get();
        return questions.length - Object.keys(selectedAnswers).length;
      },
      
      getReviewedCount: () => {
        const { reviewedQuestions } = get();
        return reviewedQuestions.size;
      },
      
      getProgressPercentage: () => {
        const { questions, selectedAnswers } = get();
        if (questions.length === 0) return 0;
        return Math.round((Object.keys(selectedAnswers).length / questions.length) * 100);
      },
      
      canSubmitTest: () => {
        const { questions, selectedAnswers } = get();
        return questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;
      },
      
      canGoNext: () => {
        const { currentQuestionIndex, questions } = get();
        return currentQuestionIndex < questions.length - 1;
      },
      
      canGoPrevious: () => {
        const { currentQuestionIndex } = get();
        return currentQuestionIndex > 0;
      },
      
      isLastQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        return currentQuestionIndex === questions.length - 1;
      },
      
      getNextUnansweredQuestion: () => {
        const { questions, selectedAnswers, currentQuestionIndex } = get();
        
        // Look for unanswered questions starting from current + 1
        for (let i = currentQuestionIndex + 1; i < questions.length; i++) {
          if (!(i in selectedAnswers)) {
            return i;
          }
        }
        
        // Look for unanswered questions from the beginning
        for (let i = 0; i <= currentQuestionIndex; i++) {
          if (!(i in selectedAnswers)) {
            return i;
          }
        }
        
        return null;
      },
      
      getPreviousUnansweredQuestion: () => {
        const { questions, selectedAnswers, currentQuestionIndex } = get();
        
        // Look for unanswered questions starting from current - 1
        for (let i = currentQuestionIndex - 1; i >= 0; i--) {
          if (!(i in selectedAnswers)) {
            return i;
          }
        }
        
        // Look for unanswered questions from the end
        for (let i = questions.length - 1; i >= currentQuestionIndex; i--) {
          if (!(i in selectedAnswers)) {
            return i;
          }
        }
        
        return null;
      },
    }),
    {
      name: 'test-navigation-store'
    }
  )
); 