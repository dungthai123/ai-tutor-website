import React from 'react';
import { Card } from '@/shared/components/ui/cards/Card';
import { cn } from '@/utils/helpers';

interface TextSuggestionProps {
  suggestion: string;
  onApply?: () => void;
  className?: string;
}

export function TextSuggestion({ suggestion, onApply, className }: TextSuggestionProps) {
  if (!suggestion) return null;

  return (
    <Card className={cn(
      'border-l-4 border-l-blue-500',
      'bg-blue-50 border-blue-200',
      className
    )}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-blue-600">
            💡
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Alternative Suggestion
            </h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              {suggestion}
            </p>
            {onApply && (
              <button
                onClick={onApply}
                className={cn(
                  'mt-3 px-3 py-1 text-xs',
                  'bg-blue-600 text-white rounded-md',
                  'hover:bg-blue-700 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
                )}
              >
                Apply Suggestion
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 