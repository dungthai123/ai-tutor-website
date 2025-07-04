import { Button } from '@/shared/components/ui/buttons/Button';
import { QuestionNavigationGrid } from './QuestionNavigationGrid';
import { PracticeTopicModel, HSKLevel } from '../../types';
import { TimerService } from '../../services/timer.service';

function getTotalTimeForLevel(level: HSKLevel): number {
  return level === HSKLevel.HSK4 || level === HSKLevel.HSK5 || level === HSKLevel.HSK6 ? 2400 : 1800;
}

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

  // New props
  topic?: PracticeTopicModel | null;
  timeElapsed: number;
  onExit: () => void;
}

export function TestNavigationSidebar({
  progressPercentage,
  answeredCount,
  unansweredCount,
  totalQuestions,
  canSubmitTest,
  onQuestionChange,
  onShowSubmitModal,
  topic,
  timeElapsed,
  onExit
}: TestNavigationSidebarProps) {
  const totalTime = topic ? getTotalTimeForLevel(topic.level) : 0;
  const timeRemaining = totalTime > 0 ? Math.max(totalTime - timeElapsed, 0) : 0;

  const format = (seconds: number) => TimerService.formatTime(seconds);

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col rounded-lg">
      {/* Navigation Header */}
      <div className="p-4 border-b border-gray-200 overflow-y-auto flex-shrink-0">
        {/* Topic Info */}
        {topic && (
          <div className="mb-4">
            <div className="bg-blue-600 text-white rounded-lg p-3 shadow-sm text-center">
              <div className="text-xs uppercase opacity-80">Online Course</div>
              <div className="text-sm font-semibold mt-1">{topic.title}</div>
            </div>
          </div>
        )}

        {/* Timer Section */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-600">Remaining</div>
            <div className="text-lg font-mono font-semibold text-gray-800">
              {format(timeRemaining)}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-600">Elapsed</div>
            <div className="text-lg font-mono font-semibold text-gray-800">
              {format(timeElapsed)}
            </div>
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
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* Submit Section */}
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

        {/* Exit Button */}
        <Button
          variant="secondary"
          onClick={onExit}
          className="w-full py-3 font-medium bg-gray-800 text-white hover:bg-gray-700"
        >
          Exit
        </Button>
      </div>
    </div>
  );
} 