import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PracticeType, QuizModel } from '@/modules/practice/types';

export interface QuestionStatus {
  index: number;
  isAnswered: boolean;
  isCurrent: boolean;
  isReviewed: boolean;
  selectedAnswer?: number | string;
}

export interface TestNavigationState {
  // Test data
  testId: string | null;
  testType: PracticeType | null;
  questions: QuizModel[];
  currentQuestionIndex: number;
  selectedAnswers: Record<number, number | string>;
  
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
  setAnswer: (questionIndex: number, answer: number | string) => void;
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
      
      setAnswer: (questionIndex, answer) => {
        const { selectedAnswers } = get();
        set({
          selectedAnswers: {
            ...selectedAnswers,
            [questionIndex]: answer
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
        const question = state.questions[index];
        const answer = state.selectedAnswers[index];
        let isAnswered = false;

        if (answer !== undefined && answer !== null) {
          if (question?.type === 'writing') {
            // For writing questions, check if answer is meaningful
            if (typeof answer === 'string') {
              const trimmedAnswer = answer.trim();
              if (question.questionType === 'Write_Ordering') {
                // For ordering questions, check if all words are used
                const orderingItems = question.orderingItems || [];
                const answerWords = trimmedAnswer.split(' ').filter(word => word.length > 0);
                isAnswered = answerWords.length === orderingItems.length && answerWords.length > 0;
              } else {
                // For other writing questions, check if text is not empty
                isAnswered = trimmedAnswer.length > 0;
              }
            }
          } else {
            // For non-writing questions (listening/reading), any answer means answered
            isAnswered = true;
          }
        }

        return {
          index,
          isAnswered,
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
        const { questions } = get();
        return questions.filter((_, index) => get().getQuestionStatus(index).isAnswered).length;
      },
      
      getUnansweredCount: () => {
        const { questions } = get();
        const answeredCount = questions.filter((_, index) => get().getQuestionStatus(index).isAnswered).length;
        return questions.length - answeredCount;
      },
      
      getReviewedCount: () => {
        const { reviewedQuestions } = get();
        return reviewedQuestions.size;
      },
      
      getProgressPercentage: () => {
        const { questions } = get();
        if (questions.length === 0) return 0;
        const answeredCount = questions.filter((_, index) => get().getQuestionStatus(index).isAnswered).length;
        return Math.round((answeredCount / questions.length) * 100);
      },
      
      canSubmitTest: () => {
        const { questions } = get();
        const answeredCount = questions.filter((_, index) => get().getQuestionStatus(index).isAnswered).length;
        return questions.length > 0 && answeredCount === questions.length;
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
        const { questions, currentQuestionIndex } = get();
        
        // Look for unanswered questions starting from current + 1
        for (let i = currentQuestionIndex + 1; i < questions.length; i++) {
          if (!get().getQuestionStatus(i).isAnswered) {
            return i;
          }
        }
        
        // Look for unanswered questions from the beginning
        for (let i = 0; i <= currentQuestionIndex; i++) {
          if (!get().getQuestionStatus(i).isAnswered) {
            return i;
          }
        }
        
        return null;
      },
      
      getPreviousUnansweredQuestion: () => {
        const { questions, currentQuestionIndex } = get();
        
        // Look for unanswered questions starting from current - 1
        for (let i = currentQuestionIndex - 1; i >= 0; i--) {
          if (!get().getQuestionStatus(i).isAnswered) {
            return i;
          }
        }
        
        // Look for unanswered questions from the end
        for (let i = questions.length - 1; i >= currentQuestionIndex; i--) {
          if (!get().getQuestionStatus(i).isAnswered) {
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