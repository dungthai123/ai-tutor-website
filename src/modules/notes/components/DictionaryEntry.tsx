'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, BookOpenIcon } from 'lucide-react';

interface DictionaryEntryProps {
  word: string;
  pinyin: string;
  hanNom: string;
  wordLevel?: string;
  wordType?: string;
  meanings: Array<{
    meaning: string;
    explanation?: string;
    examples?: Array<{
      word: string;
      phonetic: string;
      translation: string;
    }>;
  }>;
  className?: string;
}

export function DictionaryEntry({
  word,
  pinyin,
  hanNom,
  wordLevel,
  wordType,
  meanings,
  className = ''
}: DictionaryEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLevelColor = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-700';
    
    const levelNum = level.toLowerCase();
    if (levelNum.includes('hsk1') || levelNum.includes('beginner')) return 'bg-green-100 text-green-700 border-green-200';
    if (levelNum.includes('hsk2')) return 'bg-lime-100 text-lime-700 border-lime-200';
    if (levelNum.includes('hsk3')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (levelNum.includes('hsk4')) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (levelNum.includes('hsk5')) return 'bg-red-100 text-red-700 border-red-200';
    if (levelNum.includes('hsk6') || levelNum.includes('advanced')) return 'bg-purple-100 text-purple-700 border-purple-200';
    
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getTypeColor = (type?: string) => {
    if (!type) return 'bg-gray-100 text-gray-700';
    
    const typeStr = type.toLowerCase();
    if (typeStr.includes('noun')) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (typeStr.includes('verb')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (typeStr.includes('adjective')) return 'bg-pink-100 text-pink-700 border-pink-200';
    if (typeStr.includes('adverb')) return 'bg-cyan-100 text-cyan-700 border-cyan-200';
    
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className={`dictionary-entry bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      {/* Header with toggle */}
      <div 
        className="flex items-center gap-3 cursor-pointer hover:bg-blue-100/50 p-4 rounded-t-xl transition-colors group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDownIcon size={20} className="text-blue-600 group-hover:text-blue-700 transition-colors" />
          ) : (
            <ChevronRightIcon size={20} className="text-blue-600 group-hover:text-blue-700 transition-colors" />
          )}
        </div>
        
        <div className="flex items-center gap-2 text-blue-600">
          <BookOpenIcon size={16} className="text-blue-500" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-bold text-xl text-gray-900 tracking-wide">{word}</span>
            <span className="text-blue-600 font-medium text-lg">📢 {pinyin}</span>
          </div>
        </div>
        
        <div className="flex-shrink-0 text-xs text-gray-500 font-medium">
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </div>
      </div>

      {/* Expandable content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-6 border-t border-blue-100">
          {/* Han Nom Section */}
          <div className="bg-white/60 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <h4 className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Hán Nôm</h4>
            </div>
            <p className="text-purple-800 font-medium text-lg">{hanNom}</p>
          </div>

          {/* Level and Word Type */}
          {(wordLevel || wordType) && (
            <div className="flex flex-wrap gap-3">
              {wordLevel && (
                <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getLevelColor(wordLevel)}`}>
                  <span className="mr-1">🎯</span>
                  {wordLevel}
                </div>
              )}
              {wordType && (
                <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getTypeColor(wordType)}`}>
                  <span className="mr-1">📝</span>
                  {wordType}
                </div>
              )}
            </div>
          )}

          {/* Meanings Section */}
          {meanings && meanings.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <h4 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                  Meanings ({meanings.length})
                </h4>
              </div>
              
              <div className="space-y-4">
                {meanings.map((meaningObj, index) => (
                  <div key={index} className="bg-white/80 rounded-lg p-4 border border-emerald-100 hover:border-emerald-200 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="text-gray-900 font-semibold text-base leading-relaxed">
                          {meaningObj.meaning}
                        </div>
                        
                        {meaningObj.explanation && (
                          <div className="text-gray-600 text-sm italic leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
                            💡 {meaningObj.explanation}
                          </div>
                        )}
                        
                        {meaningObj.examples && meaningObj.examples.length > 0 && (
                          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-amber-600">📚</span>
                              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Example</span>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-gray-900 text-base">{meaningObj.examples[0].word}</div>
                              <div className="text-blue-600 font-medium">{meaningObj.examples[0].phonetic}</div>
                              <div className="text-gray-700 italic leading-relaxed">{meaningObj.examples[0].translation}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 