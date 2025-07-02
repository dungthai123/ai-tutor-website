import { ListeningQuestionContent } from '../questions/ListeningQuestionContent';
import { ReadingQuestionContent } from '../questions/ReadingQuestionContent';
import { AnswerSection } from '../answers/AnswerSection';
import { QuestionNavigation } from './QuestionNavigation';
import { PracticeType, ListeningQuizModel, ReadingQuizModel, QuizModel } from '../../types';

interface TestContentAreaProps {
  testType: PracticeType;
  currentQuestion: QuizModel;
  currentPosition: number;
  totalQuestions: number;
  selectedAnswer: number | undefined;
  onAnswerSelected: (answerIndex: number) => void;
  // Navigation props
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
}

export function TestContentArea({
  testType,
  currentQuestion,
  currentPosition,
  totalQuestions,
  selectedAnswer,
  onAnswerSelected,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastQuestion
}: TestContentAreaProps) {

  return (
    <div className="flex flex-col h-full">
      {/* Question and Answer Section - Combined in same container */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Question Content */}
          {testType === PracticeType.LISTENING ? (
            <ListeningQuestionContent
              quizModel={currentQuestion as ListeningQuizModel}
              questionIndex={currentPosition}
              totalQuestions={totalQuestions}
            />
          ) : (
            <ReadingQuestionContent
              quizModel={currentQuestion as ReadingQuizModel}
              questionIndex={currentPosition}
              totalQuestions={totalQuestions}
            />
          )}
          {/* Answer Section */}
          <AnswerSection
            quizModel={currentQuestion}
            onAnswerSelected={onAnswerSelected}
            selectedAnswer={selectedAnswer}
            showFeedback={false}
            showTranslation={false}
          />
        </div>
      </div>

      {/* Navigation Controls - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white p-3">
        <QuestionNavigation
          currentPosition={currentPosition}
          totalQuestions={totalQuestions}
          onNext={onNext}
          onPrevious={onPrevious}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          isLastQuestion={isLastQuestion}
        />
      </div>
    </div>
  );
} 