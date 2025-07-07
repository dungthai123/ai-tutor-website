import { BaseApiService } from '../api/base-api.service';

class TextToSpeechService extends BaseApiService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_BASE_URL || 'https://trumchinese-staging.hackinglanguage.com');
  }

  async generateSpeech(text: string, speechRate: number = 1.0): Promise<Blob> {
    try {
      console.log('🔊 TTS Service: Generating speech for text:', text.substring(0, 50) + '...');
      
      const response = await fetch('/api/chat/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          speechRate,
        }),
      });

      console.log('🔊 TTS Service: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔊 TTS Service: Error response:', errorText);
        throw new Error(`Failed to generate speech: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      console.log('🔊 TTS Service: Generated blob size:', blob.size);
      
      return blob;
    } catch (error) {
      console.error('Failed to generate speech:', error);
      throw error;
    }
  }

  async generateSpeechUrl(text: string, speechRate: number = 1.0): Promise<string> {
    const blob = await this.generateSpeech(text, speechRate);
    return URL.createObjectURL(blob);
  }

  async generateSpeechWithAzure(text: string, speechRate: number = 1.0): Promise<Blob> {
    try {
      const response = await this.requestBlob(
        'POST',
        '/api/v1/azure-text-to-speech/text-to-speech-mp3',
        {
          text,
          speech_rate: speechRate,
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to generate speech with Azure:', error);
      throw error;
    }
  }

  // Cache for frequently used TTS
  private ttsCache = new Map<string, string>();

  async getCachedSpeechUrl(text: string, speechRate: number = 1.0): Promise<string> {
    const cacheKey = `${text}_${speechRate}`;
    
    if (this.ttsCache.has(cacheKey)) {
      return this.ttsCache.get(cacheKey)!;
    }

    const url = await this.generateSpeechUrl(text, speechRate);
    this.ttsCache.set(cacheKey, url);

    // Clean up cache after 5 minutes
    setTimeout(() => {
      if (this.ttsCache.has(cacheKey)) {
        URL.revokeObjectURL(this.ttsCache.get(cacheKey)!);
        this.ttsCache.delete(cacheKey);
      }
    }, 5 * 60 * 1000);

    return url;
  }

  clearCache(): void {
    this.ttsCache.forEach((url) => URL.revokeObjectURL(url));
    this.ttsCache.clear();
  }
}

export const textToSpeechService = new TextToSpeechService(); 