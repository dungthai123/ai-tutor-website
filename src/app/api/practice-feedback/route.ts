import { NextRequest, NextResponse } from 'next/server';
import { provideFeedback } from '@/shared/services';

interface FeedbackRequest {
  exercise: string;
  userAnswer: string;
  correctAnswer?: string;
}

interface FeedbackResponse {
  feedback: string;
  success: boolean;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json();
    const { exercise, userAnswer, correctAnswer } = body;

    if (!exercise || !userAnswer) {
      return NextResponse.json<FeedbackResponse>(
        { feedback: '', success: false, error: 'Exercise and user answer are required' },
        { status: 400 }
      );
    }

    // Use shared OpenAI service for practice feedback
    const feedback = await provideFeedback(exercise, userAnswer, correctAnswer);

    return NextResponse.json<FeedbackResponse>({
      feedback,
      success: true
    });

  } catch (error) {
    console.error('Practice Feedback API error:', error);
    
    return NextResponse.json<FeedbackResponse>(
      { 
        feedback: '', 
        success: false, 
        error: 'An error occurred while processing your request. Please try again.' 
      },
      { status: 500 }
    );
  }
} 