import { WritingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { AspectRatioImage } from '../../shared/AspectRatioImage';

export function WriteSentenceFromImageQuestion({ 
  quizModel, 
  isShowTranslation,
  fontClasses 
}: WritingQuestionProps) {
  return (
    <div className="write-sentence-from-image-question">
      {/* Instruction */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
        <h4 className="font-semibold text-purple-800 mb-2">✍️🖼️ Write from Image</h4>
        <p className="text-purple-700">
          Look at the image and write a sentence that describes what you see.
        </p>
      </div>

      {/* Show image */}
      {quizModel.imageUrl && (
        <div className="mb-6">
          <AspectRatioImage 
            src={quizModel.imageUrl} 
            alt="Writing prompt image" 
            aspectRatio="video"
          />
          {quizModel.imageDescription && (
            <p className="text-sm text-gray-600 mt-2 italic">
              {quizModel.imageDescription}
            </p>
          )}
        </div>
      )}

      {/* Show instruction if available */}
      {quizModel.instruction && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <h5 className="font-semibold text-yellow-800 mb-2">📋 Instructions:</h5>
          <p className="text-yellow-700">{quizModel.instruction}</p>
        </div>
      )}

      {/* Show answer example if available */}
      {quizModel.answerExample && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h5 className="font-semibold text-blue-800 mb-2">💡 Example Answer:</h5>
          <TextAndTranslate 
            text={quizModel.answerExample}
            translation={quizModel.correctAnswerTranslation}
            isShowTranslation={isShowTranslation}
            fontClasses={fontClasses}
          />
        </div>
      )}

      {/* Show correct answer if available */}
      {quizModel.correctAnswer && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
          <h5 className="font-semibold text-green-800 mb-2">📝 Model Answer:</h5>
          <TextAndTranslate 
            text={quizModel.correctAnswer}
            translation={quizModel.correctAnswerTranslation}
            isShowTranslation={isShowTranslation}
            fontClasses={fontClasses}
          />
        </div>
      )}
    </div>
  );
} 