import { ReadingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { AspectRatioImage } from '../../shared/AspectRatioImage';
import { ImageGrid } from '../../shared/ImageGrid';

export function DefaultReadingQuestion({ quizModel, isShowTranslation, fontClasses }: ReadingQuestionProps) {
  // Helper to check if passage is valid and not empty
  const hasValidPassage = quizModel.passage && quizModel.passage.trim() !== '' && quizModel.passage !== quizModel.question;

  return (
    <div className="default-reading-question">
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

      {/* Context Images for Picture Matching */}
      {quizModel.imageList && quizModel.imageList.length > 0 && (
        <div className="mb-6">
          <h5 className="font-medium text-gray-700 mb-3">Choose the correct option:</h5>
          <ImageGrid images={quizModel.imageList} />
        </div>
      )}
      
      {/* Reading passage - only show if it's actually different from the question */}
      {hasValidPassage && (
        <div className="passage mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📖</span>
            <h4 className="font-semibold text-lg text-gray-800">Reading Passage</h4>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <TextAndTranslate 
              text={quizModel.passage!} 
              translation={quizModel.readingTranslationContext}
              isShowTranslation={isShowTranslation}
              fontClasses={fontClasses}
            />
          </div>
        </div>
      )}

      {/* Question text */}
      <div className="mb-6">
        <h3 className={`font-semibold mb-3 ${fontClasses?.questionText || 'text-base'}`}>
          {quizModel.question}
        </h3>
        
        {isShowTranslation && quizModel.readingTranslation && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className={`text-blue-700 ${fontClasses?.questionText || 'text-base'}`}>
              <strong>Translation:</strong> {quizModel.readingTranslation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 