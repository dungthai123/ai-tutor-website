import { ApiResponse } from '../../types';

class SpeechToTextService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async transcribeAudio(
    audioBlob: Blob,
    language?: string
  ): Promise<ApiResponse<string>> {
    try {
      // Use Next.js API route for transcription
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.m4a');
      
      if (language) {
        formData.append('language', language);
      }

      const response = await fetch('/api/chat/stt', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Failed to transcribe audio',
        };
      }

      return {
        success: true,
        data: result.text,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  async transcribeAudioDirect(
    audioBlob: Blob,
    language?: string
  ): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.m4a');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');

    if (language) {
      formData.append('language', language);
    } else {
      formData.append('language', 'zh');
      formData.append('prompt', '如果是中文的话就是简体中文。');
    }

    try {
      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error?.message || 'Failed to transcribe audio',
        };
      }

      return {
        success: true,
        data: result.text,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred during transcription';
  }
}

export const speechToTextService = new SpeechToTextService(); 