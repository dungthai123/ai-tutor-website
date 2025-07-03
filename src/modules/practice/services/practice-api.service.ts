import { apiClient } from '@/lib/api/client';
import { 
  HSKLevel, 
  PracticeType,
  PracticeTopicModel, 
  ListeningQuizModel, 
  ReadingQuizModel,
  TestResult,
  OptionModel,
  TypeAnswer,
  ReadingQuestionType,
  ListeningQuestionType,
  WritingQuizModel,
  WritingQuestionType
} from '../types';

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
  regions?: Record<string, {
    reading_translation?: string;
    context?: string;
    explanation?: string;
    transcript?: string;
  }>;
}

interface ApiWritingQuestion {
  _id: string;
  id: string;
  hsk_test_id: string;
  display_order: number;
  context?: string | null;
  answer_example?: string | null;
  correct_answer: string;
  image_url?: string | null;
  image_description?: string | null;
  instruction?: string | null;
  ordering_items?: string[] | null;
  required_words?: string[] | null;
  prompt?: string | null;
  question?: string | null;
  type_practice: string;
  type_of_question: string;
  localized_content?: {
    correctAnswer?: string;
    answerExample?: string;
  };
}

/**
 * API Service for Practice Module
 * Handles all external API calls for practice-related data
 */
export class PracticeApiService {
  /**
   * Get HSK tests by level
   */
  static async getHSKTestsByLevel(level: HSKLevel): Promise<PracticeTopicModel[]> {
    try {
      const response = await apiClient.get<ApiHSKTestResponse>(
      `/api/v1/hsk-tests/level/${level}?pageIndex=1&pageSize=25`
      );
      
      if (!response.success || !response.data?.data || !Array.isArray(response.data.data)) {
        console.warn('Invalid API response format for HSK tests');
        return [];
      }

      // Transform all tests to include both listening and reading variants
      const transformedTests: PracticeTopicModel[] = [];
      
      response.data.data.forEach(test => {
        // Add listening test if it has listening questions
        if (test.total_listening_questions > 0) {
          transformedTests.push(this.transformHSKTest(test, PracticeType.LISTENING));
        }
        
        // Add reading test if it has reading questions
        if (test.total_reading_questions > 0) {
          transformedTests.push(this.transformHSKTest(test, PracticeType.READING));
        }
        
        // Add writing test if it has writing questions
        if (test.total_writing_questions > 0) {
          transformedTests.push(this.transformHSKTest(test, PracticeType.WRITING));
        }
      });

      return transformedTests;
    } catch (error) {
      console.error('Failed to fetch HSK tests by level:', error);
      return [];
    }
  }

  /**
   * Get listening questions for a test
   */
  static async getListeningQuestions(testId: string): Promise<ListeningQuizModel[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: ApiQuizQuestion[] }>(
        `/api/v1/hsk-test-listening-questions/hsk-test/${testId}`
      );
      
      if (!response.success || !Array.isArray(response.data)) {
        console.warn('Invalid API response format for listening questions');
        return [];
      }

      return response.data.map((question) => this.transformListeningQuizModel(question));
    } catch (error) {
      console.error('Failed to fetch listening questions:', error);
      throw new Error('Failed to load listening questions. Please try again.');
    }
  }

  /**
   * Get reading questions for a test  
   */
  static async getReadingQuestions(testId: string): Promise<ReadingQuizModel[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: ApiQuizQuestion[] }>(
        `/api/v1/hsk-test-reading-questions/hsk-test/${testId}`
      );
      
      if (!response.success || !Array.isArray(response.data)) {
        console.warn('Invalid API response format for reading questions');
        return [];
      }

      return response.data.map((question) => this.transformReadingQuizModel(question));
    } catch (error) {
      console.error('Failed to fetch reading questions:', error);
      throw new Error('Failed to load reading questions. Please try again.');
    }
  }

  /**
   * Get writing questions for a test
   */
  static async getWritingQuestions(testId: string): Promise<WritingQuizModel[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: ApiWritingQuestion[] }>(
        `/api/v1/hsk-test-writing-questions/hsk-test/${testId}`
      );
      
      if (!response.success || !Array.isArray(response.data)) {
        console.warn('Invalid API response format for writing questions');
        return [];
      }

      return response.data.map((question) => this.transformWritingQuizModel(question));
    } catch (error) {
      console.error('Failed to fetch writing questions:', error);
      throw new Error('Failed to load writing questions. Please try again.');
    }
  }

  /**
   * Submit test results (optional - implement if backend supports it)
   */
  static async submitTestResult(result: TestResult): Promise<void> {
    try {
      await apiClient.post('/api/v1/practice/results', result);
    } catch (error) {
      console.error('Failed to submit test result:', error);
      // Don't throw error - this is optional functionality
    }
  }

  /**
   * Get test history (optional - implement if backend supports it)
   */
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

  /**
   * Transform HSK test data
   */
  private static transformHSKTest(rawData: ApiHSKTest, type: PracticeType): PracticeTopicModel {
    const questionCount = type === PracticeType.LISTENING 
      ? rawData.total_listening_questions 
      : type === PracticeType.READING ? rawData.total_reading_questions : rawData.total_writing_questions;
      
    return {
      id: rawData._id,
      title: `${rawData.title} (${type === PracticeType.LISTENING ? 'Listening' : type === PracticeType.READING ? 'Reading' : 'Writing'})`,
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

  /**
   * Transform raw API data to ListeningQuizModel
   */
  private static transformListeningQuizModel(rawData: ApiQuizQuestion): ListeningQuizModel {
    // Handle context images for word matching and picture selection questions
    const imageList = rawData.context && Array.isArray(rawData.context) && rawData.context.length > 0 
      ? rawData.context 
      : undefined;

    return {
      id: rawData.id,
      question: rawData.question || '',
      correctAnswer: rawData.answer,
      optionList: rawData.option_list.map(this.transformOptionModel),
      typeAnswer: this.mapAnswerType(rawData.type_of_answer),
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
      questionType: this.detectListeningQuestionType(rawData), // Enhanced question type detection
      imageUrl: rawData.image_url || undefined, // Main question image for listening questions
      imageList: imageList, // Context images for word matching questions
    };
  }

  /**
   * Transform raw API data to ReadingQuizModel
   */
  private static transformReadingQuizModel(rawData: ApiQuizQuestion): ReadingQuizModel {
    // Handle context data properly - could be images (strings) or text options (strings)
    let passage: string | undefined = undefined;
    let imageList: string[] | undefined = undefined;
    
    if (rawData.context && Array.isArray(rawData.context) && rawData.context.length > 0) {
      // Check if context contains URLs (image links) or text
      const isImageContext = rawData.context.some(item => 
        typeof item === 'string' && (
          item.includes('http') || 
          item.includes('.jpg') || 
          item.includes('.png') || 
          item.includes('.jpeg')
        )
      );
      
      if (isImageContext) {
        imageList = rawData.context;
      } else {
        // Context is text options or passage
        passage = rawData.context.join('\n');
      }
    }
    
    // Extract localized content from regions
    const localizedContent = rawData.regions || {};
    const preferredLanguage = 'vi'; // Default to Vietnamese
    const fallbackLanguage = 'en';
    
    const regionData = localizedContent[preferredLanguage] || localizedContent[fallbackLanguage] || {};
    
    return {
      id: rawData.id,
      question: rawData.question || '',
      correctAnswer: rawData.answer,
      optionList: rawData.option_list.map(this.transformOptionModel),
      typeAnswer: this.mapAnswerType(rawData.type_of_answer),
      explanation: regionData.explanation || rawData.localized_content?.explanation || undefined,
      readingTranslation: regionData.reading_translation || undefined,
      correctAnswerTranslation: undefined, // Not available in current API
      optionListText: undefined, // Not available in current API
      type: PracticeType.READING,
      passage: passage,
      questionType: this.detectReadingQuestionType(rawData),
      readingTranslationContext: regionData.context || undefined,
      imageUrl: rawData.image_url || undefined, // Main question image
      imageList: imageList, // Context images for picture matching questions
    };
  }

  /**
   * Transform raw API data to WritingQuizModel
   */
  private static transformWritingQuizModel(rawData: ApiWritingQuestion): WritingQuizModel {
    return {
      id: rawData.id,
      question: rawData.question || '',
      correctAnswer: rawData.correct_answer,
      optionList: [], // Writing questions typically don't have multiple choice options
      typeAnswer: TypeAnswer.QUESTION_ANSWER, // Default for writing questions
      explanation: rawData.localized_content?.correctAnswer || undefined,
      readingTranslation: undefined, // Not applicable for writing
      correctAnswerTranslation: rawData.localized_content?.correctAnswer || undefined,
      optionListText: undefined, // Not applicable for writing
      type: PracticeType.WRITING,
      questionType: this.detectWritingQuestionType(rawData),
      orderingItems: rawData.ordering_items || undefined,
      requiredWords: rawData.required_words || undefined,
      prompt: rawData.prompt || undefined,
      context: rawData.context || undefined,
      answerExample: rawData.answer_example || undefined,
      imageUrl: rawData.image_url || undefined,
      imageDescription: rawData.image_description || undefined,
      instruction: rawData.instruction || undefined,
    };
  }

  /**
   * Detect listening question type based on API data
   */
  private static detectListeningQuestionType(rawData: ApiQuizQuestion): ListeningQuestionType | undefined {
    // Use type_of_question field from API if available
    if (rawData.type_of_question) {
      const typeMap: Record<string, ListeningQuestionType> = {
        'Listen_TrueFalse': ListeningQuestionType.LISTEN_TRUE_FALSE,
        'Listen_Match_PictureWithAudio': ListeningQuestionType.LISTEN_MATCH_PICTURE_WITH_AUDIO,
        'Listen_MultipleChoice_Picture': ListeningQuestionType.LISTEN_MULTIPLE_CHOICE_PICTURE,
        'Listen_MultipleChoice_Statement': ListeningQuestionType.LISTEN_MULTIPLE_CHOICE_STATEMENT,
        'Listen_MultipleChoice_ShortDialogue': ListeningQuestionType.LISTEN_MULTIPLE_CHOICE_SHORT_DIALOGUE,
        'Listen_MultipleChoice_MediumDialogue': ListeningQuestionType.LISTEN_MULTIPLE_CHOICE_MEDIUM_DIALOGUE,
        'Listen_MultipleChoice_Dialogue': ListeningQuestionType.LISTEN_MULTIPLE_CHOICE_DIALOGUE,
        'Listen_MultipleChoice_ShortPassage': ListeningQuestionType.LISTEN_MULTIPLE_CHOICE_SHORT_PASSAGE,
        'Listen_MultipleChoice_ConsistentStatement': ListeningQuestionType.LISTEN_MULTIPLE_CHOICE_CONSISTENT_STATEMENT,
        'Listen_MultipleChoice_Interview': ListeningQuestionType.LISTEN_MULTIPLE_CHOICE_INTERVIEW,
      };
      
      return typeMap[rawData.type_of_question];
    }

    // Fallback to heuristic detection
    if (rawData.type_of_answer === 'true_false') {
      return ListeningQuestionType.LISTEN_TRUE_FALSE;
    }
    
    if (rawData.option_list.some(opt => opt.img_link)) {
      return ListeningQuestionType.LISTEN_MULTIPLE_CHOICE_PICTURE;
    }

    if (rawData.type_of_answer === 'wordMatching') {
      return ListeningQuestionType.LISTEN_MATCH_PICTURE_WITH_AUDIO;
    }

    return undefined; // Let it default to normal question
  }

  /**
   * Detect reading question type based on API data
   */
  private static detectReadingQuestionType(rawData: ApiQuizQuestion): ReadingQuestionType | undefined {
    // Use type_of_question field from API if available
    if (rawData.type_of_question) {
      const typeMap: Record<string, ReadingQuestionType> = {
        'Read_Ordering': ReadingQuestionType.READ_ORDERING,
        'Read_MultipleChoice_WrongSentence': ReadingQuestionType.READ_WRONG_SENTENCE,
        'Read_TrueFalse': ReadingQuestionType.READ_TRUE_FALSE,
        'Read_Match_PictureWithStatement': ReadingQuestionType.READ_MATCH_PICTURE_WITH_STATEMENT,
        'Read_Match_StatementWithStatement': ReadingQuestionType.READ_MATCH_STATEMENT_WITH_STATEMENT,
        'Read_Match_MissingWordWithStatement': ReadingQuestionType.READ_MATCH_MISSING_WORD_WITH_STATEMENT,
        'Read_MultipleChoice_ShortPassage': ReadingQuestionType.READ_MULTIPLE_CHOICE_SHORT_PASSAGE,
        'Read_MultipleChoice_LongPassage': ReadingQuestionType.READ_MULTIPLE_CHOICE_LONG_PASSAGE,
        'Read_MultipleChoice_Statement': ReadingQuestionType.READ_MULTIPLE_CHOICE_STATEMENT,
        'Read_MultipleChoice_Passage': ReadingQuestionType.READ_MULTIPLE_CHOICE_PASSAGE,
        'Read_Matching_MissingSentence': ReadingQuestionType.READ_MATCHING_MISSING_SENTENCE,
        'Read_MultipleChoice_MissingWords_sentence': ReadingQuestionType.READ_MULTIPLE_CHOICE_MISSING_WORDS_SENTENCE,
      };
      
      return typeMap[rawData.type_of_question];
    }

    // Fallback to heuristic detection
    if (rawData.type_of_answer === 'true_false') {
      return ReadingQuestionType.READ_TRUE_FALSE;
    }
    
    if (rawData.option_list.some(opt => opt.img_link)) {
      return ReadingQuestionType.READ_MATCH_PICTURE_WITH_STATEMENT;
    }

    return undefined; // Let it default to normal question
  }

  /**
   * Detect writing question type based on API data
   */
  private static detectWritingQuestionType(rawData: ApiWritingQuestion): WritingQuestionType | undefined {
    // Use type_of_question field from API if available
    if (rawData.type_of_question) {
      const typeMap: Record<string, WritingQuestionType> = {
        'Write_Ordering': WritingQuestionType.WRITE_ORDERING,
        'Write_SentencefromImage': WritingQuestionType.WRITE_SENTENCE_FROM_IMAGE,
        'Write_Completion': WritingQuestionType.WRITE_COMPLETION,
        'Write_Essay': WritingQuestionType.WRITE_ESSAY,
        'Write_PassagefromVocabs': WritingQuestionType.WRITE_PASSAGE_FROM_VOCABS,
        'Write_PassagefromPictures': WritingQuestionType.WRITE_PASSAGE_FROM_PICTURES,
        'Write_SummarizePassage': WritingQuestionType.WRITE_SUMMARIZE_PASSAGE
      };
      
      return typeMap[rawData.type_of_question];
    }

    // Fallback to heuristic detection
    if (rawData.ordering_items && rawData.ordering_items.length > 0) {
      return WritingQuestionType.WRITE_ORDERING;
    }
    
    if (rawData.image_url) {
      return WritingQuestionType.WRITE_SENTENCE_FROM_IMAGE;
    }
    
    if (rawData.required_words && rawData.required_words.length > 0) {
      return WritingQuestionType.WRITE_PASSAGE_FROM_VOCABS;
    }
    
    if (rawData.prompt && (rawData.prompt.includes('picture') || rawData.prompt.includes('image'))) {
      return WritingQuestionType.WRITE_PASSAGE_FROM_PICTURES;
    }
    
    if (rawData.context && rawData.context.length > 100) {
      return WritingQuestionType.WRITE_SUMMARIZE_PASSAGE;
    }
    
    return undefined; // Let it default to normal question
  }

  /**
   * Transform answer option
   */
  private static transformOptionModel(option: { text: string; img_link?: string | null }, index: number): OptionModel {
    return {
      id: (index + 1).toString(),
      text: option.text,
      imageUrl: option.img_link || undefined,
    };
  }

  /**
   * Map API answer type to our enum - updated to fix runtime error
   */
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