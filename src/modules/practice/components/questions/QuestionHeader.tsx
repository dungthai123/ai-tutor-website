import { useEffect } from 'react';
import { PracticeTopicModel } from '../../types';
import { Button } from '@/shared/components/ui/buttons/Button';
import { usePracticeDetailStore } from '@/lib/stores/practiceDetailStore';

interface QuestionHeaderProps {
  topicModel: PracticeTopicModel;
  onBack: () => void;
  onShowQuestionList?: () => void;
  onShowSettings?: () => void;
}

export function QuestionHeader({ 
  topicModel, 
  onBack, 
  onShowQuestionList,
  onShowSettings 
}: QuestionHeaderProps) {
  const {
    currentTime,
    totalTime,
    isTimerRunning,
    updateTimer,
    getProgress
  } = usePracticeDetailStore();

  const progress = getProgress();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning) {
      interval = setInterval(updateTimer, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, updateTimer]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const timeRemaining = totalTime - currentTime;
  const isTimeWarning = timeRemaining <= 300; // Last 5 minutes

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* Left side - Back button */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          ← Back
        </Button>
        
        <div className="text-sm text-gray-600">
          <span className="font-medium">{topicModel.title}</span>
          <span className="ml-2">• {topicModel.level}</span>
        </div>
      </div>

      {/* Center - Progress */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Question {progress.current} of {progress.total}
          </span>
          
          {/* Progress bar */}
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
          isTimeWarning 
            ? 'bg-red-100 text-red-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          <span className="text-sm">⏱️</span>
          <span className={`font-mono text-sm font-medium ${
            isTimeWarning ? 'animate-pulse' : ''
          }`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2">
        {onShowQuestionList && (
          <Button
            variant="secondary"
            onClick={onShowQuestionList}
            className="flex items-center gap-1 text-sm px-3 py-1"
          >
            📋 Questions
          </Button>
        )}
        
        {onShowSettings && (
          <Button
            variant="secondary"
            onClick={onShowSettings}
            className="flex items-center gap-1 text-sm px-3 py-1"
          >
            ⚙️ Settings
          </Button>
        )}
      </div>
    </div>
  );
} 