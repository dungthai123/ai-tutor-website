'use client';

import { useEffect, useState } from 'react';
import { DictionaryTooltipProps, DictionaryEntry } from '../types';
import { DictionaryService } from '../services/dictionary.service';

export function DictionaryTooltip({ 
  word, 
  isVisible, 
  onClose, 
  position 
}: DictionaryTooltipProps) {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && word) {
      setLoading(true);
      DictionaryService.lookupWord(word)
        .then(setEntry)
        .catch(() => setEntry(null))
        .finally(() => setLoading(false));
    }
  }, [isVisible, word]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dictionary-tooltip')) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className="dictionary-tooltip fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg text-gray-900">{word}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : entry ? (
        <div className="space-y-3">
          {/* Pinyin */}
          {entry.pinyin && (
            <div className="text-sm text-blue-600 font-medium">
              📢 {entry.pinyin}
            </div>
          )}

          {/* Level and Word Type */}
          <div className="flex flex-wrap gap-2 text-xs">
            {entry.level && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {entry.level}
              </span>
            )}
            {entry.definitions && entry.definitions[0]?.partOfSpeech && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {entry.definitions[0].partOfSpeech}
              </span>
            )}
          </div>

          {/* Main meaning */}
          {entry.meaning && (
            <div className="text-sm text-gray-700">
              <strong>Meaning:</strong> {entry.meaning}
            </div>
          )}

          {/* Additional definitions */}
          {entry.definitions && entry.definitions.length > 1 && (
            <div className="text-sm text-gray-700">
              <strong>Other meanings:</strong>
              <ul className="mt-1 ml-2 space-y-1">
                {entry.definitions.slice(1, 3).map((def, index) => (
                  <li key={index} className="text-xs">
                    • {def.meaning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Examples */}
          {entry.examples && entry.examples.length > 0 && (
            <div className="text-xs text-gray-600 border-t pt-2">
              <strong>Example:</strong>
              <div className="mt-1 italic">
                {entry.examples[0]}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          No definition found for &ldquo;{word}&rdquo;
        </div>
      )}
    </div>
  );
} 