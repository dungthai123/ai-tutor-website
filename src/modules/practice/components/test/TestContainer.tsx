import { useState } from 'react';
import { TestContainerProps } from '../../types';
import { useTestSession, useTestContainerSync } from '../../hooks';
import { TestStateRenderer } from './TestStateRenderer';
import { TestHeader } from './TestHeader';
import { TestContentArea } from './TestContentArea';
import { TestNavigationSidebar } from './TestNavigationSidebar';
import { TestSubmissionModal } from './TestSubmissionModal';

export function TestContainer({ testType, testId, onBack }: TestContainerProps) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // Main test session state and logic
  const testSession = useTestSession(testType, testId);
  const { state, actions, computed } = testSession;
  
  // Dual store synchronization and derived values
  const sync = useTestContainerSync({ testId, testType, testSession });
  
  // Handle test submission with modal
  const handleSubmitTest = async () => {
    await sync.handleSubmitTest();
    setShowSubmitModal(false);
    // Complete the test to trigger results screen
    actions.completeTest();
  };

  // Handle navigation from results screen
  const handleBackToTopics = () => {
    onBack();
  };

  const handleViewAnswers = () => {
    // TODO: Implement answer review functionality
    console.log('View answers functionality to be implemented');
  };

  return (
    <TestStateRenderer
      state={{
        loading: state.loading,
        error: state.error,
        isCompleted: state.isCompleted,
        score: state.score,
        topic: state.topic,
        questions: state.questions,
        currentQuestion: computed.currentQuestion,
      }}
      testType={testType}
      testId={testId}
      onRetry={actions.resetTest}
      onBackToTopics={handleBackToTopics}
      onViewAnswers={handleViewAnswers}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header with back button and topic info */}
        <TestHeader
        />

        {/* Main Content Layout */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Side - Navigation Panel (Fixed Width) */}
          <div className="flex-shrink-0 w-80">
            <TestNavigationSidebar
              topic={state.topic}
              timeElapsed={state.timeElapsed}
              onExit={onBack}
              progressPercentage={sync.progressPercentage}
              answeredCount={sync.answeredCount}
              unansweredCount={sync.unansweredCount}
              totalQuestions={state.questions.length}
              canSubmitTest={sync.navigationStore.canSubmitTest()}
              onQuestionChange={sync.handleQuestionChange}
              onShowSubmitModal={() => setShowSubmitModal(true)}
            />
          </div>

          {/* Right Side - Test Content (Flexible Width) */}
          <div className="flex-1 min-w-0">
            <TestContentArea
              testType={testType}
              currentQuestion={computed.currentQuestion!}
              currentPosition={state.currentPosition}
              totalQuestions={state.questions.length}
              selectedAnswer={state.selectedAnswers[state.currentPosition]}
              onAnswerSelected={sync.handleAnswerSelected}
              onNext={sync.handleNext}
              onPrevious={sync.handlePrevious}
              canGoNext={sync.navigationStore.canGoNext()}
              canGoPrevious={sync.navigationStore.canGoPrevious()}
              isLastQuestion={sync.navigationStore.isLastQuestion()}
            />
          </div>
        </div>

        {/* Submit Modal */}
        <TestSubmissionModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onConfirmSubmit={handleSubmitTest}
        />
      </div>
    </TestStateRenderer>
  );
} 