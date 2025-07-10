'use client';

import { useTestNavigationStore } from '@/lib/stores/testNavigationStore';
import { usePracticeDetailStore } from '@/lib/stores/practiceDetailStore';
import { cn } from '@/utils/helpers';
import { QuizModel } from '../../types';

interface QuestionNavigationGridProps {
  onQuestionSelect?: (questionIndex: number) => void;
  className?: string;
  // Review mode props
  isReviewMode?: boolean;
  reviewSelectedAnswers?: Record<number, number | string>;
  reviewQuestions?: QuizModel[];
}

interface QuestionGroup {
  type: string;
  questions: Array<{ question: QuizModel; globalIndex: number }>;
  title: string;
}

export function QuestionNavigationGrid({ 
  onQuestionSelect, 
  className,
  isReviewMode = false,
  reviewSelectedAnswers,
  reviewQuestions
}: QuestionNavigationGridProps) {
  const {
    questions: storeQuestions,
    setCurrentQuestion,
    markQuestionAsReviewed,
    getQuestionStatus,
    selectedAnswers: storeSelectedAnswers,
  } = useTestNavigationStore();

  const { showAnswerAfterEach } = usePracticeDetailStore();

  // Use review data when in review mode, otherwise use store data
  const questions = isReviewMode && reviewQuestions ? reviewQuestions : storeQuestions;
  const selectedAnswers = isReviewMode && reviewSelectedAnswers ? reviewSelectedAnswers : storeSelectedAnswers;
  const shouldShowAnswers = isReviewMode || showAnswerAfterEach;

  const handleQuestionClick = (index: number) => {
    // Only update store in non-review mode
    if (!isReviewMode) {
      setCurrentQuestion(index);
      markQuestionAsReviewed(index);
    }
    onQuestionSelect?.(index);
  };

  const getQuestionButtonStyle = (index: number) => {
    const status = getQuestionStatus(index);
    
    if (status.isCurrent) {
      return 'bg-green-600 text-white shadow-md';
    }
    
    // Check if question is answered (either from store or review data)
    const isAnswered = isReviewMode ? selectedAnswers[index] !== undefined : status.isAnswered;
    
    if (isAnswered) {
      // If show answer is enabled and question is answered, show correct/incorrect colors
      if (shouldShowAnswers && selectedAnswers[index] !== undefined) {
        const question = questions[index];
        const selectedAnswer = selectedAnswers[index];
        const correctAnswer = parseInt(question.correctAnswer) - 1;
        
        // Handle both number and string answers
        const selectedAnswerNum = typeof selectedAnswer === 'string' ? parseInt(selectedAnswer) : selectedAnswer;
        const isCorrect = selectedAnswerNum === correctAnswer;
        
        return isCorrect 
          ? 'bg-green-500 text-white shadow-md' 
          : 'bg-red-500 text-white shadow-md';
      }
      
      // Default answered state (blue)
      return 'bg-blue-600 text-white';
    }
    
    return 'bg-blue-200 text-blue-600';
  };

  const getTooltipText = (index: number) => {
    const status = getQuestionStatus(index);
    const question = questions[index];
    
    // Check if question is answered (either from store or review data)
    const isAnswered = isReviewMode ? selectedAnswers[index] !== undefined : status.isAnswered;
    
    if (!isAnswered) {
      return `Question ${question.id} - Unanswered`;
    }
    
    if (shouldShowAnswers && selectedAnswers[index] !== undefined) {
      const selectedAnswer = selectedAnswers[index];
      const correctAnswer = parseInt(question.correctAnswer) - 1;
      
      // Handle both number and string answers
      const selectedAnswerNum = typeof selectedAnswer === 'string' ? parseInt(selectedAnswer) : selectedAnswer;
      const isCorrect = selectedAnswerNum === correctAnswer;
      
      return `Question ${question.id} - ${isCorrect ? 'Correct' : 'Incorrect'}`;
    }
    
    return `Question ${question.id} - Answered`;
  };

  const getSectionTitle = (questionType: string, sectionIndex: number): string => {
    const partNumber = sectionIndex + 1;
    const chinesePart = `第${['一', '二', '三', '四', '五', '六'][sectionIndex] || partNumber}部分`;
    
    return `${chinesePart}`;
  };

  // Group questions by their questionType
  const groupQuestionsByType = (): QuestionGroup[] => {
    const groups: Record<string, Array<{ question: QuizModel; globalIndex: number }>> = {};
    
    questions.forEach((question, index) => {
      // Get the question type from the question object
      const questionType = question.questionType || 'default';
      
      if (!groups[questionType]) {
        groups[questionType] = [];
      }
      
      groups[questionType].push({
        question,
        globalIndex: index
      });
    });

    // Convert to array and add titles
    return Object.entries(groups).map(([type, questionsInGroup], index) => ({
      type,
      questions: questionsInGroup,
      title: getSectionTitle(type, index)
    }));
  };

  if (questions.length === 0) {
    return (
      <div className={cn('p-4 text-center text-gray-500', className)}>
        No questions available
      </div>
    );
  }

  const questionGroups = groupQuestionsByType();

  return (
    <div className={cn('', className)}>
      {questionGroups.map((group) => (
        <div key={group.type} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {group.title}
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {group.questions.map(({ question, globalIndex }) => {
              // Use the question ID instead of index-based number
              const questionId = question.id;
              
              return (
                <button
                  key={globalIndex}
                  onClick={() => handleQuestionClick(globalIndex)}
                  className={cn(
                    'w-14 h-14 rounded-xl text-sm font-semibold transition-all duration-200',
                    'flex items-center justify-center',
                    'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                    getQuestionButtonStyle(globalIndex)
                  )}
                  title={getTooltipText(globalIndex)}
                >
                  {questionId}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 