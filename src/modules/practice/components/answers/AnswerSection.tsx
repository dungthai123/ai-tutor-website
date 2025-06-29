import { QuizModel, TypeAnswer } from '../../types';
import { Card } from '@/shared/components/ui/cards/Card';

interface AnswerSectionProps {
  quizModel: QuizModel;
  onAnswerSelected: (answerIndex: number) => void;
  selectedAnswer?: number;
  showFeedback?: boolean;
  showTranslation?: boolean;
}

export function AnswerSection({ 
  quizModel, 
  onAnswerSelected, 
  selectedAnswer,
  showFeedback = false,
  showTranslation = false 
}: AnswerSectionProps) {
  const correctAnswerIndex = parseInt(quizModel.correctAnswer) - 1;

  const renderTrueFalseAnswers = () => (
    <div className="space-y-3">
      {['True', 'False'].map((option, index) => {
        const isSelected = selectedAnswer === index;
        const isCorrect = index === correctAnswerIndex;
        const showCorrectness = showFeedback;
        
        return (
          <button
            key={index}
            onClick={() => onAnswerSelected(index)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all font-medium ${
              isSelected && !showCorrectness
                ? 'border-blue-500 bg-blue-50'
                : showCorrectness && isCorrect
                ? 'border-green-500 bg-green-50 text-green-700'
                : showCorrectness && isSelected && !isCorrect
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {option === 'True' ? '✓' : '✗'}
              </span>
              <span>{option}</span>
              {showCorrectness && isCorrect && (
                <span className="ml-auto text-green-600">✓</span>
              )}
              {showCorrectness && isSelected && !isCorrect && (
                <span className="ml-auto text-red-600">✗</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderImageSelectionAnswers = () => (
    <div className="grid grid-cols-2 gap-4">
      {quizModel.optionList?.map((option, index) => {
        const isSelected = selectedAnswer === index;
        const isCorrect = index === correctAnswerIndex;
        const showCorrectness = showFeedback;
        
        return (
          <button
            key={option.id}
            onClick={() => onAnswerSelected(index)}
            className={`p-3 rounded-lg border-2 transition-all ${
              isSelected && !showCorrectness
                ? 'border-blue-500 bg-blue-50'
                : showCorrectness && isCorrect
                ? 'border-green-500 bg-green-50'
                : showCorrectness && isSelected && !isCorrect
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="relative">
              {option.imageUrl ? (
                <img
                  src={option.imageUrl}
                  alt={`Option ${index + 1}`}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {String.fromCharCode(65 + index)}.
                </span>
                {showCorrectness && isCorrect && (
                  <span className="text-green-600">✓</span>
                )}
                {showCorrectness && isSelected && !isCorrect && (
                  <span className="text-red-600">✗</span>
                )}
              </div>
              
              <p className="text-sm mt-1">{option.text}</p>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderWordMatchingGrid = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Select the correct word that matches the audio/context:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quizModel.optionList?.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === correctAnswerIndex;
          const showCorrectness = showFeedback;
          
          return (
            <button
              key={option.id}
              onClick={() => onAnswerSelected(index)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                isSelected && !showCorrectness
                  ? 'border-blue-500 bg-blue-50'
                  : showCorrectness && isCorrect
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : showCorrectness && isSelected && !isCorrect
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {option.imageUrl && (
                  <img
                    src={option.imageUrl}
                    alt={`Option ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <span className="font-medium">{option.text}</span>
                {showCorrectness && isCorrect && (
                  <span className="text-green-600">✓</span>
                )}
                {showCorrectness && isSelected && !isCorrect && (
                  <span className="text-red-600">✗</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderMultipleChoiceAnswers = () => (
    <div className="space-y-3">
      {quizModel.optionList?.map((option, index) => {
        const isSelected = selectedAnswer === index;
        const isCorrect = index === correctAnswerIndex;
        const showCorrectness = showFeedback;
        
        return (
          <button
            key={option.id}
            onClick={() => onAnswerSelected(index)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              isSelected && !showCorrectness
                ? 'border-blue-500 bg-blue-50'
                : showCorrectness && isCorrect
                ? 'border-green-500 bg-green-50 text-green-700'
                : showCorrectness && isSelected && !isCorrect
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-semibold">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span>{option.text}</span>
              </div>
              {showCorrectness && isCorrect && (
                <span className="text-green-600">✓</span>
              )}
              {showCorrectness && isSelected && !isCorrect && (
                <span className="text-red-600">✗</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderAnswers = () => {
    switch (quizModel.typeAnswer) {
      case TypeAnswer.TRUE_FALSE:
        return renderTrueFalseAnswers();
      
      case TypeAnswer.IMAGE_SELECTION:
        return renderImageSelectionAnswers();
      
      case TypeAnswer.WORD_MATCHING:
        return renderWordMatchingGrid();
      
      case TypeAnswer.QUESTION_ANSWER:
      default:
        return renderMultipleChoiceAnswers();
    }
  };

  return (
    <Card className="p-6">
      <h4 className="font-semibold mb-4">Choose your answer:</h4>
      
      {renderAnswers()}

      {/* Show correct answer translation if available and feedback is shown */}
      {showFeedback && showTranslation && quizModel.correctAnswerTranslation && (
        <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            <strong>Correct Answer Translation:</strong> {quizModel.correctAnswerTranslation}
          </p>
        </div>
      )}

      {/* Show options translation if available */}
      {showTranslation && quizModel.optionListText && (
        <div className="mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-800">
            <strong>Options Translation:</strong> {quizModel.optionListText}
          </p>
        </div>
      )}
    </Card>
  );
} 