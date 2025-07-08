// Pinyin service for Chinese text

import pinyin from 'pinyin';

export class PinyinService {
  /**
   * Get pinyin for a Chinese word or character using the official pinyin library
   */
  static getPinyin(text: string): string {
    try {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        return text;
      }

      // Check if pinyin library is available
      if (typeof pinyin !== 'function') {
        console.error('Pinyin library is not available or not a function:', typeof pinyin);
        return text;
      }

      // Use the pinyin library with tone style (default)
      // Returns a 2D array where each sub-array contains pinyin for each character
      const result = pinyin(text, {
        style: 'tone',        // Use tone marks (pīn yīn)
        heteronym: false,     // Only return the most common pronunciation
        segment: true,        // Enable segmentation for better multi-character word handling
        group: false          // Don't group by words, keep character-by-character
      });

      // Flatten the result and join with spaces
      const pinyinText = result.map(pinyinArray => pinyinArray[0]).join(' ');
      
      return pinyinText;
    } catch (error) {
      console.error('Error generating pinyin:', error);
      // Fallback to original text if pinyin generation fails
      return text;
    }
  }

  /**
   * Get pinyin with specific style options
   */
  static getPinyinWithOptions(text: string, options: {
    style?: 'normal' | 'tone' | 'tone2' | 'initials' | 'first_letter';
    heteronym?: boolean;
    segment?: boolean;
  } = {}): string {
    try {
      if (typeof window === 'undefined') return text;
      
      const result = pinyin(text, {
        style: options.style || 'tone',
        heteronym: options.heteronym || false,
        segment: options.segment !== false, // Default to true
        group: false
      });

      return result.map(pinyinArray => pinyinArray[0]).join(' ');
    } catch (error) {
      console.error('Error generating pinyin with options:', error);
      return text;
    }
  }

  /**
   * Get pinyin for individual characters (useful for ruby text)
   */
  static getPinyinByCharacter(text: string): Array<{ char: string; pinyin: string }> {
    try {
      if (typeof window === 'undefined') {
        // Server-side, return characters without pinyin
        return Array.from(text).map(char => ({ char, pinyin: char }));
      }
      
      const result = pinyin(text, {
        style: 'tone',
        heteronym: false,
        segment: false, // Don't segment for character-by-character processing
        group: false
      });

      const characters = Array.from(text);
      
      const characterPinyinData = characters.map((char, index) => ({
        char,
        pinyin: result[index] ? result[index][0] : char
      }));
      
      return characterPinyinData;
    } catch (error) {
      console.error('Error generating character pinyin:', error);
      // Fallback: return characters without pinyin
      return Array.from(text).map(char => ({ char, pinyin: char }));
    }
  }

  /**
   * Check if a character is Chinese
   */
  static isChinese(char: string): boolean {
    const code = char.charCodeAt(0);
    return (code >= 0x4e00 && code <= 0x9fff) || // CJK Unified Ideographs
           (code >= 0x3400 && code <= 0x4dbf) || // CJK Extension A
           (code >= 0x20000 && code <= 0x2a6df); // CJK Extension B
  }

  /**
   * Check if text contains Chinese characters
   */
  static containsChinese(text: string): boolean {
    return Array.from(text).some(char => this.isChinese(char));
  }

  /**
   * Get pinyin for segmented words (useful with jieba segmentation)
   */
  static getPinyinForSegments(segments: string[]): Array<{ segment: string; pinyin: string }> {
    return segments.map(segment => ({
      segment,
      pinyin: this.getPinyin(segment)
    }));
  }
} 