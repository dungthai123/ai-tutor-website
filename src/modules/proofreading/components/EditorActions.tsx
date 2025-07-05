import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/buttons/Button';
import { cn } from '@/utils/helpers';

interface EditorActionsProps {
  onProofread: () => void;
  onReset: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onSaveToNote?: (title: string) => Promise<boolean>;
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
  onSaveToNote,
  isLoading,
  isEditable,
  hasResult,
  characterCount,
  maxCharacters = 5000,
  className,
}: EditorActionsProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const isOverLimit = characterCount > maxCharacters;
  const isEmpty = characterCount === 0;

  const handleSaveClick = () => {
    setNoteTitle('');
    setShowSaveModal(true);
    setSaveStatus('idle');
  };

  const handleSaveConfirm = async () => {
    if (!onSaveToNote) return;
    
    setIsSaving(true);
    try {
      const title = noteTitle.trim() || 'My writing';
      const success = await onSaveToNote(title);
      
      if (success) {
        setSaveStatus('success');
        // Auto-close modal after 2 seconds
        setTimeout(() => {
          setShowSaveModal(false);
          setSaveStatus('idle');
        }, 2000);
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCancel = () => {
    setShowSaveModal(false);
    setNoteTitle('');
    setSaveStatus('idle');
  };

  return (
    <>
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
              {onSaveToNote && (
                <Button
                  variant="secondary"
                  onClick={handleSaveClick}
                  disabled={isLoading}
                  className="px-3 py-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                >
                  💾 Save to Note
                </Button>
              )}
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

      {/* Save Note Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💾 Save to Notes
            </h3>
            
            {saveStatus === 'idle' && (
              <>
                <p className="text-gray-600 mb-4">
                  Enter a title for your note:
                </p>
                
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="My writing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveConfirm();
                    } else if (e.key === 'Escape') {
                      handleSaveCancel();
                    }
                  }}
                />
                
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleSaveCancel}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveConfirm}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Saving...
                      </>
                    ) : (
                      'Save Note'
                    )}
                  </Button>
                </div>
              </>
            )}

            {saveStatus === 'success' && (
              <div className="text-center">
                <div className="text-4xl mb-4">✅</div>
                <h4 className="text-lg font-medium text-green-800 mb-2">
                  Note Saved Successfully!
                </h4>
                <p className="text-green-600 text-sm">
                  Your note &quot;{noteTitle.trim() || 'My writing'}&quot; has been saved to your notes.
                </p>
              </div>
            )}

            {saveStatus === 'error' && (
              <div className="text-center">
                <div className="text-4xl mb-4">❌</div>
                <h4 className="text-lg font-medium text-red-800 mb-2">
                  Failed to Save Note
                </h4>
                <p className="text-red-600 text-sm mb-4">
                  There was an error saving your note. Please try again.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleSaveCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveConfirm}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
} 