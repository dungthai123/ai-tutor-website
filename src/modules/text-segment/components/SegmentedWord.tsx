'use client';

import React, { useMemo, useCallback } from 'react';
import { PinyinService } from '../services';
import { SegmentedWordProps } from '../types';

export const SegmentedWord = React.memo(function SegmentedWord({ 
  segment, 
  showPinyin, 
  onDoubleClick,
  className = ''
}: SegmentedWordProps) {
  const handleDoubleClick = useCallback(() => {
    if (onDoubleClick) {
      onDoubleClick(segment.word);
    }
  }, [onDoubleClick, segment.word]);

  // Memoize Chinese character detection
  const containsChinese = useMemo(() => {
    return PinyinService.containsChinese(segment.word);
  }, [segment.word]);

  // Memoize character-by-character pinyin data
  const characterPinyinData = useMemo(() => {
    return PinyinService.getPinyinByCharacter(segment.word);
  }, [segment.word]);

  // Memoize the ruby text rendering
  const rubyContent = useMemo(() => {
    return characterPinyinData.map((item, index) => (
      <React.Fragment key={index}>
        {item.char}
        {PinyinService.isChinese(item.char) && (
          <rt className="text-xs text-gray-500 font-normal leading-none">
            {item.pinyin}
          </rt>
        )}
      </React.Fragment>
    ));
  }, [characterPinyinData]);

  // If not showing pinyin or no Chinese characters, render simple text
  if (!showPinyin || !containsChinese) {
    return (
      <span 
        className={`cursor-pointer hover:bg-blue-50 px-0.5 rounded ${className}`}
        onDoubleClick={handleDoubleClick}
      >
        {segment.word}
      </span>
    );
  }

  return (
    <span 
      className={`cursor-pointer hover:bg-blue-50 px-0.5 rounded ${className}`}
      onDoubleClick={handleDoubleClick}
    >
      <ruby className="ruby-text">
        {rubyContent}
      </ruby>
    </span>
  );
}); 