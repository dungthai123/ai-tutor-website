import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  HSKLevel, 
  PracticeType, 
  QuizModel,
  TestProgress,
  TestResult 
} from '@/modules/practice/types';

interface PracticeState {
  // Current test state
  currentLevel: HSKLevel;
  currentType: PracticeType | null;
  currentTest: string | null;
  questions: QuizModel[];
  currentQuestionIndex: number;
  selectedAnswers: Record<number, number>;
  
  // UI state
  isLoading: boolean;
  showTranslation: boolean;
  showTranscript: boolean;
  showExplanation: boolean;
  
  // Test progress
  progress: TestProgress | null;
  isTestComplete: boolean;
  
  // Results
  currentResult: TestResult | null;
  
  // Actions
  setCurrentLevel: (level: HSKLevel) => void;
  setCurrentType: (type: PracticeType) => void;
  startTest: (testId: string, questions: QuizModel[]) => void;
  setQuestions: (questions: QuizModel[]) => void;
  selectAnswer: (questionIndex: number, answerIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  toggleTranslation: () => void;
  toggleTranscript: () => void;
  toggleExplanation: () => void;
  completeTest: () => void;
  resetTest: () => void;
  calculateScore: () => { correct: number; total: number; percentage: number };
}

export const usePracticeStore = create<PracticeState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentLevel: HSKLevel.HSK1,
        currentType: null,
        currentTest: null,
        questions: [],
        currentQuestionIndex: 0,
        selectedAnswers: {},
        isLoading: false,
        showTranslation: false,
        showTranscript: false,
        showExplanation: false,
        progress: null,
        isTestComplete: false,
        currentResult: null,

        // Actions
        setCurrentLevel: (level) => set({ currentLevel: level }),
        
        setCurrentType: (type) => set({ currentType: type }),
        
        startTest: (testId, questions) => {
          const startTime = new Date();
          set({ 
            currentTest: testId,
            questions,
            currentQuestionIndex: 0,
            selectedAnswers: {},
            isTestComplete: false,
            progress: {
              currentQuestionIndex: 0,
              totalQuestions: questions.length,
              answeredQuestions: new Set(),
              timeSpent: 0,
              startTime
            }
          });
        },
        
        setQuestions: (questions) => set({ questions }),
        
        selectAnswer: (questionIndex, answerIndex) => {
          const { selectedAnswers, progress } = get();
          const newAnsweredQuestions = new Set(progress?.answeredQuestions || []);
          newAnsweredQuestions.add(questionIndex);
          
          set({
            selectedAnswers: {
              ...selectedAnswers,
              [questionIndex]: answerIndex
            },
            progress: progress ? {
              ...progress,
              answeredQuestions: newAnsweredQuestions
            } : null
          });
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
        
        goToQuestion: (index) => {
          const { questions } = get();
          if (index >= 0 && index < questions.length) {
            set({ currentQuestionIndex: index });
          }
        },
        
        toggleTranslation: () => 
          set((state) => ({ showTranslation: !state.showTranslation })),
        
        toggleTranscript: () =>
          set((state) => ({ showTranscript: !state.showTranscript })),
        
        toggleExplanation: () =>
          set((state) => ({ showExplanation: !state.showExplanation })),
        
        completeTest: () => {
          const { 
            currentTest, 
            currentLevel, 
            currentType, 
            questions, 
            selectedAnswers, 
            progress 
          } = get();
          
          if (!currentTest || !currentType || !progress) return;
          
          const score = get().calculateScore();
          const timeSpent = Math.floor((Date.now() - progress.startTime.getTime()) / 1000);
          
          const result: TestResult = {
            testId: currentTest,
            level: currentLevel,
            type: currentType,
            score: score.percentage,
            totalQuestions: questions.length,
            correctAnswers: score.correct,
            timeSpent,
            completedAt: new Date(),
            questionResults: questions.map((question, index) => ({
              questionId: question.id,
              selectedAnswer: selectedAnswers[index],
              correctAnswer: parseInt(question.correctAnswer) - 1,
              isCorrect: selectedAnswers[index] === (parseInt(question.correctAnswer) - 1),
              timeSpent: Math.floor(timeSpent / questions.length) // Approximate
            }))
          };
          
          set({ 
            isTestComplete: true,
            currentResult: result
          });
        },
        
        resetTest: () => set({
          currentTest: null,
          questions: [],
          currentQuestionIndex: 0,
          selectedAnswers: {},
          progress: null,
          isTestComplete: false,
          currentResult: null,
          showTranslation: false,
          showTranscript: false,
          showExplanation: false
        }),
        
        calculateScore: () => {
          const { questions, selectedAnswers } = get();
          let correct = 0;
          
          questions.forEach((question, index) => {
            const selectedAnswer = selectedAnswers[index];
            if (selectedAnswer !== undefined) {
              const correctAnswerIndex = parseInt(question.correctAnswer) - 1;
              if (selectedAnswer === correctAnswerIndex) {
                correct++;
              }
            }
          });
          
          return {
            correct,
            total: questions.length,
            percentage: questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0
          };
        }
      }),
      {
        name: 'practice-store',
        partialize: (state) => ({
          currentLevel: state.currentLevel,
          currentType: state.currentType
        })
      }
    ),
    { name: 'practice-store' }
  )
); 