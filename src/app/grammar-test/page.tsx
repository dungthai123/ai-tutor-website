'use client';

import React, { useState } from 'react';
import { useGrammarCheck } from '@/modules/notes/hooks';
import { GrammarChecker } from '@/modules/notes/components';

export default function GrammarTestPage() {
  const [text, setText] = useState('This is an test sentence with some grammar errors. I are writing to test the grammar checker.');
  const { issues, isChecking, checkGrammar, applyCorrection } = useGrammarCheck();

  const handleCheckGrammar = () => {
    checkGrammar(text);
  };

  const handleApplyCorrection = async (issue: import('@/modules/notes/hooks').GrammarIssue, suggestionIndex: number) => {
    try {
      const correctedText = await applyCorrection(text, issue, suggestionIndex);
      setText(correctedText);
      // Re-check grammar after applying correction
      setTimeout(() => {
        checkGrammar(correctedText);
      }, 500);
    } catch (error) {
      console.error('Failed to apply correction:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Grammar Checker Test
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Text Editor */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ✏️ Text Editor
            </h2>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text here..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCheckGrammar}
                disabled={isChecking}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {isChecking ? 'Checking...' : 'Check Grammar'}
              </button>
              
              <button
                onClick={() => setText('This is an test sentence with some grammar errors. I are writing to test the grammar checker.')}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reset Sample Text
              </button>
            </div>
          </div>
          
          {/* Grammar Results */}
          <div>
            <GrammarChecker
              issues={issues}
              isChecking={isChecking}
              text={text}
              onApplyCorrection={handleApplyCorrection}
            />
          </div>
        </div>
        
        {/* Info */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🔍 About This Demo
          </h3>
          <p className="text-blue-800 mb-4">
            This demo showcases Harper.js integration for privacy-first grammar checking. 
            Harper runs entirely in your browser using WebAssembly - no data is sent to external servers.
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Privacy-first:</strong> All processing happens locally in your browser</li>
            <li>• <strong>Fast:</strong> Powered by WebAssembly for near-native performance</li>
            <li>• <strong>Open Source:</strong> Built on Harper by Automattic</li>
            <li>• <strong>Offline:</strong> Works without internet connection</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 