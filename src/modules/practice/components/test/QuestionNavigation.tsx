import { QuestionNavigationProps } from '../../types';
import { cn } from '@/utils/helpers';

export function QuestionNavigation({
  currentPosition,
  totalQuestions,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
  className
}: QuestionNavigationProps) {
  return (
    <div className={cn('mt-6 space-y-3', className)}>
      <div className="flex gap-3">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={cn(
            'flex-1 px-4 py-2 rounded-lg transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'bg-gray-200 text-gray-700 hover:bg-gray-300'
          )}
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={cn(
            'flex-1 px-4 py-2 rounded-lg transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'bg-blue-500 text-white hover:bg-blue-600'
          )}
        >
          {isLastQuestion ? 'Finish' : 'Next →'}
        </button>
      </div>
      
      {/* Progress indicator */}
      <div className="text-center text-sm text-text-secondary">
        Question {currentPosition + 1} of {totalQuestions}
      </div>
    </div>
  );
} 