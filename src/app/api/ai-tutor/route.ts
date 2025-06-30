import { NextRequest, NextResponse } from 'next/server';
import { tutorResponse } from '@/shared/services';

interface TutorRequest {
  studentInput: string;
  context?: string;
}

interface TutorResponse {
  feedback: string;
  success: boolean;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TutorRequest = await request.json();
    const { studentInput, context } = body;

    if (!studentInput || typeof studentInput !== 'string') {
      return NextResponse.json<TutorResponse>(
        { feedback: '', success: false, error: 'Student input is required' },
        { status: 400 }
      );
    }

    // Use shared OpenAI service for AI tutor
    const feedback = await tutorResponse(studentInput, context);

    return NextResponse.json<TutorResponse>({
      feedback,
      success: true
    });

  } catch (error) {
    console.error('AI Tutor API error:', error);
    
    return NextResponse.json<TutorResponse>(
      { 
        feedback: '', 
        success: false, 
        error: 'An error occurred while processing your request. Please try again.' 
      },
      { status: 500 }
    );
  }
} 