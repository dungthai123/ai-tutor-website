'use client';

import { useEffect, useState } from 'react';
import { DictionaryTooltipProps, DictionaryEntry } from '../types';
import { DictionaryService } from '../services/dictionary.service';
import { useNotes } from '@/modules/notes/hooks/useNotes';
import { BookOpenIcon, PlusIcon } from 'lucide-react';

export function DictionaryTooltip({ 
  word, 
  isVisible, 
  onClose, 
  position 
}: DictionaryTooltipProps) {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
    showBelow: boolean;
  }>({
    x: position.x,
    y: position.y,
    showBelow: false
  });

  const { notes, updateNote } = useNotes();

  // Set default note selection to first note
  useEffect(() => {
    if (notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  useEffect(() => {
    if (isVisible && word) {
      setLoading(true);
      DictionaryService.lookupWord(word)
        .then(setEntry)
        .catch(() => setEntry(null))
        .finally(() => setLoading(false));
    }
  }, [isVisible, word]);

  // Calculate smart positioning when position changes
  useEffect(() => {
    if (isVisible) {
      const tooltipHeight = 500; // Increased height for add to note section
      const margin = 20; // Safety margin
      
      // Check if tooltip would be clipped at the top
      const wouldBeClippedAtTop = position.y - tooltipHeight - margin < 0;
      
      // Check if there's enough space below
      const spaceBelow = window.innerHeight - position.y;
      const hasSpaceBelow = spaceBelow > tooltipHeight + margin;
      
      const showBelow = wouldBeClippedAtTop && hasSpaceBelow;
      
      setTooltipPosition({
        x: position.x,
        y: position.y,
        showBelow
      });
    }
  }, [isVisible, position]);

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

  const handleAddToNote = async () => {
    if (!selectedNoteId || !entry) return;
    
    setIsAdding(true);
    
    try {
      const selectedNote = notes.find(note => note.id === selectedNoteId);
      if (!selectedNote) return;

      // Create dictionary entry as JSON that can be parsed
      const dictionaryEntry = {
        type: 'dictionary',
        word,
        pinyin: entry.pinyin,
        hanNom: entry.han_nom,
        wordLevel: entry.word_level,
        wordType: entry.word_type,
        meanings: entry.meanings?.slice(0, 3) || []
      };

      // Add dictionary entry marker
      const dictionaryContent = `
---DICTIONARY-ENTRY-START---
${JSON.stringify(dictionaryEntry)}
---DICTIONARY-ENTRY-END---

`;

      // Add dictionary entry to the note content
      const updatedContent = selectedNote.content + '\n\n' + dictionaryContent;
      
      await updateNote(selectedNoteId, {
        content: updatedContent,
        tags: [...new Set([...selectedNote.tags, 'vocab'])] // Add vocab tag if not present
      });

      // Close tooltip after successful addition
      onClose();
    } catch (error) {
      console.error('Error adding to note:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="dictionary-tooltip fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-96"
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
          transform: tooltipPosition.showBelow 
            ? 'translate(-50%, 10px)' 
            : 'translate(-50%, -100%)',
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-xl text-gray-900">{word}</h3>
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
            <div className="text-lg text-blue-600 font-medium">
              📢 {entry.pinyin}
            </div>

            {/* Han Nom */}
            <div className="text-sm text-purple-600">
              <strong>Hán Nôm:</strong> {entry.han_nom}
            </div>

            {/* Level and Word Type */}
            <div className="flex flex-wrap gap-2 text-xs">
              {entry.word_level && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {entry.word_level}
                </span>
              )}
              {entry.word_type && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {entry.word_type}
                </span>
              )}
            </div>

            {/* Meanings */}
            {entry.meanings && entry.meanings.length > 0 && (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                <strong className="text-sm text-gray-700">Meanings:</strong>
                {entry.meanings.slice(0, 3).map((meaningObj, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-3 space-y-2">
                    <div className="text-sm text-gray-700">
                      <strong>{meaningObj.meaning}</strong>
                    </div>
                    {meaningObj.explanation && (
                      <div className="text-xs text-gray-600 italic">
                        {meaningObj.explanation}
                      </div>
                    )}
                    {meaningObj.examples && meaningObj.examples.length > 0 && (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Example:</strong>
                        <div className="mt-1">
                          <div className="font-medium">{meaningObj.examples[0].word}</div>
                          <div className="text-blue-600">{meaningObj.examples[0].phonetic}</div>
                          <div className="italic">{meaningObj.examples[0].translation}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {entry.meanings.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    ... and {entry.meanings.length - 3} more meanings
                  </div>
                )}
              </div>
            )}

            {/* Add to Note Section */}
            {notes.length > 0 && (
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpenIcon size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Add to Note</span>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedNoteId}
                    onChange={(e) => setSelectedNoteId(e.target.value)}
                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isAdding}
                  >
                    {notes.map(note => (
                      <option key={note.id} value={note.id}>
                        {note.title.length > 30 ? note.title.substring(0, 30) + '...' : note.title}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={handleAddToNote}
                    disabled={isAdding || !selectedNoteId}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                    ) : (
                      <PlusIcon size={14} />
                    )}
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            No definition found for &ldquo;{word}&rdquo;
          </div>
        )}

        {/* Arrow - position changes based on tooltip direction */}
        <div 
          className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 ${
            tooltipPosition.showBelow 
              ? 'top-0 -translate-y-full' 
              : 'top-full'
          }`}
          style={{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            ...(tooltipPosition.showBelow 
              ? { borderBottom: '6px solid white' }
              : { borderTop: '6px solid white' }
            )
          }}
        />
      </div>
      
      {/* Backdrop to close tooltip */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
    </>
  );
} 