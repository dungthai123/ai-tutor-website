import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { QuizModel } from '../types';

export interface QuestionStatus {
  index: number;
  isAnswered: boolean;
  isCurrent: boolean;
  isReviewed: boolean;
  selectedAnswer?: number;
}

interface NavigationState {
  currentPosition: number;
  selectedAnswers: Record<number, number>;
  reviewedQuestions: Set<number>;
  quizList: QuizModel[];
  
  // UI state
  isNavigationPanelOpen: boolean;
  showQuestionPalette: boolean;
  
  // Actions - Navigation
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  markQuestionAsReviewed: (questionIndex: number) => void;
  
  // Actions - Answer management
  setAnswer: (questionIndex: number, answerIndex: number) => void;
  removeAnswer: (questionIndex: number) => void;
  
  // Actions - UI toggles
  toggleNavigationPanel: () => void;
  toggleQuestionPalette: () => void;
  
  // Actions - Initialization
  initNavigation: (quizList: QuizModel[]) => void;
  resetNavigation: () => void;
  
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
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
  getNextUnansweredQuestion: () => number | null;
  getPreviousUnansweredQuestion: () => number | null;
}

export const useNavigationStore = create<NavigationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentPosition: 0,
      selectedAnswers: {},
      reviewedQuestions: new Set(),
      quizList: [],
      isNavigationPanelOpen: false,
      showQuestionPalette: false,
      
      // Actions - Navigation
      nextQuestion: () => {
        const state = get();
        const nextPosition = state.currentPosition + 1;
        
        if (nextPosition < state.quizList.length) {
          set({ currentPosition: nextPosition });
        }
      },
      
      previousQuestion: () => {
        const state = get();
        if (state.currentPosition > 0) {
          set({ currentPosition: state.currentPosition - 1 });
        }
      },
      
      goToQuestion: (index) => {
        const state = get();
        if (index >= 0 && index < state.quizList.length) {
          set({ currentPosition: index });
        }
      },
      
      markQuestionAsReviewed: (questionIndex) => {
        const { reviewedQuestions } = get();
        const newReviewed = new Set(reviewedQuestions);
        newReviewed.add(questionIndex);
        set({ reviewedQuestions: newReviewed });
      },
      
      // Actions - Answer management
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
      
      // Actions - UI toggles
      toggleNavigationPanel: () => {
        set(state => ({ isNavigationPanelOpen: !state.isNavigationPanelOpen }));
      },
      
      toggleQuestionPalette: () => {
        set(state => ({ showQuestionPalette: !state.showQuestionPalette }));
      },
      
      // Actions - Initialization
      initNavigation: (quizList) => {
        set({
          quizList,
          currentPosition: 0,
          selectedAnswers: {},
          reviewedQuestions: new Set(),
          isNavigationPanelOpen: false,
          showQuestionPalette: false
        });
      },
      
      resetNavigation: () => {
        set({
          currentPosition: 0,
          selectedAnswers: {},
          reviewedQuestions: new Set(),
          quizList: [],
          isNavigationPanelOpen: false,
          showQuestionPalette: false
        });
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
      }
    }),
    { name: 'navigation-store' }
  )
); 
 