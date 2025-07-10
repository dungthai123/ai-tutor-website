import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic, level, tone, focus } = await request.json();

    if (!topic?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Topic is required' },
        { status: 400 }
      );
    }

    const prompt = `You are a Chinese language speaking tutor. Generate helpful conversation suggestions for a student who wants to practice speaking about: "${topic}"

Student Level: ${level}
Conversation Tone: ${tone}
Focus Area: ${focus}

Please provide:
1. 4-6 useful phrases they can use in this conversation
2. 5-8 key vocabulary words with pinyin, meanings, and example sentences
3. 3-4 grammar tips relevant to this topic
4. 4-5 conversation starters they can use to begin talking about this topic

Format your response as JSON with this structure:
{
  "phrases": ["phrase1", "phrase2", ...],
  "vocabulary": [
    {
      "word": "Chinese word",
      "pinyin": "pinyin pronunciation", 
      "meaning": "English meaning",
      "example": "Example sentence in Chinese"
    }
  ],
  "grammarTips": ["tip1", "tip2", ...],
  "conversationStarters": ["starter1", "starter2", ...]
}

Make sure the suggestions are:
- Appropriate for ${level} level
- Match the ${tone} tone
- Focus on ${focus}
- Practical and useful for real conversations
- Include both Chinese characters and pinyin where appropriate`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful Chinese language speaking tutor. Always respond with valid JSON only, no additional text or markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let suggestions;
    try {
      suggestions = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse OpenAI response:', responseText);
      throw new Error('Invalid response format from AI');
    }

    // Validate the response structure
    if (!suggestions.phrases || !suggestions.vocabulary || !suggestions.grammarTips || !suggestions.conversationStarters) {
      throw new Error('Incomplete response from AI');
    }

    const result = {
      suggestions,
      level,
      tone,
      focus,
    };

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Speaking helper error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to generate speaking help'
      },
      { status: 500 }
    );
  }
} 