import { QuestionNavigationProps } from '../../types';
import { cn } from '@/utils/helpers';
import { QuizModel } from '../../types';

interface ExtendedQuestionNavigationProps extends QuestionNavigationProps {
  currentQuestion?: QuizModel;
}

export function QuestionNavigation({
  currentPosition,
  totalQuestions,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
  className,
  currentQuestion
}: ExtendedQuestionNavigationProps) {
  return (
    <div className={cn('mt-6 space-y-3', className)}>
      <div className="flex gap-3">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={cn(
            'flex-1 px-4 py-2 rounded-lg transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'bg-gray-200 text-gray-700 hover:bg-gray-300',
            'w-40 h-12 bg-gray-500 cursor-pointer select-none active:translate-y-2 active:[box-shadow:0_0px_0_0_#4a5568,0_0px_0_0_#4a556841] active:border-b-[0px] transition-all duration-150 [box-shadow:0_10px_0_0_#4a5568,0_15px_0_0_#4a556841] border-b-[1px] border-gray-400'
          )}
        >
          <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg">← Previous</span>
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={cn(
            'flex-1 px-4 py-2 rounded-lg transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'bg-blue-500 text-white hover:bg-blue-600',
            'w-40 h-12 cursor-pointer select-none active:translate-y-2 active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841] active:border-b-[0px] transition-all duration-150 [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841] border-b-[1px] border-blue-400'
          )}
        >
          <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg">{isLastQuestion ? 'Finish' : 'Next →'}</span>
        </button>
      </div>
      
      {/* Progress indicator */}
      <div className="text-center text-sm text-text-secondary">
        Question {currentQuestion?.id || (currentPosition + 1)} of {totalQuestions}
      </div>
    </div>
  );
} 