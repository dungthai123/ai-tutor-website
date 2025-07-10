import { QuizModel } from '../../types';

interface ExplanationContentProps {
  currentQuestion: QuizModel;
  className?: string;
}

export function ExplanationContent({ currentQuestion, className = '' }: ExplanationContentProps) {
  // Get explanation from the question
  const explanation = currentQuestion.explanation;
  
  // Get localized content
  const localizedExplanation = currentQuestion.localizedContent?.explanation;
  const localizedContext = currentQuestion.localizedContent?.context;

  // Don't render if no content is available
  if (!explanation && !localizedExplanation && !localizedContext) {
    return null;
  }

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">💡</span>
        <h3 className="font-semibold text-yellow-800">Explanation & Translation</h3>
      </div>
      
      <div className="space-y-4">
        {/* Original Explanation */}
        {explanation && (
          <div className="p-3 bg-white rounded border border-yellow-200">
            <h4 className="font-medium text-yellow-700 mb-2">📝 Explanation:</h4>
            <p className="text-gray-700 leading-relaxed">{explanation}</p>
          </div>
        )}

        {/* Localized Explanation */}
        {localizedExplanation && localizedExplanation !== explanation && (
          <div className="p-3 bg-white rounded border border-yellow-200">
            <h4 className="font-medium text-yellow-700 mb-2">🌐 Vietnamese Explanation:</h4>
            <p className="text-gray-700 leading-relaxed">{localizedExplanation}</p>
          </div>
        )}

        {/* Localized Context (Translation) */}
        {localizedContext && (
          <div className="p-3 bg-white rounded border border-yellow-200">
            <h4 className="font-medium text-yellow-700 mb-2">🔄 Vietnamese Translation:</h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{localizedContext}</p>
          </div>
        )}
      </div>
    </div>
  );
} 