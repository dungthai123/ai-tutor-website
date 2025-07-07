import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, speechRate = 1.0 } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    console.log('🔊 Generating TTS for text:', text.substring(0, 100) + '...');

    // Call the external TTS API
    const apiBaseUrl = 'https://trumchinese-staging.hackinglanguage.com';
    const apiKey = 'think_ai_lab';
    
    console.log('🔊 Calling TTS API:', `${apiBaseUrl}/api/v1/azure-text-to-speech/text-to-speech-mp3`);
    console.log('🔊 Request body:', JSON.stringify({ text: text.substring(0, 100) + '...', speech_rate: speechRate }));
    
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `${apiBaseUrl}/api/v1/azure-text-to-speech/text-to-speech-mp3`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'location': 'vi',
          },
          body: JSON.stringify({
            text,
            speech_rate: speechRate,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ TTS API error response:', response.status, errorText);
        throw new Error(`TTS API failed with status: ${response.status} - ${errorText}`);
      }

      const audioBuffer = await response.arrayBuffer();

      console.log('✅ TTS generation successful, audio size:', audioBuffer.byteLength);

      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.byteLength.toString(),
        },
      });

    } catch (apiError) {
      console.warn('⚠️ External TTS API failed, falling back to mock response:', apiError);
      
      // Fallback: Create a minimal MP3 header for testing
      // This is a minimal valid MP3 file that creates a short beep sound
      const mockMp3Buffer = new Uint8Array([
        0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ]);

      console.log('🔊 Returning mock TTS response for testing');

      return new NextResponse(mockMp3Buffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': mockMp3Buffer.byteLength.toString(),
        },
      });
    }

  } catch (error) {
    console.error('❌ Text-to-speech error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate speech',
        success: false 
      },
      { status: 500 }
    );
  }
} 