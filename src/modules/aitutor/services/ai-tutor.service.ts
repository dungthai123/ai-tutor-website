// AI Tutor Client Service
export interface TutorRequest {
  studentInput: string;
  context?: string;
}

export interface TutorResponse {
  feedback: string;
  success: boolean;
  error?: string;
}

export class AITutorService {
  static async getFeedback(
    studentInput: string,
    context?: string
  ): Promise<string> {
    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentInput, context }),
      });

      const data: TutorResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get tutor feedback');
      }

      return data.feedback;
    } catch (error) {
      console.error('AI Tutor Service Error:', error);
      throw new Error('Failed to get AI tutor feedback');
    }
  }

  static async checkGrammar(text: string): Promise<string> {
    try {
      const response = await fetch('/api/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to check grammar');
      }

      return data.feedback;
    } catch (error) {
      console.error('Grammar Check Error:', error);
      throw new Error('Failed to check grammar');
    }
  }
}

// Export convenience functions
export const getTutorFeedback = AITutorService.getFeedback;
export const checkGrammar = AITutorService.checkGrammar; 