import { WritingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';

export function WriteOrderingQuestion({ 
  quizModel, 
  isShowTranslation,
  fontClasses 
}: WritingQuestionProps) {
  return (
    <div className="write-ordering-question">
      {/* Instruction */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <h4 className="font-semibold text-blue-800 mb-2">✍️ Word Ordering</h4>
        <p className="text-blue-700">
          Arrange the words in the correct order to form a proper sentence.
        </p>
      </div>

      {/* Show ordering items */}
      {quizModel.orderingItems && quizModel.orderingItems.length > 0 && (
        <div className="mb-6">
          <h5 className="font-medium text-gray-700 mb-3">Available words/phrases:</h5>
          <div className="flex flex-wrap gap-2">
            {quizModel.orderingItems.map((item, index) => (
              <div 
                key={index}
                className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md font-medium text-gray-800"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show correct answer as example if available */}
      {quizModel.correctAnswer && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
          <h5 className="font-semibold text-green-800 mb-2">📝 Correct Answer:</h5>
          <TextAndTranslate 
            text={quizModel.correctAnswer}
            translation={quizModel.correctAnswerTranslation}
            isShowTranslation={isShowTranslation}
            fontClasses={fontClasses}
          />
        </div>
      )}

      {/* Show answer example if available */}
      {quizModel.answerExample && (
        <div className="mb-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
          <h5 className="font-semibold text-purple-800 mb-2">💡 Example Answer:</h5>
          <p className="text-purple-700">{quizModel.answerExample}</p>
        </div>
      )}
    </div>
  );
} 