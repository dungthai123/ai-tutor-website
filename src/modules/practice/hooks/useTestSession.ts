import { useState, useEffect, useCallback, useMemo } from 'react';
import { PracticeType } from '../types';
import { PracticeService, TimerService, ValidationService } from '../services';
import { UseTestSessionReturn, TestSessionState } from '../types';

/**
 * Custom hook for managing test session state and logic
 */
export function useTestSession(testType: PracticeType, testId: string): UseTestSessionReturn {
  const [state, setState] = useState<TestSessionState>({
    testId,
    testType,
    topic: null,
    questions: [],
    currentPosition: 0,
    selectedAnswers: {},
    timeStarted: 0,
    timeElapsed: 0,
    isCompleted: false,
    score: null,
    loading: true,
    error: null
  });

  // Initialize test session
  const initializeTest = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    // Validate test parameters
    const validation = ValidationService.validateTestStart(testId, testType);
    if (!validation.valid) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: validation.error || 'Invalid test parameters'
      }));
      return;
    }

    try {
      const { topic, questions } = await PracticeService.initializeTest(testType, testId);

      // Log questions for debugging
      console.log('Received questions:', {
        testType,
        testId,
        questionsCount: questions.length,
        firstQuestion: questions[0] || null
      });

      // Validate questions (but continue for debugging purposes)
      const isValid = PracticeService.validateQuestions(questions);
      if (!isValid) {
        console.error('⚠️ Question validation failed for test:', { testType, testId, questionsCount: questions.length });
        console.log('📝 Continuing with invalid questions for debugging...');
      }

      const timeStarted = Date.now();
      const sessionId = `${testType}-${testId}`;

      setState(prev => ({
        ...prev,
        topic,
        questions,
        timeStarted,
        loading: false,
        error: null
      }));

      // Start timer
      TimerService.startTimer(sessionId, (elapsed) => {
        setState(prev => ({ ...prev, timeElapsed: elapsed }));
      });

    } catch (error) {
      console.error('Failed to initialize test:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load test'
      }));
    }
  }, [testId, testType]);

  // Set answer for current question
  const setAnswer = useCallback((answerIndex: number) => {
    setState(prev => {
      const currentQuestion = prev.questions[prev.currentPosition];
      if (!currentQuestion) return prev;

      // Validate answer
      const validation = ValidationService.validateAnswerSelection(
        answerIndex, 
        currentQuestion.optionList.length
      );
      
      if (!validation.valid) {
        console.warn(validation.error);
        return prev;
      }

      return {
        ...prev,
        selectedAnswers: {
          ...prev.selectedAnswers,
          [prev.currentPosition]: answerIndex
        }
      };
    });
  }, []);

  // Navigate to next question
  const nextQuestion = useCallback(() => {
    setState(prev => {
      const nextPosition = prev.currentPosition + 1;
      
      // If last question, complete the test
      if (nextPosition >= prev.questions.length) {
        return completeTestInternal(prev);
      }
      
      return {
        ...prev,
        currentPosition: nextPosition
      };
    });
  }, []);

  // Navigate to previous question
  const previousQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPosition: Math.max(0, prev.currentPosition - 1)
    }));
  }, []);

  // Go to specific question
  const goToQuestion = useCallback((index: number) => {
    setState(prev => {
      if (index >= 0 && index < prev.questions.length) {
        return {
          ...prev,
          currentPosition: index
        };
      }
      return prev;
    });
  }, []);

  // Complete test and calculate score
  const completeTest = useCallback(() => {
    setState(prev => completeTestInternal(prev));
  }, []);

  // Internal function to complete test (used by both completeTest and nextQuestion)
  const completeTestInternal = (currentState: TestSessionState): TestSessionState => {
    const score = PracticeService.calculateScore(currentState.questions, currentState.selectedAnswers);
    
    // Stop timer
    const sessionId = `${currentState.testType}-${currentState.testId}`;
    TimerService.stopTimer(sessionId);

    return {
      ...currentState,
      isCompleted: true,
      score
    };
  };

  // Reset test session
  const resetTest = useCallback(() => {
    const sessionId = `${testType}-${testId}`;
    TimerService.stopTimer(sessionId);

    setState({
      testId,
      testType,
      topic: null,
      questions: [],
      currentPosition: 0,
      selectedAnswers: {},
      timeStarted: 0,
      timeElapsed: 0,
      isCompleted: false,
      score: null,
      loading: true,
      error: null
    });

    // Re-initialize
    initializeTest();
  }, [testId, testType, initializeTest]);

  // Computed values
  const computed = useMemo(() => {
    const currentQuestion = state.questions[state.currentPosition] || null;
    const progress = {
      current: state.currentPosition + 1,
      total: state.questions.length,
      percentage: state.questions.length > 0 
        ? Math.round(((state.currentPosition + 1) / state.questions.length) * 100)
        : 0
    };
    
    return {
      currentQuestion,
      progress,
      canGoNext: state.currentPosition < state.questions.length - 1 || state.currentPosition === state.questions.length - 1,
      canGoPrevious: state.currentPosition > 0,
      isLastQuestion: state.currentPosition === state.questions.length - 1
    };
  }, [state.questions, state.currentPosition]);

  // Initialize test on mount
  useEffect(() => {
    initializeTest();
    
    // Cleanup timer on unmount
    return () => {
      const sessionId = `${testType}-${testId}`;
      TimerService.stopTimer(sessionId);
    };
  }, [initializeTest, testType, testId]);

  return {
    state,
    actions: {
      setAnswer,
      nextQuestion,
      previousQuestion,
      goToQuestion,
      completeTest,
      resetTest
    },
    computed
  };
} 