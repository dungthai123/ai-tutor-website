import { OpenAI } from 'openai';

// OpenAI Client Instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Base Types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenAIConfig {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

// Default configurations for different use cases
export const OPENAI_CONFIGS = {
  CHATBOT: {
    model: 'gpt-4o-mini',
    maxTokens: 500,
    temperature: 0.7,
    systemPrompt: `You are a helpful AI assistant for an English learning platform. You help users with:
    - English language learning questions
    - HSK Chinese test preparation
    - Grammar explanations
    - Vocabulary assistance
    - Study tips and strategies
    
    Keep your responses concise, helpful, and encouraging. If users ask about topics unrelated to language learning, gently redirect them back to educational content.`
  },
  
  AI_TUTOR: {
    model: 'gpt-4o-mini',
    maxTokens: 800,
    temperature: 0.5,
    systemPrompt: `You are an expert English tutor. Provide detailed explanations, corrections, and teaching guidance. Focus on:
    - Grammar corrections with explanations
    - Pronunciation guidance
    - Writing improvement suggestions
    - Structured learning approaches
    
    Be patient, encouraging, and provide specific examples.`
  },
  
  PRACTICE_FEEDBACK: {
    model: 'gpt-4o-mini',
    maxTokens: 300,
    temperature: 0.3,
    systemPrompt: `You are an assessment AI that provides feedback on language practice exercises. Provide:
    - Clear, constructive feedback
    - Specific areas for improvement
    - Encouragement and next steps
    - Scoring justification
    
    Be objective and educational in your responses.`
  },
  
  GRAMMAR_CHECKER: {
    model: 'gpt-4o-mini',
    maxTokens: 400,
    temperature: 0.2,
    systemPrompt: `You are a grammar checking AI. Analyze text and provide:
    - Grammar error identification
    - Corrected versions
    - Brief explanations of rules
    - Alternative phrasings
    
    Focus on accuracy and clarity.`
  },
  
  TRANSLATOR: {
    model: 'gpt-4o-mini',
    maxTokens: 300,
    temperature: 0.3,
    systemPrompt: `You are a professional translator. Provide accurate translations with:
    - Clear, natural translations
    - Cultural context when needed
    - Maintain the tone and meaning of the original text
    - Only return the translation, no additional commentary unless specifically requested
    
    Focus on accuracy and natural language flow.`
  }
} as const;

// Core OpenAI Service Functions
export class OpenAIService {
  /**
   * Generic chat completion function
   */
  static async createChatCompletion(
    messages: ChatMessage[],
    config: OpenAIConfig = OPENAI_CONFIGS.CHATBOT
  ): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      const systemMessage: ChatMessage = {
        role: 'system',
        content: config.systemPrompt || OPENAI_CONFIGS.CHATBOT.systemPrompt
      };

      const completion = await openai.chat.completions.create({
        model: config.model || 'gpt-4o-mini',
        messages: [systemMessage, ...messages],
        max_tokens: config.maxTokens || 500,
        temperature: config.temperature || 0.7,
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
    } catch (error) {
      console.error('OpenAI Service Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  /**
   * Chatbot-specific function
   */
  static async chatbotResponse(
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    const messages: ChatMessage[] = [
      ...conversationHistory.slice(-10), // Last 10 messages for context
      { role: 'user', content: message }
    ];

    return OpenAIService.createChatCompletion(messages, OPENAI_CONFIGS.CHATBOT);
  }

  /**
   * AI Tutor-specific function
   */
  static async tutorResponse(
    studentInput: string,
    context?: string
  ): Promise<string> {
    const messages: ChatMessage[] = [];
    
    if (context) {
      messages.push({ role: 'user', content: `Context: ${context}` });
    }
    
    messages.push({ role: 'user', content: studentInput });

    return OpenAIService.createChatCompletion(messages, OPENAI_CONFIGS.AI_TUTOR);
  }

  /**
   * Practice feedback function
   */
  static async provideFeedback(
    exercise: string,
    userAnswer: string,
    correctAnswer?: string
  ): Promise<string> {
    let prompt = `Exercise: ${exercise}\nUser Answer: ${userAnswer}`;
    
    if (correctAnswer) {
      prompt += `\nCorrect Answer: ${correctAnswer}`;
    }

    const messages: ChatMessage[] = [
      { role: 'user', content: prompt }
    ];

    return OpenAIService.createChatCompletion(messages, OPENAI_CONFIGS.PRACTICE_FEEDBACK);
  }

  /**
   * Grammar checking function
   */
  static async checkGrammar(text: string): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'user', content: `Please check the grammar of this text: "${text}"` }
    ];

    return OpenAIService.createChatCompletion(messages, OPENAI_CONFIGS.GRAMMAR_CHECKER);
  }

  /**
   * Translation function
   */
  static async translateText(
    text: string,
    targetLanguage: string = 'Chinese',
    sourceLanguage?: string
  ): Promise<string> {
    const sourceInfo = sourceLanguage ? `from ${sourceLanguage} ` : '';
    const prompt = `Translate the following text ${sourceInfo}to ${targetLanguage}: "${text}"`;
    
    const messages: ChatMessage[] = [
      { role: 'user', content: prompt }
    ];

    return OpenAIService.createChatCompletion(messages, OPENAI_CONFIGS.TRANSLATOR);
  }
}

// Export individual functions for convenience
export const {
  chatbotResponse,
  tutorResponse,
  provideFeedback,
  checkGrammar,
  translateText,
  createChatCompletion
} = OpenAIService; 