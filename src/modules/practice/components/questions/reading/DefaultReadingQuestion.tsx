import { useState, useEffect, useRef } from 'react';
import { ReadingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { AspectRatioImage } from '../../shared/AspectRatioImage';
import { ImageGrid } from '../../shared/ImageGrid';
import { TextSegmentWrapper } from '@/modules/text-segment';

export function DefaultReadingQuestion({ quizModel, isShowTranslation, fontClasses, isTextSegmentEnabled }: ReadingQuestionProps) {
  // Helper to check if passage is valid and not empty
  const hasValidPassage = quizModel.passage && quizModel.passage.trim() !== '' && quizModel.passage !== quizModel.question;

  // Animation states for different content sections
  const [isPassageAnimating, setIsPassageAnimating] = useState(false);
  const [isQuestionAnimating, setIsQuestionAnimating] = useState(false);
  const [isImageAnimating, setIsImageAnimating] = useState(false);
  const [isImageListAnimating, setIsImageListAnimating] = useState(false);

  // Previous content refs for each section
  const prevPassageRef = useRef<string>('');
  const prevQuestionRef = useRef<string>('');
  const prevImageUrlRef = useRef<string>('');
  const prevImageListRef = useRef<string>('');

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

  // Track image list changes
  useEffect(() => {
    const currentImageList = (quizModel.imageList || []).join('|');
    const prevImageList = prevImageListRef.current;
    
    if (prevImageList && currentImageList !== prevImageList) {
      setIsImageListAnimating(true);
      const timer = setTimeout(() => setIsImageListAnimating(false), 100);
      prevImageListRef.current = currentImageList;
      return () => clearTimeout(timer);
    } else {
      prevImageListRef.current = currentImageList;
    }
  }, [quizModel.imageList]);

  return (
    <div className="default-reading-question">
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

      {/* Context Images for Picture Matching - animate only if image list changes */}
      {quizModel.imageList && quizModel.imageList.length > 0 && (
        <div 
          className={`mb-6 transition-transform duration-100 ease-out ${
            isImageListAnimating ? 'animate-slide-in-right' : ''
          }`}
          style={{ '--slide-distance': '20px' } as React.CSSProperties}
        >
          <h5 className="font-medium text-gray-700 mb-3">Choose the correct option:</h5>
          <ImageGrid images={quizModel.imageList} />
        </div>
      )}
      
      {/* Reading passage - animate only if passage changes */}
      {hasValidPassage && (
        <div 
          className={`passage p-4 bg-gray-50 rounded-lg transition-transform duration-100 ease-out ${
            isPassageAnimating ? 'animate-slide-in-right' : ''
          }`}
          style={{ '--slide-distance': '20px' } as React.CSSProperties}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📖</span>
            <h4 className="font-semibold text-lg text-gray-800">Reading Passage</h4>
          </div>
          
          <div className={`prose prose-sm max-w-none ${fontClasses?.questionText || 'text-base'}`}>
            {isTextSegmentEnabled ? (
              <TextSegmentWrapper 
                text={quizModel.passage!}
                showPinyin={true}
                className="mb-4"
              />
            ) : (
              <TextAndTranslate 
                text={quizModel.passage!} 
                translation={quizModel.readingTranslationContext}
                isShowTranslation={isShowTranslation}
                fontClasses={fontClasses}
              />
            )}
          </div>
        </div>
      )}
      

      {/* Question text - animate only if question changes */}
      <div 
        className={`prose-sm transition-transform duration-100 ease-out ${
          isQuestionAnimating ? 'animate-slide-in-right' : ''
        }`}
        style={{ '--slide-distance': '20px' } as React.CSSProperties}
      >
      {quizModel.question && (
        <div 
          className={`question-text p-4 bg-teal-50 rounded-lg border-l-4 border-teal-400 transition-transform duration-100 ease-out ${
            isQuestionAnimating ? 'animate-slide-in-right' : ''
          }`}
          style={{ '--slide-distance': '20px' } as React.CSSProperties}
        >
          <h4 className="font-semibold text-teal-1000 mb-2">❓ Question:</h4>
          <TextAndTranslate 
            text={quizModel.question} 
            translation={quizModel.readingTranslation}
            isShowTranslation={isShowTranslation}
            fontClasses={fontClasses}
          />
        </div>
      )}
        
        {isShowTranslation && quizModel.readingTranslation && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className={`text-blue-700 ${fontClasses?.questionText || 'text-base'}`}>
              <strong>Translation:</strong> {quizModel.readingTranslation}
            </p>
          </div>
        )}
      </div>

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