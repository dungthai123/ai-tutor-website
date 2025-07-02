import { ReadingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { AspectRatioImage } from '../../shared/AspectRatioImage';
import { DefaultReadingQuestion } from './DefaultReadingQuestion';

export function StatementMatchingQuestion({ quizModel, isShowTranslation, fontClasses }: ReadingQuestionProps) {
  // Helper to check if passage is valid and not empty
  const hasValidPassage = quizModel.passage && quizModel.passage.trim() !== '' && quizModel.passage !== quizModel.question;

  return (
    <div className="statement-matching-question">
      <div className="mb-4 p-4 pb-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
        <h4 className="font-semibold text-indigo-800 mb-2">🔗 Statement Matching</h4>

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
        <div className="passage mb-6 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 gap-3">
            {quizModel.passage!.split('\n').map((option, index) => (
              <div key={index} className="p-3 bg-white rounded border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <TextAndTranslate 
                    text={option} 
                    translation={quizModel.readingTranslationContext}
                    isShowTranslation={isShowTranslation}
                    fontClasses={fontClasses}
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {quizModel.question && (
        <div className="question-text p-4 bg-teal-50 rounded-lg border-l-4 border-teal-400">
          <h4 className="font-semibold text-teal-800 mb-2">❓ Question:</h4>
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

export function MissingWordQuestion(props: ReadingQuestionProps) {
  return <DefaultReadingQuestion {...props} />;
}

export function ShortPassageQuestion(props: ReadingQuestionProps) {
  return <DefaultReadingQuestion {...props} />;
}

export function LongPassageQuestion(props: ReadingQuestionProps) {
  return <DefaultReadingQuestion {...props} />;
}

export function StatementQuestion(props: ReadingQuestionProps) {
  return <DefaultReadingQuestion {...props} />;
}

export function PassageQuestion(props: ReadingQuestionProps) {
  return <DefaultReadingQuestion {...props} />;
}

export function MissingSentenceQuestion(props: ReadingQuestionProps) {
  return <DefaultReadingQuestion {...props} />;
}

export function MissingWordsQuestion(props: ReadingQuestionProps) {
  return <DefaultReadingQuestion {...props} />;
} 