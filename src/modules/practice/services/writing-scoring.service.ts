import { WritingScoringRequest, WritingScore, WritingQuizModel } from '../types';

interface WritingScoringResponse {
  success: boolean;
  result?: WritingScore;
  error?: string;
}

export class WritingScoringService {
  /**
   * Score a writing answer using AI
   */
  static async scoreWriting(
    quizModel: WritingQuizModel,
    userAnswer: string
  ): Promise<WritingScore> {
    try {
      if (!userAnswer || userAnswer.trim().length === 0) {
        throw new Error('Please provide an answer to score');
      }

      // Build the task description based on question type
      const task = this.buildTaskDescription(quizModel);

      const requestData: WritingScoringRequest = {
        questionType: quizModel.questionType!,
        task,
        userAnswer: userAnswer.trim(),
        questionData: {
          imageUrl: quizModel.imageUrl,
          prompt: quizModel.prompt,
          context: quizModel.context,
          requiredWords: quizModel.requiredWords,
          instruction: quizModel.instruction,
        },
      };

      const response = await fetch('/api/writing-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data: WritingScoringResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to score writing');
      }

      if (!data.result) {
        throw new Error('No scoring result received');
      }

      return data.result;
    } catch (error) {
      console.error('Writing scoring service error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to score writing'
      );
    }
  }

  /**
   * Build task description based on question type and content
   */
  private static buildTaskDescription(quizModel: WritingQuizModel): string {
    const { questionType, question, prompt, context, instruction } = quizModel;

    let taskDescription = '';

    switch (questionType) {
      case 'Write_SentencefromImage':
        taskDescription = `Write a sentence describing the image. ${question || ''}`;
        break;
      case 'Write_Essay':
        taskDescription = `Write an essay. ${question || prompt || ''}`;
        break;
      case 'Write_PassagefromVocabs':
        taskDescription = `Write a passage using the provided vocabulary words. ${question || ''}`;
        break;
      case 'Write_PassagefromPictures':
        taskDescription = `Write a passage based on the provided pictures. ${question || ''}`;
        break;
      case 'Write_SummarizePassage':
        taskDescription = `Summarize the given passage. ${question || ''}`;
        if (context) {
          taskDescription += ` Passage to summarize: "${context}"`;
        }
        break;
      default:
        taskDescription = question || prompt || 'Complete the writing task.';
    }

    // Add additional instruction if available
    if (instruction && !taskDescription.includes(instruction)) {
      taskDescription += ` Instructions: ${instruction}`;
    }

    return taskDescription.trim();
  }

  /**
   * Get a human-readable question type name
   */
  static getQuestionTypeName(questionType: string): string {
    switch (questionType) {
      case 'Write_SentencefromImage':
        return 'Write Sentence from Image';
      case 'Write_Essay':
        return 'Essay Writing';
      case 'Write_PassagefromVocabs':
        return 'Write Passage from Vocabulary';
      case 'Write_PassagefromPictures':
        return 'Write Passage from Pictures';
      case 'Write_SummarizePassage':
        return 'Summarize Passage';
      default:
        return 'Writing Exercise';
    }
  }
} 