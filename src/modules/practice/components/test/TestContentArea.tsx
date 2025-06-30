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
      {/* Question and Answer Section - Takes remaining height */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="h-full">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Question Content - 2/3 width */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="flex-1 overflow-y-auto">
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
              </div>
            </div>

            {/* Answer Section - 1/3 width */}
            <div className="lg:col-span-1 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <AnswerSection
                  quizModel={currentQuestion}
                  onAnswerSelected={onAnswerSelected}
                  selectedAnswer={selectedAnswer}
                  showFeedback={false}
                  showTranslation={false}
                />
              </div>
            </div>
          </div>
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