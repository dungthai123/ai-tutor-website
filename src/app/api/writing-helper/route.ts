import { NextRequest, NextResponse } from 'next/server';
import OpenAIService from '@/shared/services/openai.service';

export async function POST(request: NextRequest) {
  try {
    console.log('[WRITING_HELPER_API] Request received');
    
    const body = await request.json();
    const { topic, style, tone, level } = body;
    
    console.log('[WRITING_HELPER_API] Request data:', { topic, style, tone, level });
    
    // Validate required fields
    if (!topic || !style || !tone || !level) {
      console.log('[WRITING_HELPER_API] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: topic, style, tone, level' },
        { status: 400 }
      );
    }
    
    // Validate topic length
    if (topic.length > 500) {
      console.log('[WRITING_HELPER_API] Topic too long');
      return NextResponse.json(
        { error: 'Topic must be less than 500 characters' },
        { status: 400 }
      );
    }
    
    // Call OpenAI service
    const rawResult = await OpenAIService.generateWritingHelp({
      topic,
      style,
      tone,
      level
    });
    
    console.log('[WRITING_HELPER_API] OpenAI raw response:', rawResult.substring(0, 200) + '...');
    
    // Parse the JSON response from OpenAI
    let parsedResult;
    try {
      parsedResult = JSON.parse(rawResult);
      
      // Validate the response structure
      if (!parsedResult || typeof parsedResult !== 'object') {
        throw new Error('Response is not a valid object');
      }
      
      // Ensure required fields exist with proper types
      if (!Array.isArray(parsedResult.outline)) {
        parsedResult.outline = [];
      }
      if (!Array.isArray(parsedResult.vocabulary)) {
        parsedResult.vocabulary = [];
      }
      if (!Array.isArray(parsedResult.grammarTips)) {
        parsedResult.grammarTips = [];
      }
      if (!Array.isArray(parsedResult.writingStyleTips)) {
        parsedResult.writingStyleTips = [];
      }
      
    } catch (parseError) {
      console.error('[WRITING_HELPER_API] Failed to parse OpenAI response:', parseError);
      console.error('[WRITING_HELPER_API] Raw response:', rawResult);
      return NextResponse.json(
        { error: 'Invalid response format from AI service' },
        { status: 500 }
      );
    }
    
    console.log('[WRITING_HELPER_API] Parsed response successfully');
    
    return NextResponse.json(parsedResult);
    
  } catch (error) {
    console.error('[WRITING_HELPER_API] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `Failed to generate writing help: ${errorMessage}` },
      { status: 500 }
    );
  }
} 