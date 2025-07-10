'use client';

import React, { useState, useMemo } from 'react';
import { useGlobalNotesStore } from '@/shared/stores/globalNotesStore';
import { useNotes } from '../hooks/useNotes';
import { Note } from '../types';
import { StickerNoteCard } from './StickerNoteCard';
import { NoteForm } from './NoteForm';
import { TagFilter } from './TagFilter';

export function GlobalNotesPanel() {
  const { isOpen, togglePanel, selectedTags, setSelectedTags, searchQuery, setSearchQuery } = useGlobalNotesStore();
  const { notes, createNote, updateNote, deleteNote } = useNotes();
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const filteredNotes = useMemo(() => {
    let filtered = notes;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note => 
        note.tags && selectedTags.some(tag => note.tags.includes(tag))
      );
    }

    return filtered;
  }, [notes, searchQuery, selectedTags]);

  const handleCreateNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    createNote(noteData.content, noteData.title, undefined, undefined, noteData.tags);
    setIsCreating(false);
  };

  const handleUpdateNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
      setEditingNote(null);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsCreating(false);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    if (editingNote?.id === id) {
      setEditingNote(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setIsCreating(false);
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
  };

  return (
    <div className={`
      transition-all duration-300 ease-in-out overflow-hidden bg-white border-l border-gray-200 h-screen
      ${isOpen ? 'w-96' : 'w-0'}
    `}>
      {isOpen && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">📝 Notes</h2>
            <button
              onClick={togglePanel}
              className="p-2 hover:bg-gray-200 rounded-md text-gray-500 hover:text-gray-700 transition-colors"
              title="Close notes panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200 space-y-3 bg-gray-50">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Tag Filter */}
            <TagFilter
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              onClearFilters={handleClearFilters}
            />

            {/* Add Note Button */}
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingNote(null);
              }}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Note
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Note Form */}
            {(isCreating || editingNote) && (
              <div className="mb-4">
                <NoteForm
                  note={editingNote}
                  onSave={editingNote ? handleUpdateNote : handleCreateNote}
                  onCancel={handleCancelEdit}
                />
              </div>
            )}

            {/* Notes List */}
            <div className="space-y-3">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No notes found</p>
                  {!isCreating && (
                    <button
                      onClick={() => setIsCreating(true)}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Create your first note
                    </button>
                  )}
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <StickerNoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              {filteredNotes.length} of {notes.length} notes
              {selectedTags.length > 0 && ` • ${selectedTags.length} filters active`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 