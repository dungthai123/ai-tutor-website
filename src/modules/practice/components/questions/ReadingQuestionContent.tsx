/**
 * ReadingQuestionContent - HSK Reading Test Component
 * 
 * Implements HSK-specific question type handling as per the plan:
 * - Uses questionType field to route to specific question handlers
 * - Supports specialized components for different reading question types
 * - Integrates with shared components (TextAndTranslate, ImageGrid, AspectRatioImage)
 * 
 * Supported Question Types:
 * - READ_TRUE_FALSE: Statement evaluation questions
 * - READ_ORDERING: Sentence ordering tasks  
 * - READ_WRONG_SENTENCE: Incorrect sentence identification
 * - READ_MATCH_PICTURE_WITH_STATEMENT: Picture matching tasks
 * - Default: Falls back to general reading question handler
 */

import { ReadingQuizModel, TypeAnswer, ReadingQuestionType } from '../../types';
import { usePracticeDetailStore } from '@/lib/stores/practiceDetailStore';
import { ImageGrid } from '../shared';
import { getFontSizeClasses } from '../../utils';

// Import specific question type components
import { 
  TrueFalseQuestion,
  OrderingQuestion,
  WrongSentenceQuestion,
  PictureMatchingQuestion,
  StatementMatchingQuestion,
  DefaultReadingQuestion
} from './reading';

interface ReadingQuestionContentProps {
  quizModel: ReadingQuizModel;
  questionIndex: number;
  totalQuestions: number;
}

export function ReadingQuestionContent({ 
  quizModel, 
}: ReadingQuestionContentProps) {
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
      fontClasses
    };

    switch (quizModel.questionType) {
      case ReadingQuestionType.READ_TRUE_FALSE:
        return <TrueFalseQuestion {...questionProps} />;
      case ReadingQuestionType.READ_ORDERING:
        return <OrderingQuestion {...questionProps} />;
      case ReadingQuestionType.READ_WRONG_SENTENCE:
        return <WrongSentenceQuestion {...questionProps} />;
      case ReadingQuestionType.READ_MATCH_PICTURE_WITH_STATEMENT:
        return <PictureMatchingQuestion {...questionProps} />;
      case ReadingQuestionType.READ_MATCH_STATEMENT_WITH_STATEMENT:
      case ReadingQuestionType.READ_MATCH_MISSING_WORD_WITH_STATEMENT:
        return <StatementMatchingQuestion {...questionProps} />;
      default:
        return <DefaultReadingQuestion {...questionProps} />;
    }
  };

  // Only render special image grids for specific question types that need them
  const renderImageGrid = () => {
    // Only show WORD_MATCHING image grid if not handled by specific question type
    if (quizModel.typeAnswer === TypeAnswer.WORD_MATCHING && 
        quizModel.questionType !== ReadingQuestionType.READ_MATCH_PICTURE_WITH_STATEMENT) {
      
      // Try imageList first (context images), then optionList images
      const imageUrls = quizModel.imageList && quizModel.imageList.length > 0
        ? quizModel.imageList
        : quizModel.optionList?.map(opt => opt.imageUrl || '').filter(Boolean) || [];
        
      if (imageUrls.length > 0) {
        return (
          <div className="mb-6">
            <div className="mb-4 p-4 bg-purple-50 rounded-lg">
              <h4 className="text-lg font-semibold text-purple-800 mb-2">🧩 Match Words with Images</h4>
              <p className="text-sm text-purple-600">
                Match the description with the correct image.
              </p>
            </div>
            <ImageGrid images={imageUrls} />
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div>

      {/* Special image grid for WORD_MATCHING (only if not handled by specific question type) */}
      {renderImageGrid()}

      {/* Render specific question type content */}
      {renderByQuestionType()}

      {/* Explanation */}
      {isShowExplanation && quizModel.explanation && (
        <div className="mb-4 p-4 bg-green-50 rounded border-l-4 border-green-400">
          <h4 className="font-medium text-green-700 mb-2">💡 Explanation</h4>
          <p className="text-green-700">{quizModel.explanation}</p>
        </div>
      )}

      {/* Question Type Info */}
      {quizModel.questionType && (
        <div className="mt-4 text-xs text-gray-500">
          Question Type: {quizModel.questionType}
        </div>
      )}
    </div>
  );
} 