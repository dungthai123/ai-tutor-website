'use client';

import { useState, useCallback, useEffect } from 'react';
import { Note, NoteStyle, NotesState, ProofreadingData } from '../types';
import { NotesService } from '../services/notes.service';

export function useNotes() {
  const [state, setState] = useState<NotesState>({
    notes: [],
    loading: false,
    error: null
  });

  // Load notes from localStorage
  const loadNotes = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const notes = NotesService.getAllNotes();
      setState(prev => ({
        ...prev,
        notes,
        loading: false
      }));
    } catch (error) {
      console.error('[USE_NOTES] Error loading notes:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load notes'
      }));
    }
  }, []);

  // Create a new note
  const createNote = useCallback((content: string, title?: string, style?: NoteStyle, proofreading?: ProofreadingData) => {
    try {
      const newNote = NotesService.createNote(content, title, style, proofreading);
      setState(prev => ({
        ...prev,
        notes: [newNote, ...prev.notes],
        error: null
      }));
      return newNote;
    } catch (error) {
      console.error('[USE_NOTES] Error creating note:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to create note'
      }));
      return null;
    }
  }, []);

  // Update a note
  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    try {
      const updatedNote = NotesService.updateNote(id, updates);
      if (updatedNote) {
        setState(prev => ({
          ...prev,
          notes: prev.notes.map(note => 
            note.id === id ? updatedNote : note
          ),
          error: null
        }));
        return updatedNote;
      }
      return null;
    } catch (error) {
      console.error('[USE_NOTES] Error updating note:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to update note'
      }));
      return null;
    }
  }, []);

  // Delete a note
  const deleteNote = useCallback((id: string) => {
    try {
      const success = NotesService.deleteNote(id);
      if (success) {
        setState(prev => ({
          ...prev,
          notes: prev.notes.filter(note => note.id !== id),
          error: null
        }));
      }
      return success;
    } catch (error) {
      console.error('[USE_NOTES] Error deleting note:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to delete note'
      }));
      return false;
    }
  }, []);

  // Get a single note by ID
  const getNoteById = useCallback((id: string) => {
    return state.notes.find(note => note.id === id) || null;
  }, [state.notes]);

  // Filter notes by date range
  const filterNotesByDateRange = useCallback((range: 'today' | 'week' | 'month') => {
    return NotesService.filterNotesByDateRange(state.notes, range);
  }, [state.notes]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    ...state,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
    filterNotesByDateRange,
    loadNotes,
    clearError
  };
} 