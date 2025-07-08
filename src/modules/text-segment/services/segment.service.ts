import { SegmentResponse } from '../types';

const API_BASE_URL = 'https://trumchinese-staging.hackinglanguage.com/api/v1';
const API_KEY = 'think_ai_lab';

export class SegmentService {
  /**
   * Segment Chinese text using jieba API
   */
  static async segmentText(text: string): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/jieba/segment`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'location': 'vi'
        },
        body: JSON.stringify({
          text: text
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SegmentResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to segment text');
      }

      return data.data;
    } catch (error) {
      console.error('Error segmenting text:', error);
      // Fallback: return original text as single segment
      return [text];
    }
  }
} 