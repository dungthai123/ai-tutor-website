import { QuizModel } from '../../types';
import { Card } from '@/shared/components/ui/cards/Card';
import { Button } from '@/shared/components/ui/buttons/Button';

interface AnswerPanelProps {
  question: QuizModel;
  selectedAnswer: number | undefined;
  onAnswerSelect: (answerIndex: number) => void;
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function AnswerPanel({
  question,
  selectedAnswer,
  onAnswerSelect,
  currentIndex,
  totalQuestions,
  answeredCount,
  onPrevious,
  onNext,
  onSubmit
}: AnswerPanelProps) {
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const canSubmit = answeredCount > 0;

  return (
    <Card className="p-6">
      <h4 className="font-semibold mb-4">Choose your answer:</h4>
      <div className="space-y-3">
        {question.optionList?.map((option, index) => (
          <button
            key={option.id}
            onClick={() => onAnswerSelect(index)}
            className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="font-semibold mr-2">
              {String.fromCharCode(65 + index)}.
            </span>
            {option.text}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-6 pt-6 border-t space-y-3">
        <div className="flex gap-3">
          <Button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            variant="secondary"
            className="flex-1"
          >
            ← Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={isLastQuestion}
            className="flex-1"
          >
            Next →
          </Button>
        </div>
        
        {isLastQuestion && (
          <Button
            onClick={onSubmit}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!canSubmit}
          >
            Submit Test
          </Button>
        )}
      </div>
    </Card>
  );
} 