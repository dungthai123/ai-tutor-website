import { useEffect } from 'react';
import { TestContainerProps } from '../../types';
import { useTestSession } from '../../hooks';
import { useTestNavigationStore } from '@/lib/stores/testNavigationStore';
import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';
import { TestResults } from './TestResults';
import { QuestionNavigationGrid } from './QuestionNavigationGrid';
import { TestSubmissionModal } from './TestSubmissionModal';
import { ListeningQuestionContent } from '../questions/ListeningQuestionContent';
import { AnswerSection } from '../answers/AnswerSection';
import { QuestionNavigation } from './QuestionNavigation';
import { PracticeType, ListeningQuizModel } from '../../types';
import { Button } from '@/shared/components/ui/buttons/Button';
import { useState } from 'react';

export function TestContainer({ testType, testId, onBack }: TestContainerProps) {
  const { state, actions, computed } = useTestSession(testType, testId);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // Navigation store integration
  const {
    initializeTest: initNavigationTest,
    setAnswer: setNavigationAnswer,
    currentQuestionIndex: navigationCurrentIndex,
    nextQuestion: navigationNext,
    previousQuestion: navigationPrevious,
    canGoNext: navigationCanGoNext,
    canGoPrevious: navigationCanGoPrevious,
    isLastQuestion: navigationIsLastQuestion,
    getUnansweredCount,
    getProgressPercentage,
    canSubmitTest,
    submitTest,
    setCurrentQuestion: setNavigationQuestion,
  } = useTestNavigationStore();

  // Calculate answered count
  const answeredCount = Object.keys(state.selectedAnswers).length;

  // Sync navigation store with test session state
  useEffect(() => {
    if (state.questions.length > 0 && !state.loading) {
      initNavigationTest(testId, testType, state.questions);
    }
  }, [state.questions, state.loading, testId, testType, initNavigationTest]);

  // Sync current question between stores
  useEffect(() => {
    if (navigationCurrentIndex !== state.currentPosition) {
      actions.goToQuestion(navigationCurrentIndex);
    }
  }, [navigationCurrentIndex, state.currentPosition, actions]);

  // Sync answers between stores
  useEffect(() => {
    if (state.selectedAnswers[state.currentPosition] !== undefined) {
      setNavigationAnswer(state.currentPosition, state.selectedAnswers[state.currentPosition]);
    }
  }, [state.selectedAnswers, state.currentPosition, setNavigationAnswer]);

  // Handle question change from navigation panel
  const handleQuestionChange = (questionIndex: number) => {
    actions.goToQuestion(questionIndex);
    setNavigationQuestion(questionIndex);
  };

  // Handle navigation actions
  const handleNext = () => {
    navigationNext();
    actions.goToQuestion(navigationCurrentIndex + 1);
  };

  const handlePrevious = () => {
    navigationPrevious();
    actions.goToQuestion(navigationCurrentIndex - 1);
  };

  // Handle answer selection with dual store update
  const handleAnswerSelected = (answerIndex: number) => {
    actions.setAnswer(answerIndex);
    setNavigationAnswer(state.currentPosition, answerIndex);
  };

  // Handle test submission
  const handleSubmitTest = async () => {
    await submitTest();
    setShowSubmitModal(false);
    // You can add navigation to results page here
  };

  // Loading state
  if (state.loading) {
    return <LoadingState />;
  }

  // Error state
  if (state.error) {
    return (
      <EmptyState 
        title="Test Load Error"
        description={state.error}
        showRetry={true}
        onRetry={actions.resetTest}
      />
    );
  }

  // Test completed - show results
  if (state.isCompleted && state.score) {
    return (
      <div className="max-w mx-auto py-8">
        <TestResults 
          score={state.score} 
          testType={testType} 
          testId={testId} 
        />
      </div>
    );
  }

  // No questions loaded
  if (!computed.currentQuestion || state.questions.length === 0) {
    return (
      <EmptyState 
        title="No Questions Available"
        description="This test doesn't have any questions available."
        showRetry={true}
        onRetry={actions.resetTest}
      />
    );
  }

  // No topic loaded
  if (!state.topic) {
    return (
      <EmptyState 
        title="Test Configuration Error"
        description="Unable to load test configuration."
        showRetry={true}
        onRetry={actions.resetTest}
      />
    );
  }

  const progressPercentage = getProgressPercentage();
  const unansweredCount = getUnansweredCount();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button and topic info */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            ← Back
          </Button>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">{state.topic.title}</span>
            <span className="ml-2">• {state.topic.level}</span>
          </div>
        </div>
      </div>


      {/* Main Content Layout */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Side - Test Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Question Content - 2/3 width */}
              <div className="lg:col-span-2">
                {testType === PracticeType.LISTENING ? (
                  <ListeningQuestionContent
                    quizModel={computed.currentQuestion as ListeningQuizModel}
                    questionIndex={state.currentPosition}
                    totalQuestions={state.questions.length}
                  />
                ) : (
                  // Reading question content component would go here
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">
                      Reading Question {state.currentPosition + 1}
                    </h3>
                    <p>{computed.currentQuestion.question}</p>
                    {/* Add ReadingQuestionContent component */}
                  </div>
                )}
              </div>

              {/* Answer Section - 1/3 width */}
              <div className="lg:col-span-1">
                <AnswerSection
                  quizModel={computed.currentQuestion}
                  onAnswerSelected={handleAnswerSelected}
                  selectedAnswer={state.selectedAnswers[state.currentPosition]}
                  showFeedback={false}
                  showTranslation={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Navigation Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
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
              onQuestionSelect={handleQuestionChange}
              className="border-none p-0"
            />
          </div>

          {/* Navigation Controls */}
          <div className="p-4 border-t border-gray-200">
            <QuestionNavigation
              currentPosition={navigationCurrentIndex}
              totalQuestions={state.questions.length}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canGoNext={navigationCanGoNext()}
              canGoPrevious={navigationCanGoPrevious()}
              isLastQuestion={navigationIsLastQuestion()}
              className="mb-4"
            />

            {/* Submit Section */}
            <div className="border-t border-gray-200 pt-4">
              <Button
                variant="primary"
                onClick={() => setShowSubmitModal(true)}
                disabled={state.questions.length === 0}
                className={`w-full py-3 font-medium ${
                  canSubmitTest() 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {canSubmitTest() ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>✅</span>
                    <span>Submit Test</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>⚠️</span>
                    <span>Submit ({answeredCount}/{state.questions.length})</span>
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
      </div>

      {/* Submit Modal */}
      <TestSubmissionModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirmSubmit={handleSubmitTest}
      />
    </div>
  );
} 