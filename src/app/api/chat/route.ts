import { NextRequest, NextResponse } from 'next/server';
import { ChatApiRequest, ChatApiResponse } from '@/modules/chatbot/types';
import { chatbotResponse } from '@/shared/services';

export async function POST(request: NextRequest) {
  try {
    const body: ChatApiRequest = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json<ChatApiResponse>(
        { reply: '', success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Convert to the format expected by shared service
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

    // Use shared OpenAI service
    const reply = await chatbotResponse(message, formattedHistory);

    return NextResponse.json<ChatApiResponse>({
      reply,
      success: true
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json<ChatApiResponse>(
      { 
        reply: '', 
        success: false, 
        error: 'An error occurred while processing your request. Please try again.' 
      },
      { status: 500 }
    );
  }
} 