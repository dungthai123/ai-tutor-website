/**
 * AnswerSection - HSK Answer Handling Component
 * 
 * Implements complete answer type handling as per the HSK plan:
 * - TRUE_FALSE: Binary true/false answers with Vietnamese labels
 * - IMAGE_SELECTION: Grid-based image selection with responsive layout
 * - WORD_MATCHING: Compact grid for image-text matching
 * - QUESTION_ANSWER: Traditional multiple choice answers
 * 
 * Features:
 * - Visual feedback for selected answers
 * - Correct/incorrect highlighting when showFeedback is enabled
 * - Responsive grid layouts based on answer count
 * - Translation support for answer options
 * - Consistent styling across all answer types
 */

import { QuizModel, TypeAnswer } from '../../types';
import { usePracticeDetailStore } from '@/lib/stores/practiceDetailStore';
import { getFontSizeClasses } from '../../utils';

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
  const { fontSize } = usePracticeDetailStore();
  const fontClasses = getFontSizeClasses(fontSize);
  const correctAnswerIndex = parseInt(quizModel.correctAnswer) - 1;

  const renderTrueFalseAnswers = () => (
    <div className="grid grid-cols-2 gap-4">
      {['Sai', 'Đúng'].map((option, index) => {
        const isSelected = selectedAnswer === index;
        const isCorrect = index === correctAnswerIndex;
        const showCorrectness = showFeedback;
        
        return (
          <button
            key={index}
            onClick={() => onAnswerSelected(index)}
            className={`p-4 rounded-xl text-center font-semibold text-lg transition-all ${
              isSelected && !showCorrectness
                ? 'bg-blue-600 text-white shadow-md'
                : showCorrectness && isCorrect
                ? 'bg-green-500 text-white shadow-md'
                : showCorrectness && isSelected && !isCorrect
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );

  const renderImageSelectionAnswers = () => {
    // Determine grid layout based on number of options
    const optionCount = quizModel.optionList?.length || 0;
    const gridCols = optionCount <= 2 ? 'grid-cols-1 md:grid-cols-2' : 
                     optionCount <= 4 ? 'grid-cols-2' : 
                     'grid-cols-2 md:grid-cols-3';

    return (
      <div className={`grid ${gridCols} gap-4`}>
        {quizModel.optionList?.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === correctAnswerIndex;
          const showCorrectness = showFeedback;
          
          return (
            <button
              key={option.id}
              onClick={() => onAnswerSelected(index)}
              className={`p-4 rounded-xl transition-all ${
                isSelected && !showCorrectness
                  ? 'bg-blue-600 text-white shadow-md'
                  : showCorrectness && isCorrect
                  ? 'bg-green-500 text-white shadow-md'
                  : showCorrectness && isSelected && !isCorrect
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
              }`}
            >
              <div className="text-center">
                {option.imageUrl ? (
                  <img
                    src={option.imageUrl}
                    alt={`Option ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                
                <div className={`font-semibold ${fontClasses.answerText}`}>
                   {option.text}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderWordMatchingGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {quizModel.optionList?.map((option, index) => {
        const isSelected = selectedAnswer === index;
        const isCorrect = index === correctAnswerIndex;
        const showCorrectness = showFeedback;
        
        return (
          <button
            key={option.id}
            onClick={() => onAnswerSelected(index)}
            className={`p-4 rounded-xl text-center transition-all ${
              isSelected && !showCorrectness
                ? 'bg-blue-600 text-white shadow-md'
                : showCorrectness && isCorrect
                ? 'bg-green-500 text-white shadow-md'
                : showCorrectness && isSelected && !isCorrect
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              {/* {option.imageUrl && (
                <img
                  src={option.imageUrl}
                  alt={`Option ${index + 1}`}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )} */}
              <span className={`font-semibold ${fontClasses.answerText}`}>
               {option.text}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderMultipleChoiceAnswers = () => (
    <div className="grid grid-cols-1 gap-3">
      {quizModel.optionList?.map((option, index) => {
        const isSelected = selectedAnswer === index;
        const isCorrect = index === correctAnswerIndex;
        const showCorrectness = showFeedback;
        
        return (
          <button
            key={option.id}
            onClick={() => onAnswerSelected(index)}
            className={`p-4 rounded-xl text-left font-semibold transition-all ${
              isSelected && !showCorrectness
                ? 'bg-blue-600 text-white shadow-md'
                : showCorrectness && isCorrect
                ? 'bg-green-500 text-white shadow-md'
                : showCorrectness && isSelected && !isCorrect
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold">
                
              </span>
              <span className={fontClasses.answerText}>{option.text}</span>
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
    <div className="">
      <div className="mb-6">
        {renderAnswers()}
      </div>

      {/* Show correct answer translation if available and feedback is shown */}
      {showFeedback && showTranslation && quizModel.correctAnswerTranslation && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            <strong>Correct Answer Translation:</strong> {quizModel.correctAnswerTranslation}
          </p>
        </div>
      )}

      {/* Show options translation if available */}
      {showTranslation && quizModel.optionListText && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-800">
            <strong>Options Translation:</strong> {quizModel.optionListText}
          </p>
        </div>
      )}
    </div>
  );
} 