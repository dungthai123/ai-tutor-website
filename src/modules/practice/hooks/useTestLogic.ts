import { useState, useEffect } from 'react';
import { PracticeType, QuizModel, PracticeTopicModel, TestScore } from '../types';
import { PracticeService } from '../services';

export function useTestLogic(testType: PracticeType, testId: string) {
  const [questions, setQuestions] = useState<QuizModel[]>([]);
  const [topic, setTopic] = useState<PracticeTopicModel | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | string>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestData = async () => {
      setLoading(true);
      try {
        const testData = await PracticeService.initializeTest(testType, testId);
        setQuestions(testData.questions);
        setTopic(testData.topic);
      } catch (error) {
        console.error('Failed to load test data:', error);
        setQuestions([]);
        setTopic(null);
      } finally {
        setLoading(false);
      }
    };

    loadTestData();
  }, [testId, testType]);

  const handleAnswerSelect = (answer: number | string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: answer
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
    return PracticeService.calculateScore(questions, selectedAnswers);
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
    topic,
    handleAnswerSelect,
    handleNext,
    handlePrevious,
    handleSubmit,
    calculateScore
  };
} 