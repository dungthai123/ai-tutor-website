import { ApiResponse, SpeechData } from '../../types';
import { BaseApiService } from '../api/base-api.service';

class PronunciationService extends BaseApiService {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_BASE_URL || 'https://trumchinese-staging.hackinglanguage.com');
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
    return 'm4a';
  }

  async assessPronunciation(
    audioBlob: Blob,
    referenceText: string
  ): Promise<ApiResponse<SpeechData>> {
    const fileExtension = this.getFileExtension(audioBlob.type);
    const fileName = `recording_${Date.now()}.${fileExtension}`;
    
    const formData = new FormData();
    formData.append('file', audioBlob, fileName);
    formData.append('referenceText', referenceText);

    try {
      const response = await fetch(
        `${this.api.defaults.baseURL}/api/v1/azure-speech-pronunciation-assessment/assess-pronunciation`,
        {
          method: 'POST',
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'think_ai_lab',
            'location': 'vi',
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Failed to assess pronunciation',
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: this.formatErrorMessage(error),
      };
    }
  }

  async assessPronunciationWithDetails(
    audioBlob: Blob,
    referenceText: string,
    language: string = 'zh-CN'
  ): Promise<ApiResponse<SpeechData>> {
    try {
      const response = await this.request<SpeechData>(
        'POST',
        '/api/v1/azure-speech-pronunciation-assessment/assess-pronunciation',
        {
          file: audioBlob,
          referenceText,
          language,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response;
    } catch (error) {
      return {
        success: false,
        error: this.formatErrorMessage(error),
      };
    }
  }

  private formatErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred during pronunciation assessment';
  }

  // Helper method to calculate overall pronunciation score
  calculateOverallScore(speechData: SpeechData): number {
    if (!speechData.nBest || speechData.nBest.length === 0) {
      return 0;
    }

    const nBest = speechData.nBest[0];
    const { accuracyScore, fluencyScore, completenessScore } = nBest.pronunciationAssessment;

    // Weighted average calculation
    return Math.round((accuracyScore * 0.4 + fluencyScore * 0.3 + completenessScore * 0.3));
  }

  // Helper method to get pronunciation feedback
  getPronunciationFeedback(speechData: SpeechData): string {
    const score = this.calculateOverallScore(speechData);
    
    if (score >= 90) {
      return 'Excellent pronunciation! Your speech is very clear and natural.';
    } else if (score >= 80) {
      return 'Good pronunciation! Minor improvements could make it even better.';
    } else if (score >= 70) {
      return 'Fair pronunciation. Focus on clarity and rhythm.';
    } else if (score >= 60) {
      return 'Needs improvement. Practice individual sounds and word stress.';
    } else {
      return 'Significant improvement needed. Consider working with a pronunciation coach.';
    }
  }
}

export const pronunciationService = new PronunciationService(); 