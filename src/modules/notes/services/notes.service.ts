import { Note, NoteStyle, NOTE_STYLES, ProofreadingData } from '../types';

const NOTES_STORAGE_KEY = 'ai-tutor-notes';

export class NotesService {
  /**
   * Generate a unique ID for a new note
   */
  private static generateId(): string {
    return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all notes from localStorage
   */
  static getAllNotes(): Note[] {
    try {
      const notesJson = localStorage.getItem(NOTES_STORAGE_KEY);
      if (!notesJson) return [];
      
      const notes = JSON.parse(notesJson);
      return Array.isArray(notes) ? notes : [];
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
      return [];
    }
  }

  /**
   * Save notes array to localStorage
   */
  private static saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
      throw new Error('Failed to save note');
    }
  }

  /**
   * Create a new note
   */
  static createNote(content: string, title?: string, style?: NoteStyle, proofreading?: ProofreadingData): Note {
    const now = new Date().toISOString();
    
    // Auto-generate title from first line if not provided
    const autoTitle = title || NotesService.generateTitleFromContent(content);
    
    // Use random style if not provided
    const noteStyle = style || NotesService.getRandomStyle();

    const newNote: Note = {
      id: NotesService.generateId(),
      title: autoTitle,
      content,
      createdAt: now,
      updatedAt: now,
      style: noteStyle,
      source: proofreading ? 'proofreader' : 'manual',
      proofreading
    };

    const notes = NotesService.getAllNotes();
    notes.unshift(newNote); // Add to beginning of array
    NotesService.saveNotes(notes);

    console.log('[NOTES_SERVICE] Created new note:', newNote.id, proofreading ? 'with proofreading data' : 'manual note');
    return newNote;
  }

  /**
   * Update an existing note
   */
  static updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | null {
    const notes = NotesService.getAllNotes();
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) {
      console.error('[NOTES_SERVICE] Note not found:', id);
      return null;
    }

    const updatedNote = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;
    NotesService.saveNotes(notes);

    console.log('[NOTES_SERVICE] Updated note:', id);
    return updatedNote;
  }

  /**
   * Delete a note
   */
  static deleteNote(id: string): boolean {
    const notes = NotesService.getAllNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    if (filteredNotes.length === notes.length) {
      console.error('[NOTES_SERVICE] Note not found for deletion:', id);
      return false;
    }

    NotesService.saveNotes(filteredNotes);
    console.log('[NOTES_SERVICE] Deleted note:', id);
    return true;
  }

  /**
   * Get a single note by ID
   */
  static getNoteById(id: string): Note | null {
    const notes = NotesService.getAllNotes();
    return notes.find(note => note.id === id) || null;
  }

  /**
   * Generate a title from content (first line, max 50 chars)
   */
  static generateTitleFromContent(content: string): string {
    if (!content.trim()) return 'Untitled Note';
    
    // Get first line and clean it up
    const firstLine = content.split('\n')[0].trim();
    
    // Remove HTML tags if any
    const cleanLine = firstLine.replace(/<[^>]*>/g, '');
    
    // Truncate if too long
    if (cleanLine.length > 50) {
      return cleanLine.substring(0, 47) + '...';
    }
    
    return cleanLine || 'Untitled Note';
  }

  /**
   * Get a random style for new notes
   */
  static getRandomStyle(): NoteStyle {
    const styleKeys = Object.keys(NOTE_STYLES);
    const randomKey = styleKeys[Math.floor(Math.random() * styleKeys.length)];
    return NOTE_STYLES[randomKey];
  }

  /**
   * Filter notes by date range
   */
  static filterNotesByDateRange(notes: Note[], range: 'today' | 'week' | 'month'): Note[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      
      switch (range) {
        case 'today':
          return noteDate >= today;
        
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return noteDate >= weekAgo;
        
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          return noteDate >= monthAgo;
        
        default:
          return true;
      }
    });
  }

  /**
   * Get notes count
   */
  static getNotesCount(): number {
    return NotesService.getAllNotes().length;
  }
} 