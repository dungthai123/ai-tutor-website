import { ReadingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { AspectRatioImage } from '../../shared/AspectRatioImage';

export function OrderingQuestion({ quizModel, isShowTranslation, fontClasses }: ReadingQuestionProps) {
  // Helper to check if passage is valid and not empty
  const hasValidPassage = quizModel.passage && quizModel.passage.trim() !== '' && quizModel.passage !== quizModel.question;

  return (
    <div className="ordering-question">
      <div className="mb-4 p-4 pb-2 bg-purple-50 rounded-lg border-l-4 border-purple-400">
        <h4 className="font-semibold text-purple-800 mb-2">🔢 Sentence Ordering</h4>
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
          <h5 className="font-medium text-gray-700 mb-3">Context Passage:</h5>
          <TextAndTranslate 
            text={quizModel.passage!} 
            translation={quizModel.readingTranslationContext}
            isShowTranslation={isShowTranslation}
            fontClasses={fontClasses}
          />
        </div>
      )}

      {quizModel.question && (
        <div className="question-text p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
          <h4 className="font-semibold text-indigo-800 mb-2">🎯 Task:</h4>
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