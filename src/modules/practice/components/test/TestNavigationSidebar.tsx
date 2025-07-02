import { Button } from '@/shared/components/ui/buttons/Button';
import { QuestionNavigationGrid } from './QuestionNavigationGrid';

interface TestNavigationSidebarProps {
  // Progress data
  progressPercentage: number;
  answeredCount: number;
  unansweredCount: number;
  
  // Navigation state
  totalQuestions: number;
  canSubmitTest: boolean;
  
  // Event handlers
  onQuestionChange: (questionIndex: number) => void;
  onShowSubmitModal: () => void;
}

export function TestNavigationSidebar({
  progressPercentage,
  answeredCount,
  unansweredCount,
  totalQuestions,
  canSubmitTest,
  onQuestionChange,
  onShowSubmitModal
}: TestNavigationSidebarProps) {
  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col rounded-lg">
      {/* Navigation Header */}
      <div className="p-4 border-b border-gray-200">


        {/* Progress Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress:</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-600">
            <span>Answered: {answeredCount}</span>
            <span>Remaining: {unansweredCount}</span>
          </div>
        </div>
      </div>

      {/* Question Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <QuestionNavigationGrid 
          onQuestionSelect={onQuestionChange}
          className="border-none p-0"
        />
      </div>

      {/* Navigation Controls */}
      <div className="p-4 border-t border-gray-200">
        {/* Submit Section */}
        <div className="border-t border-gray-200 pt-4">
          <Button
            variant="primary"
            onClick={onShowSubmitModal}
            disabled={totalQuestions === 0}
            className={`w-full py-3 font-medium ${
              canSubmitTest 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {canSubmitTest ? (
              <div className="flex items-center justify-center gap-2">
                <span>✅</span>
                <span>Submit Test</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>Submit ({answeredCount}/{totalQuestions})</span>
              </div>
            )}
          </Button>

        </div>
      </div>
    </div>
  );
} 