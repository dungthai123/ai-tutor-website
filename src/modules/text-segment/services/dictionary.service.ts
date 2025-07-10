import { DictionaryEntry, DictionaryApiResponse } from '../types';

const API_BASE_URL = 'https://trumchinese-staging.hackinglanguage.com/api/v1';
const API_KEY = 'think_ai_lab';

export class DictionaryService {
  /**
   * Look up a Chinese word in the dictionary
   */
  static async lookupWord(word: string): Promise<DictionaryEntry | null> {
    try {
      const encodedWord = encodeURIComponent(word);
      const url = `${API_BASE_URL}/dictionaries/hanzi/${encodedWord}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'x-api-key': API_KEY,
          'location': 'vi'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: DictionaryApiResponse = await response.json();

      if (!apiResponse.success || !apiResponse.data) {
        return null;
      }

      // Return the data directly since it now matches our DictionaryEntry type
      return apiResponse.data;
    } catch (error) {
      console.error('Error looking up word:', error);
      return null;
    }
  }
} 