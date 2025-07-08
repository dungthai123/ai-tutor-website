import { DictionaryEntry } from '../types';

const API_BASE_URL = 'https://trumchinese-staging.hackinglanguage.com/api/v1';
const API_KEY = 'think_ai_lab';

// API response structure based on the actual response
interface DictionaryApiResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    hanzi: string;
    pinyin: string;
    han_nom: string;
    word_level: string;
    word_type: string;
    meanings: Array<{
      meaning: string;
      explanation: string;
      examples: Array<{
        word: string;
        phonetic: string;
        translation: string;
      }>;
    }>;
  };
}

export class DictionaryService {
  /**
   * Look up a Chinese word in the dictionary
   */
  static async lookupWord(word: string): Promise<DictionaryEntry | null> {
    try {
      const encodedWord = encodeURIComponent(word);
      const response = await fetch(`${API_BASE_URL}/dictionaries/hanzi/${encodedWord}`, {
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

      const data = apiResponse.data;

      // Convert API response to our DictionaryEntry format
      return {
        id: data.hanzi,
        hanzi: data.hanzi,
        word: data.hanzi,
        pinyin: data.pinyin,
        pronunciation: data.pinyin,
        meaning: data.meanings.length > 0 ? data.meanings[0].meaning : '',
        definitions: data.meanings.map(meaning => ({
          partOfSpeech: data.word_type,
          meaning: meaning.meaning,
          examples: meaning.examples.map(ex => `${ex.word} (${ex.phonetic}) - ${ex.translation}`)
        })),
        examples: data.meanings.length > 0 && data.meanings[0].examples.length > 0 
          ? [`${data.meanings[0].examples[0].word} (${data.meanings[0].examples[0].phonetic}) - ${data.meanings[0].examples[0].translation}`]
          : [],
        level: data.word_level
      };
    } catch (error) {
      console.error('Error looking up word:', error);
      return null;
    }
  }
} 