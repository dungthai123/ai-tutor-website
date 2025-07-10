import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TestContainerProps, HSKLevel } from '../../types';
import { useTestSession, useTestContainerSync, useReviewSession } from '../../hooks';
import { TestStateRenderer } from './TestStateRenderer';
import { TestHeader } from './TestHeader';
import { TestContentArea } from './TestContentArea';
import { TestNavigationSidebar } from './TestNavigationSidebar';
import { TestSubmissionModal } from './TestSubmissionModal';
import { HistoryService } from '../../services/history.service';

export function TestContainer({ 
  testType, 
  testId, 
  onBack, 
  mode = 'practice',
  historyData 
}: TestContainerProps) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const router = useRouter();
  
  // Always call hooks unconditionally
  const practiceSession = useTestSession(testType, testId);
  const reviewSession = useReviewSession(historyData || {
    historyId: '',
    testId,
    testType,
    completedAt: '',
    topic: { id: '', title: '', displayOrder: 0, level: HSKLevel.HSK1, typePractice: testType, totalQuestions: 0, totalListeningQuestions: 0, totalReadingQuestions: 0, totalWritingQuestions: 0 },
    questions: [],
    selectedAnswers: {},
    score: { correct: 0, total: 0, percentage: 0, right: 0, wrong: 0, skip: 0, score: 0 },
    level: HSKLevel.HSK1
  });
  const sync = useTestContainerSync({ testId, testType, testSession: practiceSession });
  
  // Select the appropriate session based on mode
  const testSession = mode === 'review' && historyData ? reviewSession : practiceSession;
  const { state, actions, computed } = testSession;
  
  const isReviewMode = mode === 'review';
  
  // Handle test submission with modal
  const handleSubmitTest = async () => {
    if (sync) {
    await sync.handleSubmitTest();
    }
    setShowSubmitModal(false);
    // Complete the test to trigger results screen
    actions.completeTest();
  };

  // Handle navigation from results screen
  const handleBackToTopics = () => {
    // Cleanup timer before exiting
    practiceSession.actions.cleanupTest();
    onBack();
  };

  const handleViewAnswers = () => {
    // For completed tests, find the history entry and navigate to review page
    if (!isReviewMode && state.isCompleted && state.score && state.topic) {
      // The test should already be saved to history by useTestSession
      // Find the most recent history entry for this test
      const historyItems = HistoryService.getTestHistory();
      const matchingItem = historyItems.find(item => 
        item.testId === testId && 
        item.testType === testType &&
        item.topic.id === state.topic!.id
      );
      
      if (matchingItem) {
        // Navigate to existing history entry
        router.push(`/history/${matchingItem.historyId}`);
      } else {
        // Fallback: create new history entry if not found
        const historyItem = {
          historyId: `${testId}-${Date.now()}`,
          testId,
          testType,
          completedAt: new Date().toISOString(),
          topic: state.topic,
          questions: state.questions,
          selectedAnswers: state.selectedAnswers,
          score: state.score,
          level: state.topic.level,
        };
        
        HistoryService.saveTestToHistory(historyItem);
        router.push(`/history/${historyItem.historyId}`);
      }
    }
  };

  // In review mode, don't show results screen - stay in review interface
  if (isReviewMode && state.isCompleted) {
    // Override the completed state for review mode to show the test interface
    const reviewState = { ...state, isCompleted: false };
    
    return (
      <TestStateRenderer
        state={{
          loading: reviewState.loading,
          error: reviewState.error,
          isCompleted: reviewState.isCompleted,
          score: reviewState.score,
          topic: reviewState.topic,
          questions: reviewState.questions,
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
          <TestHeader />

          {/* Main Content Layout */}
          <div className="flex h-[calc(100vh-80px)]">
            {/* Left Side - Navigation Panel (Fixed Width) */}
            <div className="flex-shrink-0 w-80">
              <TestNavigationSidebar
                topic={state.topic}
                timeElapsed={isReviewMode ? 0 : practiceSession.state.timeElapsed}
                onExit={() => {
                  // Cleanup timer before exiting
                  practiceSession.actions.cleanupTest();
                  onBack();
                }}
                progressPercentage={computed.progress.percentage}
                answeredCount={Object.keys(state.selectedAnswers).length}
                unansweredCount={state.questions.length - Object.keys(state.selectedAnswers).length}
                totalQuestions={state.questions.length}
                canSubmitTest={false} // No submit in review mode
                onQuestionChange={actions.goToQuestion}
                onShowSubmitModal={() => {}} // No submit modal in review mode
                mode={mode === 'review' ? 'practice' : mode} // Map review to practice for now
                isReviewMode={isReviewMode}
                reviewSelectedAnswers={state.selectedAnswers}
                reviewQuestions={state.questions}
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
                onAnswerSelected={actions.setAnswer} // No-op in review mode
                onNext={actions.nextQuestion}
                onPrevious={actions.previousQuestion}
                canGoNext={computed.canGoNext}
                canGoPrevious={computed.canGoPrevious}
                isLastQuestion={computed.isLastQuestion}
                hskLevel={state.topic?.level}
              />
            </div>
          </div>
        </div>
      </TestStateRenderer>
    );
  }

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
        <TestHeader />

        {/* Main Content Layout */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Side - Navigation Panel (Fixed Width) */}
          <div className="flex-shrink-0 w-80">
            <TestNavigationSidebar
              topic={state.topic}
              timeElapsed={practiceSession.state.timeElapsed}
              onExit={() => {
                // Cleanup timer before exiting
                practiceSession.actions.cleanupTest();
                onBack();
              }}
              progressPercentage={sync?.progressPercentage || computed.progress.percentage}
              answeredCount={sync?.answeredCount || Object.keys(state.selectedAnswers).length}
              unansweredCount={sync?.unansweredCount || (state.questions.length - Object.keys(state.selectedAnswers).length)}
              totalQuestions={state.questions.length}
              canSubmitTest={sync?.navigationStore.canSubmitTest() || false}
              onQuestionChange={sync?.handleQuestionChange || actions.goToQuestion}
              onShowSubmitModal={() => setShowSubmitModal(true)}
              mode={mode === 'review' ? 'practice' : mode}
              isReviewMode={isReviewMode}
              reviewSelectedAnswers={isReviewMode ? state.selectedAnswers : undefined}
              reviewQuestions={isReviewMode ? state.questions : undefined}
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
              onAnswerSelected={sync?.handleAnswerSelected || actions.setAnswer}
              onNext={sync?.handleNext || actions.nextQuestion}
              onPrevious={sync?.handlePrevious || actions.previousQuestion}
              canGoNext={sync?.navigationStore.canGoNext() || computed.canGoNext}
              canGoPrevious={sync?.navigationStore.canGoPrevious() || computed.canGoPrevious}
              isLastQuestion={sync?.navigationStore.isLastQuestion() || computed.isLastQuestion}
              hskLevel={state.topic?.level}
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