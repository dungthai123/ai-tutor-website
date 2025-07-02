import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  PracticeTopicModel, 
  QuizModel, 
  TestOptions, 
  HistoryModel,
  QuizStats,
  HSKLevel,
  TestScore
} from '@/modules/practice/types';

export type FontSize = 'small' | 'medium' | 'large';

interface PracticeDetailState {
  // Test data
  topicModel: PracticeTopicModel | null;
  quizList: QuizModel[];
  currentPosition: number;
  
  // Test settings
  showAnswerAfterEach: boolean;
  typeOfQuestion?: string;
  resume: boolean;
  isReview: boolean;
  
  // Answer tracking
  selectedAnswers: Record<number, number>;
  historyMap: Record<string, HistoryModel>;
  
  // UI state
  isShowTranslation: boolean;
  isShowExplanation: boolean;
  isShowTranscript: boolean;
  isAnswerSelected: boolean;
  isShowAnswerFeedback: boolean;
  isAnswerCorrect: boolean;
  fontSize: FontSize;
  
  // Timer
  currentTime: number;
  totalTime: number;
  isTimerRunning: boolean;
  
  // Score tracking
  right: number;
  wrong: number;
  skip: number;
  score: number;
  
  // Loading states
  isLoading: boolean;
  isCompleted: boolean;
  
  // Actions
  initTest: (topicModel: PracticeTopicModel, quizList: QuizModel[], options?: Partial<TestOptions>) => void;
  setAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  toggleTranslation: () => void;
  toggleExplanation: () => void;
  toggleTranscript: () => void;
  setFontSize: (size: FontSize) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  updateTimer: () => void;
  calculateScore: () => TestScore;
  completeTest: () => void;
  resetTest: () => void;
  
  // Getters
  getCurrentQuestion: () => QuizModel | null;
  getAnswerForCurrentQuestion: () => number | undefined;
  isLastQuestion: () => boolean;
  isFirstQuestion: () => boolean;
  getProgress: () => { current: number; total: number; percentage: number };
}

const getTimerDuration = (level: HSKLevel): number => {
  // HSK4-6: 40 minutes, HSK1-3: 30 minutes
  return (level === HSKLevel.HSK4 || level === HSKLevel.HSK5 || level === HSKLevel.HSK6) 
    ? 2400 // 40 minutes in seconds
    : 1800; // 30 minutes in seconds
};

export const usePracticeDetailStore = create<PracticeDetailState>()(
  devtools(
    (set, get) => ({
      // Initial state
      topicModel: null,
      quizList: [],
      currentPosition: 0,
      
      showAnswerAfterEach: true,
      typeOfQuestion: undefined,
      resume: false,
      isReview: false,
      
      selectedAnswers: {},
      historyMap: {},
      
      isShowTranslation: false,
      isShowExplanation: false,
      isShowTranscript: false,
      isAnswerSelected: false,
      isShowAnswerFeedback: false,
      isAnswerCorrect: false,
      fontSize: 'small' as FontSize,
      
      currentTime: 0,
      totalTime: 1800,
      isTimerRunning: false,
      
      right: 0,
      wrong: 0,
      skip: 0,
      score: 0,
      
      isLoading: false,
      isCompleted: false,
      
      // Actions
      initTest: (topicModel, quizList, options = {}) => {
        if (!topicModel || !quizList || quizList.length === 0) {
          console.error('Invalid test data provided to initTest');
          return;
        }

        const totalTime = getTimerDuration(topicModel.level);
        
        set({
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
        });
      },
      
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
      },
      
      completeTest: () => {
        set({
          isCompleted: true,
          isTimerRunning: false
        });
      },
      
      resetTest: () => {
        set({
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
        });
      },
      
      // Getters
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
      
      getProgress: () => {
        const state = get();
        const current = state.currentPosition + 1;
        const total = state.quizList.length;
        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
        
        return { current, total, percentage };
      }
    }),
    {
      name: 'practice-detail-store'
    }
  )
); 