import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const topicId = searchParams.get('topic_id');
    const categoryId = searchParams.get('category_id');
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Get LiveKit credentials from environment
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      console.error('Missing LiveKit credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Create room name - use category and topic ID if provided
    let roomName = 'english-practice';
    if (categoryId && topicId) {
      roomName = `practice-${categoryId}-${topicId}`;
    } else if (topicId) {
      roomName = `practice-${topicId}`;
    }

    console.log('🏠 Creating room:', roomName, 'for user:', name);
    
    // Create access token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: name,
      name: name,
    });

    // Grant permissions
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();
    
    return new NextResponse(token, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
} 