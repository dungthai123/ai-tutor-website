'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/buttons/Button';
import { SpeakingHelperResponse } from '../../types';

interface SpeakingHelperResultsProps {
  result: SpeakingHelperResponse;
  onReset: () => void;
}

export function SpeakingHelperResults({ result, onReset }: SpeakingHelperResultsProps) {
  const [activeTab, setActiveTab] = useState<'phrases' | 'vocabulary' | 'grammar' | 'starters'>('phrases');

  const tabs = [
    { id: 'phrases' as const, label: '💬 Phrases', icon: '💬' },
    { id: 'vocabulary' as const, label: '📚 Vocabulary', icon: '📚' },
    { id: 'grammar' as const, label: '📝 Grammar', icon: '📝' },
    { id: 'starters' as const, label: '🚀 Starters', icon: '🚀' },
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            🗣️ Speaking Suggestions
          </h3>
          <p className="text-xs text-gray-600">
            {result.level} • {result.tone} • Focus: {result.focus}
          </p>
        </div>
        <Button
          onClick={onReset}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          New Request
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Phrases Tab */}
        {activeTab === 'phrases' && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800">Useful Phrases</h4>
            {result.suggestions.phrases.map((phrase, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-800 flex-1">{phrase}</p>
                  <button
                    onClick={() => copyToClipboard(phrase)}
                    className="ml-2 text-gray-400 hover:text-gray-600 text-xs"
                    title="Copy phrase"
                  >
                    📋
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vocabulary Tab */}
        {activeTab === 'vocabulary' && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800">Key Vocabulary</h4>
            {result.suggestions.vocabulary.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.word}</span>
                    <span className="text-sm text-blue-600">[{item.pinyin}]</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${item.word} (${item.pinyin}) - ${item.meaning}`)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                    title="Copy vocabulary"
                  >
                    📋
                  </button>
                </div>
                <p className="text-sm text-gray-700 mb-1">{item.meaning}</p>
                <p className="text-xs text-gray-600 italic">Example: {item.example}</p>
              </div>
            ))}
          </div>
        )}

        {/* Grammar Tab */}
        {activeTab === 'grammar' && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800">Grammar Tips</h4>
            {result.suggestions.grammarTips.map((tip, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-800 flex-1">{tip}</p>
                  <button
                    onClick={() => copyToClipboard(tip)}
                    className="ml-2 text-gray-400 hover:text-gray-600 text-xs"
                    title="Copy tip"
                  >
                    📋
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conversation Starters Tab */}
        {activeTab === 'starters' && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800">Conversation Starters</h4>
            {result.suggestions.conversationStarters.map((starter, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-800 flex-1">{starter}</p>
                  <button
                    onClick={() => copyToClipboard(starter)}
                    className="ml-2 text-gray-400 hover:text-gray-600 text-xs"
                    title="Copy starter"
                  >
                    📋
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Click 📋 to copy any suggestion to use in your conversation
        </p>
      </div>
    </div>
  );
} 