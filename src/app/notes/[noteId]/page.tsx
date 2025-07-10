'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useNotes, useGrammarCheck } from '@/modules/notes/hooks';
import { Note, NOTE_STYLES } from '@/modules/notes/types';
import { ProofreadingDetails, GrammarChecker } from '@/modules/notes/components';
import { DictionaryEntry } from '@/modules/notes/components/DictionaryEntry';
import { cn } from '@/utils/helpers';

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

export default function NoteEditPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.noteId as string;
  
  const { getNoteById, updateNote, deleteNote } = useNotes();
  const { issues, isChecking, checkGrammar, applyCorrection } = useGrammarCheck();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isGrammarCheckEnabled, setIsGrammarCheckEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Parse note content to handle dictionary entries
  const contentParts = parseNoteContent(content);

  // Load note data
  useEffect(() => {
    if (noteId) {
      const foundNote = getNoteById(noteId);
      if (foundNote) {
        setNote(foundNote);
        setTitle(foundNote.title);
        setContent(foundNote.content);
      }
      setIsLoading(false);
    }
  }, [noteId, getNoteById]);

  // Trigger grammar check when enabled
  useEffect(() => {
    if (isGrammarCheckEnabled && content.trim()) {
      checkGrammar(content);
    }
  }, [isGrammarCheckEnabled, content, checkGrammar]);

  // Handle saving
  const handleSave = async () => {
    if (!note) return;
    
    setIsSaving(true);
    try {
      const updatedNote = updateNote(note.id, {
        title: title.trim() || 'Untitled Note',
        content,
        style: NOTE_STYLES,
        updatedAt: new Date().toISOString()
      });
      
      if (updatedNote) {
        setNote(updatedNote);
        setIsEditing(false);
        // Show success feedback
        setTimeout(() => setIsSaving(false), 500);
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (!note) return;
    
    const success = deleteNote(note.id);
    if (success) {
      router.push('/notes');
    }
  };

  // Handle content change with grammar checking
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (isGrammarCheckEnabled && newContent.trim()) {
      // Debounce grammar checking
      const timeoutId = setTimeout(() => {
        checkGrammar(newContent);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

  // Handle applying grammar corrections
  const handleApplyCorrection = async (issue: import('@/modules/notes/hooks').GrammarIssue, suggestionIndex: number) => {
    try {
      const correctedText = await applyCorrection(content, issue, suggestionIndex);
      setContent(correctedText);
      
      // Re-check grammar after applying correction
      if (isGrammarCheckEnabled) {
        setTimeout(() => {
          checkGrammar(correctedText);
        }, 500);
      }
    } catch (error) {
      console.error('Failed to apply correction:', error);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.push('/notes');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            Note not found
          </h2>
          <p className="text-gray-600 mb-4">
            The note you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className=" mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl">←</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Edit Note
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                'px-4 py-2 rounded-md font-medium transition-colors',
                isEditing
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {isEditing ? '👁️ Preview' : '✏️ Edit'}
            </button>
            <button
              onClick={() => setIsGrammarCheckEnabled(!isGrammarCheckEnabled)}
              className={cn(
                'px-4 py-2 rounded-md font-medium transition-colors',
                isGrammarCheckEnabled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              📝 Grammar Check
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              🗑️ Delete
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                'px-6 py-2 rounded-md font-medium transition-colors',
                isSaving
                  ? 'bg-green-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              )}
            >
              {isSaving ? '✓ Saved' : '💾 Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Section */}
          <div className="lg:col-span-2">
            <div className={cn(
              'rounded-2xl p-6 shadow-sm border border-gray-200',
              'bg-white text-gray-800'
            )}>
              {/* Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className={cn(
                  'w-full text-2xl font-bold mb-4 bg-transparent border-none outline-none',
                  'placeholder-opacity-60 resize-none'
                )}
                style={{ color: 'inherit' }}
              />
              
              {/* Content - Show editor or preview based on mode */}
              {isEditing ? (
                /* Content Textarea */
                <textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Start writing your note..."
                  className={cn(
                    'w-full min-h-[400px] bg-transparent border-none outline-none',
                    'placeholder-opacity-60 resize-none leading-relaxed'
                  )}
                  style={{ color: 'inherit' }}
                />
              ) : (
                /* Content Preview with Dictionary Entries */
                <div className="min-h-[400px] text-gray-700 leading-relaxed">
                  {contentParts.length === 0 ? (
                    <div className="text-gray-400 italic">Start writing your note...</div>
                  ) : (
                    contentParts.map((part, index) => {
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
                            className="my-4"
                          />
                        );
                      } else {
                        return (
                          <div key={index} className="whitespace-pre-line">
                            {part.content}
                          </div>
                        );
                      }
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            {/* Note Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Note Info
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <strong>Created:</strong> {new Date(note.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Updated:</strong> {new Date(note.updatedAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Source:</strong> {note.source === 'proofreader' ? '📝 Proofreader' : '✏️ Manual'}
                </div>
                <div>
                  <strong>Characters:</strong> {content.length}
                </div>
                <div>
                  <strong>Mode:</strong> {isEditing ? '✏️ Editing' : '👁️ Preview'}
                </div>
              </div>
            </div>

            {/* Grammar Checker */}
            {isGrammarCheckEnabled && (
              <GrammarChecker
                issues={issues}
                isChecking={isChecking}
                text={content}
                onApplyCorrection={handleApplyCorrection}
                className="mt-6"
              />
            )}

            {/* Proofreading Details */}
            {note.proofreading && (
              <ProofreadingDetails 
                proofreading={note.proofreading}
                className="mt-6"
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Note?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The note will be permanently deleted.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 