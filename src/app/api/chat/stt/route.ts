import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    console.log('🎤 Processing audio file:', audioFile.name, 'Size:', audioFile.size);

    // Convert File to the format expected by OpenAI
    const audioBuffer = await audioFile.arrayBuffer();
    const audioFile2 = new File([audioBuffer], audioFile.name, { type: audioFile.type });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile2,
      model: 'whisper-1',
      language: language || 'zh',
      prompt: language === 'zh' ? '如果是中文的话就是简体中文。' : undefined,
    });

    console.log('✅ Transcription successful:', transcription.text);

    return NextResponse.json({
      text: transcription.text,
      success: true,
    });

  } catch (error) {
    console.error('❌ Speech-to-text error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to transcribe audio',
        success: false 
      },
      { status: 500 }
    );
  }
} 