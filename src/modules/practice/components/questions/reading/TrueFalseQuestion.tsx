import { ReadingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { AspectRatioImage } from '../../shared/AspectRatioImage';

export function TrueFalseQuestion({ quizModel, isShowTranslation, fontClasses }: ReadingQuestionProps) {
  // Helper to check if passage is valid and not empty
  const hasValidPassage = quizModel.passage && quizModel.passage.trim() !== '' && quizModel.passage !== quizModel.question;

  return (
    <div className="true-false-question">
      <div className="mb-4 p-4 pb-2 bg-green-50 rounded-lg border-l-4 border-green-400">
        <h4 className="font-semibold text-green-800 mb-2">📝 Statement to Evaluate</h4>
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
          <h5 className="font-medium text-gray-700 mb-3">Reading Passage:</h5>
          <div className="space-y-2">
            {quizModel.passage!.split('\n').map((line, index) => (
              <TextAndTranslate 
                key={index} 
                text={line} 
                translation={quizModel.readingTranslationContext}
                isShowTranslation={isShowTranslation}
                fontClasses={fontClasses}
              />
            ))}
          </div>
        </div>
      )}

      {quizModel.question && (
        <div className="question-text p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
          <h4 className="font-semibold text-amber-800 mb-2">❓ Statement:</h4>
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