'use client';

import React from 'react';
import { Note } from '../types';
import { NoteCard, NewNoteCard } from './NoteCard';
import { cn } from '@/utils/helpers';

interface NotesGridProps {
  notes: Note[];
  onNoteClick?: (note: Note) => void;
  onNewNoteClick: () => void;
  loading?: boolean;
  className?: string;
}

export function NotesGrid({ 
  notes, 
  onNoteClick, 
  onNewNoteClick, 
  loading = false, 
  className 
}: NotesGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      className
    )}>
      {/* New Note Card - Always first */}
      <NewNoteCard onClick={onNewNoteClick} />
      
      {/* Existing Notes */}
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={() => onNoteClick?.(note)}
        />
      ))}
      
      {/* Empty State */}
      {notes.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No notes yet
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            Start by creating your first note or use the proofreading tool to save corrected text as notes.
          </p>
        </div>
      )}
    </div>
  );
} 