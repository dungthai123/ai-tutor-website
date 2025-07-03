import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TestScore, QuizModel, HistoryModel, QuizStats } from '../types';

interface SubmissionState {
  // Score tracking
  right: number;
  wrong: number;
  skip: number;
  score: number;
  
  // Answer tracking
  historyMap: Record<string, HistoryModel>;
  
  // Submission state
  isReadyToSubmit: boolean;
  showSubmitConfirmation: boolean;
  isSubmitting: boolean;
  
  // Actions - Score management
  updateScore: (isCorrect: boolean, wasSkipped?: boolean) => void;
  resetScore: () => void;
  
  // Actions - History management
  addToHistory: (questionId: string, isCorrect: boolean, quizData: QuizModel) => void;
  clearHistory: () => void;
  
  // Actions - Submission
  setShowSubmitConfirmation: (show: boolean) => void;
  submitTest: () => Promise<void>;
  setReadyToSubmit: (ready: boolean) => void;
  
  // Getters - Score calculation
  calculateScore: (totalQuestions: number) => TestScore;
  canSubmitTest: (totalQuestions: number, answeredCount: number) => boolean;
}

export const useSubmissionStore = create<SubmissionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      right: 0,
      wrong: 0,
      skip: 0,
      score: 0,
      historyMap: {},
      isReadyToSubmit: false,
      showSubmitConfirmation: false,
      isSubmitting: false,
      
      // Actions - Score management
      updateScore: (isCorrect, wasSkipped = false) => {
        const state = get();
        if (wasSkipped) {
          set({ skip: state.skip + 1 });
        } else if (isCorrect) {
          set({ right: state.right + 1 });
        } else {
          set({ wrong: state.wrong + 1 });
        }
      },
      
      resetScore: () => {
        set({
          right: 0,
          wrong: 0,
          skip: 0,
          score: 0
        });
      },
      
      // Actions - History management
      addToHistory: (questionId, isCorrect, quizData) => {
        const { historyMap } = get();
        const historyEntry: HistoryModel = {
          type: isCorrect ? QuizStats.CORRECT : QuizStats.WRONG,
          completedAt: new Date(),
          quizData
        };
        
        set({
          historyMap: {
            ...historyMap,
            [questionId]: historyEntry
          }
        });
      },
      
      clearHistory: () => {
        set({ historyMap: {} });
      },
      
      // Actions - Submission
      setShowSubmitConfirmation: (show) => {
        set({ showSubmitConfirmation: show });
      },
      
      submitTest: async () => {
        set({ isSubmitting: true });
        
        try {
          // Simulate submission
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const state = get();
          console.log('Test submitted:', {
            score: state.score,
            right: state.right,
            wrong: state.wrong,
            skip: state.skip,
            historyCount: Object.keys(state.historyMap).length
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
      
      setReadyToSubmit: (ready) => {
        set({ isReadyToSubmit: ready });
      },
      
      // Getters - Score calculation
      calculateScore: (totalQuestions) => {
        const state = get();
        const correct = state.right;
        const percentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
        
        return {
          correct,
          total: totalQuestions,
          percentage,
          right: state.right,
          wrong: state.wrong,
          skip: state.skip,
          score: percentage
        };
      },
      
      canSubmitTest: (totalQuestions, answeredCount) => {
        return totalQuestions > 0 && answeredCount === totalQuestions;
      }
    }),
    { name: 'submission-store' }
  )
); 