import { WritingQuestionProps } from './types';

export function WriteHanziQuestion({ 
  quizModel, 
  isShowTranslation,
  fontClasses 
}: WritingQuestionProps) {
  return (
    <div className="write-hanzi-question">
      {/* Instruction */}
      <div className="mb-6 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
        <h4 className="font-semibold text-orange-800 mb-2">✍️ Write Hanzi</h4>
        <p className="text-orange-700">
          Fill in the missing Chinese character(s) based on the pinyin pronunciation given.
        </p>
      </div>

      {/* Question Text */}
      {quizModel.question && (
        <div className="mb-6">
          <h5 className="font-medium text-gray-700 mb-3">Question:</h5>
          <div 
            className={`p-4 bg-gray-50 rounded-lg border border-gray-200 ${fontClasses}`}
            style={{ lineHeight: '1.8' }}
          >
            <div className="text-gray-800 text-lg">
              {quizModel.question}
            </div>
          </div>
        </div>
      )}

      {/* Show context if available */}
      {quizModel.context && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h5 className="font-semibold text-blue-800 mb-2">📖 Context:</h5>
          <p className="text-blue-700">{quizModel.context}</p>
        </div>
      )}

      {/* Show translation if enabled */}
      {isShowTranslation && quizModel.readingTranslation && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
          <h5 className="font-semibold text-green-800 mb-2">🔤 Translation:</h5>
          <p className="text-green-700">{quizModel.readingTranslation}</p>
        </div>
      )}

      {/* Instruction for user */}
      <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-800 text-sm">
          <span className="font-medium">💡 Tip:</span> 
          Look for the pinyin in parentheses and write the corresponding Chinese character(s) in the answer box below.
        </p>
      </div>
    </div>
  );
} 