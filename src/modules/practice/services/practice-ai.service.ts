// Practice AI Client Service
export interface PracticeFeedbackRequest {
  exercise: string;
  userAnswer: string;
  correctAnswer?: string;
}

export interface PracticeFeedbackResponse {
  feedback: string;
  success: boolean;
  error?: string;
}

export class PracticeAIService {
  static async getFeedback(
    exercise: string,
    userAnswer: string,
    correctAnswer?: string
  ): Promise<string> {
    try {
      const response = await fetch('/api/practice-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise, userAnswer, correctAnswer }),
      });

      const data: PracticeFeedbackResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get practice feedback');
      }

      return data.feedback;
    } catch (error) {
      console.error('Practice AI Service Error:', error);
      throw new Error('Failed to get practice feedback');
    }
  }

  static async evaluateAnswer(
    question: string,
    userAnswer: string,
    expectedAnswer: string
  ): Promise<{
    score: number;
    feedback: string;
    suggestions: string[];
  }> {
    try {
      const exercise = `Question: ${question}\nExpected Answer: ${expectedAnswer}`;
      const feedback = await this.getFeedback(exercise, userAnswer, expectedAnswer);
      
      // Parse AI response to extract score and suggestions
      // This is a simplified example - you might want more sophisticated parsing
      const score = this.extractScore(feedback);
      const suggestions = this.extractSuggestions(feedback);

      return {
        score,
        feedback,
        suggestions
      };
    } catch (error) {
      console.error('Answer Evaluation Error:', error);
      throw new Error('Failed to evaluate answer');
    }
  }

  private static extractScore(feedback: string): number {
    // Simple regex to extract score from feedback
    const scoreMatch = feedback.match(/score[:\s]*(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1]) : 75; // Default score
  }

  private static extractSuggestions(feedback: string): string[] {
    // Simple extraction of suggestions
    const suggestionSection = feedback.split('suggestions:')[1] || feedback.split('improve:')[1];
    if (!suggestionSection) return [];
    
    return suggestionSection
      .split(/[.\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .slice(0, 3); // Max 3 suggestions
  }
}

// Export convenience functions
export const getPracticeFeedback = PracticeAIService.getFeedback;
export const evaluateAnswer = PracticeAIService.evaluateAnswer; 