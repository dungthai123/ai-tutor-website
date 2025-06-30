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