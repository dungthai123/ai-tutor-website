export interface NoteStyle {
  backgroundColor: string; // e.g., 'bg-purple-100', 'bg-red-100', 'bg-blue-100'
  textColor: string;       // e.g., 'text-purple-800', 'text-red-800', 'text-blue-800'
  borderColor: string;     // e.g., 'border-purple-200', 'border-red-200', 'border-blue-200'
}

export interface Note {
  id: string; // Unique ID, e.g., from uuid
  title: string;
  content: string; // The proofread text or user content
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
  style: NoteStyle;
  source?: 'proofreader' | 'manual'; // Track where the note came from
}

export interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

// Predefined note styles matching the design
export const NOTE_STYLES: Record<string, NoteStyle> = {
  purple: {
    backgroundColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200'
  },
  orange: {
    backgroundColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200'
  },
  blue: {
    backgroundColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200'
  },
  green: {
    backgroundColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200'
  },
  pink: {
    backgroundColor: 'bg-pink-100',
    textColor: 'text-pink-800',
    borderColor: 'border-pink-200'
  },
  yellow: {
    backgroundColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200'
  }
}; 