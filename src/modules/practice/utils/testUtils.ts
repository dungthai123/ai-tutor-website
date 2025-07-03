import { HSKLevel, TestScore, QuizModel } from '../types';

/**
 * Get timer duration based on HSK level
 */
export function getTimerDuration(level: HSKLevel): number {
  // HSK4-6: 40 minutes, HSK1-3: 30 minutes
  return (level === HSKLevel.HSK4 || level === HSKLevel.HSK5 || level === HSKLevel.HSK6) 
    ? 2400 // 40 minutes in seconds
    : 1800; // 30 minutes in seconds
}

/**
 * Calculate test score based on correct answers
 */
export function calculateTestScore(
  questions: QuizModel[], 
  selectedAnswers: Record<number, number>
): TestScore {
  let correct = 0;
  let wrong = 0;
  
  questions.forEach((question, index) => {
    const selectedAnswer = selectedAnswers[index];
    if (selectedAnswer !== undefined) {
      const isCorrect = selectedAnswer === parseInt(question.correctAnswer) - 1;
      if (isCorrect) {
        correct++;
      } else {
        wrong++;
      }
    }
  });
  
  const total = questions.length;
  const skip = total - correct - wrong;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return {
    correct,
    total,
    percentage,
    right: correct,
    wrong,
    skip,
    score: percentage
  };
}

/**
 * Format time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Check if an answer is correct
 */
export function isAnswerCorrect(answerIndex: number, correctAnswer: string): boolean {
  return answerIndex === parseInt(correctAnswer) - 1;
}

/**
 * Get progress percentage
 */
export function getProgressPercentage(answeredCount: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  return Math.round((answeredCount / totalQuestions) * 100);
}

/**
 * Find next unanswered question index
 */
export function findNextUnansweredQuestion(
  currentPosition: number,
  totalQuestions: number,
  selectedAnswers: Record<number, number>
): number | null {
  // Look for unanswered questions starting from current + 1
  for (let i = currentPosition + 1; i < totalQuestions; i++) {
    if (!(i in selectedAnswers)) {
      return i;
    }
  }
  
  // Look for unanswered questions from the beginning
  for (let i = 0; i <= currentPosition; i++) {
    if (!(i in selectedAnswers)) {
      return i;
    }
  }
  
  return null;
}

/**
 * Find previous unanswered question index
 */
export function findPreviousUnansweredQuestion(
  currentPosition: number,
  totalQuestions: number,
  selectedAnswers: Record<number, number>
): number | null {
  // Look for unanswered questions starting from current - 1
  for (let i = currentPosition - 1; i >= 0; i--) {
    if (!(i in selectedAnswers)) {
      return i;
    }
  }
  
  // Look for unanswered questions from the end
  for (let i = totalQuestions - 1; i >= currentPosition; i--) {
    if (!(i in selectedAnswers)) {
      return i;
    }
  }
  
  return null;
} 