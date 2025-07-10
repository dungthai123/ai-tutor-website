'use client';

import React, { useState } from 'react';
import { Note } from '../types';
import { cn } from '@/utils/helpers';
import { NOTE_TAGS } from '../types';
import { DictionaryEntry } from './DictionaryEntry';

interface StickerNoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

// Function to parse content and extract dictionary entries
function parseNoteContent(content: string) {
  const parts: Array<{ type: 'text' | 'dictionary'; content: string; data?: unknown }> = [];
  const dictionaryRegex = /---DICTIONARY-ENTRY-START---\s*(.*?)\s*---DICTIONARY-ENTRY-END---/g;
  
  let lastIndex = 0;
  let match;

  while ((match = dictionaryRegex.exec(content)) !== null) {
    // Add text before dictionary entry
    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index).trim();
      if (textContent) {
        parts.push({ type: 'text', content: textContent });
      }
    }

    // Parse dictionary entry
    try {
      const dictionaryData = JSON.parse(match[1]);
      parts.push({ 
        type: 'dictionary', 
        content: match[0],
        data: dictionaryData 
      });
    } catch (error) {
      console.error('Error parsing dictionary entry:', error);
      // If parsing fails, treat as regular text
      parts.push({ type: 'text', content: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex).trim();
    if (remainingText) {
      parts.push({ type: 'text', content: remainingText });
    }
  }

  return parts;
}

export function StickerNoteCard({ note, onEdit, onDelete }: StickerNoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Use white background for all notes
  const colorClass = 'bg-white border-gray-200';
  
  // Get tag color based on predefined mapping
  const getTagColor = (tag: string) => {
    switch (tag) {
      case NOTE_TAGS.GRAMMAR:
        return 'bg-blue-100 text-blue-800';
      case NOTE_TAGS.VOCABULARY:
        return 'bg-green-100 text-green-800';
      case NOTE_TAGS.WRITING:
        return 'bg-purple-100 text-purple-800';
      case NOTE_TAGS.SPEAKING:
        return 'bg-pink-100 text-pink-800';
      case NOTE_TAGS.LISTENING:
        return 'bg-indigo-100 text-indigo-800';
      case NOTE_TAGS.READING:
        return 'bg-teal-100 text-teal-800';
      case NOTE_TAGS.PRONUNCIATION:
        return 'bg-orange-100 text-orange-800';
      case NOTE_TAGS.CONVERSATION:
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Parse note content to handle dictionary entries
  const contentParts = parseNoteContent(note.content);

  return (
    <div 
      className={cn(
        'relative border-2 rounded-lg shadow-md p-4 mb-4',
        'min-h-[150px] w-full',
        'transition-all duration-200',
        'transform',
        colorClass,
        'border-opacity-50',
        isHovered && 'shadow-lg scale-105 z-10',
        'group'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with title and actions */}
      <div className="flex justify-between items-start mb-2"> 
        <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">{note.title}</h3>
        <div className={cn(
          'flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          isHovered && 'opacity-100'
        )}>
          <button 
            className="p-1 hover:bg-gray-200 rounded text-sm text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            title="Edit note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            className="p-1 hover:bg-red-100 rounded text-sm text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            title="Delete note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4v1H8a1 1 0 00-1 1v3m4 0V3a1 1 0 011-1h2a1 1 0 011 1v4M9 7h6" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content with dictionary entries */}
      <div className="text-gray-700 text-sm mb-4 max-h-32 overflow-y-auto">
        {contentParts.map((part, index) => {
          if (part.type === 'dictionary' && part.data) {
            const data = part.data as {
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
            };
            
            return (
              <DictionaryEntry
                key={index}
                word={data.word}
                pinyin={data.pinyin}
                hanNom={data.hanNom}
                wordLevel={data.wordLevel}
                wordType={data.wordType}
                meanings={data.meanings}
                className="my-1"
              />
            );
          } else {
            return (
              <div key={index} className="whitespace-pre-line">
                {part.content}
              </div>
            );
          }
        })}
      </div>
      
      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                getTagColor(tag)
              )}
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}
      
      {/* Footer with date */}
      <div className="text-xs text-gray-500 mt-auto text-right">{new Date(note.createdAt).toLocaleDateString()}</div>
    </div>
  );
} 