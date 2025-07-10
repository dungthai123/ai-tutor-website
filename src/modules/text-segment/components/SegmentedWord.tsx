'use client';

import React, { useMemo, useCallback } from 'react';
import { PinyinService } from '../services';
import { SegmentedWordProps } from '../types';

export const SegmentedWord = React.memo(function SegmentedWord({ 
  segment, 
  showPinyin, 
  onDoubleClick,
  className = '',
  isHighlighted = false
}: SegmentedWordProps) {
  const handleDoubleClick = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
    if (onDoubleClick) {
      onDoubleClick(segment.word, event);
    }
  }, [onDoubleClick, segment.word]);

  // Memoize Chinese character detection
  const containsChinese = useMemo(() => {
    return PinyinService.containsChinese(segment.word);
  }, [segment.word]);

  // Create dynamic className based on highlight state
  const baseClasses = `cursor-pointer px-0.5 rounded transition-colors duration-200 ${className}`;
  const highlightClasses = isHighlighted 
    ? 'bg-blue-200 text-blue-900 shadow-sm' 
    : 'hover:bg-blue-50';
  const combinedClasses = `${baseClasses} ${highlightClasses}`;

  // If not showing pinyin or no Chinese characters, render simple text
  if (!showPinyin || !containsChinese) {
    return (
      <span 
        className={combinedClasses}
        onDoubleClick={handleDoubleClick}
      >
        {segment.word}
      </span>
    );
  }

  // For Chinese text with pinyin, we need to map pinyin syllables to characters
  const renderRubyText = () => {
    const characters = Array.from(segment.word);
    const pinyinSyllables = segment.pinyin ? segment.pinyin.split(' ') : [];
    
    return characters.map((char, index) => {
      const isChineseChar = PinyinService.isChinese(char);
      const pinyinForChar = pinyinSyllables[index] || '';
      
      if (isChineseChar && pinyinForChar) {
        return (
          <ruby key={index} className="ruby-text">
            {char}
            <rt className="text-xs text-gray-500 font-normal leading-none">
              {pinyinForChar}
            </rt>
          </ruby>
        );
      } else {
        // Non-Chinese characters or no pinyin available
        return <span key={index}>{char}</span>;
      }
    });
  };

  return (
    <span 
      className={combinedClasses}
      onDoubleClick={handleDoubleClick}
    >
      {renderRubyText()}
    </span>
  );
}); 