'use client';

import { useTestNavigationStore } from '@/lib/stores/testNavigationStore';
import { cn } from '@/utils/helpers';
import { PracticeType } from '../../types';

interface QuestionNavigationGridProps {
  onQuestionSelect?: (questionIndex: number) => void;
  className?: string;
}

export function QuestionNavigationGrid({ 
  onQuestionSelect, 
  className 
}: QuestionNavigationGridProps) {
  const {
    questions,
    setCurrentQuestion,
    markQuestionAsReviewed,
    getQuestionStatus,
    testType,
  } = useTestNavigationStore();

  const handleQuestionClick = (index: number) => {
    setCurrentQuestion(index);
    markQuestionAsReviewed(index);
    onQuestionSelect?.(index);
  };

  const getQuestionButtonStyle = (index: number) => {
    const status = getQuestionStatus(index);
    
    if (status.isCurrent) {
      return 'bg-blue-600 text-white shadow-md';
    }
    
    if (status.isAnswered) {
      return 'bg-blue-600 text-white';
    }
    
    return 'bg-blue-200 text-blue-600';
  };

  if (questions.length === 0) {
    return (
      <div className={cn('p-4 text-center text-gray-500', className)}>
        No questions available
      </div>
    );
  }

  // Determine sections based on test type or question count
  const isListeningTest = testType === PracticeType.LISTENING;
  const totalQuestions = questions.length;
  
  // For demo purposes, if we have more than 40 questions, split them
  const listeningQuestions = totalQuestions > 40 ? questions.slice(0, 40) : questions;
  const readingQuestions = totalQuestions > 40 ? questions.slice(40) : [];
  
  const renderQuestionSection = (
    sectionQuestions: typeof questions,
    startIndex: number,
    title: string
  ) => (
    <div className="mb-6">
      {/* Section Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {title}
      </h3>
      
      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-3">
        {sectionQuestions.map((_, localIndex) => {
          const globalIndex = startIndex + localIndex;
          const questionNumber = (globalIndex + 1).toString().padStart(2, '0');
          
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
              title={`Question ${globalIndex + 1} - ${getQuestionStatus(globalIndex).isAnswered ? 'Answered' : 'Unanswered'}`}
            >
              {questionNumber}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={cn('', className)}>
      {/* Header with legend */}


      {/* Question Sections */}
      {isListeningTest || totalQuestions <= 40 ? (
        // Single section for listening or small tests
        renderQuestionSection(
          listeningQuestions,
          0,
          'Phần 1: 第一部分'
        )
      ) : (
        // Multiple sections for combined tests
        <>
          {listeningQuestions.length > 0 && 
            renderQuestionSection(listeningQuestions, 0, 'Phần 1: 第一部分')
          }
          {readingQuestions.length > 0 && 
            renderQuestionSection(readingQuestions, 40, 'Phần 2: 第二部分')
          }
        </>
      )}
    </div>
  );
} 