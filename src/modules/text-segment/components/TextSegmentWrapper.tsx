'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SegmentService, PinyinService } from '../services';
import { SegmentedWord } from './SegmentedWord';
import { DictionaryTooltip } from './DictionaryTooltip';
import { TextSegmentWrapperProps, SegmentedText } from '../types';

export function TextSegmentWrapper({ 
  text, 
  showPinyin, 
  className = '' 
}: TextSegmentWrapperProps) {
  const [segments, setSegments] = useState<SegmentedText[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tooltipState, setTooltipState] = useState<{
    word: string;
    isVisible: boolean;
    position: { x: number; y: number };
  }>({
    word: '',
    isVisible: false,
    position: { x: 0, y: 0 }
  });

  // Memoize Chinese text detection to prevent unnecessary recalculations
  const containsChinese = useMemo(() => {
    return text ? PinyinService.containsChinese(text) : false;
  }, [text]);

  // Memoize the segmentation process
  const segmentText = useCallback(async () => {
    if (!text.trim()) {
      setSegments([]);
      return;
    }

    // If no Chinese characters, just return the text as a single segment
    if (!containsChinese) {
      setSegments([{ word: text }]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get segments from jieba API
      const segmentedWords = await SegmentService.segmentText(text);
      
      // Convert to SegmentedText with pinyin if needed
      const segmentedTextArray: SegmentedText[] = segmentedWords.map(word => {
        // Only generate pinyin if showPinyin is true and word contains Chinese
        let pinyinText: string | undefined = undefined;
        if (showPinyin && PinyinService.containsChinese(word)) {
          pinyinText = PinyinService.getPinyin(word);
        }
        
        return {
          word,
          pinyin: pinyinText
        };
      });

      setSegments(segmentedTextArray);
    } catch (err) {
      console.error('Error segmenting text:', err);
      setError('Failed to segment text');
      // Fallback: split by characters for Chinese text
      const fallbackSegments: SegmentedText[] = Array.from(text).map(char => {
        let pinyinText: string | undefined = undefined;
        if (showPinyin && PinyinService.containsChinese(char)) {
          pinyinText = PinyinService.getPinyin(char);
        }
        
        return {
          word: char,
          pinyin: pinyinText
        };
      });
      setSegments(fallbackSegments);
    } finally {
      setIsLoading(false);
    }
  }, [text, showPinyin, containsChinese]);

  // Effect to trigger segmentation when dependencies change
  useEffect(() => {
    segmentText();
  }, [segmentText]);

  // Memoize the double-click handler
  const handleWordDoubleClick = useCallback((word: string) => {
    if (!PinyinService.containsChinese(word)) return;

    setTooltipState({
      word,
      isVisible: true,
      position: { x: window.innerWidth / 2, y: 100 } // Center position
    });
  }, []);

  // Memoize the close handler
  const handleCloseTooltip = useCallback(() => {
    setTooltipState(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Memoize the segments rendering to prevent unnecessary re-renders
  const renderedSegments = useMemo(() => {
    return segments.map((segment, index) => (
      <SegmentedWord
        key={`${segment.word}-${index}`}
        segment={segment}
        showPinyin={showPinyin}
        onDoubleClick={handleWordDoubleClick}
        className="inline"
      />
    ));
  }, [segments, showPinyin, handleWordDoubleClick]);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 text-sm ${className}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="leading-relaxed">
        {renderedSegments}
      </div>

      {tooltipState.isVisible && (
        <DictionaryTooltip
          word={tooltipState.word}
          isVisible={tooltipState.isVisible}
          position={tooltipState.position}
          onClose={handleCloseTooltip}
        />
      )}
    </div>
  );
} 