import { WritingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { AspectRatioImage } from '../../shared/AspectRatioImage';

export function DefaultWritingQuestion({ 
  quizModel, 
  isShowTranslation,
  fontClasses 
}: WritingQuestionProps) {
  return (
    <div className="default-writing-question">
      {/* Main question image */}
      {quizModel.imageUrl && (
        <div className="mb-6">
          <AspectRatioImage 
            src={quizModel.imageUrl} 
            alt="Question image" 
            aspectRatio="video"
          />
        </div>
      )}

      {/* Context */}
      {quizModel.context && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📝</span>
            <h4 className="font-semibold text-lg text-gray-800">Context</h4>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <TextAndTranslate 
              text={quizModel.context} 
              translation={quizModel.correctAnswerTranslation}
              isShowTranslation={isShowTranslation}
              fontClasses={fontClasses}
            />
          </div>
        </div>
      )}

      {/* Question text */}
      {quizModel.question && (
        <div className="question-text mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h4 className="font-semibold text-blue-800 mb-2">📝 Question:</h4>
          <TextAndTranslate 
            text={quizModel.question} 
            translation={quizModel.correctAnswerTranslation}
            isShowTranslation={isShowTranslation}
            fontClasses={fontClasses}
          />
        </div>
      )}

      {/* Prompt */}
      {quizModel.prompt && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <h5 className="font-semibold text-yellow-800 mb-2">💭 Prompt:</h5>
          <p className="text-yellow-700">{quizModel.prompt}</p>
        </div>
      )}

      {/* Required words */}
      {quizModel.requiredWords && quizModel.requiredWords.length > 0 && (
        <div className="mb-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
          <h5 className="font-semibold text-purple-800 mb-2">🔑 Required Words:</h5>
          <div className="flex flex-wrap gap-2">
            {quizModel.requiredWords.map((word, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-purple-100 border border-purple-300 rounded text-purple-800 text-sm"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Answer example */}
      {quizModel.answerExample && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
          <h5 className="font-semibold text-green-800 mb-2">💡 Example Answer:</h5>
          <TextAndTranslate 
            text={quizModel.answerExample}
            translation={quizModel.correctAnswerTranslation}
            isShowTranslation={isShowTranslation}
            fontClasses={fontClasses}
          />
        </div>
      )}
    </div>
  );
} 