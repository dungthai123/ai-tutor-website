'use client';

import { useTestSessionStoreForReadingAndListening } from '@/lib/stores/testSessionStoreForReadingAndListening';
import { cn } from '@/utils/helpers';
import { QuizModel } from '../../types';

interface QuestionNavigationGridProps {
  onQuestionSelect?: (questionIndex: number) => void;
  className?: string;
}

interface QuestionGroup {
  type: string;
  questions: Array<{ question: QuizModel; globalIndex: number }>;
  title: string;
}

export function QuestionNavigationGrid({ 
  onQuestionSelect, 
  className 
}: QuestionNavigationGridProps) {
  const {
    quizList: questions,
    goToQuestion: setCurrentQuestion,
    markQuestionAsReviewed,
    getQuestionStatus,
  } = useTestSessionStoreForReadingAndListening();

  const handleQuestionClick = (index: number) => {
    setCurrentQuestion(index);
    markQuestionAsReviewed(index);
    onQuestionSelect?.(index);
  };

  const getQuestionButtonStyle = (index: number) => {
    const status = getQuestionStatus(index);
    
    if (status.isCurrent) {
      return 'bg-green-600 text-white shadow-md';
    }
    
    if (status.isAnswered) {
      return 'bg-blue-600 text-white';
    }
    
    return 'bg-blue-200 text-blue-600';
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
            {group.questions.map(({ globalIndex }) => {
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
      ))}
    </div>
  );
} 