import { HSKLevel, PracticeType } from '../types';

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