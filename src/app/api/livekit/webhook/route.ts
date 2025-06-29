import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    console.log('🚨 WEBHOOK RECEIVED - Raw Body:', body);
    
    try {
      const jsonBody = JSON.parse(body);
      console.log('🚨 WEBHOOK RECEIVED - JSON Body:', JSON.stringify(jsonBody, null, 2));
      
      // Log specific event types
      if (jsonBody.event) {
        console.log('🎉 LiveKit Event Type:', jsonBody.event);
        
        if (jsonBody.event === 'participant_joined') {
          console.log('👤 Participant Joined:', jsonBody.participant);
        }
        
        if (jsonBody.event === 'track_published') {
          console.log('📡 Track Published:', jsonBody.track);
        }
        
        // Look for any message-related events
        if (jsonBody.event.includes('message') || jsonBody.event.includes('chat')) {
          console.log('💬 MESSAGE EVENT DETECTED:', jsonBody);
        }
      }
      
      // Log any data that looks like a message
      if (jsonBody.message || jsonBody.text || jsonBody.content) {
        console.log('🤖 POTENTIAL MESSAGE DATA:', {
          message: jsonBody.message,
          text: jsonBody.text,
          content: jsonBody.content,
          timestamp: jsonBody.timestamp,
          from: jsonBody.from,
          participant: jsonBody.participant
        });
      }
      
    } catch (parseError) {
      console.log('⚠️ Could not parse webhook body as JSON:', parseError);
      console.log('Raw text:', body);
    }
    
    return NextResponse.json({ success: true, received: true });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

export async function GET() {
  console.log('🔍 Webhook GET request received');
  return NextResponse.json({ status: 'Webhook endpoint active' });
} 