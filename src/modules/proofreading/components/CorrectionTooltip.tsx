'use client';

import React from 'react';
import { EditModel } from '../types';
import { cn } from '@/utils/helpers';

interface CorrectionTooltipWrapperProps {
  edits: EditModel[];
  children: React.ReactNode;
  className?: string;
}

export function CorrectionTooltipWrapper({ 
  edits, 
  children, 
  className 
}: CorrectionTooltipWrapperProps) {
  const [activeEdit, setActiveEdit] = React.useState<EditModel | null>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState<{ x: number; y: number } | null>(null);

  const handleClick = React.useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const correctionElement = target.closest('[data-correction]') as HTMLElement;
    
    if (correctionElement) {
      const editIndex = correctionElement.getAttribute('data-edit-index');
      if (editIndex !== null) {
        const index = parseInt(editIndex, 10);
        const edit = edits[index];
        if (edit) {
          // Get element position for tooltip
          const rect = correctionElement.getBoundingClientRect();
          setTooltipPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          });
          setActiveEdit(activeEdit === edit ? null : edit);
        }
      }
    } else {
      setActiveEdit(null);
      setTooltipPosition(null);
    }
  }, [edits, activeEdit]);

  return (
    <>
      <div 
        className={cn('relative', className)}
        onClick={handleClick}
      >
        {children}
      </div>
      
      {/* Render tooltip outside the main content */}
      {activeEdit && tooltipPosition && (
        <div
          className="fixed z-50 max-w-sm p-3 bg-white rounded-lg shadow-lg border border-gray-200"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-red-500 text-sm font-medium">Original:</span>
              <span className="text-sm text-gray-700 line-through">
                {activeEdit.oldText}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-sm font-medium">Corrected:</span>
              <span className="text-sm text-gray-700 font-medium">
                {activeEdit.newText}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <span className="text-blue-500 text-sm font-medium">Reason:</span>
                <span className="text-sm text-gray-600">
                  {activeEdit.reasons.en}
                </span>
              </div>
            </div>
          </div>
          {/* Arrow */}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid white',
            }}
          />
        </div>
      )}
      
      {/* Backdrop to close tooltip */}
      {activeEdit && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setActiveEdit(null);
            setTooltipPosition(null);
          }}
        />
      )}
    </>
  );
}
 