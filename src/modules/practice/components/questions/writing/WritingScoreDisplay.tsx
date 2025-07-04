import { WritingScore } from '../../../types';
import { cn } from '@/utils/helpers';

interface WritingScoreDisplayProps {
  score: WritingScore;
  onClose: () => void;
  className?: string;
}

export function WritingScoreDisplay({ score, onClose, className }: WritingScoreDisplayProps) {
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (scoreValue >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (scoreValue >= 4) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (scoreValue: number) => {
    if (scoreValue >= 9) return 'Excellent';
    if (scoreValue >= 8) return 'Very Good';
    if (scoreValue >= 6) return 'Good';
    if (scoreValue >= 4) return 'Fair';
    return 'Needs Improvement';
  };

  const getConfidenceBadgeColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg shadow-lg', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Writing Score</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Confidence:</span>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                getConfidenceBadgeColor(score.confidence_level)
              )}>
                {score.confidence_level}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Score Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              'flex items-center justify-center w-20 h-20 rounded-full border-4',
              getScoreColor(score.score)
            )}>
              <span className="text-2xl font-bold">{score.score}/10</span>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">
                {getScoreLabel(score.score)}
              </div>
              <div className="text-sm text-gray-600">Overall Writing Score</div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="space-y-6">
          <div>
            <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
              <span className="text-blue-600">💬</span>
              Detailed Feedback
            </h4>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-700 leading-relaxed">{score.feedback}</p>
            </div>
          </div>

          {/* Corrected Text Section */}
          {score.corrected_text && score.corrected_text.trim() && (
            <div>
              <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                <span className="text-green-600">✏️</span>
                Corrected Version
              </h4>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-gray-700 leading-relaxed font-medium">{score.corrected_text}</p>
              </div>
            </div>
          )}

          {/* Suggestions Section */}
          {score.suggestions && score.suggestions.trim() && (
            <div>
              <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                <span className="text-purple-600">💡</span>
                Suggestions for Improvement
              </h4>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-gray-700 leading-relaxed">{score.suggestions}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
} 