import { useState, useEffect, useRef } from 'react';
import { ReadingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { AspectRatioImage } from '../../shared/AspectRatioImage';

export function TrueFalseQuestion({ quizModel, isShowTranslation, fontClasses }: ReadingQuestionProps) {
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

  return (
    <div className="true-false-question">
      <div className="mb-4 p-4 pb-2 bg-green-50 rounded-lg border-l-4 border-green-400">
        <h4 className="font-semibold text-green-800 mb-2">📝 Statement to Evaluate</h4>
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
      
      {/* Reading passage - animate only if passage changes */}
      {hasValidPassage && (
        <div 
          className={`passage mb-6 p-4 bg-gray-50 rounded-lg transition-transform duration-100 ease-out ${
            isPassageAnimating ? 'animate-slide-in-right' : ''
          }`}
          style={{ '--slide-distance': '20px' } as React.CSSProperties}
        >
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

      {/* Question text - animate only if question changes */}
      {quizModel.question && (
        <div 
          className={`question-text p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400 transition-transform duration-100 ease-out ${
            isQuestionAnimating ? 'animate-slide-in-right' : ''
          }`}
          style={{ '--slide-distance': '20px' } as React.CSSProperties}
        >
          <h4 className="font-semibold text-amber-800 mb-2">❓ Statement:</h4>
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