import { useState, useEffect, useRef } from 'react';
import { ReadingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { ImageGrid } from '../../shared/ImageGrid';

export function PictureMatchingQuestion({ quizModel, isShowTranslation }: ReadingQuestionProps) {
  // Animation states for different content sections
  const [isQuestionAnimating, setIsQuestionAnimating] = useState(false);
  const [isImageListAnimating, setIsImageListAnimating] = useState(false);

  // Previous content refs for each section
  const prevQuestionRef = useRef<string>('');
  const prevImageListRef = useRef<string>('');

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

  // Track image list changes (both imageList and optionList images)
  useEffect(() => {
    const imageUrls = quizModel.imageList && quizModel.imageList.length > 0 
      ? quizModel.imageList
      : quizModel.optionList.map(opt => opt.imageUrl || '').filter(Boolean);
    const currentImageList = imageUrls.join('|');
    const prevImageList = prevImageListRef.current;
    
    if (prevImageList && currentImageList !== prevImageList) {
      setIsImageListAnimating(true);
      const timer = setTimeout(() => setIsImageListAnimating(false), 100);
      prevImageListRef.current = currentImageList;
      return () => clearTimeout(timer);
    } else {
      prevImageListRef.current = currentImageList;
    }
  }, [quizModel.imageList, quizModel.optionList]);

  return (
    <div className="picture-matching-question">
      <div className="mb-4 p-4 pb-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
        <h4 className="font-semibold text-indigo-800 mb-2">🖼️ Picture Matching</h4>
      </div>
      
      {/* Show images from imageList (context images) or optionList if available - animate only if images change */}
      {((quizModel.imageList && quizModel.imageList.length > 0) || 
        (quizModel.optionList && quizModel.optionList.some(opt => opt.imageUrl))) && (
        <div 
          className={`mb-6 transition-transform duration-100 ease-out ${
            isImageListAnimating ? 'animate-slide-in-right' : ''
          }`}
          style={{ '--slide-distance': '20px' } as React.CSSProperties}
        >
          <h5 className="font-medium text-gray-700 mb-3">Choose the correct image:</h5>
          <ImageGrid 
            images={
              quizModel.imageList && quizModel.imageList.length > 0 
                ? quizModel.imageList
                : quizModel.optionList.map(opt => opt.imageUrl || '').filter(Boolean)
            } 
          />
        </div>
      )}

      {/* Question text - animate only if question changes */}
      {quizModel.question && (
        <div 
          className={`question-text p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 transition-transform duration-100 ease-out ${
            isQuestionAnimating ? 'animate-slide-in-right' : ''
          }`}
          style={{ '--slide-distance': '20px' } as React.CSSProperties}
        >
          <h4 className="font-semibold text-blue-800 mb-2">📝 Statement:</h4>
          <TextAndTranslate 
            text={quizModel.question} 
            translation={quizModel.readingTranslation}
            isShowTranslation={isShowTranslation}
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