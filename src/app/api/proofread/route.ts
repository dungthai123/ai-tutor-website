import { NextRequest, NextResponse } from 'next/server';
import { proofreadText } from '@/shared/services/openai.service';
import { AssistantResult } from '@/modules/proofreading/types';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    console.log('[PROOFREAD_API] Received text:', text?.substring(0, 100) + '...');

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.log('[PROOFREAD_API] Invalid text input');
      return NextResponse.json(
        { error: 'Valid text is required' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      console.log('[PROOFREAD_API] Text too long:', text.length);
      return NextResponse.json(
        { error: 'Text is too long. Maximum 5000 characters allowed.' },
        { status: 400 }
      );
    }

    console.log('[PROOFREAD_API] Calling OpenAI service...');
    const aiResponse = await proofreadText(text);
    console.log('[PROOFREAD_API] Raw AI response:', aiResponse);
    
    // Parse the AI response as JSON
    let result: AssistantResult;
    try {
      result = JSON.parse(aiResponse);
      console.log('[PROOFREAD_API] Parsed AI response:', result);
    } catch (parseError) {
      console.error('[PROOFREAD_PARSE_ERROR]', parseError);
      console.error('[PROOFREAD_PARSE_ERROR] Raw response:', aiResponse);
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    // Validate the response structure
    if (!result.correction || !Array.isArray(result.edits)) {
      console.error('[PROOFREAD_API] Invalid response structure:', result);
      return NextResponse.json(
        { error: 'Invalid response format from AI service' },
        { status: 500 }
      );
    }

    console.log('[PROOFREAD_API] Returning successful result with', result.edits.length, 'edits');
    return NextResponse.json(result);
  } catch (error) {
    console.error('[PROOFREAD_API_ERROR]', error);
    return NextResponse.json(
      { error: 'An internal server error occurred. Please try again.' },
      { status: 500 }
    );
  }
} 