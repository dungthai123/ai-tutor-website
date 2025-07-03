import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type FontSize = 'small' | 'medium' | 'large';

interface UIState {
  // Content display toggles
  isShowTranslation: boolean;
  isShowExplanation: boolean;
  isShowTranscript: boolean;
  isShowAnswerFeedback: boolean;
  
  // Answer state
  isAnswerSelected: boolean;
  isAnswerCorrect: boolean;
  
  // UI settings
  fontSize: FontSize;
  
  // Loading and completion states
  isLoading: boolean;
  isCompleted: boolean;
  
  // Actions - Content toggles
  toggleTranslation: () => void;
  toggleExplanation: () => void;
  toggleTranscript: () => void;
  setShowAnswerFeedback: (show: boolean) => void;
  
  // Actions - Answer state
  setAnswerSelected: (selected: boolean, correct?: boolean) => void;
  resetAnswerState: () => void;
  
  // Actions - UI settings
  setFontSize: (size: FontSize) => void;
  
  // Actions - Loading/completion
  setLoading: (loading: boolean) => void;
  setCompleted: (completed: boolean) => void;
  
  // Actions - Reset
  resetUIState: () => void;
}

export const useUIStateStore = create<UIState>()(
  devtools(
    (set) => ({
      // Initial state
      isShowTranslation: false,
      isShowExplanation: false,
      isShowTranscript: false,
      isShowAnswerFeedback: false,
      isAnswerSelected: false,
      isAnswerCorrect: false,
      fontSize: 'small' as FontSize,
      isLoading: false,
      isCompleted: false,
      
      // Actions - Content toggles
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
      
      setShowAnswerFeedback: (show) => {
        set({ isShowAnswerFeedback: show });
      },
      
      // Actions - Answer state
      setAnswerSelected: (selected, correct = false) => {
        set({ 
          isAnswerSelected: selected,
          isAnswerCorrect: correct
        });
      },
      
      resetAnswerState: () => {
        set({
          isAnswerSelected: false,
          isAnswerCorrect: false,
          isShowAnswerFeedback: false
        });
      },
      
      // Actions - UI settings
      setFontSize: (size) => {
        set({ fontSize: size });
      },
      
      // Actions - Loading/completion
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      setCompleted: (completed) => {
        set({ isCompleted: completed });
      },
      
      // Actions - Reset
      resetUIState: () => {
        set({
          isShowTranslation: false,
          isShowExplanation: false,
          isShowTranscript: false,
          isShowAnswerFeedback: false,
          isAnswerSelected: false,
          isAnswerCorrect: false,
          fontSize: 'small' as FontSize,
          isLoading: false,
          isCompleted: false
        });
      }
    }),
    { name: 'ui-state-store' }
  )
); 