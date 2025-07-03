'use client';

import { useState } from 'react';
import { useTestSessionStoreForReadingAndListening } from '@/lib/stores/testSessionStoreForReadingAndListening';
import { Button } from '@/shared/components/ui/buttons/Button';
import { QuestionNavigationGrid } from './QuestionNavigationGrid';
import { TestSubmissionModal } from './TestSubmissionModal';
import { cn } from '@/utils/helpers';

interface TestNavigationPanelProps {
  onQuestionChange?: (questionIndex: number) => void;
  className?: string;
}

export function TestNavigationPanel({ 
  onQuestionChange, 
  className 
}: TestNavigationPanelProps) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  const {
    currentPosition: currentQuestionIndex,
    quizList: questions,
    isNavigationPanelOpen,
    toggleNavigationPanel,
    getAnsweredCount,
    getUnansweredCount,
    getProgressPercentage,
    canSubmitTest,
    submitTest,
    getNextUnansweredQuestion,
    getPreviousUnansweredQuestion,
    goToQuestion: setCurrentQuestion,
  } = useTestSessionStoreForReadingAndListening();

  const handleQuestionSelect = (questionIndex: number) => {
    onQuestionChange?.(questionIndex);
  };

  const handleSubmitTest = async () => {
    await submitTest();
    setShowSubmitModal(false);
  };

  const handleNextUnanswered = () => {
    const nextIndex = getNextUnansweredQuestion();
    if (nextIndex !== null) {
      setCurrentQuestion(nextIndex);
      onQuestionChange?.(nextIndex);
    }
  };

  const handlePreviousUnanswered = () => {
    const prevIndex = getPreviousUnansweredQuestion();
    if (prevIndex !== null) {
      setCurrentQuestion(prevIndex);
      onQuestionChange?.(prevIndex);
    }
  };

  const answeredCount = getAnsweredCount();
  const unansweredCount = getUnansweredCount();
  const progressPercentage = getProgressPercentage();
  const totalQuestions = questions.length;

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed top-20 right-4 z-40">
        <Button
          variant="primary"
          onClick={toggleNavigationPanel}
          className={cn(
            "px-3 py-2 shadow-lg",
            isNavigationPanelOpen && "bg-blue-700"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">📋</span>
            <span className="hidden sm:inline">Questions</span>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
              {answeredCount}/{totalQuestions}
            </span>
          </div>
        </Button>
      </div>

      {/* Navigation Panel */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-30",
        "border-l border-gray-200 overflow-y-auto",
        isNavigationPanelOpen ? "translate-x-0" : "translate-x-full",
        className
      )}>
        {/* Panel Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Test Navigation
            </h2>
            <Button
              variant="secondary"
              onClick={toggleNavigationPanel}
              className="p-2"
            >
              ✕
            </Button>
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

        {/* Navigation Controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button
              variant="secondary"
              onClick={handlePreviousUnanswered}
              disabled={unansweredCount === 0}
              className="text-xs py-2"
            >
              ← Prev Unanswered
            </Button>
            <Button
              variant="secondary"
              onClick={handleNextUnanswered}
              disabled={unansweredCount === 0}
              className="text-xs py-2"
            >
              Next Unanswered →
            </Button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Current: Question {currentQuestionIndex + 1}
            </span>
          </div>
        </div>

        {/* Question Grid */}
        <div className="p-4">
          <QuestionNavigationGrid 
            onQuestionSelect={handleQuestionSelect}
            className="border-none p-0"
          />
        </div>

        {/* Submit Section */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="space-y-3">
            {/* Submit Button */}
            <Button
              variant="primary"
              onClick={() => setShowSubmitModal(true)}
              disabled={totalQuestions === 0}
              className={cn(
                "w-full py-3 font-medium",
                canSubmitTest() 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-orange-500 hover:bg-orange-600"
              )}
            >
              {canSubmitTest() ? (
                <div className="flex items-center justify-center gap-2">
                  <span>✅</span>
                  <span>Submit Test</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>⚠️</span>
                  <span>Submit Incomplete ({answeredCount}/{totalQuestions})</span>
                </div>
              )}
            </Button>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
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

      {/* Backdrop */}
      {isNavigationPanelOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-20"
          onClick={toggleNavigationPanel}
        />
      )}

      {/* Submit Modal */}
      <TestSubmissionModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirmSubmit={handleSubmitTest}
      />
    </>
  );
} 