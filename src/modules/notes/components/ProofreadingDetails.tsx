'use client';

import React from 'react';
import { ProofreadingData } from '../types';
import { cn } from '@/utils/helpers';

interface ProofreadingDetailsProps {
  proofreading: ProofreadingData;
  className?: string;
}

export function ProofreadingDetails({ proofreading, className }: ProofreadingDetailsProps) {
  return (
    <div className={cn('bg-white rounded-2xl p-6 shadow-sm border border-gray-200', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        🔍 Proofreading Details
        <span className="text-sm font-normal text-gray-500">
          ({proofreading.correctionCount} corrections)
        </span>
      </h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {proofreading.correctionCount}
          </div>
          <div className="text-sm text-gray-600">Corrections</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {proofreading.suggestion ? '1' : '0'}
          </div>
          <div className="text-sm text-gray-600">Suggestions</div>
        </div>
      </div>

      {/* Corrections List */}
      {proofreading.edits.length > 0 && (
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-gray-800">Corrections Made:</h4>
          <div className="space-y-3">
            {proofreading.edits.map((edit, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="space-y-2">
                  {/* Original Text */}
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 text-sm font-medium min-w-[60px]">
                      Before:
                    </span>
                    <span className="text-sm text-gray-700 line-through bg-red-50 px-2 py-1 rounded">
                      {edit.oldText}
                    </span>
                  </div>
                  
                  {/* Corrected Text */}
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 text-sm font-medium min-w-[60px]">
                      After:
                    </span>
                    <span className="text-sm text-gray-700 font-medium bg-green-50 px-2 py-1 rounded">
                      {edit.newText}
                    </span>
                  </div>
                  
                  {/* Reason */}
                  <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                    <span className="text-blue-500 text-sm font-medium min-w-[60px]">
                      Why:
                    </span>
                    <span className="text-sm text-gray-600">
                      {edit.reason}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestion */}
      {proofreading.suggestion && (
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            💡 AI Suggestion
          </h4>
          <p className="text-sm text-blue-700">
            {proofreading.suggestion}
          </p>
        </div>
      )}

      {/* Original vs Corrected Comparison */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">Text Comparison:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-red-600">Original Text:</h5>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-gray-700 max-h-32 overflow-y-auto">
              {proofreading.originalText}
            </div>
          </div>
          
          {/* Corrected */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-green-600">Corrected Text:</h5>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-gray-700 max-h-32 overflow-y-auto">
              {proofreading.correctedText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 