'use client';

import React from 'react';
import { TextSegmentWrapper } from '@/modules/text-segment/components';

export default function TestDictionaryPage() {
  const testTexts = [
    "我知道这本书很有趣。", // Contains compound words: 知道, 本书, 有趣
    "今天天气很好。",
    "他们在学校学习中文。", // Contains: 他们, 学校, 学习, 中文
    "这个问题比较复杂。"  // Contains: 这个, 问题, 比较, 复杂
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dictionary Tooltip Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Instructions:
          </h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li>• Double-click on any Chinese character or word to see the dictionary tooltip</li>
            <li>• The tooltip should appear positioned above the clicked word</li>
            <li>• <strong>NEW:</strong> When near the top of screen, tooltip should appear below the word</li>
            <li>• The tooltip should show: Hanzi, Pinyin, Hán Nôm, Level, Type, and Meanings</li>
            <li>• Click outside or on the X button to close the tooltip</li>
          </ul>
        </div>

        {/* Test at top of screen */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-yellow-800 mb-3">
            🔝 Test Near Top of Screen (should show tooltip BELOW):
          </h3>
          <div className="text-2xl leading-relaxed">
            <TextSegmentWrapper 
              text="测试顶部位置的工具提示"
              showPinyin={true}
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-6">
          {testTexts.map((text, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Test Text {index + 1}:
              </h3>
              <div className="text-2xl leading-relaxed">
                <TextSegmentWrapper 
                  text={text}
                  showPinyin={true}
                  className="cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add some spacing to test bottom positioning */}
        <div className="h-96"></div>

        {/* Test at bottom of screen */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-green-800 mb-3">
            🔽 Test Near Bottom of Screen (should show tooltip ABOVE):
          </h3>
          <div className="text-2xl leading-relaxed">
            <TextSegmentWrapper 
              text="测试底部位置的工具提示"
              showPinyin={true}
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Expected Behavior:
          </h3>
          <div className="text-blue-800 text-sm space-y-1">
            <p>✅ Tooltip appears at the correct position (above the clicked word)</p>
            <p>✅ <strong>NEW:</strong> When near screen top, tooltip appears below the word</p>
            <p>✅ <strong>NEW:</strong> Arrow direction changes based on tooltip position</p>
            <p>✅ Dictionary data displays correctly with all fields</p>
            <p>✅ Tooltip can be closed by clicking outside or X button</p>
            <p>✅ Multiple meanings are shown with examples</p>
            <p>✅ Scrollable content for long definitions</p>
          </div>
        </div>

        {/* Add extra space at bottom for testing */}
        <div className="h-64"></div>
      </div>
    </div>
  );
} 