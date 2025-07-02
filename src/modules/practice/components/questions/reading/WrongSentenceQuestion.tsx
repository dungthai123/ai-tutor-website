import { ReadingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { AspectRatioImage } from '../../shared/AspectRatioImage';

export function WrongSentenceQuestion({ quizModel, isShowTranslation, fontClasses }: ReadingQuestionProps) {
  // Helper to check if passage is valid and not empty
  const hasValidPassage = quizModel.passage && quizModel.passage.trim() !== '' && quizModel.passage !== quizModel.question;

  return (
    <div className="wrong-sentence-question">
      <div className="mb-4 p-4 pb-2 bg-red-50 rounded-lg border-l-4 border-red-400">
        <h4 className="font-semibold text-red-800 mb-2">🔍 Find the Error</h4>
      </div>

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
      
      {hasValidPassage && (
        <div className="passage mb-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-700 mb-3">Text to Review:</h5>
          <TextAndTranslate 
            text={quizModel.passage!} 
            translation={quizModel.readingTranslationContext}
            isShowTranslation={isShowTranslation}
            fontClasses={fontClasses}
          />
        </div>
      )}

      {quizModel.question && (
        <div className="question-text p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
          <h4 className="font-semibold text-orange-800 mb-2">🎯 Task:</h4>
          <TextAndTranslate 
            text={quizModel.question} 
            translation={quizModel.readingTranslation}
            isShowTranslation={isShowTranslation}
            fontClasses={fontClasses}
          />
        </div>
      )}
    </div>
  );
} 