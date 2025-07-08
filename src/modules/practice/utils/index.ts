import { FontSize } from '@/lib/stores/practiceDetailStore';

/**
 * Utility function to get the correct image URL for practice module
 * @param imageUrl - The image URL from the API
 * @returns The full image URL
 */
export const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  return imageUrl.startsWith('http') 
    ? imageUrl 
    : `https://thinkailabstaging.blob.core.windows.net/trum-chinese${imageUrl}`;
};

/**
 * Utility function to validate if an image URL is valid
 * @param imageUrl - The image URL to validate
 * @returns Boolean indicating if the URL is valid
 */
  export const isValidImageUrl = (imageUrl?: string | null): boolean => {
    return Boolean(imageUrl && imageUrl.trim() !== '');
  };

/**
 * Get Tailwind CSS classes for font sizes
 */
export const getFontSizeClasses = (fontSize: FontSize) => {
  const fontSizeMap = {
    small: {
      questionText: 'text-lg',
      answerText: 'text-base',
      transcriptText: 'text-lg',
      passageText: 'text-lg',
    },
    medium: {
      questionText: 'text-xl',
      answerText: 'text-lg', 
      transcriptText: 'text-xl',
      passageText: 'text-xl',
    },
    large: {
      questionText: 'text-2xl',
      answerText: 'text-xl',
      transcriptText: 'text-2xl', 
      passageText: 'text-2xl',
    }
  };

  return fontSizeMap[fontSize];
};

/**
 * Get dynamic font size classes with cn utility
 */
export const getDynamicFontClasses = (fontSize: FontSize, baseClasses: string = '') => {
  const sizeClasses = getFontSizeClasses(fontSize);
  return {
    questionText: `${baseClasses} ${sizeClasses.questionText}`,
    answerText: `${baseClasses} ${sizeClasses.answerText}`,
    transcriptText: `${baseClasses} ${sizeClasses.transcriptText}`,
    passageText: `${baseClasses} ${sizeClasses.passageText}`,
  };
}; 