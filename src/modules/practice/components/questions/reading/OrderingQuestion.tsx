import { useState, useEffect, useRef } from 'react';
import { ReadingQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { AspectRatioImage } from '../../shared/AspectRatioImage';

export function OrderingQuestion({ quizModel, isShowTranslation, fontClasses }: ReadingQuestionProps) {
  // Helper to check if passage is valid and not empty
  const hasValidPassage = quizModel.passage && quizModel.passage.trim() !== '' && quizModel.passage !== quizModel.question;

  // Animation state for content changes
  const [isAnimating, setIsAnimating] = useState(false);
  const prevContentHashRef = useRef<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Create a content hash to detect actual content changes
  const createContentHash = () => {
    const contentParts = [
      quizModel.question || '',
      quizModel.passage || '',
      quizModel.imageUrl || '',
      quizModel.readingTranslation || '',
      quizModel.readingTranslationContext || ''
    ];
    return contentParts.join('::');
  };

  // Track question changes and trigger slide animation only when content actually changes
  useEffect(() => {
    const currentContentHash = createContentHash();
    const prevContentHash = prevContentHashRef.current;
    
    // Only animate if the content actually changed
    if (prevContentHash && currentContentHash !== prevContentHash) {
      setIsAnimating(true);
      
      // Reset animation after duration
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 100); // 0.1 seconds
      
      prevContentHashRef.current = currentContentHash;
      
      return () => clearTimeout(timer);
    } else {
      // Update ref without animation if content is the same
      prevContentHashRef.current = currentContentHash;
    }
  }, [quizModel.question, quizModel.passage, quizModel.imageUrl, quizModel.readingTranslation, quizModel.readingTranslationContext]);

  return (
    <div 
      ref={contentRef}
      className={`ordering-question transition-transform duration-100 ease-out ${
        isAnimating ? 'animate-slide-in-right' : ''
      }`}
      style={{
        '--slide-distance': '20px'
      } as React.CSSProperties}
    >
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