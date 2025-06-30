import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/shared/services';

interface TranslateRequest {
  text: string;
  targetLanguage?: string;
  sourceLanguage?: string;
}

interface TranslateResponse {
  translation: string;
  success: boolean;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json();
    const { text, targetLanguage = 'Chinese', sourceLanguage } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json<TranslateResponse>(
        { translation: '', success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    // Use shared OpenAI service for translation
    const translation = await translateText(text, targetLanguage, sourceLanguage);

    return NextResponse.json<TranslateResponse>({
      translation,
      success: true
    });

  } catch (error) {
    console.error('Translation API error:', error);
    
    return NextResponse.json<TranslateResponse>(
      { 
        translation: '', 
        success: false, 
        error: 'An error occurred while translating. Please try again.' 
      },
      { status: 500 }
    );
  }
} 