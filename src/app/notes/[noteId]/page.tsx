'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useNotes } from '@/modules/notes/hooks';
import { Note, NoteStyle, NOTE_STYLES } from '@/modules/notes/types';
import { cn } from '@/utils/helpers';

export default function NoteEditPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.noteId as string;
  
  const { getNoteById, updateNote, deleteNote } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<NoteStyle>(NOTE_STYLES[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load note data
  useEffect(() => {
    if (noteId) {
      const foundNote = getNoteById(noteId);
      if (foundNote) {
        setNote(foundNote);
        setTitle(foundNote.title);
        setContent(foundNote.content);
        setSelectedStyle(foundNote.style);
      }
      setIsLoading(false);
    }
  }, [noteId, getNoteById]);

  // Handle saving
  const handleSave = async () => {
    if (!note) return;
    
    setIsSaving(true);
    try {
      const updatedNote = updateNote(note.id, {
        title: title.trim() || 'Untitled Note',
        content,
        style: selectedStyle,
        updatedAt: new Date().toISOString()
      });
      
      if (updatedNote) {
        setNote(updatedNote);
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
              'rounded-2xl p-6 shadow-sm border border-opacity-50',
              selectedStyle.backgroundColor,
              selectedStyle.textColor,
              selectedStyle.borderColor
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
              
              {/* Content Textarea */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your note..."
                className={cn(
                  'w-full min-h-[400px] bg-transparent border-none outline-none',
                  'placeholder-opacity-60 resize-none leading-relaxed'
                )}
                style={{ color: 'inherit' }}
              />
            </div>
          </div>

          {/* Style Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎨 Style
              </h3>
              
              <div className="space-y-3">
                {Object.values(NOTE_STYLES).map((style: NoteStyle, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedStyle(style)}
                    className={cn(
                      'w-full p-4 rounded-lg border-2 transition-all duration-200',
                      style.backgroundColor,
                      style.textColor,
                      style.borderColor,
                      JSON.stringify(selectedStyle) === JSON.stringify(style)
                        ? 'ring-2 ring-blue-500 ring-offset-2'
                        : 'hover:scale-105'
                    )}
                  >
                    <div className="text-left">
                      <div className="font-medium">Sample Title</div>
                      <div className="text-sm opacity-80 mt-1">
                        This is how your note will look...
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mt-6">
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
              </div>
            </div>
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