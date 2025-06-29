import { PracticeApiService } from '@/lib/api/practice';
import { 
  HSKLevel, 
  PracticeType, 
  QuizModel, 
  PracticeTopicModel,
  TestScore 
} from '../types';
import { 
  PracticeTopicsResponse, 
  TestInitResponse,
  TestConfiguration 
} from '../types';

/**
 * Service class for handling practice-related business logic
 */
export class PracticeService {
  /**
   * Fetch all practice topics for a given HSK level
   * Returns separated listening and reading topics with count
   */
  static async fetchPracticeTopics(level: HSKLevel): Promise<PracticeTopicsResponse> {
    try {
      const allTopics = await PracticeApiService.getHSKTestsByLevel(level);
      
      const listening = allTopics.filter(topic => topic.type === PracticeType.LISTENING);
      const reading = allTopics.filter(topic => topic.type === PracticeType.READING);
      
      return {
        listening,
        reading,
        total: allTopics.length
      };
    } catch (error) {
      console.error('Failed to fetch practice topics:', error);
      return {
        listening: [],
        reading: [],
        total: 0
      };
    }
  }

  /**
   * Get topics for a specific practice type and level
   */
  static async fetchTopicsByType(
    practiceType: PracticeType, 
    level: HSKLevel
  ): Promise<PracticeTopicModel[]> {
    try {
      const allTopics = await PracticeApiService.getHSKTestsByLevel(level);
      return allTopics.filter(topic => topic.type === practiceType);
    } catch (error) {
      console.error(`Failed to fetch ${practiceType} topics:`, error);
      return [];
    }
  }

  /**
   * Initialize a test session with topic and questions
   */
  static async initializeTest(
    testType: PracticeType,
    testId: string
  ): Promise<TestInitResponse> {
    try {
      console.log('🎯 PracticeService.initializeTest called with:', { testType, testId });
      
      // Fetch questions based on test type
      let questions: QuizModel[] = [];
      if (testType === PracticeType.LISTENING) {
        console.log('📞 Fetching listening questions...');
        questions = await PracticeApiService.getListeningQuestions(testId);
        console.log(`📞 Received ${questions.length} listening questions`);
      } else if (testType === PracticeType.READING) {
        console.log('📖 Fetching reading questions...');
        questions = await PracticeApiService.getReadingQuestions(testId);
        console.log(`📖 Received ${questions.length} reading questions`);
      }

      console.log('🔍 Questions fetched:', questions.length, 'First question:', questions[0]);

      if (questions.length === 0) {
        throw new Error(`No questions found for test ID: ${testId}`);
      }

      // Try to find the topic across different HSK levels
      let topic = await this.findTopicById(testId);

      // If no topic found, create a fallback
      if (!topic) {
        topic = this.createFallbackTopic(testId, testType, questions.length);
      }

      return { topic, questions };
    } catch (error) {
      console.error('Failed to initialize test:', error);
      throw error;
    }
  }

  /**
   * Find topic by ID across all HSK levels
   */
  private static async findTopicById(testId: string): Promise<PracticeTopicModel | null> {
    const levels = [HSKLevel.HSK1, HSKLevel.HSK2, HSKLevel.HSK3, HSKLevel.HSK4, HSKLevel.HSK5, HSKLevel.HSK6];
    
    for (const level of levels) {
      try {
        const topics = await PracticeApiService.getHSKTestsByLevel(level);
        const foundTopic = topics.find(t => t.id === testId);
        if (foundTopic) {
          return foundTopic;
        }
      } catch (levelError) {
        console.warn(`Failed to fetch topics for ${level}:`, levelError);
        continue;
      }
    }
    
    return null;
  }

  /**
   * Create fallback topic when metadata is not found
   */
  private static createFallbackTopic(
    testId: string,
    testType: PracticeType,
    questionCount: number
  ): PracticeTopicModel {
    return {
      id: testId,
      title: `${testType.charAt(0).toUpperCase() + testType.slice(1)} Test`,
      displayOrder: 1,
      level: HSKLevel.HSK1,
      typePractice: testType,
      totalQuestions: questionCount,
      totalListeningQuestions: testType === PracticeType.LISTENING ? questionCount : 0,
      totalReadingQuestions: testType === PracticeType.READING ? questionCount : 0,
      totalWritingQuestions: 0,
      type: testType,
      description: `Practice test with ${questionCount} questions`,
      difficulty: 'medium',
      questionCount,
      estimatedTime: Math.ceil(questionCount * 1.5) // 1.5 minutes per question
    };
  }

  /**
   * Validate question data
   */
  static validateQuestions(questions: QuizModel[]): boolean {
    console.log('🔍 Starting validation for', questions.length, 'questions');
    
    if (!Array.isArray(questions) || questions.length === 0) {
      console.warn('❌ Questions validation failed: not an array or empty', { questions });
      return false;
    }

    // Check each question and log which ones fail
    const invalidQuestions = questions.filter((question, index) => {
      // Basic required fields
      const hasId = question.id && question.id.trim() !== '';
      const hasCorrectAnswer = question.correctAnswer && question.correctAnswer.trim() !== '';
      const hasValidOptions = Array.isArray(question.optionList) && question.optionList.length > 0;
      
      // Question text can be empty for audio-only questions, but we need either question text or audio
      const hasQuestionContent = (question.question && question.question.trim() !== '') ||
        ('audio' in question && question.audio && question.audio.trim() !== '') ||
        ('passage' in question && question.passage && question.passage.trim() !== '');
      
      // Options should have valid structure
      const hasValidOptionStructure = question.optionList.every(option => 
        option && typeof option === 'object' && 
        option.text && option.text.trim() !== ''
      );
      
      const isValid = hasId && hasCorrectAnswer && hasValidOptions && hasQuestionContent && hasValidOptionStructure;
      
      if (!isValid) {
        console.warn(`Question ${index} validation failed:`, {
          id: question.id,
          hasId,
          hasQuestionContent,
          hasCorrectAnswer,
          hasValidOptions,
          hasValidOptionStructure,
          optionListLength: question.optionList?.length || 0,
          questionType: question.type || 'unknown',
          question: question
        });
      }
      
      return !isValid;
    });

    if (invalidQuestions.length > 0) {
      console.warn(`❌ ${invalidQuestions.length} out of ${questions.length} questions failed validation`);
      return false;
    }

    console.log('✅ All questions passed validation');
    return true;
  }

  /**
   * Calculate test score from selected answers
   */
  static calculateScore(
    questions: QuizModel[],
    selectedAnswers: Record<number, number>
  ): TestScore {
    let correct = 0;
    let wrong = 0;
    let skip = 0;

    questions.forEach((question, index) => {
      const selectedAnswer = selectedAnswers[index];
      
      if (selectedAnswer === undefined) {
        skip++;
      } else {
        const correctAnswerIndex = parseInt(question.correctAnswer) - 1;
        if (selectedAnswer === correctAnswerIndex) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      correct,
      wrong,
      skip,
      total,
      percentage,
      right: correct, // Alias for correct
      score: percentage // Alias for percentage
    };
  }

  /**
   * Get default test configuration
   */
  static getDefaultTestConfiguration(): TestConfiguration {
    return {
      showAnswerAfterEach: true,
      allowReview: true,
      showTimer: true,
      timeLimit: undefined // No time limit by default
    };
  }

  /**
   * Get time limit for HSK level (in seconds)
   */
  static getTimeLimitForLevel(level: HSKLevel): number {
    // HSK4-6: 40 minutes, HSK1-3: 30 minutes
    return (level === HSKLevel.HSK4 || level === HSKLevel.HSK5 || level === HSKLevel.HSK6) 
      ? 2400 // 40 minutes in seconds
      : 1800; // 30 minutes in seconds
  }
}

/**
 * Timer service for managing test timing
 */
export class TimerService {
  private static timers = new Map<string, NodeJS.Timeout>();

  /**
   * Start a timer for a test session
   */
  static startTimer(
    sessionId: string,
    onTick: (elapsed: number) => void,
    interval: number = 1000
  ): void {
    this.stopTimer(sessionId); // Clear any existing timer
    
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      onTick(elapsed);
    }, interval);

    this.timers.set(sessionId, timer);
  }

  /**
   * Stop timer for a test session
   */
  static stopTimer(sessionId: string): void {
    const timer = this.timers.get(sessionId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(sessionId);
    }
  }

  /**
   * Stop all timers (cleanup)
   */
  static stopAllTimers(): void {
    for (const [sessionId] of this.timers) {
      this.stopTimer(sessionId);
    }
  }

  /**
   * Format time in seconds to MM:SS format
   */
  static formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

/**
 * Validation service for test data
 */
export class ValidationService {
  /**
   * Validate if a test can be started
   */
  static validateTestStart(
    testId: string,
    testType: PracticeType
  ): { valid: boolean; error?: string } {
    if (!testId || !testId.trim()) {
      return { valid: false, error: 'Test ID is required' };
    }

    if (!Object.values(PracticeType).includes(testType)) {
      return { valid: false, error: 'Invalid practice type' };
    }

    return { valid: true };
  }

  /**
   * Validate answer selection
   */
  static validateAnswerSelection(
    answerIndex: number,
    optionCount: number
  ): { valid: boolean; error?: string } {
    if (answerIndex < 0 || answerIndex >= optionCount) {
      return { valid: false, error: 'Invalid answer index' };
    }

    return { valid: true };
  }

  /**
   * Validate HSK level
   */
  static validateHSKLevel(level: string): level is HSKLevel {
    return Object.values(HSKLevel).includes(level as HSKLevel);
  }
} 