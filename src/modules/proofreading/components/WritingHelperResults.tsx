'use client';

import React from 'react';
import { WritingHelperResponse } from '../types';

interface WritingHelperResultsProps {
  result: WritingHelperResponse;
  onReset: () => void;
}

export function WritingHelperResults({ result, onReset }: WritingHelperResultsProps) {
  // Ensure we have valid data with fallbacks
  const safeResult = {
    outline: result?.outline || [],
    vocabulary: result?.vocabulary || [],
    grammarTips: result?.grammarTips || [],
    writingStyleTips: result?.writingStyleTips || []
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ✨ Your Writing Guide
            </h2>
            <p className="text-gray-600">
                             Here&apos;s your personalized writing assistance to help you create amazing content!
            </p>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-white text-gray-600 rounded-md hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            🔄 New Request
          </button>
        </div>
      </div>

      {/* Outline Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-bold">📋</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Writing Outline</h3>
        </div>
        <div className="space-y-3">
          {safeResult.outline.map((point, index) => (
            <div key={index} className="flex items-start">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-gray-700 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vocabulary Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-green-600 font-bold">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Useful Vocabulary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeResult.vocabulary.map((item, index) => (
            <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  {item.word.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">{item.word}</h4>
                  <p className="text-green-700 text-sm">{item.meaning}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grammar Tips Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-purple-600 font-bold">🔤</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Grammar Tips</h3>
        </div>
        <div className="space-y-3">
          {safeResult.grammarTips.map((tip, index) => (
            <div key={index} className="flex items-start">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                ✓
              </div>
              <p className="text-gray-700 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Writing Style Tips Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-orange-600 font-bold">🎨</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Writing Style Tips</h3>
        </div>
        <div className="space-y-3">
          {safeResult.writingStyleTips.map((tip, index) => (
            <div key={index} className="flex items-start">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                💡
              </div>
              <p className="text-gray-700 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            🚀 Ready to Start Writing?
          </h3>
          <p className="text-gray-600 mb-4">
            Use the left panel to start writing your piece. You can always come back to reference these tips!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onReset}
              className="px-6 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 border border-indigo-200 transition-colors"
            >
              📝 New Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 