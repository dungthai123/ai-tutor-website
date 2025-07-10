// Types for text segmentation module

// Core data types
export interface SegmentedText {
  word: string;
  pinyin?: string;
}

export interface DictionaryMeaning {
  meaning: string;
  explanation: string;
  examples: Array<{
    word: string;
    phonetic: string;
    translation: string;
  }>;
}

export interface DictionaryEntry {
  hanzi: string;
  pinyin: string;
  han_nom: string;
  word_level: string;
  word_type: string;
  meanings: DictionaryMeaning[];
}

// Component Props
export interface TextSegmentWrapperProps {
  text: string;
  showPinyin: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface SegmentedWordProps {
  segment: SegmentedText;
  showPinyin: boolean;
  onDoubleClick?: (word: string, event: React.MouseEvent<HTMLSpanElement>) => void;
  className?: string;
  isHighlighted?: boolean;
}

export interface DictionaryTooltipProps {
  word: string;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

// API Response Types
export interface SegmentResponse {
  success: boolean;
  code: number;
  message: string;
  data: string[];
}

export interface DictionaryApiResponse {
  success: boolean;
  code: number;
  message: string;
  data: DictionaryEntry;
}

export interface SegmentationResponse {
  segments: string[];
  success: boolean;
  error?: string;
}

export interface DictionaryResponse {
  success: boolean;
  data?: DictionaryEntry;
  error?: string;
}

// Service Interface Types
export interface ISegmentService {
  segmentText: (text: string) => Promise<string[]>;
}

export interface IDictionaryService {
  lookupWord: (word: string) => Promise<DictionaryEntry | null>;
}

// Service Options
export interface SegmentServiceOptions {
  apiKey?: string;
  location?: string;
}

export interface PinyinOptions {
  style?: 'normal' | 'tone' | 'tone2' | 'initials' | 'first_letter';
  heteronym?: boolean;
  segment?: boolean;
} 