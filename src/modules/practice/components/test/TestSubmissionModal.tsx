'use client';

import { useTestNavigationStore } from '@/lib/stores/testNavigationStore';
import { Button } from '@/shared/components/ui/buttons/Button';
import { cn } from '@/utils/helpers';

interface TestSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  className?: string;
}

export function TestSubmissionModal({ 
  isOpen, 
  onClose, 
  onConfirmSubmit,
  className 
}: TestSubmissionModalProps) {
  const {
    questions,
    getAnsweredCount,
    getUnansweredCount,
    getProgressPercentage,
    isSubmitting,
    canSubmitTest,
  } = useTestNavigationStore();

  const answeredCount = getAnsweredCount();
  const unansweredCount = getUnansweredCount();
  const progressPercentage = getProgressPercentage();
  const totalQuestions = questions.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={cn(
          'relative w-full max-w-md transform overflow-hidden rounded-lg',
          'bg-white px-6 py-4 text-left shadow-xl transition-all',
          className
        )}>
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Submit Test
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Are you sure you want to submit your test? You won&apos;t be able to change your answers after submission.
            </p>
          </div>

          {/* Test Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Test Summary</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Questions:</span>
                <span className="font-medium">{totalQuestions}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Answered:</span>
                <span className="font-medium text-green-600">{answeredCount}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Unanswered:</span>
                <span className={cn(
                  "font-medium",
                  unansweredCount > 0 ? "text-red-600" : "text-gray-600"
                )}>
                  {unansweredCount}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Progress:</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Warning for unanswered questions */}
          {unansweredCount > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-yellow-600 mr-2">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Incomplete Test
                  </p>
                  <p className="text-sm text-yellow-700">
                    You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}. 
                    These will be marked as incorrect.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              onClick={onConfirmSubmit}
              disabled={isSubmitting || !canSubmitTest()}
              className={cn(
                "px-4 py-2",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Test'
              )}
            </Button>
          </div>

          {/* Force submit option for incomplete tests */}
          {unansweredCount > 0 && !canSubmitTest() && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={onConfirmSubmit}
                disabled={isSubmitting}
                className="w-full text-sm py-2 text-orange-600 hover:text-orange-700"
              >
                Submit Anyway (Incomplete)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 