import { apiClient } from './client';
import { 
  HSKLevel, 
  PracticeType,
  PracticeTopicModel, 
  ListeningQuizModel, 
  ReadingQuizModel,
  TestResult,
  OptionModel,
  TypeAnswer
} from '@/modules/practice/types';

// API Response interfaces
interface ApiHSKTestResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    recordsFiltered: number;
    recordsTotal: number;
    totalPages: number;
    currentPage: number;
    data: ApiHSKTest[];
  };
}

interface ApiHSKTest {
  _id: string;
  display_order: number;
  level: string;
  title: string;
  total_questions: number;
  total_listening_questions: number;
  total_reading_questions: number;
  total_writing_questions: number;
  is_active: boolean;
  created_at: string;
}

interface ApiQuizQuestion {
  _id: string;
  id: string;
  hsk_test_id: string;
  display_order: number;
  audio_url?: string;
  image_url?: string;
  context?: string[] | null;
  question?: string | null;
  option_list: Array<{
    text: string;
    img_link?: string | null;
  }>;
  answer: string;
  audio_context?: string | null;
  transcript?: string;
  transcript_context?: string | null;
  type_practice: string;
  type_of_question: string;
  type_of_answer: string;
  localized_content?: {
    transcript?: string;
    explanation?: string | null;
  };
}

export class PracticeApiService {
  // Get HSK tests by level
  static async getHSKTestsByLevel(level: HSKLevel): Promise<PracticeTopicModel[]> {
    try {
      const response = await apiClient.get<ApiHSKTestResponse>(`/api/v1/hsk-tests/level/${level}`);
      
      if (!response.success || !response.data?.data || !Array.isArray(response.data.data)) {
        console.warn('Invalid API response format for HSK tests');
        return [];
      }

      // Transform all tests to include both listening and reading variants
      const transformedTests: PracticeTopicModel[] = [];
      
      response.data.data.forEach(test => {
        // Add listening test if it has listening questions
        if (test.total_listening_questions > 0) {
          transformedTests.push(PracticeApiService.transformHSKTest(test, PracticeType.LISTENING));
        }
        
        // Add reading test if it has reading questions
        if (test.total_reading_questions > 0) {
          transformedTests.push(PracticeApiService.transformHSKTest(test, PracticeType.READING));
        }
      });

      return transformedTests;
    } catch (error) {
      console.error('Failed to fetch HSK tests by level:', error);
      return [];
    }
  }

  // Get listening questions for a test
  static async getListeningQuestions(testId: string): Promise<ListeningQuizModel[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: ApiQuizQuestion[] }>(
        `/api/v1/hsk-test-listening-questions/hsk-test/${testId}`
      );
      
      if (!response.success || !Array.isArray(response.data)) {
        console.warn('Invalid API response format for listening questions');
        return [];
      }

      return response.data.map((question) => PracticeApiService.transformListeningQuizModel(question));
    } catch (error) {
      console.error('Failed to fetch listening questions:', error);
      throw new Error('Failed to load listening questions. Please try again.');
    }
  }

  // Get reading questions for a test  
  static async getReadingQuestions(testId: string): Promise<ReadingQuizModel[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: ApiQuizQuestion[] }>(
        `/api/v1/hsk-test-reading-questions/hsk-test/${testId}`
      );
      
      if (!response.success || !Array.isArray(response.data)) {
        console.warn('Invalid API response format for reading questions');
        return [];
      }

      return response.data.map((question) => PracticeApiService.transformReadingQuizModel(question));
    } catch (error) {
      console.error('Failed to fetch reading questions:', error);
      throw new Error('Failed to load reading questions. Please try again.');
    }
  }

  // Submit test results (optional - implement if backend supports it)
  static async submitTestResult(result: TestResult): Promise<void> {
    try {
      await apiClient.post('/api/v1/practice/results', result);
    } catch (error) {
      console.error('Failed to submit test result:', error);
      // Don't throw error - this is optional functionality
    }
  }

  // Get test history (optional - implement if backend supports it)
  static async getTestHistory(level: HSKLevel, type: PracticeType): Promise<TestResult[]> {
    try {
      const response = await apiClient.get<TestResult[]>(
        `/api/v1/practice/history?level=${level}&type=${type}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Failed to fetch test history:', error);
      return [];
    }
  }

  // Transform HSK test data
  private static transformHSKTest(rawData: ApiHSKTest, type: PracticeType): PracticeTopicModel {
    const questionCount = type === PracticeType.LISTENING 
      ? rawData.total_listening_questions 
      : rawData.total_reading_questions;
      
    return {
      id: rawData._id,
      title: `${rawData.title} (${type === PracticeType.LISTENING ? 'Listening' : 'Reading'})`,
      displayOrder: rawData.display_order,
      level: rawData.level as HSKLevel,
      typePractice: type,
      totalQuestions: rawData.total_questions,
      totalListeningQuestions: rawData.total_listening_questions,
      totalReadingQuestions: rawData.total_reading_questions,
      totalWritingQuestions: rawData.total_writing_questions,
      // Legacy fields for backward compatibility
      type,
      description: `HSK ${rawData.level} ${type} practice test with ${questionCount} questions`,
      difficulty: rawData.level.includes('1') || rawData.level.includes('2') ? 'easy' : 
                 rawData.level.includes('3') || rawData.level.includes('4') ? 'medium' : 'hard',
      questionCount,
      estimatedTime: Math.max(10, questionCount * 1.5), // Estimate 1.5 min per question
    };
  }

  // Transform raw API data to ListeningQuizModel
  private static transformListeningQuizModel(rawData: ApiQuizQuestion): ListeningQuizModel {
    return {
      id: rawData.id,
      question: rawData.question || '',
      correctAnswer: rawData.answer,
      optionList: rawData.option_list.map(PracticeApiService.transformOptionModel),
      typeAnswer: PracticeApiService.mapAnswerType(rawData.type_of_answer),
      explanation: rawData.localized_content?.explanation || undefined,
      readingTranslation: undefined, // Not available in current API
      correctAnswerTranslation: undefined, // Not available in current API
      optionListText: undefined, // Not available in current API
      type: PracticeType.LISTENING,
      audio: rawData.audio_url || '',
      audioContext: rawData.audio_context || undefined,
      transcript: rawData.transcript,
      transcriptContext: rawData.transcript_context || undefined,
      readingTranslationContext: undefined, // Not available in current API
    };
  }

  // Transform raw API data to ReadingQuizModel
  private static transformReadingQuizModel(rawData: ApiQuizQuestion): ReadingQuizModel {
    return {
      id: rawData.id,
      question: rawData.question || '',
      correctAnswer: rawData.answer,
      optionList: rawData.option_list.map(PracticeApiService.transformOptionModel),
      typeAnswer: PracticeApiService.mapAnswerType(rawData.type_of_answer),
      explanation: rawData.localized_content?.explanation || undefined,
      readingTranslation: undefined, // Not available in current API
      correctAnswerTranslation: undefined, // Not available in current API
      optionListText: undefined, // Not available in current API
      type: PracticeType.READING,
      passage: rawData.context?.join('\n') || rawData.question || '',
      questionType: undefined, // Could be enhanced to detect question type
      readingTranslationContext: undefined, // Not available in current API
      imageUrl: rawData.image_url || undefined, // Main question image
    };
  }

  // Transform answer option
  private static transformOptionModel(option: { text: string; img_link?: string | null }, index: number): OptionModel {
    return {
      id: (index + 1).toString(),
      text: option.text,
      imageUrl: option.img_link || undefined,
    };
  }

  // Map API answer type to our enum - updated to fix runtime error
  private static mapAnswerType(apiType: string): TypeAnswer {
    // Direct string mapping to avoid enum import issues
    const typeMap: Record<string, string> = {
      'trueFalse': 'trueFalse',
      'imageSelection': 'imageSelection', 
      'wordMatching': 'wordMatching',
      'questionAnswer': 'questionAnswer',
      'multiple_choice': 'questionAnswer',
      'true_false': 'trueFalse',
      'image_selection': 'imageSelection',
      'word_matching': 'wordMatching'
    };
    
    return (typeMap[apiType] || 'questionAnswer') as TypeAnswer;
  }
} 