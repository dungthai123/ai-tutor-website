'use client';

import { useTestNavigationStore } from '@/lib/stores/testNavigationStore';
import { Button } from '@/shared/components/ui/buttons/Button';
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
    selectedAnswers,
    setCurrentQuestion,
    markQuestionAsReviewed,
    getQuestionStatus,
    getAnsweredCount,
    getUnansweredCount,
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
      return 'bg-blue-600 text-white border-blue-600';
    }
    
    if (status.isAnswered) {
      return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
    }
    
    if (status.isReviewed) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200';
    }
    
    return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
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
    title: string,
    bgColor: string
  ) => (
    <div className="mb-6">
      <div className={cn('px-3 py-2 rounded-t-lg', bgColor)}>
        <h4 className="font-semibold text-white text-sm">{title}</h4>
      </div>
      <div className="bg-gray-50 p-3 rounded-b-lg">
        <div className="grid grid-cols-5 gap-2">
          {sectionQuestions.map((_, localIndex) => {
            const globalIndex = startIndex + localIndex;
            return (
              <button
                key={globalIndex}
                onClick={() => handleQuestionClick(globalIndex)}
                className={cn(
                  'w-8 h-8 rounded border text-xs font-medium transition-all duration-200',
                  'flex items-center justify-center',
                  'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500',
                  getQuestionButtonStyle(globalIndex)
                )}
                title={`Question ${globalIndex + 1} - ${getQuestionStatus(globalIndex).isAnswered ? 'Answered' : 'Unanswered'}`}
              >
                {globalIndex + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn('', className)}>
      {/* Header with legend */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Question Navigator
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600">Answered ({getAnsweredCount()})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
            <span className="text-gray-600">Unanswered ({getUnansweredCount()})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-gray-600">Reviewed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span className="text-gray-600">Current</span>
          </div>
        </div>
      </div>

      {/* Question Sections */}
      {isListeningTest || totalQuestions <= 40 ? (
        // Single section for listening or small tests
        renderQuestionSection(
          listeningQuestions,
          0,
          isListeningTest ? 'Listening' : 'Questions',
          'bg-blue-600'
        )
      ) : (
        // Multiple sections for combined tests
        <>
          {listeningQuestions.length > 0 && 
            renderQuestionSection(listeningQuestions, 0, 'Listening', 'bg-blue-600')
          }
          {readingQuestions.length > 0 && 
            renderQuestionSection(readingQuestions, 40, 'Reading', 'bg-green-600')
          }
        </>
      )}

      {/* Quick Navigation Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              const firstUnanswered = questions.findIndex((_, index) => !(index in selectedAnswers));
              if (firstUnanswered !== -1) {
                handleQuestionClick(firstUnanswered);
              }
            }}
            disabled={getUnansweredCount() === 0}
            className="text-xs py-2 px-2"
          >
            First Unanswered
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => {
              const lastUnanswered = questions.map((_, index) => index)
                .reverse()
                .find(index => !(index in selectedAnswers));
              if (lastUnanswered !== undefined) {
                handleQuestionClick(lastUnanswered);
              }
            }}
            disabled={getUnansweredCount() === 0}
            className="text-xs py-2 px-2"
          >
            Last Unanswered
          </Button>
        </div>
      </div>
    </div>
  );
} 