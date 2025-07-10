export interface NoteStyle {
  backgroundColor: string; // Always 'bg-white'
  textColor: string;       // Always 'text-gray-800'
  borderColor: string;     // Always 'border-gray-200'
}

// Proofreading data to track corrections made
export interface ProofreadingData {
  originalText: string;
  correctedText: string;
  edits: {
    oldText: string;
    newText: string;
    reason: string;
  }[];
  suggestion?: string;
  correctionCount: number;
}

export interface Note {
  id: string; // Unique ID, e.g., from uuid
  title: string;
  content: string; // The proofread text or user content
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
  style: NoteStyle;
  source?: 'proofreader' | 'manual'; // Track where the note came from
  proofreading?: ProofreadingData; // Store proofreading details if from proofreader
  tags: string[]; // Tags for filtering (e.g., 'grammar', 'vocab', 'writing')
}

export interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

// Global notes panel state
export interface GlobalNotesState {
  isOpen: boolean;
  selectedTags: string[];
  searchQuery: string;
}

// Predefined tags for filtering
export const NOTE_TAGS = {
  GRAMMAR: 'grammar',
  VOCABULARY: 'vocab',
  WRITING: 'writing',
  SPEAKING: 'speaking',
  LISTENING: 'listening',
  READING: 'reading',
  PRONUNCIATION: 'pronunciation',
  CONVERSATION: 'conversation',
  GENERAL: 'general'
} as const;

export type NoteTag = typeof NOTE_TAGS[keyof typeof NOTE_TAGS];

export const TAG_LABELS: Record<NoteTag, string> = {
  [NOTE_TAGS.GRAMMAR]: '📝 Grammar',
  [NOTE_TAGS.VOCABULARY]: '📚 Vocabulary',
  [NOTE_TAGS.WRITING]: '✍️ Writing',
  [NOTE_TAGS.SPEAKING]: '🗣️ Speaking',
  [NOTE_TAGS.LISTENING]: '👂 Listening',
  [NOTE_TAGS.READING]: '📖 Reading',
  [NOTE_TAGS.PRONUNCIATION]: '🔊 Pronunciation',
  [NOTE_TAGS.CONVERSATION]: '💬 Conversation',
  [NOTE_TAGS.GENERAL]: '📌 General'
};

// Simplified note style - only white background
export const NOTE_STYLES: NoteStyle = {
  backgroundColor: 'bg-white',
  textColor: 'text-gray-800',
  borderColor: 'border-gray-200'
}; 