import { useState, useEffect } from 'react';
import { PracticeType, QuizModel } from '../types';
import { PracticeApiService } from '@/lib/api/practice';

interface TestScore {
  correct: number;
  total: number;
  percentage: number;
}

export function useTestLogic(testType: PracticeType, testId: string) {
  const [questions, setQuestions] = useState<QuizModel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        let testQuestions: QuizModel[] = [];
        
        if (testType === PracticeType.LISTENING) {
          testQuestions = await PracticeApiService.getListeningQuestions(testId);
        } else if (testType === PracticeType.READING) {
          testQuestions = await PracticeApiService.getReadingQuestions(testId);
        }
        
        setQuestions(testQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [testId, testType]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = (): TestScore => {
    let correct = 0;
    questions.forEach((question, index) => {
      const selected = selectedAnswers[index];
      if (selected !== undefined && selected === parseInt(question.correctAnswer) - 1) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return {
    questions,
    currentIndex,
    currentQuestion,
    selectedAnswer,
    selectedAnswers,
    showResults,
    loading,
    answeredCount,
    handleAnswerSelect,
    handleNext,
    handlePrevious,
    handleSubmit,
    calculateScore
  };
} 