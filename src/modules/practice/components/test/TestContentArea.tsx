import { ListeningQuestionContent } from '../questions/ListeningQuestionContent';
import { ReadingQuestionContent } from '../questions/ReadingQuestionContent';
import { WritingQuestionContent } from '../questions/WritingQuestionContent';
import { AnswerSection } from '../answers/AnswerSection';
import { QuestionNavigation } from './QuestionNavigation';
import { PracticeType, ListeningQuizModel, ReadingQuizModel, WritingQuizModel, QuizModel, HSKLevel } from '../../types';

interface TestContentAreaProps {
  testType: PracticeType;
  currentQuestion: QuizModel;
  currentPosition: number;
  totalQuestions: number;
  selectedAnswer: number | string | undefined;
  onAnswerSelected: (answer: number | string) => void;
  // Navigation props
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  // HSK level for question rendering
  hskLevel?: HSKLevel;
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
  isLastQuestion,
  hskLevel
}: TestContentAreaProps) {

  return (
    <div className="flex flex-col h-full">
      {/* Question Content - Takes remaining space */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-lg leading-relaxed">
          {/* Question Content with larger text */}
          {testType === PracticeType.LISTENING ? (
            <ListeningQuestionContent
              quizModel={currentQuestion as ListeningQuizModel}
              questionIndex={currentPosition}
              totalQuestions={totalQuestions}
            />
          ) : testType === PracticeType.READING ? (
            <ReadingQuestionContent
              quizModel={currentQuestion as ReadingQuizModel}
              questionIndex={currentPosition}
              totalQuestions={totalQuestions}
              hskLevel={hskLevel}
            />
          ) : (
            <WritingQuestionContent
              quizModel={currentQuestion as WritingQuizModel}
              questionIndex={currentPosition}
              totalQuestions={totalQuestions}
              onAnswerSelected={onAnswerSelected}
              selectedAnswer={selectedAnswer}
            />
          )}
        </div>
      </div>

      {/* Answer Section - Fixed at bottom with smaller text */}
      {testType !== PracticeType.WRITING && (
        <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
          <div className="text-base">
            <AnswerSection
              quizModel={currentQuestion}
              onAnswerSelected={onAnswerSelected}
              selectedAnswer={selectedAnswer as number | undefined}
              showFeedback={false}
              showTranslation={false}
            />
          </div>
        </div>
      )}

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