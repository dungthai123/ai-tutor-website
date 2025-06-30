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
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Navigation Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Test Navigation
          </h3>
          <div className="text-sm text-gray-500">
            Time: 777:40
          </div>
        </div>

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

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-xs text-center mt-3">
            <div className="p-2 bg-green-50 rounded">
              <div className="font-medium text-green-700">{answeredCount}</div>
              <div className="text-green-600">Answered</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-medium text-gray-700">{unansweredCount}</div>
              <div className="text-gray-600">Remaining</div>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <div className="font-medium text-blue-700">{progressPercentage}%</div>
              <div className="text-blue-600">Complete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 