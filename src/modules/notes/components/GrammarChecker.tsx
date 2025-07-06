import React, { useState } from 'react';
import { GrammarIssue } from '@/modules/notes/hooks';
import { cn } from '@/utils/helpers';

interface GrammarCheckerProps {
  issues: GrammarIssue[];
  isChecking: boolean;
  text: string;
  onApplyCorrection: (issue: GrammarIssue, suggestionIndex: number) => void;
  className?: string;
}

interface IssueItemProps {
  issue: GrammarIssue;
  text: string;
  onApplyCorrection: (suggestionIndex: number) => void;
}

function IssueItem({ issue, text, onApplyCorrection }: IssueItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const problemText = text.slice(issue.start, issue.end);
  const contextStart = Math.max(0, issue.start - 20);
  const contextEnd = Math.min(text.length, issue.end + 20);
  const contextText = text.slice(contextStart, contextEnd);
  
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-red-600 mb-1">
            &ldquo;{problemText}&rdquo;
          </div>
          <div className="text-xs text-gray-600 mb-2">
            {issue.message}
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            ...{contextText.replace(problemText, `**${problemText}**`)}...
          </div>
        </div>
        
        {issue.suggestions.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            {isExpanded ? '▼' : '▶'} Fix
          </button>
        )}
      </div>
      
      {isExpanded && issue.suggestions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-600 mb-2">Suggestions:</div>
          <div className="space-y-1">
            {issue.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onApplyCorrection(index)}
                                 className="block w-full text-left px-2 py-1 text-sm bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
               >
                 &ldquo;{suggestion}&rdquo;
               </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function GrammarChecker({
  issues,
  isChecking,
  text,
  onApplyCorrection,
  className,
}: GrammarCheckerProps) {

  if (isChecking) {
    return (
      <div className={cn('bg-white rounded-2xl p-6 shadow-sm border border-gray-200', className)}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Checking grammar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-2xl p-6 shadow-sm border border-gray-200', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📝 Grammar Check
        </h3>
        <div className="text-sm text-gray-500">
          {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-sm text-gray-600">
            No grammar issues found!
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {issues.map((issue, index) => (
            <IssueItem
              key={`${issue.start}-${issue.end}-${index}`}
              issue={issue}
              text={text}
              onApplyCorrection={(suggestionIndex) => onApplyCorrection(issue, suggestionIndex)}
            />
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Powered by{' '}
          <a
            href="https://github.com/Automattic/harper"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Harper
          </a>
          {' '}• Privacy-first grammar checking
        </div>
      </div>
    </div>
  );
} 