import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface Task {
  id: string;
  title: string;
  status: string;
  progress: number;
  examples: string[];
  completedAt?: Date;
}

interface ConversationMessage {
  role: string;
  content: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationHistory, tasks, userMessage, topicContext } = body;

    // Create a prompt for OpenAI to analyze task completion
    const prompt = `
You are an expert language learning assistant that analyzes conversations to determine if learning tasks have been completed, regardless of the specific language used in the task descriptions vs. the conversation.

IMPORTANT: The conversation may be in a different language than the task descriptions, but the underlying learning objectives are the same. Focus on the CONTENT and LEARNING OBJECTIVES, not the specific language of the task descriptions.

Topic Context: ${topicContext}

Tasks to check (NOTE: These may be in a different language than the conversation, but represent the same learning objectives):
${(tasks as Task[]).map((task) => `
- Task ID: ${task.id}
- Title: ${task.title}
- Current Status: ${task.status}
- Current Progress: ${task.progress}%
- Examples: ${task.examples.length > 0 ? task.examples.join(', ') : 'None provided'}
`).join('\n')}

Conversation History:
${(conversationHistory as ConversationMessage[]).map((msg) => `${msg.role}: ${msg.content}`).join('\n')}

Latest User Message: ${userMessage}

ANALYSIS INSTRUCTIONS:
1. Look at the MEANING and CONTENT of what the user has communicated, not the specific language
2. If the user has provided information that fulfills a learning objective (like introducing name, age, occupation, etc.), mark the corresponding task as completed
3. Be flexible with language - Chinese responses can fulfill Vietnamese task descriptions if the content matches
4. Focus on whether the user has demonstrated the skill or provided the information requested

For example:
- If a task asks to "introduce name, age, and location" (in any language), and the user said "我叫文勇，我二十八岁，我住在越南" (Chinese), this SHOULD be marked as completed
- If a task asks about "occupation/job" and the user said "我現在是一名學生" (I am currently a student), this SHOULD be marked as completed

Please analyze the conversation and determine which tasks have been completed based on the user's demonstrated communication (regardless of language mismatch).

Respond in the following JSON format:
{
  "completedTasks": ["task_id1", "task_id2"]
}

Focus only on clear task completion - be encouraging and focus on the learning achievements, not language barriers.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert English learning assistant that analyzes conversations to track learning progress."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let result;
    try {
      // Handle markdown code blocks that OpenAI sometimes returns
      let cleanedResponse = responseText.trim();
      
      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      console.log('🔧 Cleaned OpenAI response for parsing:', cleanedResponse);
      result = JSON.parse(cleanedResponse);
      console.log('✅ Successfully parsed OpenAI response:', result);
    } catch {
      console.error('Failed to parse OpenAI response:', responseText);
      // Return empty result if parsing fails
      result = {
        completedTasks: [],
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Task completion check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check task completion',
        completedTasks: [],
      },
      { status: 500 }
    );
  }
} 