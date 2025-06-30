import { ReadingQuizModel } from '../../types';
import { Card } from '@/shared/components/ui/cards/Card';
import { Button } from '@/shared/components/ui/buttons/Button';
import { usePracticeDetailStore } from '@/lib/stores/practiceDetailStore';
import { getImageUrl, isValidImageUrl } from '../../utils';

interface ReadingQuestionContentProps {
  quizModel: ReadingQuizModel;
  questionIndex: number;
  totalQuestions: number;
}

export function ReadingQuestionContent({ 
  quizModel, 
  questionIndex, 
  totalQuestions 
}: ReadingQuestionContentProps) {
  const {
    isShowTranslation,
    isShowExplanation,
    toggleTranslation,
  } = usePracticeDetailStore();



  const renderMainQuestionImage = () => {
    if (!isValidImageUrl(quizModel.imageUrl)) return null;

    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Question Image</h4>
        <div className="relative">
          <img
            src={getImageUrl(quizModel.imageUrl!)}
            alt="Question image"
            className="w-full max-w-md mx-auto rounded-lg border border-gray-200 shadow-sm"
            onError={(e) => {
              console.error('Failed to load question image:', quizModel.imageUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>
    );
  };

  const renderImageGrid = () => {
    // Show option images for specific question types OR if any option has an image
    const hasOptionImages = quizModel.optionList?.some(option => isValidImageUrl(option.imageUrl));
    
    if (!hasOptionImages) return null;

    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Answer Options</h4>
        <div className="grid grid-cols-2 gap-3">
          {quizModel.optionList?.map((option, index) => (
            isValidImageUrl(option.imageUrl) && (
              <div key={option.id} className="relative">
                <img
                  src={getImageUrl(option.imageUrl!)}
                  alt={`Option ${index + 1}: ${option.text}`}
                  className="w-full h-24 object-cover rounded border border-gray-200"
                  onError={(e) => {
                    console.error('Failed to load option image:', option.imageUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                  {String.fromCharCode(65 + index)}
                </span>
                <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                  {option.text}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    );
  };

  const renderPassage = () => {
    if (!quizModel.passage) return null;

    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📖</span>
          <h4 className="font-semibold text-gray-800">Reading Passage</h4>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {quizModel.passage}
          </div>
        </div>

        {/* Passage Translation */}
        {isShowTranslation && quizModel.readingTranslationContext && (
          <div className="mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800">
              <strong>Passage Translation:</strong> {quizModel.readingTranslationContext}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6">
      {/* Question number indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          Reading Question {questionIndex + 1} of {totalQuestions}
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={toggleTranslation}
            className={`text-xs px-2 py-1 ${isShowTranslation ? 'bg-blue-100' : ''}`}
          >
            🌐 Translate
          </Button>
        </div>
      </div>

      {/* Reading Passage */}
      {renderPassage()}

      {/* Main Question Image */}
      {renderMainQuestionImage()}

      {/* Answer Option Images */}
      {renderImageGrid()}

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {quizModel.question}
        </h3>
        
        {/* Question Translation */}
        {isShowTranslation && quizModel.readingTranslation && (
          <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800">
              <strong>Question Translation:</strong> {quizModel.readingTranslation}
            </p>
          </div>
        )}
      </div>

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
    </Card>
  );
} 