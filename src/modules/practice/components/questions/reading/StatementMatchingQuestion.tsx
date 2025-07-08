import { useState, useEffect, useRef } from 'react';
import { ReadingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { AspectRatioImage } from '../../shared/AspectRatioImage';
import { DefaultReadingQuestion } from './DefaultReadingQuestion';
import { HSKLevel } from '../../../types';

interface StatementMatchingQuestionProps extends ReadingQuestionProps {
  hskLevel?: HSKLevel;
}

export function StatementMatchingQuestion({ quizModel, isShowTranslation, fontClasses, hskLevel }: StatementMatchingQuestionProps) {
  // Helper to check if passage is valid and not empty
  const hasValidPassage = quizModel.passage && quizModel.passage.trim() !== '' && quizModel.passage !== quizModel.question;

  // Animation states for different content sections
  const [isPassageAnimating, setIsPassageAnimating] = useState(false);
  const [isQuestionAnimating, setIsQuestionAnimating] = useState(false);
  const [isImageAnimating, setIsImageAnimating] = useState(false);

  // Previous content refs for each section
  const prevPassageRef = useRef<string>('');
  const prevQuestionRef = useRef<string>('');
  const prevImageUrlRef = useRef<string>('');

  // Track passage changes
  useEffect(() => {
    const currentPassage = quizModel.passage || '';
    const prevPassage = prevPassageRef.current;
    
    if (prevPassage && currentPassage !== prevPassage) {
      setIsPassageAnimating(true);
      const timer = setTimeout(() => setIsPassageAnimating(false), 100);
      prevPassageRef.current = currentPassage;
      return () => clearTimeout(timer);
    } else {
      prevPassageRef.current = currentPassage;
    }
  }, [quizModel.passage]);

  // Track question changes
  useEffect(() => {
    const currentQuestion = quizModel.question || '';
    const prevQuestion = prevQuestionRef.current;
    
    if (prevQuestion && currentQuestion !== prevQuestion) {
      setIsQuestionAnimating(true);
      const timer = setTimeout(() => setIsQuestionAnimating(false), 100);
      prevQuestionRef.current = currentQuestion;
      return () => clearTimeout(timer);
    } else {
      prevQuestionRef.current = currentQuestion;
    }
  }, [quizModel.question]);

  // Track main image changes
  useEffect(() => {
    const currentImageUrl = quizModel.imageUrl || '';
    const prevImageUrl = prevImageUrlRef.current;
    
    if (prevImageUrl && currentImageUrl !== prevImageUrl) {
      setIsImageAnimating(true);
      const timer = setTimeout(() => setIsImageAnimating(false), 100);
      prevImageUrlRef.current = currentImageUrl;
      return () => clearTimeout(timer);
    } else {
      prevImageUrlRef.current = currentImageUrl;
    }
  }, [quizModel.imageUrl]);

  // Check if this is HSK5 level
  const isHSK5 = hskLevel === HSKLevel.HSK5;

  return (
    <div className="statement-matching-question">
      <div className="mb-4 p-4 pb-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
        <h4 className="font-semibold text-indigo-800 mb-2">🔗 Statement Matching</h4>
      </div>

      {/* Main question image - animate only if image changes */}
      {quizModel.imageUrl && (
        <div 
          className={`mb-6 transition-transform duration-100 ease-out ${
            isImageAnimating ? 'animate-slide-in-right' : ''
          }`}
          style={{ '--slide-distance': '20px' } as React.CSSProperties}
        >
          <AspectRatioImage 
            src={quizModel.imageUrl} 
            alt="Question image" 
            aspectRatio="video"
          />
        </div>
      )}
      
      {/* Statement options passage - animate only if passage changes */}
      {hasValidPassage && (
        <div 
          className={`passage mb-6 bg-gray-50 rounded-lg transition-transform duration-100 ease-out ${
            isPassageAnimating ? 'animate-slide-in-right' : ''
          }`}
          style={{ '--slide-distance': '20px' } as React.CSSProperties}
        >
          {isHSK5 ? (
            // For HSK5, show passage as combined text with newlines preserved
            <div className="p-4 bg-white rounded border border-gray-200 shadow-sm">
              <h5 className="font-medium text-gray-700 mb-3">Reading Passage:</h5>
              <TextAndTranslate 
                text={quizModel.passage!} 
                translation={quizModel.readingTranslationContext}
                isShowTranslation={isShowTranslation}
                fontClasses={fontClasses}
                className="whitespace-pre-line"
              />
            </div>
          ) : (
            // For other levels, show individual options with labels
            <div className="grid grid-cols-1 gap-3">
              {quizModel.passage!.split('\n').map((option, index) => (
                <div key={index} className="p-3 bg-white rounded border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-2">
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
          )}
        </div>
      )}

      {/* Question text - animate only if question changes */}
      {quizModel.question && (
        <div 
          className={`question-text p-4 bg-teal-50 rounded-lg border-l-4 border-teal-400 transition-transform duration-100 ease-out ${
            isQuestionAnimating ? 'animate-slide-in-right' : ''
          }`}
          style={{ '--slide-distance': '20px' } as React.CSSProperties}
        >
          <h4 className="font-semibold text-teal-800 mb-2">❓ Question:</h4>
          <TextAndTranslate 
            text={quizModel.question} 
            translation={quizModel.readingTranslation}
            isShowTranslation={isShowTranslation}
            fontClasses={fontClasses}
          />
        </div>
      )}

      {/* Custom CSS for slide animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          0% {
            transform: translateX(var(--slide-distance));
            opacity: 0.8;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.1s ease-out;
        }
      `}</style>
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