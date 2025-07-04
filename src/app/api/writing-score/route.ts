import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '@/shared/services/openai.service';
import { WritingScoringRequest, WritingScore } from '@/modules/practice/types';

export async function POST(request: NextRequest) {
  try {
    const body: WritingScoringRequest = await request.json();
    const { questionType, task, userAnswer, questionData } = body;

    if (!userAnswer || userAnswer.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'User answer is required' },
        { status: 400 }
      );
    }

    // Build the prompt for AI scoring
    let prompt = `I have a writing task where a user is asked to perform the following:

Type: ${questionType}
Task: ${task}

`;

    // Add additional context if available
    if (questionData?.context) {
      prompt += `Context: ${questionData.context}\n`;
    }

    if (questionData?.prompt) {
      prompt += `Prompt: ${questionData.prompt}\n`;
    }

    if (questionData?.instruction) {
      prompt += `Instructions: ${questionData.instruction}\n`;
    }

    if (questionData?.requiredWords && questionData.requiredWords.length > 0) {
      prompt += `Required words to use: ${questionData.requiredWords.join(', ')}\n`;
    }

    if (questionData?.imageUrl) {
      prompt += `Note: This task includes an image that the user should reference (image URL: ${questionData.imageUrl})\n`;
    }

    prompt += `
The user's response:
${userAnswer}

Please evaluate the writing based on grammar, coherence, structure, vocabulary usage, and clarity. Provide a score out of 10, feedback for improvement, and any corrections needed. Provide the corrected version of the text, including grammar or style corrections. Respond in a structured JSON format as follows:

{
  "score": [score out of 10],
  "feedback": "[detailed feedback on writing]",
  "corrected_text": "[corrected version of the text]",
  "suggestions": "[optional suggestions for improvement]",
  "confidence_level": "[optional, a rating of the model's confidence in the score, e.g., 'high', 'medium', 'low']"
}`;

    // Get AI response
    const aiResponse = await OpenAIService.createChatCompletion(
      [{ role: 'user', content: prompt }],
      {
        model: 'gpt-4o-mini',
        maxTokens: 800,
        temperature: 0.3,
        systemPrompt: `You are an expert English writing assessor. Provide detailed, constructive feedback on English writing exercises. Focus on accuracy, clarity, and educational value. Always respond with valid JSON format.`
      }
    );

    // Parse the AI response
    let scoringResult: WritingScore;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scoringResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response
      scoringResult = {
        score: 7,
        feedback: aiResponse,
        corrected_text: userAnswer,
        suggestions: 'Please review your writing for grammar and clarity.',
        confidence_level: 'low'
      };
    }

    // Validate the response structure
    if (typeof scoringResult.score !== 'number' || scoringResult.score < 0 || scoringResult.score > 10) {
      scoringResult.score = Math.max(0, Math.min(10, scoringResult.score || 7));
    }

    return NextResponse.json({
      success: true,
      result: scoringResult
    });

  } catch (error) {
    console.error('Writing scoring error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to score writing'
      },
      { status: 500 }
    );
  }
} 