import { ApiResponse } from '../../types';

class SpeechToTextService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  // Helper method to get appropriate file extension based on MIME type
  private getFileExtension(mimeType: string): string {
    if (mimeType.includes('mp4')) return 'm4a';
    if (mimeType.includes('webm')) return 'webm';
    if (mimeType.includes('wav')) return 'wav';
    if (mimeType.includes('ogg')) return 'oga';
    if (mimeType.includes('mp3')) return 'mp3';
    if (mimeType.includes('flac')) return 'flac';
    // Default fallback
    return 'webm';
  }

  async transcribeAudio(
    audioBlob: Blob,
    language?: string
  ): Promise<ApiResponse<string>> {
    try {
      // Use Next.js API route for transcription
      const formData = new FormData();
      
      // Get the appropriate file extension based on the blob's type
      const fileExtension = this.getFileExtension(audioBlob.type);
      const fileName = `recording.${fileExtension}`;
      
      console.log('🎤 Processing audio:', { 
        type: audioBlob.type, 
        size: audioBlob.size, 
        fileName 
      });
      
      formData.append('audio', audioBlob, fileName);
      
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
    // Get the appropriate file extension based on the blob's type
    const fileExtension = this.getFileExtension(audioBlob.type);
    const fileName = `recording.${fileExtension}`;
    
    const formData = new FormData();
    formData.append('file', audioBlob, fileName);
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