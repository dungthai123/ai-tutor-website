import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomName, categoryId, topicId, topicData } = body;
    
    if (!roomName) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    }

    // Get LiveKit server URL
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!livekitUrl || !apiKey || !apiSecret) {
      console.error('Missing LiveKit configuration');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Prepare agent context
    const agentContext = {
      room: roomName,
      category_id: categoryId,
      topic_id: topicId,
      topic_data: topicData,
      instructions: `You are an AI English tutor helping students practice English conversation. 
      Topic: ${topicData?.topicName || 'General English'}
      Category: ${topicData?.categoryName || 'General'}
      Description: ${topicData?.description || 'Practice English conversation'}
      Tasks: ${topicData?.tasks?.join(', ') || 'General conversation practice'}
      
      Please:
      1. Engage in natural conversation about this topic
      2. Provide gentle corrections when needed
      3. Ask follow-up questions to encourage speaking
      4. Give positive feedback and encouragement
      5. Adapt to the student's level`
    };

    console.log('🤖 Starting agent for room:', roomName, 'with context:', agentContext);

    // In a real implementation, you would trigger your agent here
    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Agent context prepared',
      context: agentContext 
    });

  } catch (error) {
    console.error('Error starting agent:', error);
    return NextResponse.json({ error: 'Failed to start agent' }, { status: 500 });
  }
} 