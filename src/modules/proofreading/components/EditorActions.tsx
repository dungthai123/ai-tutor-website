import React from 'react';
import { Button } from '@/shared/components/ui/buttons/Button';
import { cn } from '@/utils/helpers';

interface EditorActionsProps {
  onProofread: () => void;
  onReset: () => void;
  onCopy: () => void;
  onEdit: () => void;
  isLoading: boolean;
  isEditable: boolean;
  hasResult: boolean;
  characterCount: number;
  maxCharacters?: number;
  className?: string;
}

export function EditorActions({
  onProofread,
  onReset,
  onCopy,
  onEdit,
  isLoading,
  isEditable,
  hasResult,
  characterCount,
  maxCharacters = 5000,
  className,
}: EditorActionsProps) {
  const isOverLimit = characterCount > maxCharacters;
  const isEmpty = characterCount === 0;

  return (
    <div className={cn(
      'flex items-center justify-between',
      'p-4 border-t border-gray-200',
      'bg-gray-50',
      className
    )}>
      {/* Character count */}
      <div className="flex items-center gap-2">
        <span className={cn(
          'text-sm',
          isOverLimit ? 'text-red-600' : 'text-gray-500'
        )}>
          {characterCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </span>
        <span className="text-gray-400 text-sm">
          / {maxCharacters.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} characters
        </span>
        {isOverLimit && (
          <span className="text-red-600 text-xs">
            Too long
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {hasResult && (
          <>
            <Button
              variant="secondary"
              onClick={onCopy}
              disabled={isLoading}
              className="px-3 py-2 text-xs"
            >
              📋 Copy
            </Button>
            <Button
              variant="secondary"
              onClick={onEdit}
              disabled={isLoading}
              className="px-3 py-2 text-xs"
            >
              {isEditable ? '🔒 Lock' : '✏️ Edit'}
            </Button>
            <Button
              variant="secondary"
              onClick={onReset}
              disabled={isLoading}
              className="px-3 py-2 text-xs"
            >
              🔄 New Text
            </Button>
          </>
        )}
        
        <Button
          variant="primary"
          onClick={hasResult ? onReset : onProofread}
          disabled={isLoading || isEmpty || isOverLimit}
          className="px-4 py-2 text-sm"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Checking...
            </>
          ) : hasResult ? (
            'Try Again'
          ) : (
            '✍️ Proofread'
          )}
        </Button>
      </div>
    </div>
  );
} 