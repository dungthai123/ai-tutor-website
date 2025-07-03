/**
 * WritingQuestionContent - HSK Writing Test Component
 * 
 * Implements HSK-specific writing question type handling:
 * - Uses questionType field to route to specific question handlers
 * - Supports specialized components for different writing question types
 * - Integrates with shared components (TextAndTranslate, AspectRatioImage)
 * 
 * Supported Question Types:
 * - WRITE_ORDERING: Sentence ordering tasks
 * - WRITE_SENTENCE_FROM_IMAGE: Write sentences based on images
 * - WRITE_PASSAGE_FROM_VOCABS: Write a passage from vocabulary
 * - WRITE_PASSAGE_FROM_PICTURES: Write a passage from pictures
 * - WRITE_SUMMARIZE_PASSAGE: Summarize a passage
 * - Default: Falls back to general writing question handler
 */

import { WritingQuizModel, WritingQuestionType } from '../../types';
import { usePracticeDetailStore } from '@/lib/stores/practiceDetailStore';
import { getFontSizeClasses } from '../../utils';
import { WritingAnswerInput } from './writing/WritingAnswerInput';

// Import specific question type components
import { 
  WriteOrderingQuestion,
  WriteSentenceFromImageQuestion,
  DefaultWritingQuestion
} from './writing';

interface WritingQuestionContentProps {
  quizModel: WritingQuizModel;
  questionIndex: number;
  totalQuestions: number;
  onAnswerSelected: (answer: number | string) => void;
  selectedAnswer?: number | string;
}

export function WritingQuestionContent({ 
  quizModel, 
  questionIndex,
  onAnswerSelected,
  selectedAnswer
}: WritingQuestionContentProps) {
  const {
    isShowTranslation,
    isShowExplanation,
    fontSize,
  } = usePracticeDetailStore();

  const fontClasses = getFontSizeClasses(fontSize);

  // Render by specific question type based on questionType field
  const renderByQuestionType = () => {
    const questionProps = {
      quizModel,
      isShowTranslation,
      isShowExplanation,
      fontClasses,
      onAnswerChange: onAnswerSelected,
      currentAnswer: selectedAnswer as string | undefined
    };

    switch (quizModel.questionType) {
      case WritingQuestionType.WRITE_ORDERING:
        return <WriteOrderingQuestion {...questionProps} />;
      case WritingQuestionType.WRITE_SENTENCE_FROM_IMAGE:
        return <WriteSentenceFromImageQuestion {...questionProps} />;
      case WritingQuestionType.WRITE_PASSAGE_FROM_VOCABS:
      case WritingQuestionType.WRITE_PASSAGE_FROM_PICTURES:
      case WritingQuestionType.WRITE_SUMMARIZE_PASSAGE:
        return <DefaultWritingQuestion {...questionProps} />;
      default:
        return <DefaultWritingQuestion {...questionProps} />;
    }
  };

  return (
    <div className="writing-question-content">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">✍️</span>
          <h3 className="text-lg font-semibold text-gray-800">
            Writing Question {questionIndex + 1}
          </h3>
        </div>
        
        {/* Question Type Indicator */}
        <div className="text-sm text-gray-600 mb-4">
          {quizModel.questionType === WritingQuestionType.WRITE_ORDERING && 'Word Ordering'}
          {quizModel.questionType === WritingQuestionType.WRITE_SENTENCE_FROM_IMAGE && 'Sentence from Image'}
          {quizModel.questionType === WritingQuestionType.WRITE_PASSAGE_FROM_VOCABS && 'Passage from Vocabulary'}
          {quizModel.questionType === WritingQuestionType.WRITE_PASSAGE_FROM_PICTURES && 'Passage from Pictures'}
          {quizModel.questionType === WritingQuestionType.WRITE_SUMMARIZE_PASSAGE && 'Summarize Passage'}
          {!quizModel.questionType && 'Writing Exercise'}
        </div>
      </div>

      {/* Render question content based on type */}
      {renderByQuestionType()}

      <div className="mt-6">
        <WritingAnswerInput 
          key={quizModel.id}
          quizModel={quizModel} 
          onAnswerChange={onAnswerSelected} 
          currentAnswer={selectedAnswer as string | undefined} 
        />
      </div>
    </div>
  );
} 